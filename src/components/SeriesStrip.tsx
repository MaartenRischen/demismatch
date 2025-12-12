"use client";

import { useMemo, useRef } from 'react';
import Link from 'next/link';

interface SeriesImage {
  id: number;
  title: string;
  image_url: string;
  series?: string[];
  is_favorite?: boolean;
}

interface SeriesStripProps {
  seriesName: string;
  images: SeriesImage[];
  onImageClick?: (imageId: number) => void;
  onToggleFavorite?: (imageId: number, nextValue: boolean) => void;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path
        d="M12 21s-7.1-4.4-9.5-8.3C.2 8.9 2 5.5 5.6 4.6c1.9-.5 3.9.2 5.1 1.6 1.2-1.4 3.2-2.1 5.1-1.6 3.6.9 5.4 4.3 3.1 8.1C19.1 16.6 12 21 12 21z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SeriesStrip({ seriesName, images, onImageClick, onToggleFavorite }: SeriesStripProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      const favDiff = Number(!!b.is_favorite) - Number(!!a.is_favorite);
      if (favDiff !== 0) return favDiff;
      return a.id - b.id;
    });
  }, [images]);

  return (
    <div className="py-6 border-b border-[#E5E0D8] w-full min-w-0">
      <div className="flex items-center justify-between mb-3 px-4">
        <Link
          href={`/library?series=${encodeURIComponent(seriesName)}`}
          className="group flex items-center gap-2"
        >
          <h3 className="text-lg font-semibold text-[#1A1A1A] group-hover:text-[#C75B39] transition-colors">
            {seriesName}
          </h3>
          <span className="text-sm text-[#8B8B8B]">({images.length})</span>
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
        className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 px-4 scrollbar-hide w-full min-w-0"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {sortedImages.slice(0, 30).map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => onImageClick?.(img.id)}
            className="flex-shrink-0 group text-left"
          >
            <div className="relative w-36 h-36 rounded-lg overflow-hidden bg-[#F5F3EF] border border-[#E5E0D8] hover:border-[#C75B39] transition-all hover:shadow-md">
              <button
                type="button"
                aria-label={img.is_favorite ? 'Unfavorite' : 'Favorite'}
                className={`absolute top-2 left-2 z-10 p-1.5 rounded-full border transition-colors ${
                  img.is_favorite
                    ? 'bg-white text-rose-600 border-white'
                    : 'bg-black/40 text-white border-white/30 hover:bg-black/60'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = !img.is_favorite;
                  onToggleFavorite?.(img.id, next);
                }}
              >
                <HeartIcon filled={!!img.is_favorite} />
              </button>
              <img
                src={img.image_url}
                alt=""
                title=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </button>
        ))}

        {sortedImages.length > 30 && (
          <Link
            href={`/library?series=${encodeURIComponent(seriesName)}`}
            className="flex-shrink-0 w-36 h-36 rounded-lg bg-[#F5F3EF] border border-[#E5E0D8] hover:border-[#C75B39] transition-all flex items-center justify-center"
          >
            <span className="text-sm text-[#8B8B8B]">+{sortedImages.length - 30} more</span>
          </Link>
        )}
      </div>
    </div>
  );
}
