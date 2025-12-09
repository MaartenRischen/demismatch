"use client";

import { useState, useEffect } from 'react';
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

export default function LibraryStrip({ tags, title, count = 6 }: LibraryStripProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        // Shuffle and take 'count' images
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setImages(shuffled.slice(0, count));
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
  }, [tags, count]);

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
          {Array.from({ length: count }).map((_, i) => (
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

  return (
    <div className="my-12 py-8 border-t border-b border-[#E5E0D8] px-8">
      {title && (
        <h4 className="text-sm font-medium text-[#6b6b6b] uppercase tracking-wide mb-4">
          {title}
        </h4>
      )}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {images.map((img) => (
          <Link
            key={img.id}
            href={`/library?search=${encodeURIComponent(img.title)}`}
            className="flex-shrink-0 group"
          >
            <div className="w-48 h-48 rounded-lg overflow-hidden bg-[#F5F3EF] border border-[#E5E0D8]">
              <img
                src={img.image_url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-xs text-[#4A4A4A] truncate w-48 group-hover:text-[#C75B39] transition-colors">
              {img.title}
            </p>
          </Link>
        ))}
      </div>
      <Link 
        href={`/library?tags=${tagsParam}`}
        className="inline-flex items-center gap-1 text-sm text-[#C75B39] hover:underline mt-2"
      >
        See more in library →
      </Link>
    </div>
  );
}

