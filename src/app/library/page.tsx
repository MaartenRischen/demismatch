"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface ImageData {
  id: number;
  file_name: string;
  folder_name: string;
  title: string;
  body_text: string;
  image_type: string;
  categories: string[];
  framework_concepts: string[];
  tags: string[];
  image_url: string;
}

interface TaxonomyIndex {
  by_category: Record<string, number[]>;
  by_framework_concept: Record<string, number[]>;
}

type SortOption = "alphabetical" | "type" | "category";

const IMAGE_TYPES = ["problem", "solution", "comparison", "explanation"];

function formatLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export default function LibraryPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="spinner" />
          <p className="mt-4 text-[var(--text-secondary)]">Loading library...</p>
        </div>
      </main>
    }>
      <LibraryContent />
    </Suspense>
  );
}

function LibraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Data state
  const [allImages, setAllImages] = useState<ImageData[]>([]);
  const [taxonomy, setTaxonomy] = useState<TaxonomyIndex | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedConcepts, setSelectedConcepts] = useState<Set<string>>(new Set());
  const [tagSearch, setTagSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // UI state
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["types", "categories"]));
  const [toast, setToast] = useState("");
  const [displayCount, setDisplayCount] = useState(30);

  // Initialize filters from URL
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const categoryParam = searchParams.get("category");
    const conceptParam = searchParams.get("concept");
    const tagsParam = searchParams.get("tags");
    const sortParam = searchParams.get("sort") as SortOption;

    if (typeParam) setSelectedTypes(new Set(typeParam.split(",")));
    if (categoryParam) setSelectedCategories(new Set(categoryParam.split(",")));
    if (conceptParam) setSelectedConcepts(new Set(conceptParam.split(",")));
    if (tagsParam) setSelectedTags(new Set(tagsParam.split(",")));
    if (sortParam) setSortBy(sortParam);
  }, [searchParams]);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const [taxonomyRes, imagesRes] = await Promise.all([
          fetch("/api/taxonomy"),
          fetch("/api/images")
        ]);

        if (!taxonomyRes.ok || !imagesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const taxonomyData = await taxonomyRes.json();
        const imagesData = await imagesRes.json();

        setTaxonomy(taxonomyData);
        setAllImages(imagesData.images || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load library data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (selectedTypes.size > 0) params.set("type", Array.from(selectedTypes).join(","));
    if (selectedCategories.size > 0) params.set("category", Array.from(selectedCategories).join(","));
    if (selectedConcepts.size > 0) params.set("concept", Array.from(selectedConcepts).join(","));
    if (selectedTags.size > 0) params.set("tags", Array.from(selectedTags).join(","));
    if (sortBy !== "alphabetical") params.set("sort", sortBy);

    const queryString = params.toString();
    router.replace(`/library${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [selectedTypes, selectedCategories, selectedConcepts, selectedTags, sortBy, router]);

  useEffect(() => {
    if (!isLoading) {
      updateURL();
    }
  }, [selectedTypes, selectedCategories, selectedConcepts, selectedTags, sortBy, isLoading, updateURL]);

  // Compute category and concept counts
  const categoryCounts = useMemo(() => {
    if (!taxonomy) return {};
    const counts: Record<string, number> = {};
    for (const [cat, ids] of Object.entries(taxonomy.by_category)) {
      counts[cat] = ids.length;
    }
    return counts;
  }, [taxonomy]);

  const conceptCounts = useMemo(() => {
    if (!taxonomy) return {};
    const counts: Record<string, number> = {};
    for (const [concept, ids] of Object.entries(taxonomy.by_framework_concept)) {
      counts[concept] = ids.length;
    }
    return counts;
  }, [taxonomy]);

  // Compute tag frequencies
  const tagFrequencies = useMemo(() => {
    const freq: Record<string, number> = {};
    for (const img of allImages) {
      for (const tag of img.tags) {
        freq[tag] = (freq[tag] || 0) + 1;
      }
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50);
  }, [allImages]);

  // Filter images
  const filteredImages = useMemo(() => {
    let result = allImages;

    // Filter by type
    if (selectedTypes.size > 0) {
      result = result.filter(img => selectedTypes.has(img.image_type));
    }

    // Filter by category
    if (selectedCategories.size > 0 && taxonomy) {
      const validIds = new Set<number>();
      for (const cat of selectedCategories) {
        for (const id of taxonomy.by_category[cat] || []) {
          validIds.add(id);
        }
      }
      result = result.filter(img => validIds.has(img.id));
    }

    // Filter by concept
    if (selectedConcepts.size > 0 && taxonomy) {
      const validIds = new Set<number>();
      for (const concept of selectedConcepts) {
        for (const id of taxonomy.by_framework_concept[concept] || []) {
          validIds.add(id);
        }
      }
      result = result.filter(img => validIds.has(img.id));
    }

    // Filter by tags
    if (selectedTags.size > 0) {
      result = result.filter(img =>
        Array.from(selectedTags).every(tag => img.tags.includes(tag))
      );
    }

    // Sort
    switch (sortBy) {
      case "alphabetical":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "type":
        result = [...result].sort((a, b) => a.image_type.localeCompare(b.image_type));
        break;
      case "category":
        result = [...result].sort((a, b) =>
          (a.categories[0] || "").localeCompare(b.categories[0] || "")
        );
        break;
    }

    return result;
  }, [allImages, selectedTypes, selectedCategories, selectedConcepts, selectedTags, sortBy, taxonomy]);

  // Filter tags by search
  const filteredTags = useMemo(() => {
    if (!tagSearch) return tagFrequencies;
    const search = tagSearch.toLowerCase();
    return tagFrequencies.filter(([tag]) => tag.toLowerCase().includes(search));
  }, [tagFrequencies, tagSearch]);

  // Toggle functions
  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleConcept = (concept: string) => {
    setSelectedConcepts(prev => {
      const next = new Set(prev);
      if (next.has(concept)) next.delete(concept);
      else next.add(concept);
      return next;
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSelectedTypes(new Set());
    setSelectedCategories(new Set());
    setSelectedConcepts(new Set());
    setSelectedTags(new Set());
  };

  const hasActiveFilters = selectedTypes.size > 0 || selectedCategories.size > 0 ||
    selectedConcepts.size > 0 || selectedTags.size > 0;

  // Watermark and download functions
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const addWatermark = async (imageUrl: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);

        const watermarkText = "demismatch.com";
        const padding = 10;
        const fontSize = Math.max(12, Math.min(24, img.width / 30));

        ctx.font = `${fontSize}px "Space Mono", monospace`;
        ctx.textBaseline = "bottom";
        ctx.textAlign = "right";

        const textWidth = ctx.measureText(watermarkText).width;
        const x = img.width - padding;
        const y = img.height - padding;

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(x - textWidth - 8, y - fontSize - 4, textWidth + 16, fontSize + 8);

        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillText(watermarkText, x, y);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Could not create blob"));
          },
          "image/png",
          0.95
        );
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = imageUrl;
    });
  };

  const copyToClipboard = async (imageUrl: string) => {
    try {
      showToast("Preparing image...");
      const watermarkedBlob = await addWatermark(imageUrl);
      await navigator.clipboard.write([
        new ClipboardItem({ [watermarkedBlob.type]: watermarkedBlob }),
      ]);
      showToast("Image copied to clipboard!");
    } catch (err) {
      console.error("Copy error:", err);
      try {
        await navigator.clipboard.writeText(imageUrl);
        showToast("Image URL copied!");
      } catch {
        showToast("Failed to copy image");
      }
    }
  };

  const downloadImage = async (image: ImageData) => {
    try {
      showToast("Preparing download...");
      const watermarkedBlob = await addWatermark(image.image_url);
      const url = URL.createObjectURL(watermarkedBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${image.title.replace(/[^a-z0-9]/gi, "_")}_demismatch.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Image downloaded!");
    } catch (err) {
      console.error("Download error:", err);
      showToast("Failed to download image");
    }
  };

  // Load more for infinite scroll
  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 30, filteredImages.length));
  };

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(30);
  }, [selectedTypes, selectedCategories, selectedConcepts, selectedTags]);

  const displayedImages = filteredImages.slice(0, displayCount);

  // Sidebar content (shared between desktop and mobile)
  const FilterContent = () => (
    <div className="space-y-4">
      {/* Image Types */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <button
          className="w-full flex items-center justify-between py-2 text-sm font-bold tracking-wide"
          onClick={() => toggleSection("types")}
        >
          <span>Image Type</span>
          <span>{expandedSections.has("types") ? "−" : "+"}</span>
        </button>
        {expandedSections.has("types") && (
          <div className="space-y-2 mt-2">
            {IMAGE_TYPES.map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.has(type)}
                  onChange={() => toggleType(type)}
                  className="accent-[var(--accent-primary)]"
                />
                <span className="text-sm capitalize">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <button
          className="w-full flex items-center justify-between py-2 text-sm font-bold tracking-wide"
          onClick={() => toggleSection("categories")}
        >
          <span>Categories</span>
          <span>{expandedSections.has("categories") ? "−" : "+"}</span>
        </button>
        {expandedSections.has("categories") && taxonomy && (
          <div className="space-y-1 mt-2 max-h-60 overflow-y-auto">
            {Object.keys(taxonomy.by_category).sort().map(cat => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={selectedCategories.has(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="accent-[var(--accent-primary)]"
                />
                <span className="text-sm flex-1">{formatLabel(cat)}</span>
                <span className="text-xs text-[var(--text-muted)]">{categoryCounts[cat]}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Framework Concepts */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <button
          className="w-full flex items-center justify-between py-2 text-sm font-bold tracking-wide"
          onClick={() => toggleSection("concepts")}
        >
          <span>Framework Concepts</span>
          <span>{expandedSections.has("concepts") ? "−" : "+"}</span>
        </button>
        {expandedSections.has("concepts") && taxonomy && (
          <div className="space-y-1 mt-2 max-h-60 overflow-y-auto">
            {Object.keys(taxonomy.by_framework_concept).sort().map(concept => (
              <label key={concept} className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={selectedConcepts.has(concept)}
                  onChange={() => toggleConcept(concept)}
                  className="accent-[var(--accent-primary)]"
                />
                <span className="text-sm flex-1">{formatLabel(concept)}</span>
                <span className="text-xs text-[var(--text-muted)]">{conceptCounts[concept]}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="pb-4">
        <button
          className="w-full flex items-center justify-between py-2 text-sm font-bold tracking-wide"
          onClick={() => toggleSection("tags")}
        >
          <span>Tags</span>
          <span>{expandedSections.has("tags") ? "−" : "+"}</span>
        </button>
        {expandedSections.has("tags") && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Search tags..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-sm mb-2"
            />
            <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
              {filteredTags.map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    selectedTags.has(tag)
                      ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                      : "bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  {tag} ({count})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="spinner" />
          <p className="mt-4 text-[var(--text-secondary)]">Loading library...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--error)]">{error}</p>
          <Link href="/" className="btn-primary mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <HomeIcon />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold tracking-[0.15em]">
            <span className="text-[var(--accent-primary)]">IMAGE</span> LIBRARY
          </h1>
        </div>
        <button
          className="md:hidden btn-secondary py-2 px-3"
          onClick={() => setShowMobileFilters(true)}
        >
          <FilterIcon />
          <span className="ml-2">Filters</span>
        </button>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 border-r border-[var(--border-color)] p-4 overflow-y-auto">
          <FilterContent />
        </aside>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.8)]" onClick={() => setShowMobileFilters(false)}>
            <div
              className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-[var(--bg-primary)] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                <h2 className="font-bold">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)}>✕</button>
              </div>
              <div className="p-4">
                <FilterContent />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          {/* Active Filters Bar */}
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {Array.from(selectedTypes).map(type => (
                <span key={type} className="filter-pill">
                  {type}
                  <button onClick={() => toggleType(type)} className="ml-1">✕</button>
                </span>
              ))}
              {Array.from(selectedCategories).map(cat => (
                <span key={cat} className="filter-pill">
                  {formatLabel(cat)}
                  <button onClick={() => toggleCategory(cat)} className="ml-1">✕</button>
                </span>
              ))}
              {Array.from(selectedConcepts).map(concept => (
                <span key={concept} className="filter-pill">
                  {formatLabel(concept)}
                  <button onClick={() => toggleConcept(concept)} className="ml-1">✕</button>
                </span>
              ))}
              {Array.from(selectedTags).map(tag => (
                <span key={tag} className="filter-pill">
                  #{tag}
                  <button onClick={() => toggleTag(tag)} className="ml-1">✕</button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-xs text-[var(--error)] hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Header */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              Showing {displayedImages.length} of {filteredImages.length} images
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-sm"
            >
              <option value="alphabetical">Sort: A-Z</option>
              <option value="type">Sort: Type</option>
              <option value="category">Sort: Category</option>
            </select>
          </div>

          {/* Image Grid */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--text-muted)]">No images match your filters</p>
              <button onClick={clearAllFilters} className="btn-secondary mt-4">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {displayedImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative rounded-lg overflow-hidden cursor-pointer bg-[var(--bg-tertiary)]"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full aspect-square object-cover group-hover:opacity-80 transition-opacity"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-white text-xs line-clamp-2">{image.title}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${
                          image.image_type === "problem" ? "bg-red-500/80" :
                          image.image_type === "solution" ? "bg-green-500/80" :
                          image.image_type === "comparison" ? "bg-blue-500/80" :
                          "bg-gray-500/80"
                        }`}>
                          {image.image_type}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 bg-black/60 rounded hover:bg-black/80"
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(image.image_url); }}
                      >
                        <CopyIcon />
                      </button>
                      <button
                        className="p-1.5 bg-black/60 rounded hover:bg-black/80"
                        onClick={(e) => { e.stopPropagation(); downloadImage(image); }}
                      >
                        <DownloadIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              {displayCount < filteredImages.length && (
                <div className="text-center mt-6">
                  <button onClick={loadMore} className="btn-secondary">
                    Load More ({filteredImages.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="w-full"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{selectedImage.title}</h3>

              <span className={`text-xs px-2 py-1 rounded inline-block mb-3 ${
                selectedImage.image_type === "problem" ? "bg-red-500/20 text-red-400" :
                selectedImage.image_type === "solution" ? "bg-green-500/20 text-green-400" :
                selectedImage.image_type === "comparison" ? "bg-blue-500/20 text-blue-400" :
                "bg-gray-500/20 text-gray-400"
              }`}>
                {selectedImage.image_type}
              </span>

              {selectedImage.body_text && (
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {selectedImage.body_text}
                </p>
              )}

              {selectedImage.categories.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedImage.categories.map(cat => (
                      <span key={cat} className="text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded">
                        {formatLabel(cat)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedImage.framework_concepts.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Framework Concepts</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedImage.framework_concepts.map(concept => (
                      <span key={concept} className="text-xs bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] px-2 py-1 rounded">
                        {formatLabel(concept)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedImage.tags.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedImage.tags.slice(0, 10).map(tag => (
                      <span key={tag} className="text-xs text-[var(--text-muted)]">
                        #{tag}
                      </span>
                    ))}
                    {selectedImage.tags.length > 10 && (
                      <span className="text-xs text-[var(--text-muted)]">
                        +{selectedImage.tags.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  className="btn-primary flex-1"
                  onClick={() => copyToClipboard(selectedImage.image_url)}
                >
                  <CopyIcon />
                  Copy
                </button>
                <button
                  className="btn-secondary flex-1"
                  onClick={() => downloadImage(selectedImage)}
                >
                  <DownloadIcon />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

// Icons
function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
