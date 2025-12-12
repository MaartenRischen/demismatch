"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

interface SeriesImage {
  id: number;
  title: string;
  image_url: string;
  series?: string[];
  is_favorite?: boolean;
  show_first_default?: boolean;
}

interface SeriesStripProps {
  seriesName: string;
  images: SeriesImage[];
  onImageClick?: (imageId: number) => void;
  onToggleFavorite?: (imageId: number, nextValue: boolean) => void;
  zoomLevel?: number; // 1..5 (smaller->more tiles)
  isMobile?: boolean;
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

const TILE_BY_ZOOM = [112, 128, 144, 168, 196]; // px
const GAP_PX = 12; // gap-3

export default function SeriesStrip({
  seriesName,
  images,
  onImageClick,
  onToggleFavorite,
  zoomLevel = 3,
  isMobile = false,
}: SeriesStripProps) {
  const [expanded, setExpanded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      setContainerWidth(el.getBoundingClientRect().width);
    };
    update();

    // ResizeObserver is supported in modern browsers; if unavailable, window resize fallback
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);

    if (!ro) {
      window.addEventListener('resize', update);
    }

    return () => {
      ro?.disconnect();
      if (!ro) window.removeEventListener('resize', update);
    };
  }, []);

  if (images.length === 0) return null;

  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      const favDiff = Number(!!b.is_favorite) - Number(!!a.is_favorite);
      if (favDiff !== 0) return favDiff;
      return a.id - b.id;
    });
  }, [images]);

  const tile = TILE_BY_ZOOM[Math.min(4, Math.max(0, zoomLevel - 1))];

  const fitCount = useMemo(() => {
    if (!containerWidth) return isMobile ? 3 : 6;
    const usable = Math.max(0, containerWidth);
    const per = tile + GAP_PX;
    const fit = Math.max(1, Math.floor((usable + GAP_PX) / per));
    return fit;
  }, [containerWidth, isMobile, tile]);

  const initialCount = useMemo(() => {
    const max = isMobile ? 3 : 10;
    return Math.min(sortedImages.length, max, fitCount);
  }, [fitCount, isMobile, sortedImages.length]);

  const remaining = Math.max(0, sortedImages.length - initialCount);

  const renderTile = (img: SeriesImage) => (
    <button
      key={img.id}
      type="button"
      onClick={() => onImageClick?.(img.id)}
      className="flex-shrink-0 group text-left"
      style={{ width: tile }}
    >
      <div
        className="relative rounded-lg overflow-hidden bg-[#F5F3EF] border border-[#E5E0D8] hover:border-[#C75B39] transition-all hover:shadow-md"
        style={{ width: tile, height: tile }}
      >
        <button
          type="button"
          aria-label={img.is_favorite ? 'Unfavorite' : 'Favorite'}
          className={`absolute top-2 left-2 z-10 p-1.5 rounded-full border transition-colors ${
            img.is_favorite
              ? 'bg-white text-rose-600 border-white'
              : 'bg-black/40 text-white border-white/30 hover:bg-black/60'
          }`}
          onClick={(ev) => {
            ev.stopPropagation();
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
  );

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

        {remaining > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className="text-xs text-[#8B8B8B] hover:text-[#C75B39] transition-colors"
          >
            {expanded ? 'Show less' : `Show more (+${remaining})`}
          </button>
        )}
      </div>

      {/* Collapsed: single-row showcase. Expanded: replace row with grid (avoid duplicates). */}
      {!expanded ? (
        <div ref={containerRef} className="px-4 w-full min-w-0">
          <div className="flex flex-nowrap gap-3 overflow-hidden">
            {sortedImages.slice(0, initialCount).map(renderTile)}
          </div>
        </div>
      ) : (
        <div className="px-4 pt-1">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(auto-fill, ${tile}px)`,
              justifyContent: 'start',
            }}
          >
            {sortedImages.map(renderTile)}
          </div>
        </div>
      )}
    </div>
  );
}
