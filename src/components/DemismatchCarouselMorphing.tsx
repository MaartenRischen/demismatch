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

export default function DemismatchCarouselMorphing() {
  const [concepts, setConcepts] = useState<ConceptSeries[]>([]);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [revealPercent, setRevealPercent] = useState(0); // 0-100 smooth
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const preloadedImages = useRef<Set<string>>(new Set());

  // Animation speed: percentage points per second
  const REVEAL_SPEED = 20; // Takes ~5 seconds to fully reveal
  const HOLD_TIME = 2500; // Hold at 100% for 2.5 seconds before next concept

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

    if (currentConcept) {
      preloadImages(currentConcept);
    }

    const nextConceptIndex = (currentConceptIndex + 1) % concepts.length;
    preloadImages(concepts[nextConceptIndex]);
  }, [currentConcept, currentConceptIndex, concepts, preloadImages]);

  // Smooth animation loop
  useEffect(() => {
    if (isPaused || concepts.length === 0) return;

    let holdTimeout: NodeJS.Timeout | null = null;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setRevealPercent((prev) => {
        if (prev >= 100) return prev; // Hold at 100
        const newValue = prev + (REVEAL_SPEED * deltaTime) / 1000;
        return Math.min(newValue, 100);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (holdTimeout) {
        clearTimeout(holdTimeout);
      }
    };
  }, [isPaused, concepts.length, currentConceptIndex]);

  // Handle transition to next concept when reveal completes
  useEffect(() => {
    if (revealPercent >= 100 && !isPaused && concepts.length > 0) {
      const holdTimeout = setTimeout(() => {
        setRevealPercent(0);
        lastTimeRef.current = 0;
        setCurrentConceptIndex((prev) => (prev + 1) % concepts.length);
      }, HOLD_TIME);

      return () => clearTimeout(holdTimeout);
    }
  }, [revealPercent, isPaused, concepts.length]);

  // Handle click to advance
  const handleClick = () => {
    if (revealPercent < 100) {
      // Jump to full reveal
      setRevealPercent(100);
    } else {
      // Move to next concept
      setRevealPercent(0);
      lastTimeRef.current = 0;
      setCurrentConceptIndex((prev) => (prev + 1) % concepts.length);
    }
  };

  // Navigate to previous concept
  const handlePrevConcept = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setRevealPercent(0);
    lastTimeRef.current = 0;
    setCurrentConceptIndex((prev) =>
      prev === 0 ? concepts.length - 1 : prev - 1
    );
  };

  // Navigate to next concept
  const handleNextConcept = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setRevealPercent(0);
    lastTimeRef.current = 0;
    setCurrentConceptIndex((prev) => (prev + 1) % concepts.length);
  };

  // Toggle pause
  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused((prev) => !prev);
  };

  if (isLoading) {
    return (
      <section className="bg-[#FAF9F6] py-16 border-y border-[#E5E0D8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-[#8B8B8B]">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error || concepts.length === 0) {
    return (
      <section className="bg-[#FAF9F6] py-16 border-y border-[#E5E0D8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-[#8B8B8B]">{error || 'No images available'}</div>
          </div>
        </div>
      </section>
    );
  }

  // Use smooth revealPercent directly
  const revealPct = revealPercent;

  return (
    <section className="bg-[#FAF9F6] py-8 md:py-16 overflow-hidden border-y border-[#E5E0D8]">
      <div className="w-full max-w-[1400px] mx-auto px-4">
        {/* Main morphing carousel container */}
        <div
          className="relative cursor-pointer select-none"
          onClick={handleClick}
        >
          {/* Morphing image strip */}
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Aspect ratio container - responsive: taller on mobile for visibility */}
            <div
              className="relative w-full overflow-hidden shadow-2xl aspect-[3/1] md:aspect-[3/1]"
              style={{ minHeight: '140px' }} // Ensure minimum visibility on small screens
            >
              {/* Image container with all 3 images */}
              <div className="absolute inset-0">
                {/* Base layer - all images composited */}
                <div className="relative w-full h-full flex">
                  {/* Image 1 - Mismatched (left third) */}
                  <div
                    className="absolute left-0 top-0 h-full"
                    style={{
                      width: '40%',
                      opacity: Math.min(1, 0.3 + (revealPct / 33) * 0.7),
                      filter: revealPct >= 33 ? 'none' : `grayscale(${Math.max(0, 50 - (revealPct / 33) * 50)}%)`,
                    }}
                  >
                    <img
                      src={currentConcept.mismatched}
                      alt="Mismatched state"
                      className="w-full h-full object-cover"
                      style={{
                        maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
                      }}
                    />
                  </div>

                  {/* Image 2 - Baseline (middle) */}
                  <div
                    className="absolute top-0 h-full"
                    style={{
                      left: '30%',
                      width: '40%',
                      opacity: revealPct < 33 ? 0.3 : Math.min(1, 0.3 + ((revealPct - 33) / 33) * 0.7),
                      filter: revealPct >= 66 ? 'none' : `grayscale(${revealPct < 33 ? 50 : Math.max(0, 50 - ((revealPct - 33) / 33) * 50)}%)`,
                    }}
                  >
                    <img
                      src={currentConcept.baseline}
                      alt="Baseline state"
                      className="w-full h-full object-cover"
                      style={{
                        maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                      }}
                    />
                  </div>

                  {/* Image 3 - Augmented (right third) */}
                  <div
                    className="absolute right-0 top-0 h-full"
                    style={{
                      width: '40%',
                      opacity: revealPct < 66 ? 0.3 : Math.min(1, 0.3 + ((revealPct - 66) / 34) * 0.7),
                      filter: revealPct >= 100 ? 'none' : `grayscale(${revealPct < 66 ? 50 : Math.max(0, 50 - ((revealPct - 66) / 34) * 50)}%)`,
                    }}
                  >
                    <img
                      src={currentConcept.augmented}
                      alt="Augmented state"
                      className="w-full h-full object-cover"
                      style={{
                        maskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
                      }}
                    />
                  </div>

                  {/* Reveal wipe overlay - animated terracotta glow that sweeps across */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right,
                        transparent 0%,
                        transparent ${Math.max(0, revealPct - 5)}%,
                        rgba(199, 91, 57, 0.5) ${revealPct}%,
                        transparent ${Math.min(100, revealPct + 5)}%,
                        transparent 100%)`,
                    }}
                  />
                </div>

                {/* Border/frame overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: revealPct >= 95
                      ? 'inset 0 0 0 4px rgba(199, 91, 57, 0.6), 0 0 40px rgba(199, 91, 57, 0.3)'
                      : 'inset 0 0 0 2px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.5s ease',
                  }}
                />
              </div>
            </div>

            {/* Phase labels below the image - responsive sizing */}
            <div className="flex justify-between mt-4 md:mt-6 px-2 md:px-4 gap-1 md:gap-4">
              {/* Phase 1 label */}
              <div
                className="flex-1 text-center transition-all duration-500"
                style={{
                  opacity: Math.min(1, revealPct / 20),
                  transform: `translateY(${Math.max(0, 16 - (revealPct / 20) * 16)}px)`,
                }}
              >
                <div className="text-[10px] md:text-xs font-bold text-[#8B8B8B] uppercase tracking-wider md:tracking-widest mb-1">Phase 1</div>
                <div className="text-sm md:text-lg font-bold text-[#0A0A0A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  The Mismatch
                </div>
              </div>

              {/* Phase 2 label */}
              <div
                className="flex-1 text-center transition-all duration-500"
                style={{
                  opacity: revealPct < 25 ? 0 : Math.min(1, (revealPct - 25) / 20),
                  transform: `translateY(${revealPct < 25 ? 16 : Math.max(0, 16 - ((revealPct - 25) / 20) * 16)}px)`,
                }}
              >
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-1">
                  <svg className="hidden md:block w-4 h-4 text-[#2D4A3E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="text-[10px] md:text-xs font-bold text-[#2D4A3E] uppercase tracking-wider md:tracking-widest">Demismatch</span>
                  <svg className="hidden md:block w-4 h-4 text-[#2D4A3E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div
                  className="text-sm md:text-lg font-bold text-[#2D4A3E]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  The Baseline
                </div>
              </div>

              {/* Phase 3 label */}
              <div
                className="flex-1 text-center transition-all duration-500"
                style={{
                  opacity: revealPct < 55 ? 0 : Math.min(1, (revealPct - 55) / 20),
                  transform: `translateY(${revealPct < 55 ? 16 : Math.max(0, 16 - ((revealPct - 55) / 20) * 16)}px)`,
                }}
              >
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-1">
                  <svg className="hidden md:block w-4 h-4 text-[#C75B39]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="text-[10px] md:text-xs font-bold text-[#C75B39] uppercase tracking-wider md:tracking-widest">Augment</span>
                </div>
                <div
                  className="text-sm md:text-lg font-bold text-[#C75B39]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  The Future
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 h-1 bg-[#E5E0D8] overflow-hidden max-w-md mx-auto">
              <div
                className="h-full bg-gradient-to-r from-[#8B8B8B] via-[#2D4A3E] to-[#C75B39] transition-all duration-1000 ease-out"
                style={{ width: `${revealPct}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrevConcept}
              className="p-3 bg-[#F0EDE6] hover:bg-[#E5E0D8] transition-colors"
              aria-label="Previous concept"
            >
              <svg className="w-6 h-6 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handlePause}
              className="p-3 bg-[#F0EDE6] hover:bg-[#E5E0D8] transition-colors"
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? (
                <svg className="w-6 h-6 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleNextConcept}
              className="p-3 bg-[#F0EDE6] hover:bg-[#E5E0D8] transition-colors"
              aria-label="Next concept"
            >
              <svg className="w-6 h-6 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                  if (animationRef.current) cancelAnimationFrame(animationRef.current);
                  setRevealPercent(0);
                  lastTimeRef.current = 0;
                  setCurrentConceptIndex(index);
                }}
                className={`w-2 h-2 transition-all ${
                  index === currentConceptIndex
                    ? 'bg-[#C75B39] w-4'
                    : 'bg-[#E5E0D8] hover:bg-[#D4CEC4]'
                }`}
                aria-label={`Go to concept ${index + 1}`}
              />
            ))}
          </div>

          <p className="text-center text-[#8B8B8B] text-sm mt-6">
            <span className="hidden md:inline">Click</span>
            <span className="md:hidden">Tap</span>
            {" "}anywhere to advance
          </p>
        </div>
      </div>
    </section>
  );
}
