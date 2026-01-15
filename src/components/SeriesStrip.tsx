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
  originalSeriesName?: string; // For URL filtering (uses original name from masterlist)
  images: SeriesImage[];
  onImageClick?: (imageId: number) => void;
  onDelete?: (imageId: number, e: React.MouseEvent) => void; // Admin delete
  isAdminMode?: boolean;
  zoomLevel?: number; // 1..5 (smaller->more tiles)
  isMobile?: boolean;
}

// Favorites UI intentionally hidden for now.

const TILE_BY_ZOOM = [112, 128, 144, 168, 196]; // px
const GAP_PX = 12; // gap-3

export default function SeriesStrip({
  seriesName,
  originalSeriesName,
  images,
  onImageClick,
  onDelete,
  isAdminMode = false,
  zoomLevel = 3,
  isMobile = false,
}: SeriesStripProps) {
  // Use original name for URL filtering, display name for showing
  const urlSeriesName = originalSeriesName || seriesName;
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
      const defaultDiff = Number(!!b.show_first_default) - Number(!!a.show_first_default);
      if (defaultDiff !== 0) return defaultDiff;
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
    <div
      key={img.id}
      className="flex-shrink-0 group text-left relative"
      style={{ width: tile }}
    >
      <button
        type="button"
        onClick={() => onImageClick?.(img.id)}
        className="w-full"
      >
        <div
          className="relative rounded-lg overflow-hidden bg-[#F5F3EF] border border-[#E5E0D8] hover:border-[#C75B39] transition-all hover:shadow-md"
          style={{ width: tile, height: tile }}
        >
          <img
            src={img.image_url}
            alt=""
            title=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </button>
      {isAdminMode && onDelete && (
        <button
          type="button"
          onClick={(e) => onDelete(img.id, e)}
          className="absolute top-1 right-1 p-1 bg-red-600 rounded hover:bg-red-700 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Delete image"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <div className="py-6 border-b border-[#E5E0D8] w-full min-w-0">
      <div className="flex items-center justify-between mb-3 px-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/library?series=${encodeURIComponent(urlSeriesName)}`}
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
