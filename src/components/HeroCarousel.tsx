"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface HeroImage {
  name: string;
  url: string;
  displayName: string;
}

const MIN_SPEED = 1000; // 1 second
const MAX_SPEED = 10000; // 10 seconds
const DEFAULT_SPEED = 4000; // 4 seconds
const TRANSITION_DURATION = 500;

export default function HeroCarousel() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const preloadedImages = useRef<Set<string>>(new Set());

  // Fetch images from API
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/hero-images');
        const data = await response.json();

        if (data.images && data.images.length > 0) {
          const shuffled = [...data.images].sort(() => Math.random() - 0.5);
          setImages(shuffled);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching hero images:', err);
        setIsLoading(false);
      }
    }

    fetchImages();
  }, []);

  // Preload next image
  const preloadImage = useCallback((url: string) => {
    if (!preloadedImages.current.has(url)) {
      const img = new window.Image();
      img.src = url;
      preloadedImages.current.add(url);
    }
  }, []);

  // Preload current and next images
  useEffect(() => {
    if (images.length === 0) return;
    preloadImage(images[currentIndex].url);
    const nextIndex = (currentIndex + 1) % images.length;
    preloadImage(images[nextIndex].url);
  }, [currentIndex, images, preloadImage]);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || images.length <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, TRANSITION_DURATION / 2);
    }, speed);

    return () => clearInterval(timer);
  }, [isPaused, images.length, speed]);

  // Manual navigation
  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, TRANSITION_DURATION / 2);
  };

  const goToPrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsTransitioning(false);
    }, TRANSITION_DURATION / 2);
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

  return (
    <div className="relative">
      {/* Main image container */}
      <div className="relative overflow-hidden shadow-2xl aspect-square">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Image
            src={currentImage.url}
            alt="Hero image"
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </div>

        {/* Navigation arrows - always visible */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0A0A0A]/70 text-white flex items-center justify-center hover:bg-[#C75B39] transition-colors touch-target"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0A0A0A]/70 text-white flex items-center justify-center hover:bg-[#C75B39] transition-colors touch-target"
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image counter */}
        <div className="absolute bottom-3 left-3 bg-[#0A0A0A]/70 text-white px-2 py-1 text-xs font-bold">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Controls bar below image */}
      <div className="mt-4 flex items-center gap-4">
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

        {/* Speed slider */}
        <div className="flex-1 flex items-center gap-3">
          <svg className="w-4 h-4 text-[#8B8B8B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <input
            type="range"
            min={MIN_SPEED}
            max={MAX_SPEED}
            step={500}
            value={MAX_SPEED + MIN_SPEED - speed}
            onChange={(e) => setSpeed(MAX_SPEED + MIN_SPEED - Number(e.target.value))}
            className="flex-1 h-1 bg-[#E5E0D8] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#C75B39] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#C75B39] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            title={`Speed: ${(speed / 1000).toFixed(1)}s per image`}
          />
          <span className="text-xs text-[#8B8B8B] w-12 text-right">{(speed / 1000).toFixed(1)}s</span>
        </div>

        {/* Prev/Next buttons */}
        <div className="flex gap-1">
          <button
            onClick={goToPrev}
            className="w-10 h-10 bg-[#F0EDE6] hover:bg-[#E5E0D8] flex items-center justify-center transition-colors touch-target"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
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
    </div>
  );
}
