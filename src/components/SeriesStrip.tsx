"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';

// Minimal interface - accepts any object with at least these properties
interface SeriesImage {
  id: number;
  title: string;
  image_url: string;
  series?: string[];
}

interface SeriesStripProps {
  seriesName: string;
  images: SeriesImage[];
  onImageClick?: (image: SeriesImage) => void;
}

export default function SeriesStrip({ seriesName, images, onImageClick }: SeriesStripProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  return (
    <div className="py-6 border-b border-[#E5E0D8]">
      <div className="flex items-center justify-between mb-3 px-4">
        <Link 
          href={`/library?series=${encodeURIComponent(seriesName)}`}
          className="group flex items-center gap-2"
        >
          <h3 className="text-lg font-semibold text-[#1A1A1A] group-hover:text-[#C75B39] transition-colors">
            {seriesName}
          </h3>
          <span className="text-sm text-[#8B8B8B]">
            ({images.length})
          </span>
        </Link>
        <Link 
          href={`/library?series=${encodeURIComponent(seriesName)}`}
          className="text-xs text-[#8B8B8B] hover:text-[#C75B39] transition-colors"
        >
          View all →
        </Link>
      </div>
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {images.slice(0, 30).map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => onImageClick?.(img)}
            className="flex-shrink-0 group focus:outline-none"
          >
            <div className="w-36 h-36 rounded-lg overflow-hidden bg-[#F5F3EF] border border-[#E5E0D8] hover:border-[#C75B39] transition-all hover:shadow-md">
              <img
                src={img.image_url}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </button>
        ))}
        {images.length > 30 && (
          <Link
            href={`/library?series=${encodeURIComponent(seriesName)}`}
            className="flex-shrink-0 w-36 h-36 rounded-lg bg-[#F5F3EF] border border-[#E5E0D8] hover:border-[#C75B39] transition-all flex items-center justify-center"
          >
            <span className="text-sm text-[#8B8B8B]">+{images.length - 30} more</span>
          </Link>
        )}
      </div>
    </div>
  );
}
