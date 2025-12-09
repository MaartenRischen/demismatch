"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ImageData {
  id: number;
  title: string;
  tags: string[];
  image_url: string;
}

interface LibraryStripProps {
  tags: string[];
  count?: number;
  title?: string;
}

export default function LibraryStrip({ tags, count = 6, title }: LibraryStripProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/images");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        // Filter images that match any of the provided tags
        const normalizeTag = (t: string) => t.toLowerCase().replace(/[\s_-]/g, "");
        const normalizedSearchTags = tags.map(normalizeTag);
        
        const filtered = (data.images || []).filter((img: ImageData) => {
          const imgTags = (img.tags || []).map(normalizeTag);
          return normalizedSearchTags.some(searchTag => 
            imgTags.some(imgTag => 
              imgTag.includes(searchTag) || searchTag.includes(imgTag)
            )
          );
        });
        
        // Shuffle and take the requested count
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        setImages(shuffled.slice(0, count));
      } catch (err) {
        console.error("Error fetching library images:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchImages();
  }, [tags, count]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex gap-3 overflow-x-auto pb-4">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-40 h-40 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  const tagsQuery = tags.join(",");

  return (
    <div className="py-8 max-w-6xl mx-auto">
      {title && (
        <h3 className="text-lg font-medium text-[#4A4A4A] mb-4">{title}</h3>
      )}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
        {images.map((img) => (
          <Link
            key={img.id}
            href={`/library?search=${encodeURIComponent(img.title)}`}
            className="flex-shrink-0 group"
          >
            <div className="w-40 h-40 rounded-lg overflow-hidden border border-[#E5E0D8] bg-white shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={img.image_url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-xs text-[#6b6b6b] truncate w-40 group-hover:text-[#C75B39] transition-colors">
              {img.title}
            </p>
          </Link>
        ))}
        <Link
          href={`/library?tags=${encodeURIComponent(tagsQuery)}`}
          className="flex-shrink-0 w-40 h-40 rounded-lg border border-dashed border-[#E5E0D8] bg-white flex items-center justify-center hover:border-[#C75B39] hover:text-[#C75B39] transition-colors group"
        >
          <span className="text-sm text-[#6b6b6b] group-hover:text-[#C75B39]">
            See more →
          </span>
        </Link>
      </div>
    </div>
  );
}

