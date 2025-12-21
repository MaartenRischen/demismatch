"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface TTSSegment {
  id: string;
  text: string;
  type: 'heading' | 'paragraph' | 'list-item';
}

interface TTSPlayerProps {
  content: string;
  onHighlightChange?: (segmentId: string | null) => void;
}

type TTSProvider = 'elevenlabs' | 'browser';
type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused';

interface Voice {
  id: string;
  name: string;
  description: string;
}

// Parse markdown content into speakable segments
function parseContentToSegments(markdown: string): TTSSegment[] {
  const lines = markdown.split('\n');
  const segments: TTSSegment[] = [];
  let paragraphBuffer = '';
  let segmentIndex = 0;
  let inNoteOnEvidence = false;

  const flushParagraph = () => {
    if (paragraphBuffer.trim()) {
      // Keep paragraph as single segment for natural TTS prosody
      segments.push({
        id: `seg-${segmentIndex++}`,
        text: paragraphBuffer.trim(),
        type: 'paragraph',
      });
      paragraphBuffer = '';
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    // Skip markdown formatting we don't want to read
    if (trimmed === '---') {
      flushParagraph();
      // End of note on evidence section at horizontal rule
      if (inNoteOnEvidence) {
        inNoteOnEvidence = false;
      }
      continue;
    }

    // Detect "A Note on Evidence" section - skip it entirely
    if (trimmed.toLowerCase().includes('a note on evidence')) {
      flushParagraph();
      inNoteOnEvidence = true;
      continue;
    }

    // End of note on evidence at next major Part heading
    if (inNoteOnEvidence && (trimmed.startsWith('## Part') || trimmed.startsWith('# Part'))) {
      inNoteOnEvidence = false;
      // Don't continue - process this heading below
    }

    // Skip content while in "Note on Evidence" section
    if (inNoteOnEvidence) {
      continue;
    }

    // Headings
    if (trimmed.startsWith('#')) {
      flushParagraph();
      const headingText = trimmed.replace(/^#+\s*/, '');
      if (headingText) {
        segments.push({
          id: `seg-${segmentIndex++}`,
          text: headingText,
          type: 'heading',
        });
      }
      continue;
    }

    // List items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      const listText = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
      if (listText) {
        segments.push({
          id: `seg-${segmentIndex++}`,
          text: listText,
          type: 'list-item',
        });
      }
      continue;
    }

    // Regular text - accumulate into paragraphs
    paragraphBuffer += ' ' + trimmed;
  }

  flushParagraph();
  return segments;
}

export default function TTSPlayer({ content, onHighlightChange }: TTSPlayerProps) {
  const [segments, setSegments] = useState<TTSSegment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [provider, setProvider] = useState<TTSProvider>('elevenlabs');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioQueueRef = useRef<Map<number, string>>(new Map()); // Preloaded audio URLs
  const isLoadingRef = useRef(false);

  // Parse content into segments
  useEffect(() => {
    if (content) {
      const parsed = parseContentToSegments(content);
      setSegments(parsed);
      setCurrentIndex(0);
    }
  }, [content]);

  // Fetch available voices
  useEffect(() => {
    fetch('/api/tts')
      .then(res => res.json())
      .then(data => {
        setVoices(data.voices || []);
        setSelectedVoice(data.defaultVoice || '');
      })
      .catch(console.error);
  }, []);

  // Notify parent of highlight changes
  useEffect(() => {
    if (playbackState === 'playing' && segments[currentIndex]) {
      onHighlightChange?.(segments[currentIndex].id);
    } else if (playbackState === 'idle' || playbackState === 'paused') {
      // Keep highlighting during pause
    }
  }, [currentIndex, playbackState, segments, onHighlightChange]);

  // Preload next segments
  const preloadSegment = useCallback(async (index: number) => {
    if (
      provider !== 'elevenlabs' ||
      audioQueueRef.current.has(index) ||
      index >= segments.length ||
      index < 0
    ) {
      return;
    }

    const segment = segments[index];
    if (!segment) return;

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: segment.text,
          voiceId: selectedVoice,
          provider: 'elevenlabs',
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        audioQueueRef.current.set(index, url);
      }
    } catch (err) {
      console.error('Preload error:', err);
    }
  }, [provider, segments, selectedVoice]);

  // Preload upcoming segments
  useEffect(() => {
    if (playbackState === 'playing' && provider === 'elevenlabs') {
      // Preload next 3 segments
      for (let i = 1; i <= 3; i++) {
        preloadSegment(currentIndex + i);
      }
    }
  }, [currentIndex, playbackState, provider, preloadSegment]);

  // Play current segment with ElevenLabs
  const playWithElevenLabs = useCallback(async (index: number) => {
    if (index >= segments.length) {
      setPlaybackState('idle');
      setCurrentIndex(0);
      onHighlightChange?.(null);
      return;
    }

    const segment = segments[index];
    setPlaybackState('loading');
    setError(null);
    isLoadingRef.current = true;

    try {
      let audioUrl = audioQueueRef.current.get(index);

      if (!audioUrl) {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: segment.text,
            voiceId: selectedVoice,
            provider: 'elevenlabs',
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'TTS failed');
        }

        const blob = await response.blob();
        audioUrl = URL.createObjectURL(blob);
        audioQueueRef.current.set(index, audioUrl);
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audio.playbackRate = playbackSpeed;
      audioRef.current = audio;

      audio.onended = () => {
        if (isLoadingRef.current) return;
        const nextIndex = index + 1;
        setCurrentIndex(nextIndex);
        if (nextIndex < segments.length) {
          playWithElevenLabs(nextIndex);
        } else {
          setPlaybackState('idle');
          onHighlightChange?.(null);
        }
      };

      audio.onerror = () => {
        setError('Audio playback error');
        setPlaybackState('idle');
      };

      isLoadingRef.current = false;
      setPlaybackState('playing');
      await audio.play();
    } catch (err: any) {
      console.error('ElevenLabs playback error:', err);
      setError(err.message || 'Failed to play audio');
      setPlaybackState('idle');
      isLoadingRef.current = false;
    }
  }, [segments, selectedVoice, playbackSpeed, onHighlightChange]);

  // Play with browser TTS (free fallback)
  const playWithBrowser = useCallback((index: number) => {
    if (index >= segments.length) {
      setPlaybackState('idle');
      setCurrentIndex(0);
      onHighlightChange?.(null);
      return;
    }

    if (!('speechSynthesis' in window)) {
      setError('Browser TTS not supported');
      return;
    }

    const segment = segments[index];
    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Get a good voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes('Google') ||
      v.name.includes('Natural') ||
      v.name.includes('Samantha') ||
      v.name.includes('Karen')
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      const nextIndex = index + 1;
      setCurrentIndex(nextIndex);
      if (nextIndex < segments.length) {
        playWithBrowser(nextIndex);
      } else {
        setPlaybackState('idle');
        onHighlightChange?.(null);
      }
    };

    utterance.onerror = () => {
      setError('Speech synthesis error');
      setPlaybackState('idle');
    };

    speechSynthRef.current = utterance;
    setPlaybackState('playing');
    window.speechSynthesis.speak(utterance);
  }, [segments, playbackSpeed, onHighlightChange]);

  // Main play function
  const play = useCallback(() => {
    if (segments.length === 0) return;

    if (provider === 'elevenlabs') {
      playWithElevenLabs(currentIndex);
    } else {
      playWithBrowser(currentIndex);
    }
  }, [provider, currentIndex, playWithElevenLabs, playWithBrowser, segments.length]);

  // Pause
  const pause = useCallback(() => {
    if (provider === 'elevenlabs') {
      audioRef.current?.pause();
    } else {
      window.speechSynthesis?.pause();
    }
    setPlaybackState('paused');
  }, [provider]);

  // Resume
  const resume = useCallback(() => {
    if (provider === 'elevenlabs') {
      audioRef.current?.play();
      setPlaybackState('playing');
    } else {
      window.speechSynthesis?.resume();
      setPlaybackState('playing');
    }
  }, [provider]);

  // Stop
  const stop = useCallback(() => {
    if (provider === 'elevenlabs') {
      audioRef.current?.pause();
      audioRef.current = null;
    } else {
      window.speechSynthesis?.cancel();
    }
    setPlaybackState('idle');
    setCurrentIndex(0);
    onHighlightChange?.(null);
  }, [provider, onHighlightChange]);

  // Skip forward
  const skipForward = useCallback(() => {
    const nextIndex = Math.min(currentIndex + 1, segments.length - 1);
    stop();
    setCurrentIndex(nextIndex);
    if (playbackState === 'playing') {
      setTimeout(() => {
        if (provider === 'elevenlabs') {
          playWithElevenLabs(nextIndex);
        } else {
          playWithBrowser(nextIndex);
        }
      }, 100);
    }
  }, [currentIndex, segments.length, stop, playbackState, provider, playWithElevenLabs, playWithBrowser]);

  // Skip backward
  const skipBackward = useCallback(() => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    stop();
    setCurrentIndex(prevIndex);
    if (playbackState === 'playing') {
      setTimeout(() => {
        if (provider === 'elevenlabs') {
          playWithElevenLabs(prevIndex);
        } else {
          playWithBrowser(prevIndex);
        }
      }, 100);
    }
  }, [currentIndex, stop, playbackState, provider, playWithElevenLabs, playWithBrowser]);

  // Change playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Clean up audio URLs on unmount
  useEffect(() => {
    return () => {
      audioQueueRef.current.forEach(url => URL.revokeObjectURL(url));
      audioQueueRef.current.clear();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Handle provider change
  const handleProviderChange = (newProvider: TTSProvider) => {
    stop();
    setProvider(newProvider);
    audioQueueRef.current.forEach(url => URL.revokeObjectURL(url));
    audioQueueRef.current.clear();
  };

  const progress = segments.length > 0 ? ((currentIndex + 1) / segments.length) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-40 bg-white border-t border-gray-200 shadow-lg">
      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-[#c75b3a] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-4 py-3">
        {/* Main controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Play controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={skipBackward}
              disabled={currentIndex === 0}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </button>

            {playbackState === 'idle' ? (
              <button
                onClick={play}
                disabled={segments.length === 0}
                className="p-3 bg-[#c75b3a] text-white rounded-full hover:bg-[#b54d2e] disabled:opacity-50 disabled:cursor-not-allowed"
                title="Play"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            ) : playbackState === 'loading' ? (
              <button className="p-3 bg-gray-400 text-white rounded-full cursor-wait" disabled>
                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </button>
            ) : playbackState === 'playing' ? (
              <button
                onClick={pause}
                className="p-3 bg-[#c75b3a] text-white rounded-full hover:bg-[#b54d2e]"
                title="Pause"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={resume}
                className="p-3 bg-[#c75b3a] text-white rounded-full hover:bg-[#b54d2e]"
                title="Resume"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}

            <button
              onClick={skipForward}
              disabled={currentIndex >= segments.length - 1}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
            </button>

            <button
              onClick={stop}
              disabled={playbackState === 'idle'}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Stop"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
            </button>
          </div>

          {/* Current segment preview */}
          <div className="flex-1 min-w-0 hidden sm:block">
            <p className="text-sm text-gray-600 truncate">
              {segments[currentIndex]?.text || 'Ready to play'}
            </p>
            <p className="text-xs text-gray-400">
              {currentIndex + 1} / {segments.length} segments
            </p>
          </div>

          {/* Settings toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-600 hover:text-gray-900"
            title="Settings"
          >
            <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>

        {/* Expanded settings */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Provider selector */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Voice Provider</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleProviderChange('elevenlabs')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                    provider === 'elevenlabs'
                      ? 'bg-[#c75b3a] text-white border-[#c75b3a]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ElevenLabs
                </button>
                <button
                  onClick={() => handleProviderChange('browser')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                    provider === 'browser'
                      ? 'bg-[#c75b3a] text-white border-[#c75b3a]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Free (Browser)
                </button>
              </div>
            </div>

            {/* Voice selector (ElevenLabs only) */}
            {provider === 'elevenlabs' && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Voice</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => {
                    setSelectedVoice(e.target.value);
                    audioQueueRef.current.forEach(url => URL.revokeObjectURL(url));
                    audioQueueRef.current.clear();
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c75b3a] focus:border-transparent"
                >
                  {voices.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name} - {voice.description}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Speed control */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Speed: {playbackSpeed}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.25"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#c75b3a]"
              />
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

// Export segment ID generator for use in framework page
export function getSegmentId(index: number): string {
  return `seg-${index}`;
}
