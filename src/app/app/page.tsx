"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { analyzeWithLLM, regenerateShareText, ImageResult, ShareVariants } from "@/lib/supabase";
import {
  getHistory,
  saveToHistory,
  deleteHistoryEntry,
  clearHistory,
  formatTimestamp,
  HistoryEntry
} from "@/lib/history";

type InputMode = "screenshot" | "url" | "youtube" | "text" | "describe";
type ShareLength = "short" | "medium" | "long";

export default function Home() {
  const [mode, setMode] = useState<InputMode>("describe");
  const [inputText, setInputText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // New simplified state
  const [theReframe, setTheReframe] = useState("");
  const [theMechanism, setTheMechanism] = useState("");
  const [primaryImage, setPrimaryImage] = useState<ImageResult | null>(null);
  const [contrastImage, setContrastImage] = useState<ImageResult | null>(null);
  const [shareVariants, setShareVariants] = useState<ShareVariants>({ short: "", medium: "", long: "" });
  const [selectedLength, setSelectedLength] = useState<ShareLength>("medium");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const [followUpQuestion, setFollowUpQuestion] = useState("");
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

  const hasResults = primaryImage !== null;

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const clearResults = () => {
    setTheReframe("");
    setTheMechanism("");
    setPrimaryImage(null);
    setContrastImage(null);
    setShareVariants({ short: "", medium: "", long: "" });
    setSourcePreview(null);
    setFollowUpQuestion("");
  };

  const handleAnalysis = async (text: string) => {
    if (!text.trim()) {
      setError("Please provide some content to analyze");
      return;
    }

    setIsLoading(true);
    setError("");
    clearResults();
    setCurrentQuery(text);

    try {
      setLoadingMessage("Analyzing through the lens...");
      const response = await analyzeWithLLM(text);

      if (!response.primary_image) {
        setError("Analysis could not find a matching image. Try different content.");
      } else {
        setTheReframe(response.the_reframe);
        setTheMechanism(response.the_mechanism);
        setPrimaryImage(response.primary_image);
        setContrastImage(response.contrast_image);
        setShareVariants(response.share_variants);

        // Save to history
        const entry = saveToHistory({
          query: text,
          the_reframe: response.the_reframe,
          the_mechanism: response.the_mechanism,
          primary_image: response.primary_image,
          contrast_image: response.contrast_image,
          share_variants: response.share_variants
        });
        setHistory(prev => [entry, ...prev.slice(0, 49)]);
      }
    } catch (err) {
      console.error("Analysis error:", err);
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
        setLoadingMessage("Reading visual content...");
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
          setError("Could not analyze the screenshot. Try another image.");
          setIsLoading(false);
          return;
        }

        setOcrProgress(60);

        const analysisInput = `SCREENSHOT ANALYSIS:\n\n${screenshotAnalysis}\n\nAnalyze both the textual and visual elements.`;
        setInputText(screenshotAnalysis.substring(0, 500) + "...");
        setCurrentQuery(analysisInput);

        setLoadingMessage("Analyzing through the lens...");
        setOcrProgress(80);

        const response = await analyzeWithLLM(analysisInput);

        if (!response.primary_image) {
          setError("Analysis could not find a matching image. Try different content.");
        } else {
          setTheReframe(response.the_reframe);
          setTheMechanism(response.the_mechanism);
          setPrimaryImage(response.primary_image);
          setContrastImage(response.contrast_image);
          setShareVariants(response.share_variants);

          const entry = saveToHistory({
            query: analysisInput,
            the_reframe: response.the_reframe,
            the_mechanism: response.the_mechanism,
            primary_image: response.primary_image,
            contrast_image: response.contrast_image,
            share_variants: response.share_variants
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

      if (data.ogImage) {
        setSourcePreview({ type: "url", image: data.ogImage, url: urlInput });
      }

      setInputText(data.text);
      await handleAnalysis(data.text);
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

      setLoadingMessage("Analyzing through the lens...");
      const analysisResponse = await analyzeWithLLM(data.content);

      if (!analysisResponse.primary_image) {
        setError("Analysis could not find a matching image. Try different content.");
      } else {
        setTheReframe(analysisResponse.the_reframe);
        setTheMechanism(analysisResponse.the_mechanism);
        setPrimaryImage(analysisResponse.primary_image);
        setContrastImage(analysisResponse.contrast_image);
        setShareVariants(analysisResponse.share_variants);

        const entry = saveToHistory({
          query: data.content,
          the_reframe: analysisResponse.the_reframe,
          the_mechanism: analysisResponse.the_mechanism,
          primary_image: analysisResponse.primary_image,
          contrast_image: analysisResponse.contrast_image,
          share_variants: analysisResponse.share_variants
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

  const handleRegenerate = async () => {
    if (!currentQuery || !theReframe) return;

    setIsRegenerating(true);
    try {
      const newText = await regenerateShareText(
        currentQuery,
        theReframe,
        theMechanism,
        selectedLength
      );
      setShareVariants(prev => ({ ...prev, [selectedLength]: newText }));
      showToast("Regenerated!");
    } catch (err) {
      console.error("Regenerate error:", err);
      showToast("Failed to regenerate");
    } finally {
      setIsRegenerating(false);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setTheReframe(entry.the_reframe);
    setTheMechanism(entry.the_mechanism);
    setPrimaryImage(entry.primary_image);
    setContrastImage(entry.contrast_image);
    setShareVariants(entry.share_variants);
    setCurrentQuery(entry.query);
    setInputText(entry.query);
    setShowHistory(false);
    setFollowUpQuestion("");
    setError("");
  };

  const handleDeleteHistoryEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryEntry(id);
    setHistory(prev => prev.filter(entry => entry.id !== id));
    showToast("Deleted from history");
  };

  const handleClearHistory = () => {
    if (confirm("Clear all history?")) {
      clearHistory();
      setHistory([]);
      showToast("History cleared");
    }
  };

  // Watermark helper
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

  const copyImageToClipboard = async (imageUrl: string) => {
    try {
      showToast("Preparing image...");
      const watermarkedBlob = await addWatermark(imageUrl);
      await navigator.clipboard.write([
        new ClipboardItem({ [watermarkedBlob.type]: watermarkedBlob }),
      ]);
      showToast("Image copied!");
    } catch (err) {
      console.error("Copy error:", err);
      try {
        await navigator.clipboard.writeText(imageUrl);
        showToast("URL copied!");
      } catch {
        showToast("Failed to copy");
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
      showToast("Downloaded!");
    } catch (err) {
      console.error("Download error:", err);
      showToast("Failed to download");
    }
  };

  const copyShareText = () => {
    const text = shareVariants[selectedLength];
    if (text) {
      navigator.clipboard.writeText(text);
      showToast("Copied!");
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A]">
      <Navigation />

      {/* Header */}
      <header className="pt-24 pb-4 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Mismatch Analyzer
        </h1>
        <p className="text-[#4A4A4A] text-sm tracking-wide">
          See any content through the evolutionary lens
        </p>
        <button
          className="mt-4 py-2 px-4 flex items-center gap-2 text-sm text-[#4A4A4A] hover:text-[#C75B39] border border-[#E5E0D8] hover:border-[#C75B39] transition-colors mx-auto rounded"
          onClick={() => setShowHistory(!showHistory)}
        >
          <HistoryIcon />
          History
          {history.length > 0 && (
            <span className="text-xs bg-[#C75B39] text-white rounded-full px-1.5">
              {history.length}
            </span>
          )}
        </button>
      </header>

      {/* History Panel */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowHistory(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-[#E5E0D8] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#E5E0D8] flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-wide text-[#1A1A1A]">History</h2>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <button
                    className="text-xs text-[#8B8B8B] hover:text-red-500"
                    onClick={handleClearHistory}
                  >
                    Clear
                  </button>
                )}
                <button
                  className="text-[#8B8B8B] hover:text-[#1A1A1A]"
                  onClick={() => setShowHistory(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <div className="p-8 text-center text-[#8B8B8B]">
                  <HistoryIcon />
                  <p className="mt-2">No history yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E0D8]">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 hover:bg-[#F5F3EF] cursor-pointer transition-colors group"
                      onClick={() => loadHistoryEntry(entry)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#1A1A1A] line-clamp-2 mb-1">
                            {entry.the_reframe.substring(0, 100)}...
                          </p>
                          <p className="text-xs text-[#8B8B8B]">
                            {formatTimestamp(entry.timestamp)}
                          </p>
                        </div>
                        <button
                          className="opacity-0 group-hover:opacity-100 text-[#8B8B8B] hover:text-red-500 transition-opacity p-1"
                          onClick={(e) => handleDeleteHistoryEntry(entry.id, e)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                      {entry.primary_image && (
                        <div className="mt-2 w-12 h-12 rounded overflow-hidden bg-[#F5F3EF]">
                          <img
                            src={entry.primary_image.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
        {/* Input Tabs */}
        <div className="flex border-b border-[#E5E0D8] mb-6 overflow-x-auto">
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
                  ? "text-[#C75B39]"
                  : "text-[#8B8B8B] hover:text-[#1A1A1A]"
              }`}
              onClick={() => {
                setMode(tab.id as InputMode);
                setError("");
              }}
            >
              {tab.label}
              {mode === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C75B39]" />
              )}
            </button>
          ))}
        </div>

        {/* Input Areas */}
        <div className="mb-6">
          {mode === "describe" && (
            <div className="animate-fadeIn">
              <textarea
                className="w-full p-4 min-h-[120px] resize-none bg-white border border-[#E5E0D8] text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none focus:ring-2 focus:ring-[#C75B39]/20 rounded-lg text-base"
                placeholder="Describe what you're seeing... e.g., Someone bragging about working 80 hours a week"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                className="w-full mt-4 px-6 py-3 bg-[#C75B39] text-white font-medium hover:bg-[#A84A2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
                onClick={() => handleAnalysis(inputText)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    {loadingMessage}
                  </>
                ) : (
                  "Analyze"
                )}
              </button>
            </div>
          )}

          {mode === "text" && (
            <div className="animate-fadeIn">
              <textarea
                className="w-full p-4 min-h-[180px] resize-none bg-white border border-[#E5E0D8] text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none focus:ring-2 focus:ring-[#C75B39]/20 rounded-lg text-base"
                placeholder="Paste article text, social media post, or any content..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                className="w-full mt-4 px-6 py-3 bg-[#C75B39] text-white font-medium hover:bg-[#A84A2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
                onClick={() => handleAnalysis(inputText)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    {loadingMessage}
                  </>
                ) : (
                  "Analyze"
                )}
              </button>
            </div>
          )}

          {mode === "url" && (
            <div className="animate-fadeIn">
              <input
                type="url"
                className="w-full p-4 bg-white border border-[#E5E0D8] text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none focus:ring-2 focus:ring-[#C75B39]/20 rounded-lg"
                placeholder="https://example.com/article..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <button
                className="w-full mt-4 px-6 py-3 bg-[#C75B39] text-white font-medium hover:bg-[#A84A2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
                onClick={handleUrlScrape}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    {loadingMessage}
                  </>
                ) : (
                  "Fetch & Analyze"
                )}
              </button>
            </div>
          )}

          {mode === "youtube" && (
            <div className="animate-fadeIn">
              <input
                type="url"
                className="w-full p-4 bg-white border border-[#E5E0D8] text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none focus:ring-2 focus:ring-[#C75B39]/20 rounded-lg"
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <button
                className="w-full mt-4 px-6 py-3 bg-[#C75B39] text-white font-medium hover:bg-[#A84A2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
                onClick={handleYouTubeAnalyze}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    {loadingMessage}
                  </>
                ) : (
                  "Analyze Video"
                )}
              </button>
            </div>
          )}

          {mode === "screenshot" && (
            <div className="animate-fadeIn">
              <div
                className={`flex flex-col items-center justify-center gap-4 min-h-[180px] p-8 border-2 border-dashed cursor-pointer transition-colors rounded-lg ${
                  isDragging
                    ? "border-[#C75B39] bg-[#C75B39]/5"
                    : "border-[#E5E0D8] hover:border-[#C75B39] hover:bg-[#F5F3EF]"
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
                    <Spinner />
                    <p className="text-sm text-[#4A4A4A]">
                      {loadingMessage} {ocrProgress > 0 && `(${ocrProgress}%)`}
                    </p>
                  </>
                ) : (
                  <>
                    <UploadIcon />
                    <p className="text-sm text-[#4A4A4A]">
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
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 text-sm animate-fadeIn rounded-lg">
            {error}
          </div>
        )}

        {/* Example for First-Time Users */}
        {!hasResults && !isLoading && !error && (
          <div className="mb-8">
            <div className="p-6 bg-gradient-to-br from-[#F5F3EF] to-white border border-[#E5E0D8] rounded-lg">
              <p className="text-xs text-[#8B8B8B] uppercase tracking-wide mb-3">Example</p>
              <div className="mb-4 p-3 bg-white border border-[#E5E0D8] rounded">
                <p className="text-sm text-[#4A4A4A] italic">&quot;Someone bragging about working 80 hours a week&quot;</p>
              </div>
              <div className="space-y-4 text-[#4A4A4A]">
                <p className="text-base leading-relaxed">
                  For 300,000 years, work meant doing things that directly benefited people you could see, people you loved, people who would do the same for you tomorrow. Three to four hours daily. The rest was rest, socializing, being human.
                </p>
                <p className="text-base leading-relaxed">
                  The 80-hour brag is status signaling in an environment where exhaustion has become virtue. The biology reads it correctly: this person is depleted. The culture reads it backwards: this person is valuable.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {hasResults && (
          <div className="space-y-6 animate-fadeIn">
            {/* Source Preview */}
            {sourcePreview && (
              <div className="p-4 bg-white border border-[#E5E0D8] rounded-lg">
                <div className="flex gap-4 items-start">
                  <div className={`${sourcePreview.type === "youtube" ? "w-32 h-20" : "w-20 h-20"} flex-shrink-0 overflow-hidden bg-[#F5F3EF] rounded`}>
                    <img
                      src={sourcePreview.image}
                      alt="Source"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {sourcePreview.title && (
                      <p className="text-sm font-medium text-[#1A1A1A] mb-1 line-clamp-2">
                        {sourcePreview.title}
                      </p>
                    )}
                    {sourcePreview.channel && (
                      <p className="text-xs text-[#8B8B8B]">{sourcePreview.channel}</p>
                    )}
                    {sourcePreview.url && (
                      <a
                        href={sourcePreview.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#C75B39] hover:underline"
                      >
                        View source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Primary Image - Hero */}
            {primaryImage && (
              <div
                className="relative overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => setSelectedImage(primaryImage)}
              >
                <img
                  src={primaryImage.image_url}
                  alt={primaryImage.title}
                  className="w-full max-h-[500px] object-contain bg-[#F5F3EF]"
                />
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-2 bg-white/90 hover:bg-white rounded-lg shadow"
                    onClick={(e) => { e.stopPropagation(); copyImageToClipboard(primaryImage.image_url); }}
                  >
                    <CopyIcon />
                  </button>
                  <button
                    className="p-2 bg-white/90 hover:bg-white rounded-lg shadow"
                    onClick={(e) => { e.stopPropagation(); downloadImage(primaryImage); }}
                  >
                    <DownloadIcon />
                  </button>
                </div>
              </div>
            )}

            {/* The Reframe */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg md:text-xl leading-relaxed text-[#1A1A1A]">
                {theReframe}
              </p>
            </div>

            {/* The Mechanism */}
            {theMechanism && (
              <div className="prose prose-lg max-w-none">
                <p className="text-base md:text-lg leading-relaxed text-[#4A4A4A]">
                  {theMechanism}
                </p>
              </div>
            )}

            {/* Contrast Image (optional, smaller) */}
            {contrastImage && (
              <div
                className="relative overflow-hidden rounded-lg cursor-pointer group max-w-sm"
                onClick={() => setSelectedImage(contrastImage)}
              >
                <img
                  src={contrastImage.image_url}
                  alt={contrastImage.title}
                  className="w-full object-contain bg-[#F5F3EF]"
                />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1.5 bg-white/90 hover:bg-white rounded shadow"
                    onClick={(e) => { e.stopPropagation(); copyImageToClipboard(contrastImage.image_url); }}
                  >
                    <CopyIcon />
                  </button>
                </div>
                {contrastImage.reason && (
                  <p className="text-xs text-[#8B8B8B] mt-2 italic">{contrastImage.reason}</p>
                )}
              </div>
            )}

            {/* Share Section */}
            <div className="p-5 bg-white border border-[#E5E0D8] rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold tracking-wide text-[#4A4A4A] uppercase">Share</h3>
                <div className="flex gap-1 bg-[#F5F3EF] p-1 rounded-lg">
                  {(["short", "medium", "long"] as ShareLength[]).map((len) => (
                    <button
                      key={len}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        selectedLength === len
                          ? "bg-white text-[#C75B39] shadow-sm"
                          : "text-[#8B8B8B] hover:text-[#1A1A1A]"
                      }`}
                      onClick={() => setSelectedLength(len)}
                    >
                      {len.charAt(0).toUpperCase() + len.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[100px]">
                {isRegenerating && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded">
                    <Spinner />
                  </div>
                )}
                <p className="text-[#1A1A1A] text-base leading-relaxed whitespace-pre-wrap">
                  {shareVariants[selectedLength] || "..."}
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 px-4 py-2.5 bg-[#C75B39] text-white text-sm font-medium hover:bg-[#A84A2D] transition-colors rounded-lg flex items-center justify-center gap-2"
                  onClick={copyShareText}
                >
                  <CopyIcon />
                  Copy
                </button>
                <button
                  className="px-4 py-2.5 bg-[#F5F3EF] text-[#4A4A4A] text-sm font-medium hover:bg-[#E5E0D8] transition-colors rounded-lg flex items-center justify-center gap-2"
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                >
                  <RefreshIcon />
                  Regenerate
                </button>
              </div>
            </div>

            {/* Follow-up */}
            <div className="p-4 bg-white border border-[#E5E0D8] rounded-lg">
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 p-3 bg-[#FAF9F6] border border-[#E5E0D8] text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none focus:ring-2 focus:ring-[#C75B39]/20 rounded-lg text-sm"
                  placeholder="Ask a follow-up question..."
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && followUpQuestion.trim()) {
                      e.preventDefault();
                      const followUpText = `Original content: ${currentQuery}\n\nPrevious analysis: ${theReframe}\n\nFollow-up question: ${followUpQuestion}`;
                      setFollowUpQuestion("");
                      handleAnalysis(followUpText);
                    }
                  }}
                />
                <button
                  className="px-4 py-3 bg-[#C75B39] text-white font-medium hover:bg-[#A84A2D] transition-colors rounded-lg"
                  onClick={() => {
                    if (followUpQuestion.trim()) {
                      const followUpText = `Original content: ${currentQuery}\n\nPrevious analysis: ${theReframe}\n\nFollow-up question: ${followUpQuestion}`;
                      setFollowUpQuestion("");
                      handleAnalysis(followUpText);
                    }
                  }}
                  disabled={!followUpQuestion.trim()}
                >
                  Ask
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white border border-[#E5E0D8] text-[#4A4A4A] hover:border-[#C75B39] hover:text-[#C75B39] z-10 transition-colors rounded-lg"
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
              {selectedImage.reason && (
                <p className="text-sm text-[#4A4A4A] mb-3">{selectedImage.reason}</p>
              )}
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-3 bg-[#C75B39] text-white font-medium hover:bg-[#A84A2D] transition-colors flex items-center justify-center gap-2 rounded-lg"
                  onClick={() => copyImageToClipboard(selectedImage.image_url)}
                >
                  <CopyIcon />
                  Copy
                </button>
                <button
                  className="flex-1 px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] text-[#1A1A1A] font-medium hover:bg-[#F5F3EF] transition-colors flex items-center justify-center gap-2 rounded-lg"
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white border border-[#E5E0D8] text-[#1A1A1A] text-sm font-medium shadow-lg z-50 animate-slideUp rounded-lg">
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
function Spinner() {
  return <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
}

function UploadIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C75B39" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
