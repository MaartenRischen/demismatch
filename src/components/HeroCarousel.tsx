"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface HeroImage {
  name: string;
  url: string;
  displayName: string;
}

const SLIDE_DURATION = 5000; // 5 seconds per slide
const TRANSITION_DURATION = 1000; // 1 second fade

export default function HeroCarousel() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const preloadedImages = useRef<Set<string>>(new Set());

  // Fetch images from API
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/hero-images');
        const data = await response.json();

        if (data.images && data.images.length > 0) {
          // Shuffle the images for variety
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

    // Preload current image
    preloadImage(images[currentIndex].url);

    // Preload next image
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
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, images.length]);

  // Manual navigation
  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, TRANSITION_DURATION / 2);
  };

  const goToNext = () => {
    goToSlide((currentIndex + 1) % images.length);
  };

  const goToPrev = () => {
    goToSlide((currentIndex - 1 + images.length) % images.length);
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
    <div
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main image container */}
      <div className="relative overflow-hidden shadow-2xl aspect-square">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Image
            src={currentImage.url}
            alt={currentImage.displayName}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 via-transparent to-transparent" />

        {/* Navigation arrows - visible on hover */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0A0A0A]/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#C75B39]"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0A0A0A]/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#C75B39]"
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Progress indicator dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.slice(0, Math.min(images.length, 10)).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-2 h-2 transition-all ${
                idx === currentIndex
                  ? 'bg-white w-4'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
          {images.length > 10 && (
            <span className="text-white/70 text-xs ml-1">+{images.length - 10}</span>
          )}
        </div>
      </div>

      {/* Caption badge - matches existing design */}
      <div className="absolute -bottom-4 left-0 md:-bottom-6 md:-left-6 bg-[#0A0A0A] text-white px-4 py-2 md:px-6 md:py-3 max-w-[90%]">
        <p className="text-xs font-bold uppercase tracking-widest truncate">
          {currentImage.displayName || 'The Modern Condition'}
        </p>
      </div>
    </div>
  );
}
