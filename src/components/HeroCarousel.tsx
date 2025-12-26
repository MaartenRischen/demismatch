"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface HeroImage {
  name: string;
  url: string;
  displayName: string;
}

const SLIDE_DURATION = 5000; // 5 seconds between slides
const TRANSITION_DURATION = 1000; // 1 second crossfade

// Fisher-Yates shuffle for truly random order
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function HeroCarousel() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const preloadedImages = useRef<Set<string>>(new Set());

  // Fetch images from API
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/hero-images');
        const data = await response.json();

        if (data.images && data.images.length > 0) {
          // Always shuffle for random order
          setImages(shuffleArray(data.images));
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching hero images:', err);
        setIsLoading(false);
      }
    }

    fetchImages();
  }, []);

  // Preload all images for smooth rapid cycling
  const preloadImage = useCallback((url: string) => {
    if (!preloadedImages.current.has(url)) {
      const img = new window.Image();
      img.src = url;
      preloadedImages.current.add(url);
    }
  }, []);

  // Preload all images on load
  useEffect(() => {
    images.forEach(img => preloadImage(img.url));
  }, [images, preloadImage]);

  // Transition to a new slide with crossfade
  const transitionTo = useCallback((newIndex: number) => {
    if (isTransitioning || images.length === 0) return;

    setPrevIndex(currentIndex);
    setIsTransitioning(true);
    setCurrentIndex(newIndex);

    // Clear transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
      setPrevIndex(null);
    }, TRANSITION_DURATION);
  }, [currentIndex, isTransitioning, images.length]);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || images.length <= 1 || isTransitioning) return;

    const timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      transitionTo(nextIndex);
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [isPaused, images.length, currentIndex, isTransitioning, transitionTo]);

  // Manual navigation
  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    transitionTo(nextIndex);
  };

  const goToPrev = () => {
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    transitionTo(prevIdx);
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden shadow-2xl bg-[#F0EDE6] aspect-square animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#C75B39] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="relative overflow-hidden shadow-2xl bg-[#F0EDE6] aspect-square">
        <div className="absolute inset-0 flex items-center justify-center text-[#8B8B8B]">
          No images available
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];
  const previousImage = prevIndex !== null ? images[prevIndex] : null;

  return (
    <div className="relative">
      {/* Main image container with Ken Burns effect */}
      <div className="relative overflow-hidden shadow-2xl aspect-square">
        {/* Previous image (fading out) */}
        {previousImage && isTransitioning && (
          <div
            className="absolute inset-0 z-10"
            style={{
              animation: `fadeOut ${TRANSITION_DURATION}ms ease-out forwards`,
            }}
          >
            <Image
              src={previousImage.url}
              alt="Previous hero image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        )}

        {/* Current image with Ken Burns zoom effect */}
        <div
          key={currentIndex}
          className="absolute inset-0"
          style={{
            animation: `kenBurns ${SLIDE_DURATION + TRANSITION_DURATION}ms ease-out forwards`,
          }}
        >
          <Image
            src={currentImage.url}
            alt="Hero image"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </div>
      </div>

      {/* CSS Keyframe animations */}
      <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes kenBurns {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
      `}</style>

      {/* Controls bar below image */}
      <div className="mt-4 flex items-center gap-2">
        {/* Prev button */}
        <button
          onClick={goToPrev}
          className="w-10 h-10 bg-[#F0EDE6] hover:bg-[#E5E0D8] flex items-center justify-center transition-colors touch-target"
          aria-label="Previous"
        >
          <svg className="w-5 h-5 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Play/Pause button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="w-10 h-10 bg-[#F0EDE6] hover:bg-[#E5E0D8] flex items-center justify-center transition-colors touch-target"
          aria-label={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? (
            <svg className="w-5 h-5 text-[#4A4A4A]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[#4A4A4A]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          )}
        </button>

        {/* Next button */}
        <button
          onClick={goToNext}
          className="w-10 h-10 bg-[#F0EDE6] hover:bg-[#E5E0D8] flex items-center justify-center transition-colors touch-target"
          aria-label="Next"
        >
          <svg className="w-5 h-5 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
