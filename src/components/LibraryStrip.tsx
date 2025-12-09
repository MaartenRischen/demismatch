"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ImageData {
  id: number;
  title: string;
  image_url: string;
  tags: string[];
}

interface LibraryStripProps {
  tags: string[];
  title?: string;
  count?: number;
}

export default function LibraryStrip({ tags, title, count = 6 }: LibraryStripProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/images');
        if (!res.ok) return;
        const data = await res.json();
        
        // Filter images that have ANY of the specified tags
        const filtered = (data.images || []).filter((img: ImageData) => {
          const imgTags = img.tags?.map(t => t.toLowerCase()) || [];
          return tags.some(tag => 
            imgTags.some(imgTag => imgTag.includes(tag.toLowerCase()))
          );
        });
        
        // Shuffle and take 'count' images
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        setImages(shuffled.slice(0, count));
      } catch (err) {
        console.error('Failed to fetch library images:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchImages();
  }, [tags, count]);

  if (loading || images.length === 0) return null;

  const tagsParam = tags.join(',');

  return (
    <div className="my-12 py-8 border-t border-b border-[#E5E0D8]">
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
            <div className="w-48 h-48 rounded-lg overflow-hidden bg-[#F5F3EF]">
              <img
                src={img.image_url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-xs text-[#4A4A4A] truncate w-48 group-hover:text-[#C75B39]">
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

