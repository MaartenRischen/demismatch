"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface ConceptSeries {
  letter: string;
  mismatched: string;
  baseline: string;
  augmented: string;
}

// Shuffle array utility
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function DemismatchCarousel() {
  const [concepts, setConcepts] = useState<ConceptSeries[]>([]);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const preloadedImages = useRef<Set<string>>(new Set());

  // Fetch available concepts from API route
  useEffect(() => {
    async function fetchConcepts() {
      try {
        const response = await fetch('/api/demismatch-concepts');
        const data = await response.json();

        if (!response.ok) {
          console.error('Error fetching concepts:', data.error);
          setError('Failed to load images');
          setIsLoading(false);
          return;
        }

        if (!data.concepts || data.concepts.length === 0) {
          setError('No complete image sets found');
          setIsLoading(false);
          return;
        }

        // Shuffle and set concepts
        setConcepts(shuffleArray(data.concepts));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching concepts:', err);
        setError('Failed to load images');
        setIsLoading(false);
      }
    }

    fetchConcepts();
  }, []);

  const currentConcept = concepts[currentConceptIndex];
  const currentImages = currentConcept
    ? [currentConcept.mismatched, currentConcept.baseline, currentConcept.augmented]
    : [];

  // Preload images for smooth transitions
  const preloadImages = useCallback((concept: ConceptSeries) => {
    const images = [concept.mismatched, concept.baseline, concept.augmented];
    images.forEach((src) => {
      if (!preloadedImages.current.has(src)) {
        const img = new Image();
        img.src = src;
        preloadedImages.current.add(src);
      }
    });
  }, []);

  // Preload current and next concept images
  useEffect(() => {
    if (concepts.length === 0) return;

    // Preload current concept
    if (currentConcept) {
      preloadImages(currentConcept);
    }

    // Preload next concept
    const nextConceptIndex = (currentConceptIndex + 1) % concepts.length;
    preloadImages(concepts[nextConceptIndex]);
  }, [currentConcept, currentConceptIndex, concepts, preloadImages]);

  // Auto-advance logic
  useEffect(() => {
    if (isPaused || concepts.length === 0) return;

    // State 0,1,2 = lighting up each image, State 3 = all lit, pause before next concept
    const delay = currentImageIndex === 3 ? 2000 : 1500;
    timerRef.current = setTimeout(() => {
      if (currentImageIndex < 2) {
        // Advance to next image in series
        setCurrentImageIndex((prev) => prev + 1);
      } else if (currentImageIndex === 2) {
        // Move to "all lit" state
        setCurrentImageIndex(3);
      } else {
        // Move to next concept series
        setCurrentImageIndex(0);
        setCurrentConceptIndex((prev) => (prev + 1) % concepts.length);
      }
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentImageIndex, currentConceptIndex, isPaused, concepts.length]);

  // Handle click to advance within series
  const handleClick = () => {
    if (currentImageIndex < 2) {
      setCurrentImageIndex((prev) => prev + 1);
    } else if (currentImageIndex === 2) {
      setCurrentImageIndex(3);
    } else {
      setCurrentImageIndex(0);
      setCurrentConceptIndex((prev) => (prev + 1) % concepts.length);
    }
  };

  // Navigate to previous concept
  const handlePrevConcept = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setCurrentImageIndex(0);
    setCurrentConceptIndex((prev) =>
      prev === 0 ? concepts.length - 1 : prev - 1
    );
  };

  // Navigate to next concept
  const handleNextConcept = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setCurrentImageIndex(0);
    setCurrentConceptIndex((prev) => (prev + 1) % concepts.length);
  };

  // Toggle pause
  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused((prev) => !prev);
  };

  if (isLoading) {
    return (
      <section className="bg-[#faf9f6] py-16 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error || concepts.length === 0) {
    return (
      <section className="bg-[#faf9f6] py-16 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-gray-400">{error || 'No images available'}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#faf9f6] py-8 md:py-16 overflow-hidden border-y border-gray-200">
      <div className="w-full max-w-[1400px] mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-10 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            The Sequence Matters
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We're not anti-technology. We're pro-sequence. Fix the foundation before you build higher.
            Each concept below shows the progression: the current mismatch, the healthy baseline we evolved for,
            and the augmented future that builds on solid ground.
          </p>
        </div>

        {/* Main carousel container */}
        <div
          className="relative cursor-pointer select-none"
          onClick={handleClick}
        >
          {/* Image sequence display - uses CSS custom properties for responsive sizing */}
          <div
            className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-2 xl:gap-4"
            style={{ '--img-size': 'clamp(180px, 20vw, 280px)' } as React.CSSProperties}
          >
            {/* Image 1 - Mismatched (no frame) */}
            <div className={`relative transition-all duration-500 flex-shrink-0 ${currentImageIndex >= 0 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
              <div
                className="relative rounded-xl overflow-hidden shadow-lg transition-all duration-500 border-2 border-gray-200"
                style={{
                  width: 'var(--img-size)',
                  height: 'var(--img-size)'
                }}
              >
                <img
                  src={currentImages[0]}
                  alt="Mismatched state"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Arrow 1 + "Demismatch first" */}
            <div className={`flex flex-col lg:flex-row items-center transition-all duration-500 flex-shrink-0 gap-1 ${currentImageIndex >= 1 ? 'opacity-100' : 'opacity-20'}`}>
              {/* Arrow pointing right on desktop, down on mobile */}
              <div className="hidden lg:block">
                <svg
                  className={`text-gray-700 ${currentImageIndex === 1 ? 'animate-pulse' : ''}`}
                  style={{ width: 'clamp(40px, 5vw, 80px)', height: 'clamp(30px, 4vw, 50px)' }}
                  viewBox="0 0 100 50"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="arrowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#374151" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#374151" stopOpacity="1"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M5 25 L70 25 M70 25 L55 12 M70 25 L55 38"
                    stroke="url(#arrowGrad1)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="lg:hidden py-1">
                <svg className={`w-8 h-10 text-gray-700 ${currentImageIndex === 1 ? 'animate-pulse' : ''}`} viewBox="0 0 50 60" preserveAspectRatio="xMidYMid meet">
                  <path
                    d="M25 5 L25 45 M25 45 L12 32 M25 45 L38 32"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                className={`font-black tracking-wide whitespace-nowrap text-gray-800 ${currentImageIndex === 1 ? 'animate-pulse scale-110' : ''} transition-transform duration-300`}
                style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(14px, 1.5vw, 22px)' }}
              >
                Demismatch first
              </p>
            </div>

            {/* Image 2 - Baseline/Demismatched (slight frame) */}
            <div className={`relative transition-all duration-500 flex-shrink-0 ${currentImageIndex >= 1 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
              <div
                className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${(currentImageIndex >= 1) ? 'ring-2 ring-yellow-500 border-2 border-yellow-500' : 'border-2 border-gray-200'}`}
                style={{
                  width: 'var(--img-size)',
                  height: 'var(--img-size)',
                  boxShadow: (currentImageIndex >= 1) ? '0 0 15px rgba(234, 179, 8, 0.4)' : undefined
                }}
              >
                <img
                  src={currentImages[1]}
                  alt="Baseline state"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Arrow 2 + "then augment" */}
            <div className={`flex flex-col lg:flex-row items-center transition-all duration-500 flex-shrink-0 gap-1 ${currentImageIndex >= 2 ? 'opacity-100' : 'opacity-20'}`}>
              {/* Arrow pointing right on desktop, down on mobile */}
              <div className="hidden lg:block">
                <svg
                  className={`text-[#c75b3a] drop-shadow-[0_0_15px_rgba(199,91,58,0.8)] ${currentImageIndex === 2 ? 'animate-pulse' : ''}`}
                  style={{ width: 'clamp(40px, 5vw, 80px)', height: 'clamp(30px, 4vw, 50px)' }}
                  viewBox="0 0 100 50"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <filter id="glow2">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <linearGradient id="arrowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#c75b3a" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#ff7f5c" stopOpacity="1"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M5 25 L70 25 M70 25 L55 12 M70 25 L55 38"
                    stroke="url(#arrowGrad2)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow2)"
                  />
                </svg>
              </div>
              <div className="lg:hidden py-1">
                <svg className={`w-8 h-10 text-[#c75b3a] drop-shadow-[0_0_15px_rgba(199,91,58,0.8)] ${currentImageIndex === 2 ? 'animate-pulse' : ''}`} viewBox="0 0 50 60" preserveAspectRatio="xMidYMid meet">
                  <path
                    d="M25 5 L25 45 M25 45 L12 32 M25 45 L38 32"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                className={`font-black tracking-wide whitespace-nowrap bg-gradient-to-r from-[#c75b3a] via-[#ff9f7c] to-[#c75b3a] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(199,91,58,0.9)] ${currentImageIndex === 2 ? 'animate-pulse scale-110' : ''} transition-transform duration-300`}
                style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(14px, 1.5vw, 22px)' }}
              >
                then augment
              </p>
            </div>

            {/* Image 3 - Augmented (nice golden frame) */}
            <div className={`relative transition-all duration-500 flex-shrink-0 ${currentImageIndex >= 2 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
              <div
                className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${(currentImageIndex >= 2) ? 'ring-4 ring-yellow-500 border-2 border-yellow-500' : 'border-2 border-gray-200'}`}
                style={{
                  width: 'var(--img-size)',
                  height: 'var(--img-size)',
                  boxShadow: (currentImageIndex >= 2) ? '0 0 20px rgba(234, 179, 8, 0.5)' : undefined
                }}
              >
                <img
                  src={currentImages[2]}
                  alt="Augmented state"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {/* Previous concept button */}
            <button
              onClick={handlePrevConcept}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Previous concept"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Pause/Play button */}
            <button
              onClick={handlePause}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? (
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>

            {/* Next concept button */}
            <button
              onClick={handleNextConcept}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Next concept"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Concept indicator dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {concepts.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  if (timerRef.current) {
                    clearTimeout(timerRef.current);
                  }
                  setCurrentConceptIndex(index);
                  setCurrentImageIndex(0);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentConceptIndex
                    ? 'bg-[#c75b3a] w-4'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to concept ${index + 1}`}
              />
            ))}
          </div>

          {/* Click hint */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Click anywhere to advance
          </p>
        </div>
      </div>
    </section>
  );
}
