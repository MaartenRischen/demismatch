"use client";

import { useState, useEffect, useRef } from "react";

type GoalCarouselProps = {
  images: Array<{ src: string; alt?: string }>;
  /** Base seconds per image (will be randomized slightly) */
  durationSec?: number;
  /** Fixed height of the carousel viewport */
  heightClassName?: string;
  /** Unique ID to stagger timing across multiple carousels */
  carouselId?: number;
};

export default function GoalCarousel({
  images,
  durationSec = 4,
  heightClassName = "h-96",
  carouselId = 0,
}: GoalCarouselProps) {
  const safeImages = images.filter(i => !!i?.src);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Add a random offset based on carouselId so they don't all change at once
  const baseDelay = durationSec * 1000;
  const randomOffset = (carouselId * 200) % 1000; // Stagger by up to 1 second

  useEffect(() => {
    if (isPaused || safeImages.length === 0) return;

    const showNext = () => {
      setCurrentIndex((prev) => (prev + 1) % safeImages.length);
      startTimeRef.current = Date.now();
    };

    // Calculate next delay with some randomization (±0.5s)
    const randomVariation = (Math.random() - 0.5) * 1000;
    const delay = baseDelay + randomOffset + randomVariation;

    timerRef.current = setTimeout(showNext, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, isPaused, safeImages.length, baseDelay, randomOffset]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    startTimeRef.current = Date.now();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    startTimeRef.current = Date.now();
  };

  const handlePause = () => {
    setIsPaused((prev) => !prev);
  };

  if (safeImages.length === 0) {
    return (
      <div
        className={[
          "relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center",
          heightClassName,
        ].join(" ")}
      >
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  const currentImage = safeImages[currentIndex];

  return (
    <div
      className={[
        "relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50",
        heightClassName,
      ].join(" ")}
      aria-label="Image slideshow"
    >
      {/* Current Image */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <img
          src={currentImage.src}
          alt={currentImage.alt || `Image ${currentIndex + 1}`}
          className="w-full h-full object-contain transition-opacity duration-300"
          loading="lazy"
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-gray-200">
        <button
          onClick={handlePrev}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={handlePause}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? (
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        
        <button
          onClick={handleNext}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next image"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Image counter */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-600 shadow-sm border border-gray-200">
        {currentIndex + 1} / {safeImages.length}
      </div>
    </div>
  );
}


