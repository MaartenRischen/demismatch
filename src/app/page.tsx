"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { searchImagesWithLLM, ImageResult, SearchResponse } from "@/lib/supabase";
import {
  getHistory,
  saveToHistory,
  deleteHistoryEntry,
  clearHistory,
  formatTimestamp,
  HistoryEntry
} from "@/lib/history";

type InputMode = "screenshot" | "url" | "text" | "describe";

export default function Home() {
  const [mode, setMode] = useState<InputMode>("describe");
  const [inputText, setInputText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [whatsHappening, setWhatsHappening] = useState("");
  const [whatsMissing, setWhatsMissing] = useState("");
  const [goDeeper, setGoDeeper] = useState("");
  const [problemImages, setProblemImages] = useState<ImageResult[]>([]);
  const [solutionImages, setSolutionImages] = useState<ImageResult[]>([]);
  const [showGoDeeper, setShowGoDeeper] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [toast, setToast] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasResults = problemImages.length > 0 || solutionImages.length > 0;

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const clearResults = () => {
    setWhatsHappening("");
    setWhatsMissing("");
    setGoDeeper("");
    setProblemImages([]);
    setSolutionImages([]);
    setShowGoDeeper(false);
  };

  const applyResponse = (response: SearchResponse) => {
    setWhatsHappening(response.whats_happening);
    setWhatsMissing(response.whats_missing);
    setGoDeeper(response.go_deeper);
    setProblemImages(response.problem_images);
    setSolutionImages(response.solution_images);
  };

  const handleSearch = async (text: string) => {
    if (!text.trim()) {
      setError("Please provide some content to search");
      return;
    }

    setIsLoading(true);
    setError("");
    clearResults();
    setCurrentQuery(text);

    try {
      setLoadingMessage("Analyzing with mismatch framework...");
      const response = await searchImagesWithLLM(text);

      const totalImages = response.problem_images.length + response.solution_images.length;
      if (totalImages === 0) {
        setError("No matching images found. Try a different description.");
      } else {
        applyResponse(response);

        // Save to history
        const entry = saveToHistory({
          query: text,
          whats_happening: response.whats_happening,
          whats_missing: response.whats_missing,
          go_deeper: response.go_deeper,
          problem_images: response.problem_images,
          solution_images: response.solution_images
        });
        setHistory(prev => [entry, ...prev.slice(0, 49)]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleScreenshot = useCallback(async (file: File) => {
    setIsLoading(true);
    setError("");
    clearResults();
    setLoadingMessage("Initializing OCR...");
    setOcrProgress(0);

    try {
      const Tesseract = await import("tesseract.js");

      setLoadingMessage("Extracting text from image...");

      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      const extractedText = result.data.text.trim();

      if (!extractedText) {
        setError("No text found in the image. Try another screenshot or use a different input method.");
        setIsLoading(false);
        return;
      }

      setInputText(extractedText);
      setCurrentQuery(extractedText);

      setLoadingMessage("Analyzing with mismatch framework...");
      const response = await searchImagesWithLLM(extractedText);

      const totalImages = response.problem_images.length + response.solution_images.length;
      if (totalImages === 0) {
        setError("No matching images found. Try a different screenshot.");
      } else {
        applyResponse(response);

        // Save to history
        const entry = saveToHistory({
          query: extractedText,
          whats_happening: response.whats_happening,
          whats_missing: response.whats_missing,
          go_deeper: response.go_deeper,
          problem_images: response.problem_images,
          solution_images: response.solution_images
        });
        setHistory(prev => [entry, ...prev.slice(0, 49)]);
      }
      setIsLoading(false);
      setLoadingMessage("");
    } catch (err) {
      console.error("OCR error:", err);
      setError("Failed to extract text from image. Please try again.");
      setIsLoading(false);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleScreenshot(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleScreenshot(file);
    }
  };

  const handleUrlScrape = async () => {
    if (!urlInput.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError("");
    clearResults();
    setLoadingMessage("Fetching page content...");

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to scrape URL");
      }

      const data = await response.json();
      setInputText(data.text);
      await handleSearch(data.text);
    } catch (err) {
      console.error("Scrape error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch URL content");
      setIsLoading(false);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setWhatsHappening(entry.whats_happening);
    setWhatsMissing(entry.whats_missing);
    setGoDeeper(entry.go_deeper);
    setProblemImages(entry.problem_images);
    setSolutionImages(entry.solution_images);
    setCurrentQuery(entry.query);
    setInputText(entry.query);
    setShowHistory(false);
    setShowGoDeeper(false);
    setError("");
  };

  const handleDeleteHistoryEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryEntry(id);
    setHistory(prev => prev.filter(entry => entry.id !== id));
    showToast("Search deleted from history");
  };

  const handleClearHistory = () => {
    if (confirm("Clear all search history?")) {
      clearHistory();
      setHistory([]);
      showToast("History cleared");
    }
  };

  // Add watermark to image using Canvas
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

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Configure watermark
        const watermarkText = "demismatch.com";
        const padding = 10;
        const fontSize = Math.max(12, Math.min(24, img.width / 30));

        ctx.font = `${fontSize}px "Space Mono", monospace`;
        ctx.textBaseline = "bottom";
        ctx.textAlign = "right";

        const textWidth = ctx.measureText(watermarkText).width;
        const x = img.width - padding;
        const y = img.height - padding;

        // Draw semi-transparent background
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(
          x - textWidth - 8,
          y - fontSize - 4,
          textWidth + 16,
          fontSize + 8
        );

        // Draw watermark text
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
        showToast("Image URL copied to clipboard!");
      } catch {
        showToast("Failed to copy image");
      }
    }
  };

  const downloadImage = async (image: ImageResult) => {
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

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 text-center border-b border-[var(--border-color)]">
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.2em] mb-2">
          <span className="text-[var(--accent-primary)]">SQUARE</span> TRUTHS
        </h1>
        <p className="text-[var(--text-secondary)] text-sm tracking-wide">
          Find the perfect mismatch image
        </p>

        {/* Library Link */}
        <Link
          href="/library"
          className="absolute top-6 left-6 btn-secondary py-2 px-3"
        >
          <LibraryIcon />
          <span className="ml-2 hidden sm:inline">Library</span>
        </Link>

        {/* History Toggle */}
        <button
          className="absolute top-6 right-6 btn-secondary py-2 px-3"
          onClick={() => setShowHistory(!showHistory)}
        >
          <HistoryIcon />
          <span className="ml-2 hidden sm:inline">History</span>
          {history.length > 0 && (
            <span className="ml-1 text-xs bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-full px-1.5">
              {history.length}
            </span>
          )}
        </button>
      </header>

      {/* History Panel */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.8)]" onClick={() => setShowHistory(false)}>
          <div 
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[var(--bg-primary)] border-l border-[var(--border-color)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* History Header */}
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-wide">Search History</h2>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <button 
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--error)]"
                    onClick={handleClearHistory}
                  >
                    Clear All
                  </button>
                )}
                <button 
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  onClick={() => setShowHistory(false)}
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* History List */}
            <div className="flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)]">
                  <HistoryIcon />
                  <p className="mt-2">No search history yet</p>
                  <p className="text-sm mt-1">Your searches will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-color)]">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors group"
                      onClick={() => loadHistoryEntry(entry)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--text-primary)] line-clamp-2 mb-1">
                            {entry.query}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {formatTimestamp(entry.timestamp)} · {entry.problem_images.length + entry.solution_images.length} images
                          </p>
                        </div>
                        <button
                          className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--error)] transition-opacity p-1"
                          onClick={(e) => handleDeleteHistoryEntry(entry.id, e)}
                        >
                          <TrashIcon />
                        </button>
                      </div>

                      {/* Preview thumbnails */}
                      <div className="flex gap-1 mt-2">
                        {[...entry.problem_images, ...entry.solution_images].slice(0, 4).map((result, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded overflow-hidden bg-[var(--bg-tertiary)]"
                          >
                            <img
                              src={result.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ))}
                        {entry.problem_images.length + entry.solution_images.length > 4 && (
                          <div className="w-10 h-10 rounded bg-[var(--bg-tertiary)] flex items-center justify-center text-xs text-[var(--text-muted)]">
                            +{entry.problem_images.length + entry.solution_images.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* Input Tabs */}
        <div className="flex border-b border-[var(--border-color)] mb-6 overflow-x-auto">
          {[
            { id: "describe", label: "Describe" },
            { id: "text", label: "Paste Text" },
            { id: "url", label: "URL" },
            { id: "screenshot", label: "Screenshot" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${mode === tab.id ? "active" : ""}`}
              onClick={() => {
                setMode(tab.id as InputMode);
                setError("");
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input Areas */}
        <div className="mb-6 max-w-2xl mx-auto">
          {mode === "describe" && (
            <div className="fade-in">
              <label className="block text-sm text-[var(--text-secondary)] mb-2 tracking-wide">
                Describe the situation or content
              </label>
              <textarea
                className="input-field min-h-[120px] resize-none"
                placeholder="e.g., Someone bragging about working 80 hours a week..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                className="btn-primary w-full mt-4"
                onClick={() => handleSearch(inputText)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    {loadingMessage}
                  </>
                ) : (
                  <>
                    <SearchIcon />
                    Find Mismatch
                  </>
                )}
              </button>
            </div>
          )}

          {mode === "text" && (
            <div className="fade-in">
              <label className="block text-sm text-[var(--text-secondary)] mb-2 tracking-wide">
                Paste the content you want to respond to
              </label>
              <textarea
                className="input-field min-h-[200px] resize-none"
                placeholder="Paste article text, social media post, or any content..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                className="btn-primary w-full mt-4"
                onClick={() => handleSearch(inputText)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    {loadingMessage}
                  </>
                ) : (
                  <>
                    <SearchIcon />
                    Find Mismatch
                  </>
                )}
              </button>
            </div>
          )}

          {mode === "url" && (
            <div className="fade-in">
              <label className="block text-sm text-[var(--text-secondary)] mb-2 tracking-wide">
                Enter the URL of an article or page
              </label>
              <input
                type="url"
                className="input-field"
                placeholder="https://example.com/article..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <button
                className="btn-primary w-full mt-4"
                onClick={handleUrlScrape}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    {loadingMessage}
                  </>
                ) : (
                  <>
                    <LinkIcon />
                    Fetch & Search
                  </>
                )}
              </button>
            </div>
          )}

          {mode === "screenshot" && (
            <div className="fade-in">
              <label className="block text-sm text-[var(--text-secondary)] mb-2 tracking-wide">
                Upload a screenshot to extract text
              </label>
              <div
                className={`upload-zone ${isDragging ? "dragging" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    <p className="text-sm text-[var(--text-secondary)]">
                      {loadingMessage} {ocrProgress > 0 && `(${ocrProgress}%)`}
                    </p>
                  </>
                ) : (
                  <>
                    <UploadIcon />
                    <p className="text-sm text-[var(--text-secondary)]">
                      Drop image here or tap to upload
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 bg-[rgba(255,23,68,0.1)] border border-[var(--error)] rounded text-[var(--error)] text-sm fade-in max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Current Query Display */}
        {currentQuery && hasResults && (
          <div className="mb-4 p-3 bg-[var(--bg-tertiary)] rounded border border-[var(--border-color)]">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Query</p>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{currentQuery}</p>
          </div>
        )}

        {/* WHAT'S HAPPENING Section */}
        {whatsHappening && (
          <div className="mb-6 fade-in">
            <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg">
              <h2 className="text-xs font-bold tracking-[0.2em] text-[var(--accent-primary)] uppercase mb-3">
                What&apos;s Happening
              </h2>
              <p className="text-[var(--text-primary)] text-lg leading-relaxed">
                {whatsHappening}
              </p>
            </div>
          </div>
        )}

        {/* Problem Images */}
        {problemImages.length > 0 && (
          <div className="mb-8 fade-in">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-3">
              The Dynamic at Play
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {problemImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative rounded-lg overflow-hidden cursor-pointer bg-[var(--bg-tertiary)] fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
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
                      <p className="text-white text-xs line-clamp-2">{image.reason}</p>
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
          </div>
        )}

        {/* WHAT'S MISSING Section */}
        {whatsMissing && (
          <div className="mb-6 fade-in">
            <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--accent-secondary)] border-opacity-30 rounded-lg">
              <h2 className="text-xs font-bold tracking-[0.2em] text-[var(--accent-secondary)] uppercase mb-3">
                What&apos;s Missing
              </h2>
              <p className="text-[var(--text-primary)] text-lg leading-relaxed">
                {whatsMissing}
              </p>
            </div>
          </div>
        )}

        {/* Solution Images */}
        {solutionImages.length > 0 && (
          <div className="mb-8 fade-in">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-3">
              What Actually Helps
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {solutionImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative rounded-lg overflow-hidden cursor-pointer bg-[var(--bg-tertiary)] fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
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
                      <p className="text-white text-xs line-clamp-2">{image.reason}</p>
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
          </div>
        )}

        {/* GO DEEPER Section (Collapsible) */}
        {goDeeper && (
          <div className="mb-8 fade-in">
            <button
              className="w-full p-4 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-left flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors"
              onClick={() => setShowGoDeeper(!showGoDeeper)}
            >
              <span className="text-sm font-bold tracking-[0.15em] text-[var(--text-secondary)] uppercase">
                Go Deeper
              </span>
              <span className="text-[var(--text-muted)]">
                {showGoDeeper ? "−" : "+"}
              </span>
            </button>
            {showGoDeeper && (
              <div className="mt-2 p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg fade-in">
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {goDeeper}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="modal-content max-w-lg w-full"
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
              {selectedImage.reason && (
                <p className="text-sm text-[var(--accent-secondary)] mb-2">
                  <strong>Why this matches:</strong> {selectedImage.reason}
                </p>
              )}
              {selectedImage.body_text && (
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {selectedImage.body_text}
                </p>
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
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
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

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
