"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ImageData {
  id: number;
  title: string;
  image_url: string;
  tags: string[];
  categories?: string[];
  framework_concepts?: string[];
}

interface LibraryStripProps {
  tags: string[];
  title?: string;
  count?: number;
}

// Normalize tag for fuzzy matching
function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/[\s_-]/g, '');
}

// Check if image matches any of the search tags (fuzzy matching)
function imageMatchesTags(img: ImageData, searchTags: string[]): boolean {
  const imgTagsNormalized = (img.tags || []).map(normalizeTag);
  const imgTitleNormalized = normalizeTag(img.title || '');
  
  // Also check categories and concepts if available
  const imgCategoriesNormalized = (img.categories || []).map(normalizeTag);
  const imgConceptsNormalized = (img.framework_concepts || []).map(normalizeTag);
  
  return searchTags.some(searchTag => {
    const normalizedSearch = normalizeTag(searchTag);
    
    // Check title
    if (imgTitleNormalized.includes(normalizedSearch) || normalizedSearch.includes(imgTitleNormalized)) {
      return true;
    }
    
    // Check tags
    if (imgTagsNormalized.some(imgTag => 
      imgTag.includes(normalizedSearch) || normalizedSearch.includes(imgTag)
    )) {
      return true;
    }
    
    // Check categories
    if (imgCategoriesNormalized.some(cat => 
      cat.includes(normalizedSearch) || normalizedSearch.includes(cat)
    )) {
      return true;
    }
    
    // Check concepts
    if (imgConceptsNormalized.some(concept => 
      concept.includes(normalizedSearch) || normalizedSearch.includes(concept)
    )) {
      return true;
    }
    
    return false;
  });
}

export default function LibraryStrip({ tags, title }: LibraryStripProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/images');
        if (!res.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await res.json();
        
        if (!data.images || !Array.isArray(data.images)) {
          throw new Error('Invalid response format');
        }
        
        // Filter images that match ANY of the specified tags (fuzzy matching)
        const filtered = data.images.filter((img: ImageData) => 
          imageMatchesTags(img, tags)
        );
        
        // Shuffle and use ALL matching images (no limit)
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setImages(shuffled);
      } catch (err: any) {
        console.error('Failed to fetch library images:', err);
        setError(err.message || 'Failed to load images');
      } finally {
        setLoading(false);
      }
    }
    
    if (tags.length > 0) {
      fetchImages();
    } else {
      setLoading(false);
    }
  }, [tags]);

  // Auto-scroll effect
  useEffect(() => {
    if (loading || error || images.length === 0 || isPaused || !scrollContainerRef.current) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      return;
    }

    // Duplicate images for seamless loop
    const container = scrollContainerRef.current;
    const scrollAmount = 1; // pixels per scroll
    const scrollSpeed = 50; // milliseconds between scrolls (slow)

    scrollIntervalRef.current = setInterval(() => {
      if (container) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;
        
        if (currentScroll >= maxScroll) {
          // Loop back to start
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += scrollAmount;
        }
      }
    }, scrollSpeed);

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [loading, error, images.length, isPaused]);

  // Don't render if no tags provided
  if (tags.length === 0) return null;

  const tagsParam = tags.join(',');

  // Show loading state
  if (loading) {
    return (
      <div className="my-12 py-8 border-t border-b border-[#E5E0D8] px-8">
        {title && (
          <h4 className="text-sm font-medium text-[#6b6b6b] uppercase tracking-wide mb-4">
            {title}
          </h4>
        )}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-48 h-48 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Show error or empty state
  if (error || images.length === 0) {
    return (
      <div className="my-12 py-8 border-t border-b border-[#E5E0D8] px-8">
        {title && (
          <h4 className="text-sm font-medium text-[#6b6b6b] uppercase tracking-wide mb-4">
            {title}
          </h4>
        )}
        <div className="text-sm text-[#6b6b6b] mb-2">
          {error ? `Error: ${error}` : 'No matching images found.'}
        </div>
        <Link 
          href={`/library?tags=${tagsParam}`}
          className="inline-flex items-center gap-1 text-sm text-[#C75B39] hover:underline"
        >
          Browse library →
        </Link>
      </div>
    );
  }

  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...images, ...images, ...images];

  return (
    <div className="my-12 py-8 border-t border-b border-[#E5E0D8] px-8">
      <div className="flex items-center justify-between mb-4">
        {title && (
          <h4 className="text-sm font-medium text-[#6b6b6b] uppercase tracking-wide">
            {title}
          </h4>
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-[#6b6b6b] hover:text-[#C75B39] transition-colors p-1"
            aria-label={isPaused ? 'Resume carousel' : 'Pause carousel'}
          >
            {isPaused ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <Link 
            href={`/library?tags=${tagsParam}`}
            className="text-xs text-[#6b6b6b] hover:text-[#C75B39] transition-colors"
          >
            View all ({images.length}) →
          </Link>
        </div>
      </div>
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedImages.map((img, index) => (
          <Link
            key={`${img.id}-${index}`}
            href={`/library?search=${encodeURIComponent(img.title)}`}
            className="flex-shrink-0 group"
          >
            <div className="w-48 h-48 rounded-lg overflow-hidden bg-[#F5F3EF] border border-[#E5E0D8] hover:border-[#C75B39] transition-colors">
              <img
                src={img.image_url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

