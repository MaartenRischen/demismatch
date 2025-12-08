"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { searchImagesWithLLM, ImageResult, SearchResponse } from "@/lib/supabase";
import {
  getHistory,
  saveToHistory,
  deleteHistoryEntry,
  clearHistory,
  formatTimestamp,
  HistoryEntry
} from "@/lib/history";

type InputMode = "screenshot" | "url" | "youtube" | "text" | "describe";

export default function Home() {
  const [mode, setMode] = useState<InputMode>("describe");
  const [inputText, setInputText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [whatsHappening, setWhatsHappening] = useState("");
  const [thePlayers, setThePlayers] = useState("");
  const [whatsMissing, setWhatsMissing] = useState("");
  const [whatActuallyHelps, setWhatActuallyHelps] = useState("");
  const [exampleComment, setExampleComment] = useState("");
  const [commentLength, setCommentLength] = useState(2);
  const [commentTone, setCommentTone] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [problemImages, setProblemImages] = useState<ImageResult[]>([]);
  const [solutionImages, setSolutionImages] = useState<ImageResult[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);
  const [showThePlayers, setShowThePlayers] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [toast, setToast] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [sourcePreview, setSourcePreview] = useState<{ type: "screenshot" | "url" | "youtube"; image: string; url?: string; title?: string; channel?: string } | null>(null);
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
    setThePlayers("");
    setWhatsMissing("");
    setWhatActuallyHelps("");
    setExampleComment("");
    setCommentLength(2);
    setCommentTone(0);
    setProblemImages([]);
    setSolutionImages([]);
    setShowThePlayers(false);
    setSourcePreview(null);
    setFollowUpQuestion("");
  };

  const regenerateComment = async () => {
    if (!currentQuery || !whatsHappening) return;

    setIsRegenerating(true);
    try {
      const response = await fetch('/api/regenerate-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalContent: currentQuery,
          analysis: whatsHappening,
          length: commentLength,
          tone: commentTone
        })
      });

      if (!response.ok) throw new Error('Failed to regenerate');

      const data = await response.json();
      setExampleComment(data.comment);
      showToast("Comment regenerated!");
    } catch (err) {
      console.error("Regenerate error:", err);
      showToast("Failed to regenerate comment");
    } finally {
      setIsRegenerating(false);
    }
  };

  const getToneLabel = (tone: number): string => {
    if (tone <= 20) return "Respectful";
    if (tone <= 40) return "Witty";
    if (tone <= 60) return "Sharp";
    if (tone <= 80) return "Sassy";
    return "Extremely Sassy";
  };

  const applyResponse = (response: SearchResponse) => {
    setWhatsHappening(response.whats_happening);
    setThePlayers(response.the_players);
    setWhatsMissing(response.whats_missing);
    setWhatActuallyHelps(response.what_actually_helps);
    setExampleComment(response.example_comment);
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
          the_players: response.the_players,
          whats_missing: response.whats_missing,
          what_actually_helps: response.what_actually_helps,
          example_comment: response.example_comment,
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
    setLoadingMessage("Analyzing screenshot...");
    setOcrProgress(0);

    // Create preview and get base64 from uploaded file
    const reader = new FileReader();

    reader.onload = async (e) => {
      if (!e.target?.result) {
        setError("Failed to read image file.");
        setIsLoading(false);
        return;
      }

      const imageBase64 = e.target.result as string;
      setSourcePreview({ type: "screenshot", image: imageBase64 });

      try {
        // Use vision AI to analyze both text AND visual content
        setLoadingMessage("Analyzing visual content...");
        setOcrProgress(30);

        const visionResponse = await fetch('/api/analyze-screenshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64 })
        });

        if (!visionResponse.ok) {
          throw new Error('Vision analysis failed');
        }

        const visionData = await visionResponse.json();
        const screenshotAnalysis = visionData.analysis;

        if (!screenshotAnalysis) {
          setError("Could not analyze the screenshot. Try another image or use a different input method.");
          setIsLoading(false);
          return;
        }

        setOcrProgress(60);

        // Format the analysis for the mismatch framework
        const analysisInput = `SCREENSHOT ANALYSIS:

${screenshotAnalysis}

Analyze both the textual and visual elements through the mismatch lens. Consider the platform, UI patterns, engagement metrics, and visual content - not just the text.`;

        setInputText(screenshotAnalysis.substring(0, 500) + "...");
        setCurrentQuery(analysisInput);

        setLoadingMessage("Analyzing with mismatch framework...");
        setOcrProgress(80);

        const response = await searchImagesWithLLM(analysisInput);

        const totalImages = response.problem_images.length + response.solution_images.length;
        if (totalImages === 0) {
          setError("No matching images found. Try a different screenshot.");
        } else {
          applyResponse(response);

          // Save to history (store the full analysis as query)
          const entry = saveToHistory({
            query: analysisInput,
            whats_happening: response.whats_happening,
            the_players: response.the_players,
            whats_missing: response.whats_missing,
            what_actually_helps: response.what_actually_helps,
            example_comment: response.example_comment,
            problem_images: response.problem_images,
            solution_images: response.solution_images
          });
          setHistory(prev => [entry, ...prev.slice(0, 49)]);
        }
        setOcrProgress(100);
        setIsLoading(false);
        setLoadingMessage("");
      } catch (err) {
        console.error("Screenshot analysis error:", err);
        setError("Failed to analyze screenshot. Please try again.");
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read image file.");
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
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

      // Set preview with og:image if available
      if (data.ogImage) {
        setSourcePreview({ type: "url", image: data.ogImage, url: urlInput });
      }

      setInputText(data.text);
      await handleSearch(data.text);
    } catch (err) {
      console.error("Scrape error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch URL content");
      setIsLoading(false);
    }
  };

  const handleYouTubeAnalyze = async () => {
    if (!youtubeUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    setIsLoading(true);
    setError("");
    clearResults();
    setLoadingMessage("Fetching YouTube video...");

    try {
      const response = await fetch("/api/youtube-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch YouTube video");
      }

      const data = await response.json();

      // Set preview with thumbnail
      setSourcePreview({
        type: "youtube",
        image: data.thumbnailUrl,
        url: `https://www.youtube.com/watch?v=${data.videoId}`,
        title: data.title,
        channel: data.channel
      });

      setLoadingMessage(data.hasTranscript ? "Analyzing transcript..." : "Analyzing video metadata...");
      setInputText(data.content.substring(0, 500) + "...");
      setCurrentQuery(data.content);

      // Now analyze with the mismatch framework
      setLoadingMessage("Analyzing with mismatch framework...");
      const searchResponse = await searchImagesWithLLM(data.content);

      const totalImages = searchResponse.problem_images.length + searchResponse.solution_images.length;
      if (totalImages === 0) {
        setError("No matching images found. Try a different video.");
      } else {
        applyResponse(searchResponse);

        // Save to history
        const entry = saveToHistory({
          query: data.content,
          whats_happening: searchResponse.whats_happening,
          the_players: searchResponse.the_players,
          whats_missing: searchResponse.whats_missing,
          what_actually_helps: searchResponse.what_actually_helps,
          example_comment: searchResponse.example_comment,
          problem_images: searchResponse.problem_images,
          solution_images: searchResponse.solution_images
        });
        setHistory(prev => [entry, ...prev.slice(0, 49)]);
      }
    } catch (err) {
      console.error("YouTube analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze YouTube video");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setWhatsHappening(entry.whats_happening);
    setThePlayers(entry.the_players || "");
    setWhatsMissing(entry.whats_missing);
    setWhatActuallyHelps(entry.what_actually_helps || "");
    setExampleComment(entry.example_comment || "");
    setProblemImages(entry.problem_images);
    setSolutionImages(entry.solution_images);
    setCurrentQuery(entry.query);
    setInputText(entry.query);
    setShowHistory(false);
    setShowThePlayers(false);
    setFollowUpQuestion("");
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
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />

      {/* Header with padding for fixed nav */}
      <header className="pt-24 pb-4 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Mismatch Analyzer</h1>
        <p className="text-[#a3a3a3] text-sm tracking-wide">
          See any content through the mismatch lens
        </p>
        {/* History Button */}
        <button
          className="mt-4 py-2 px-4 flex items-center gap-2 text-sm text-[#a3a3a3] hover:text-[#ff3d00] border border-[#333] hover:border-[#ff3d00] transition-colors mx-auto"
          onClick={() => setShowHistory(!showHistory)}
        >
          <HistoryIcon />
          History
          {history.length > 0 && (
            <span className="text-xs bg-[#ff3d00] text-white rounded-full px-1.5">
              {history.length}
            </span>
          )}
        </button>
      </header>

      {/* History Panel */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/70" onClick={() => setShowHistory(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-[#333] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* History Header */}
            <div className="p-4 border-b border-[#333] flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-wide text-white">Search History</h2>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <button
                    className="text-xs text-[#666] hover:text-red-500"
                    onClick={handleClearHistory}
                  >
                    Clear All
                  </button>
                )}
                <button
                  className="text-[#666] hover:text-white"
                  onClick={() => setShowHistory(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <div className="p-8 text-center text-[#666]">
                  <HistoryIcon />
                  <p className="mt-2">No search history yet</p>
                  <p className="text-sm mt-1">Your searches will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1a1a1a]">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 hover:bg-[#1a1a1a] cursor-pointer transition-colors group"
                      onClick={() => loadHistoryEntry(entry)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white line-clamp-2 mb-1">
                            {entry.query}
                          </p>
                          <p className="text-xs text-[#666]">
                            {formatTimestamp(entry.timestamp)} · {entry.problem_images.length + entry.solution_images.length} images
                          </p>
                        </div>
                        <button
                          className="opacity-0 group-hover:opacity-100 text-[#666] hover:text-red-500 transition-opacity p-1"
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
                            className="w-10 h-10 rounded overflow-hidden bg-[#1a1a1a]"
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
                          <div className="w-10 h-10 rounded bg-[#1a1a1a] flex items-center justify-center text-xs text-[#666]">
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
        <div className="flex border-b border-[#333] mb-6 overflow-x-auto">
          {[
            { id: "describe", label: "Describe" },
            { id: "text", label: "Paste Text" },
            { id: "url", label: "URL" },
            { id: "youtube", label: "YouTube" },
            { id: "screenshot", label: "Screenshot" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                mode === tab.id
                  ? "text-[#ff3d00]"
                  : "text-[#666] hover:text-white"
              }`}
              onClick={() => {
                setMode(tab.id as InputMode);
                setError("");
              }}
            >
              {tab.label}
              {mode === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff3d00]" />
              )}
            </button>
          ))}
        </div>

        {/* Input Areas */}
        <div className="mb-6 max-w-2xl mx-auto">
          {mode === "describe" && (
            <div className="animate-fadeIn">
              <label className="block text-sm text-[#a3a3a3] mb-2 tracking-wide">
                Describe the situation or content
              </label>
              <textarea
                className="w-full p-4 min-h-[120px] resize-none bg-[#1a1a1a] border border-[#333] text-white placeholder:text-[#666] focus:border-[#ff3d00] focus:outline-none focus:ring-2 focus:ring-[#ff3d00]/20"
                placeholder="e.g., Someone bragging about working 80 hours a week..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                className="w-full mt-4 px-6 py-3 bg-[#ff3d00] text-white font-medium hover:bg-[#e63600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={() => handleSearch(inputText)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
            <div className="animate-fadeIn">
              <label className="block text-sm text-[#a3a3a3] mb-2 tracking-wide">
                Paste the content you want to respond to
              </label>
              <textarea
                className="w-full p-4 min-h-[200px] resize-none bg-[#1a1a1a] border border-[#333] text-white placeholder:text-[#666] focus:border-[#ff3d00] focus:outline-none focus:ring-2 focus:ring-[#ff3d00]/20"
                placeholder="Paste article text, social media post, or any content..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                className="w-full mt-4 px-6 py-3 bg-[#ff3d00] text-white font-medium hover:bg-[#e63600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={() => handleSearch(inputText)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
            <div className="animate-fadeIn">
              <label className="block text-sm text-[#a3a3a3] mb-2 tracking-wide">
                Enter the URL of an article or page
              </label>
              <input
                type="url"
                className="w-full p-4 bg-[#1a1a1a] border border-[#333] text-white placeholder:text-[#666] focus:border-[#ff3d00] focus:outline-none focus:ring-2 focus:ring-[#ff3d00]/20"
                placeholder="https://example.com/article..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <button
                className="w-full mt-4 px-6 py-3 bg-[#ff3d00] text-white font-medium hover:bg-[#e63600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleUrlScrape}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

          {mode === "youtube" && (
            <div className="animate-fadeIn">
              <label className="block text-sm text-[#a3a3a3] mb-2 tracking-wide">
                Enter a YouTube video URL
              </label>
              <input
                type="url"
                className="w-full p-4 bg-[#1a1a1a] border border-[#333] text-white placeholder:text-[#666] focus:border-[#ff3d00] focus:outline-none focus:ring-2 focus:ring-[#ff3d00]/20"
                placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <p className="text-xs text-[#666] mt-2">
                Works with youtube.com, youtu.be, and YouTube Shorts links
              </p>
              <button
                className="w-full mt-4 px-6 py-3 bg-[#ff3d00] text-white font-medium hover:bg-[#e63600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleYouTubeAnalyze}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {loadingMessage}
                  </>
                ) : (
                  <>
                    <YouTubeIcon />
                    Analyze Video
                  </>
                )}
              </button>
            </div>
          )}

          {mode === "screenshot" && (
            <div className="animate-fadeIn">
              <label className="block text-sm text-[#a3a3a3] mb-2 tracking-wide">
                Upload a screenshot to analyze
              </label>
              <div
                className={`flex flex-col items-center justify-center gap-4 min-h-[200px] p-8 border-2 border-dashed cursor-pointer transition-colors ${
                  isDragging
                    ? "border-[#ff3d00] bg-[#ff3d00]/5"
                    : "border-[#333] hover:border-[#ff3d00] hover:bg-[#1a1a1a]"
                }`}
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
                    <span className="w-8 h-8 border-2 border-[#ff3d00]/30 border-t-[#ff3d00] rounded-full animate-spin" />
                    <p className="text-sm text-[#a3a3a3]">
                      {loadingMessage} {ocrProgress > 0 && `(${ocrProgress}%)`}
                    </p>
                  </>
                ) : (
                  <>
                    <UploadIcon />
                    <p className="text-sm text-[#a3a3a3]">
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
          <div className="p-4 mb-6 bg-red-900/20 border border-red-800 text-red-400 text-sm animate-fadeIn max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Source Preview (Screenshot, URL og:image, or YouTube) */}
        {sourcePreview && hasResults && (
          <div className="mb-6 animate-fadeIn">
            <div className="p-4 bg-[#1a1a1a] border border-[#333]">
              <p className="text-xs text-[#666] uppercase tracking-wide mb-3">
                {sourcePreview.type === "screenshot" ? "Analyzed Screenshot" : sourcePreview.type === "youtube" ? "YouTube Video" : "Source"}
              </p>
              <div className="flex gap-4 items-start">
                <div className={`${sourcePreview.type === "youtube" ? "w-40 h-24" : "w-32 h-32"} flex-shrink-0 overflow-hidden bg-[#0a0a0a]`}>
                  <img
                    src={sourcePreview.image}
                    alt="Source preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {sourcePreview.type === "youtube" && sourcePreview.title && (
                    <p className="text-sm font-medium text-white mb-1 line-clamp-2">
                      {sourcePreview.title}
                    </p>
                  )}
                  {sourcePreview.type === "youtube" && sourcePreview.channel && (
                    <p className="text-xs text-[#666] mb-2">
                      {sourcePreview.channel}
                    </p>
                  )}
                  {sourcePreview.url && (
                    <a
                      href={sourcePreview.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#ff3d00] hover:underline break-all"
                    >
                      {sourcePreview.type === "youtube" ? "Watch on YouTube" : sourcePreview.url}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Query Display */}
        {currentQuery && hasResults && !sourcePreview && (
          <div className="mb-4 p-3 bg-[#1a1a1a] border border-[#333]">
            <p className="text-xs text-[#666] uppercase tracking-wide mb-1">Query</p>
            <p className="text-sm text-[#a3a3a3] line-clamp-2">{currentQuery}</p>
          </div>
        )}

        {/* WHAT'S HAPPENING Section */}
        {whatsHappening && (
          <div className="mb-6 animate-fadeIn">
            <div className="p-5 bg-[#1a1a1a] border border-[#333]">
              <h2 className="text-xs font-bold tracking-[0.2em] text-[#ff3d00] uppercase mb-3">
                What&apos;s Happening
              </h2>
              <p className="text-white text-lg leading-relaxed">
                {whatsHappening}
              </p>
            </div>
          </div>
        )}

        {/* Problem Images */}
        {problemImages.length > 0 && (
          <div className="mb-8 animate-fadeIn">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#666] uppercase mb-3">
              The Dynamic at Play
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {problemImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden cursor-pointer bg-[#1a1a1a] animate-fadeIn"
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
                      className="p-1.5 bg-black/60 hover:bg-black/80"
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(image.image_url); }}
                    >
                      <CopyIcon />
                    </button>
                    <button
                      className="p-1.5 bg-black/60 hover:bg-black/80"
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
          <div className="mb-6 animate-fadeIn">
            <div className="p-5 bg-[#1a1a1a] border border-[#ff3d00]/30">
              <h2 className="text-xs font-bold tracking-[0.2em] text-[#ff3d00] uppercase mb-3">
                What&apos;s Missing
              </h2>
              <p className="text-[#a3a3a3] text-lg leading-relaxed">
                {whatsMissing}
              </p>
            </div>
          </div>
        )}

        {/* Solution Images */}
        {solutionImages.length > 0 && (
          <div className="mb-8 animate-fadeIn">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#666] uppercase mb-3">
              What Actually Helps
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {solutionImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden cursor-pointer bg-[#1a1a1a] animate-fadeIn"
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
                      className="p-1.5 bg-black/60 hover:bg-black/80"
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(image.image_url); }}
                    >
                      <CopyIcon />
                    </button>
                    <button
                      className="p-1.5 bg-black/60 hover:bg-black/80"
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

        {/* THE PLAYERS Section (Collapsible) */}
        {thePlayers && (
          <div className="mb-8 animate-fadeIn">
            <button
              className="w-full p-4 bg-[#1a1a1a] border border-[#333] text-left flex items-center justify-between hover:bg-[#252525] transition-colors"
              onClick={() => setShowThePlayers(!showThePlayers)}
            >
              <span className="text-sm font-bold tracking-[0.15em] text-[#a3a3a3] uppercase">
                The Players
              </span>
              <span className="text-[#666]">
                {showThePlayers ? "−" : "+"}
              </span>
            </button>
            {showThePlayers && (
              <div className="mt-2 p-5 bg-[#1a1a1a] border border-[#333] animate-fadeIn">
                <div
                  className="text-[#a3a3a3] text-sm leading-relaxed prose prose-sm max-w-none prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: thePlayers
                      .replace(/\*\*\[([^\]]+)\]:\*\*/g, '<strong class="text-[#ff3d00] block mt-3 first:mt-0">$1:</strong>')
                      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* WHAT ACTUALLY HELPS Section */}
        {whatActuallyHelps && (
          <div className="mb-6 animate-fadeIn">
            <div className="p-5 bg-[#0f2f0f] border border-[#1a4a1a]">
              <h2 className="text-xs font-bold tracking-[0.2em] text-[#4ade80] uppercase mb-3">
                What Actually Helps
              </h2>
              <p className="text-[#a3a3a3] text-lg leading-relaxed">
                {whatActuallyHelps}
              </p>
            </div>
          </div>
        )}

        {/* EXAMPLE COMMENT Section */}
        {exampleComment && (
          <div className="mb-8 animate-fadeIn">
            <div className="p-5 bg-[#1a1a1a] border border-[#333]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold tracking-[0.2em] text-[#ff3d00] uppercase">
                  Share This Take
                </h2>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff3d00] text-white text-xs font-medium hover:bg-[#e63600] transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(exampleComment);
                    showToast("Comment copied to clipboard!");
                  }}
                >
                  <CopyIcon />
                  Copy
                </button>
              </div>

              {/* Comment Display */}
              <div className="relative">
                {isRegenerating && (
                  <div className="absolute inset-0 bg-[#1a1a1a]/80 flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-[#ff3d00]/30 border-t-[#ff3d00] rounded-full animate-spin" />
                  </div>
                )}
                <p className="text-white text-base leading-relaxed italic">
                  &ldquo;{exampleComment}&rdquo;
                </p>
              </div>

              {/* Sliders and Regenerate */}
              <div className="mt-4 pt-4 border-t border-[#333]">
                {/* Length Slider */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-[#666] uppercase tracking-wide">
                      Length
                    </label>
                    <span className="text-xs text-white font-medium">
                      {commentLength} sentence{commentLength > 1 ? 's' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={commentLength}
                    onChange={(e) => setCommentLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#0a0a0a] appearance-none cursor-pointer accent-[#ff3d00]"
                    style={{
                      background: `linear-gradient(to right, #ff3d00 0%, #ff3d00 ${((commentLength - 1) / 29) * 100}%, #0a0a0a ${((commentLength - 1) / 29) * 100}%, #0a0a0a 100%)`
                    }}
                  />
                </div>

                {/* Tone Slider */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-[#666] uppercase tracking-wide">
                      Tone
                    </label>
                    <span className="text-xs text-white font-medium">
                      {getToneLabel(commentTone)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={commentTone}
                    onChange={(e) => setCommentTone(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#0a0a0a] appearance-none cursor-pointer accent-[#ff3d00]"
                    style={{
                      background: `linear-gradient(to right, #ff3d00 0%, #ff3d00 ${commentTone}%, #0a0a0a ${commentTone}%, #0a0a0a 100%)`
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-[#666] mt-1">
                    <span>Respectful</span>
                    <span>Extremely Sassy</span>
                  </div>
                </div>

                {/* Regenerate Button */}
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#333] text-white text-sm font-medium hover:bg-[#444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={regenerateComment}
                  disabled={isRegenerating}
                >
                  {isRegenerating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshIcon />
                      Regenerate Comment
                    </>
                  )}
                </button>
              </div>

              <p className="text-[#666] text-xs mt-3">
                Adjust sliders and hit regenerate to customize your comment
              </p>
            </div>
          </div>
        )}

        {/* FOLLOW-UP QUESTION Section */}
        {hasResults && (
          <div className="mb-8 animate-fadeIn">
            <div className="p-5 bg-[#1a1a1a] border border-[#333]">
              <h2 className="text-xs font-bold tracking-[0.2em] text-[#a3a3a3] uppercase mb-3">
                Ask a Follow-up
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 p-3 bg-[#0a0a0a] border border-[#333] text-white placeholder:text-[#666] focus:border-[#ff3d00] focus:outline-none focus:ring-2 focus:ring-[#ff3d00]/20"
                  placeholder="Ask more about how this connects to the framework..."
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && followUpQuestion.trim()) {
                      e.preventDefault();
                      const followUpText = `Original content: ${currentQuery}\n\nPrevious analysis: ${whatsHappening}\n\nFollow-up question: ${followUpQuestion}`;
                      setFollowUpQuestion("");
                      handleSearch(followUpText);
                    }
                  }}
                  disabled={isAskingFollowUp}
                />
                <button
                  className="px-4 py-3 bg-[#ff3d00] text-white font-medium hover:bg-[#e63600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={() => {
                    if (followUpQuestion.trim()) {
                      const followUpText = `Original content: ${currentQuery}\n\nPrevious analysis: ${whatsHappening}\n\nFollow-up question: ${followUpQuestion}`;
                      setFollowUpQuestion("");
                      handleSearch(followUpText);
                    }
                  }}
                  disabled={isAskingFollowUp || !followUpQuestion.trim()}
                >
                  {isAskingFollowUp ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <SearchIcon />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#1a1a1a] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-[#0a0a0a] border border-[#333] text-white hover:border-[#ff3d00] hover:text-[#ff3d00] z-10 transition-colors"
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
              <h3 className="text-lg font-bold mb-2 text-white">{selectedImage.title}</h3>
              {selectedImage.reason && (
                <p className="text-sm text-[#ff3d00] mb-2">
                  <strong>Why this matches:</strong> {selectedImage.reason}
                </p>
              )}
              {selectedImage.body_text && (
                <p className="text-sm text-[#a3a3a3] mb-4">
                  {selectedImage.body_text}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-3 bg-[#ff3d00] text-white font-medium hover:bg-[#e63600] transition-colors flex items-center justify-center gap-2"
                  onClick={() => copyToClipboard(selectedImage.image_url)}
                >
                  <CopyIcon />
                  Copy
                </button>
                <button
                  className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-[#333] text-white font-medium hover:bg-[#1a1a1a] hover:border-[#ff3d00] transition-colors flex items-center justify-center gap-2"
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
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#1a1a1a] border border-[#333] text-white text-sm font-medium shadow-lg z-50 animate-slideUp">
          {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease forwards; }
        .animate-slideUp { animation: slideUp 0.3s ease; }
      `}</style>
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
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff3d00" strokeWidth="1.5">
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

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}
