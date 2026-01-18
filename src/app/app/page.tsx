"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { analyzeWithLLM, regenerateShareText, ImageResult, AngleResult, ImageCluster, ShareVariants } from "@/lib/supabase";
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

  // Analysis results - new structure
  const [surface, setSurface] = useState("");
  const [reframe, setReframe] = useState("");
  const [angles, setAngles] = useState<AngleResult[]>([]);
  const [imageClusters, setImageClusters] = useState<ImageCluster[]>([]);
  const [shareVariants, setShareVariants] = useState<ShareVariants>({ short: "", medium: "", long: "" });
  const [selectedLength, setSelectedLength] = useState<ShareLength>("medium");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [expandedAngles, setExpandedAngles] = useState<Set<number>>(new Set([0])); // First angle expanded by default

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
  const [copiedState, setCopiedState] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasResults = angles.length > 0 || imageClusters.length > 0;

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const clearResults = () => {
    setSurface("");
    setReframe("");
    setAngles([]);
    setImageClusters([]);
    setShareVariants({ short: "", medium: "", long: "" });
    setSourcePreview(null);
    setFollowUpQuestion("");
    setExpandedAngles(new Set([0]));
  };

  const toggleAngle = (index: number) => {
    setExpandedAngles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
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

      if (response.angles.length === 0 && response.image_clusters.length === 0) {
        setError("Analysis could not find matching content. Try different input.");
      } else {
        setSurface(response.surface);
        setReframe(response.reframe);
        setAngles(response.angles);
        setImageClusters(response.image_clusters);
        setShareVariants(response.share_variants);

        // Save to history
        const entry = saveToHistory({
          query: text,
          surface: response.surface,
          reframe: response.reframe,
          angles: response.angles,
          image_clusters: response.image_clusters,
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

        if (response.angles.length === 0 && response.image_clusters.length === 0) {
          setError("Analysis could not find matching content. Try different input.");
        } else {
          setSurface(response.surface);
          setReframe(response.reframe);
          setAngles(response.angles);
          setImageClusters(response.image_clusters);
          setShareVariants(response.share_variants);

          const entry = saveToHistory({
            query: analysisInput,
            surface: response.surface,
            reframe: response.reframe,
            angles: response.angles,
            image_clusters: response.image_clusters,
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

      if (analysisResponse.angles.length === 0 && analysisResponse.image_clusters.length === 0) {
        setError("Analysis could not find matching content. Try different input.");
      } else {
        setSurface(analysisResponse.surface);
        setReframe(analysisResponse.reframe);
        setAngles(analysisResponse.angles);
        setImageClusters(analysisResponse.image_clusters);
        setShareVariants(analysisResponse.share_variants);

        const entry = saveToHistory({
          query: data.content,
          surface: analysisResponse.surface,
          reframe: analysisResponse.reframe,
          angles: analysisResponse.angles,
          image_clusters: analysisResponse.image_clusters,
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
    if (!currentQuery || !reframe) return;

    setIsRegenerating(true);
    try {
      const newText = await regenerateShareText(
        currentQuery,
        reframe,
        angles.map(a => a.mismatch).join(" "),
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
    setSurface(entry.surface);
    setReframe(entry.reframe);
    setAngles(entry.angles);
    setImageClusters(entry.image_clusters);
    setShareVariants(entry.share_variants);
    setCurrentQuery(entry.query);
    setInputText(entry.query);
    setShowHistory(false);
    setFollowUpQuestion("");
    setError("");
    setExpandedAngles(new Set([0]));
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
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
      showToast("Copied!");
    }
  };

  // Angle Card Component
  const AngleCard = ({ angle, index }: { angle: AngleResult; index: number }) => {
    const isExpanded = expandedAngles.has(index);
    const angleNumber = String(index + 1).padStart(2, '0');

    return (
      <div className="angle-card">
        <div
          className="angle-header"
          onClick={() => toggleAngle(index)}
        >
          <span className="angle-number">{angleNumber}</span>
          <span className="angle-title">{angle.perspective}</span>
          <ChevronIcon className={`angle-chevron ${isExpanded ? 'rotated' : ''}`} />
        </div>

        <div className={`angle-content ${isExpanded ? 'expanded' : ''}`}>
          <div className="angle-content-inner">
            <p className="angle-summary">{angle.mismatch}</p>

            <div className="comparison-row">
              <div className="comparison-card ancestral">
                {angle.ancestral_image && (
                  <div
                    className="comparison-image"
                    onClick={() => setSelectedImage(angle.ancestral_image)}
                  >
                    <img src={angle.ancestral_image.image_url} alt="" />
                  </div>
                )}
                <span className="comparison-label">For 300,000 years</span>
                <p className="comparison-text">{angle.ancestral}</p>
              </div>

              <div className="comparison-card modern">
                {angle.modern_image && (
                  <div
                    className="comparison-image"
                    onClick={() => setSelectedImage(angle.modern_image)}
                  >
                    <img src={angle.modern_image.image_url} alt="" />
                  </div>
                )}
                <span className="comparison-label">Now</span>
                <p className="comparison-text">{angle.modern}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Image Section Component
  const ImageSection = ({ cluster }: { cluster: ImageCluster }) => {
    if (cluster.images.length === 0) return null;

    return (
      <div className="image-section">
        <h3 className="image-section-title">{cluster.theme}</h3>
        <div className="image-grid">
          {cluster.images.map((image, index) => (
            <div
              key={image.id || index}
              className="image-tile"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.image_url} alt={image.title} loading="lazy" />
              <span className="image-tile-number">{index + 1}</span>
              <div className="image-tile-overlay">
                <span className="image-tile-title">{image.title}</span>
              </div>
              <div className="image-tile-actions">
                <button
                  onClick={(e) => { e.stopPropagation(); copyImageToClipboard(image.image_url); }}
                >
                  <CopyIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="analyzer-main">
      <Navigation />

      {/* Header */}
      <header className="analyzer-header">
        <h1 className="analyzer-title">Mismatch Analyzer</h1>
        <p className="analyzer-subtitle">See any content through the evolutionary lens</p>
        <button
          className="history-button"
          onClick={() => setShowHistory(!showHistory)}
        >
          <HistoryIcon />
          History
          {history.length > 0 && (
            <span className="history-badge">{history.length}</span>
          )}
        </button>
      </header>

      {/* History Panel */}
      {showHistory && (
        <div className="history-overlay" onClick={() => setShowHistory(false)}>
          <div className="history-panel" onClick={(e) => e.stopPropagation()}>
            <div className="history-panel-header">
              <h2>History</h2>
              <div className="history-panel-actions">
                {history.length > 0 && (
                  <button className="clear-history-btn" onClick={handleClearHistory}>
                    Clear
                  </button>
                )}
                <button className="close-history-btn" onClick={() => setShowHistory(false)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="history-list">
              {history.length === 0 ? (
                <div className="history-empty">
                  <HistoryIcon />
                  <p>No history yet</p>
                </div>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    className="history-item"
                    onClick={() => loadHistoryEntry(entry)}
                  >
                    <div className="history-item-content">
                      <p className="history-item-text">
                        {entry.reframe.substring(0, 100)}...
                      </p>
                      <p className="history-item-time">
                        {formatTimestamp(entry.timestamp)}
                      </p>
                    </div>
                    <button
                      className="history-item-delete"
                      onClick={(e) => handleDeleteHistoryEntry(entry.id, e)}
                    >
                      <TrashIcon />
                    </button>
                    {entry.image_clusters && entry.image_clusters[0]?.images?.[0] && (
                      <div className="history-item-thumb">
                        <img
                          src={entry.image_clusters[0].images[0].image_url}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="analyzer-content">
        {/* Input Card */}
        <div className="input-card">
          {/* Input Tabs */}
          <div className="input-tabs">
            {[
              { id: "describe", label: "Describe" },
              { id: "text", label: "Paste Text" },
              { id: "url", label: "URL" },
              { id: "youtube", label: "YouTube" },
              { id: "screenshot", label: "Screenshot" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`input-tab ${mode === tab.id ? "active" : ""}`}
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
          <div className="input-area">
            {mode === "describe" && (
              <div className="input-content">
                <textarea
                  className="input-textarea"
                  placeholder="Describe what you're seeing... e.g., Someone bragging about working 80 hours a week"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
            )}

            {mode === "text" && (
              <div className="input-content">
                <textarea
                  className="input-textarea tall"
                  placeholder="Paste article text, social media post, or any content..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
            )}

            {mode === "url" && (
              <div className="input-content">
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://example.com/article..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
            )}

            {mode === "youtube" && (
              <div className="input-content">
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>
            )}

            {mode === "screenshot" && (
              <div className="input-content">
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
                      <Spinner />
                      <p>{loadingMessage} {ocrProgress > 0 && `(${ocrProgress}%)`}</p>
                    </>
                  ) : (
                    <>
                      <UploadIcon />
                      <p>Drop image here or tap to upload</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          {mode !== "screenshot" && (
            <button
              className="submit-button"
              onClick={() => {
                if (mode === "url") handleUrlScrape();
                else if (mode === "youtube") handleYouTubeAnalyze();
                else handleAnalysis(inputText);
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  {loadingMessage}
                </>
              ) : (
                mode === "url" ? "Fetch & Analyze" : mode === "youtube" ? "Analyze Video" : "Analyze"
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Example for First-Time Users */}
        {!hasResults && !isLoading && !error && (
          <div className="example-card">
            <span className="example-label">Example</span>
            <div className="example-input">
              <p>&quot;Someone bragging about working 80 hours a week&quot;</p>
            </div>
            <div className="example-output">
              <p>
                For 300,000 years, work meant doing things that directly benefited people you could see, people you loved, people who would do the same for you tomorrow. Three to four hours daily. The rest was rest, socializing, being human.
              </p>
              <p>
                The 80-hour brag is status signaling in an environment where exhaustion has become virtue. The biology reads it correctly: this person is depleted. The culture reads it backwards: this person is valuable.
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {hasResults && (
          <div className="results-container">
            {/* Source Preview */}
            {sourcePreview && (
              <div className="source-preview">
                <div className={`source-image ${sourcePreview.type === "youtube" ? "wide" : ""}`}>
                  <img src={sourcePreview.image} alt="Source" />
                </div>
                <div className="source-info">
                  {sourcePreview.title && (
                    <p className="source-title">{sourcePreview.title}</p>
                  )}
                  {sourcePreview.channel && (
                    <p className="source-channel">{sourcePreview.channel}</p>
                  )}
                  {sourcePreview.url && (
                    <a href={sourcePreview.url} target="_blank" rel="noopener noreferrer" className="source-link">
                      View source
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* The Reframe Section */}
            <div className="reframe-section">
              <h2 className="section-title">THE REFRAME</h2>
              <div className="section-divider" />
              {surface && (
                <p className="surface-text">{surface}</p>
              )}
              <p className="reframe-text">{reframe}</p>
            </div>

            {/* The Angles Section */}
            {angles.length > 0 && (
              <div className="angles-section">
                <h2 className="section-title">THE ANGLES</h2>
                <div className="section-divider" />
                <div className="angles-list">
                  {angles.map((angle, index) => (
                    <AngleCard key={index} angle={angle} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Image Clusters */}
            {imageClusters.map((cluster, index) => (
              <ImageSection key={index} cluster={cluster} />
            ))}

            {/* Share Section */}
            <div className="share-section">
              <h2 className="section-title">SHARE</h2>
              <div className="section-divider" />

              <div className="share-preview">
                {isRegenerating && (
                  <div className="share-loading">
                    <Spinner />
                  </div>
                )}
                <p className="share-text">{shareVariants[selectedLength] || "..."}</p>
              </div>

              <div className="share-controls">
                <div className="length-toggle">
                  {(["short", "medium", "long"] as ShareLength[]).map((len) => (
                    <button
                      key={len}
                      className={`length-option ${selectedLength === len ? "active" : ""}`}
                      onClick={() => setSelectedLength(len)}
                    >
                      {len.charAt(0).toUpperCase() + len.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="share-buttons">
                  <button
                    className={`copy-button ${copiedState ? "copied" : ""}`}
                    onClick={copyShareText}
                  >
                    <CopyIcon />
                    {copiedState ? "Copied!" : "Copy"}
                  </button>
                  <button
                    className="regen-button"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                  >
                    <RefreshIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* Follow-up */}
            <div className="followup-section">
              <input
                type="text"
                className="followup-input"
                placeholder="Ask a follow-up question..."
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && followUpQuestion.trim()) {
                    e.preventDefault();
                    const followUpText = `Original content: ${currentQuery}\n\nPrevious analysis: ${reframe}\n\nFollow-up question: ${followUpQuestion}`;
                    setFollowUpQuestion("");
                    handleAnalysis(followUpText);
                  }
                }}
              />
              <button
                className="followup-button"
                onClick={() => {
                  if (followUpQuestion.trim()) {
                    const followUpText = `Original content: ${currentQuery}\n\nPrevious analysis: ${reframe}\n\nFollow-up question: ${followUpQuestion}`;
                    setFollowUpQuestion("");
                    handleAnalysis(followUpText);
                  }
                }}
                disabled={!followUpQuestion.trim()}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
            <img src={selectedImage.image_url} alt={selectedImage.title} className="modal-image" />
            <div className="modal-info">
              {selectedImage.reason && (
                <p className="modal-reason">{selectedImage.reason}</p>
              )}
              <div className="modal-actions">
                <button className="modal-copy-btn" onClick={() => copyImageToClipboard(selectedImage.image_url)}>
                  <CopyIcon /> Copy
                </button>
                <button className="modal-download-btn" onClick={() => downloadImage(selectedImage)}>
                  <DownloadIcon /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast">{toast}</div>
      )}

      <style jsx>{`
        /* CSS Variables */
        :root {
          --rust: #B85C3C;
          --rust-light: #D4856A;
          --rust-dark: #8B4532;
          --cream: #FAF7F2;
          --paper: #FFFEF9;
          --charcoal: #2D2D2D;
          --ink: #1A1A1A;
          --sage: #7A8B7A;
          --warm-gray: #9B9590;
        }

        /* Main Layout */
        .analyzer-main {
          min-height: 100vh;
          background: var(--cream);
          color: var(--ink);
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .analyzer-header {
          padding: 96px 24px 16px;
          text-align: center;
        }

        .analyzer-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          font-family: 'Playfair Display', Georgia, serif;
        }

        .analyzer-subtitle {
          font-size: 14px;
          color: var(--warm-gray);
          letter-spacing: 0.02em;
        }

        .history-button {
          margin-top: 16px;
          padding: 10px 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--charcoal);
          background: transparent;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .history-button:hover {
          border-color: var(--rust);
          color: var(--rust);
        }

        .history-badge {
          font-size: 11px;
          background: var(--rust);
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 600;
        }

        .analyzer-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        /* Input Card */
        .input-card {
          background: var(--paper);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .input-tabs {
          display: flex;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          overflow-x: auto;
        }

        .input-tab {
          padding: 16px 20px;
          font-size: 14px;
          font-weight: 500;
          color: var(--warm-gray);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.15s ease;
          position: relative;
          white-space: nowrap;
        }

        .input-tab:hover {
          color: var(--charcoal);
        }

        .input-tab.active {
          color: var(--rust);
        }

        .input-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--rust);
        }

        .input-area {
          padding: 20px;
        }

        .input-textarea {
          width: 100%;
          min-height: 100px;
          padding: 16px;
          font-size: 15px;
          font-family: inherit;
          line-height: 1.6;
          color: var(--ink);
          background: var(--cream);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 8px;
          resize: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .input-textarea.tall {
          min-height: 160px;
        }

        .input-textarea:focus {
          outline: none;
          border-color: var(--rust);
          box-shadow: 0 0 0 3px rgba(184, 92, 60, 0.1);
        }

        .input-textarea::placeholder {
          color: var(--warm-gray);
        }

        .input-field {
          width: 100%;
          padding: 16px;
          font-size: 15px;
          font-family: inherit;
          color: var(--ink);
          background: var(--cream);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 8px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: var(--rust);
          box-shadow: 0 0 0 3px rgba(184, 92, 60, 0.1);
        }

        .input-field::placeholder {
          color: var(--warm-gray);
        }

        .upload-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-height: 160px;
          padding: 32px;
          border: 2px dashed rgba(0,0,0,0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .upload-zone:hover {
          border-color: var(--rust);
          background: rgba(184, 92, 60, 0.02);
        }

        .upload-zone.dragging {
          border-color: var(--rust);
          background: rgba(184, 92, 60, 0.05);
        }

        .upload-zone p {
          font-size: 14px;
          color: var(--warm-gray);
        }

        .submit-button {
          width: calc(100% - 40px);
          margin: 0 20px 20px;
          padding: 14px 24px;
          font-size: 15px;
          font-weight: 500;
          font-family: inherit;
          color: white;
          background: var(--rust);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: var(--rust-dark);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Error Message */
        .error-message {
          padding: 16px;
          margin-bottom: 24px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 8px;
          color: #DC2626;
          font-size: 14px;
        }

        /* Example Card */
        .example-card {
          background: linear-gradient(135deg, var(--paper) 0%, var(--cream) 100%);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          padding: 24px;
        }

        .example-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--warm-gray);
        }

        .example-input {
          margin: 16px 0;
          padding: 12px 16px;
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 6px;
        }

        .example-input p {
          font-size: 14px;
          font-style: italic;
          color: var(--charcoal);
        }

        .example-output {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .example-output p {
          font-size: 16px;
          line-height: 1.65;
          color: var(--charcoal);
        }

        /* Results */
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
          animation: fadeIn 0.4s ease;
        }

        /* Source Preview */
        .source-preview {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: var(--paper);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
        }

        .source-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--cream);
        }

        .source-image.wide {
          width: 128px;
          height: 80px;
        }

        .source-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .source-info {
          flex: 1;
          min-width: 0;
        }

        .source-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .source-channel {
          font-size: 12px;
          color: var(--warm-gray);
          margin-bottom: 4px;
        }

        .source-link {
          font-size: 12px;
          color: var(--rust);
          text-decoration: none;
        }

        .source-link:hover {
          text-decoration: underline;
        }

        /* Section Styling */
        .section-title {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--warm-gray);
          margin-bottom: 8px;
        }

        .section-divider {
          width: 40px;
          height: 2px;
          background: var(--rust);
          margin-bottom: 20px;
        }

        /* Reframe Section */
        .reframe-section {
          background: var(--paper);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          padding: 24px;
        }

        .surface-text {
          font-size: 15px;
          color: var(--warm-gray);
          margin-bottom: 12px;
        }

        .reframe-text {
          font-size: 20px;
          line-height: 1.6;
          color: var(--ink);
        }

        /* Angles Section */
        .angles-section {
          background: var(--paper);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          padding: 24px;
        }

        .angles-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Angle Card */
        .angle-card {
          background: var(--cream);
          border: 1px solid rgba(0,0,0,0.04);
          border-radius: 10px;
          overflow: hidden;
          transition: box-shadow 0.2s ease;
        }

        .angle-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }

        .angle-header {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          cursor: pointer;
          gap: 12px;
        }

        .angle-number {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: var(--rust);
          background: rgba(184, 92, 60, 0.1);
          padding: 6px 10px;
          border-radius: 6px;
          font-weight: 600;
        }

        .angle-title {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--ink);
        }

        .angle-chevron {
          transition: transform 0.2s ease;
        }

        .angle-chevron.rotated {
          transform: rotate(180deg);
        }

        .angle-content {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease;
        }

        .angle-content.expanded {
          grid-template-rows: 1fr;
        }

        .angle-content-inner {
          overflow: hidden;
          padding: 0 20px;
        }

        .angle-content.expanded .angle-content-inner {
          padding: 0 20px 20px;
          border-top: 1px solid rgba(0,0,0,0.04);
          padding-top: 16px;
        }

        .angle-summary {
          font-size: 16px;
          line-height: 1.6;
          color: var(--charcoal);
          margin-bottom: 20px;
        }

        .comparison-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 600px) {
          .comparison-row {
            grid-template-columns: 1fr;
          }
        }

        .comparison-card {
          background: var(--paper);
          border-radius: 8px;
          padding: 16px;
        }

        .comparison-card.ancestral {
          border-left: 3px solid var(--sage);
        }

        .comparison-card.modern {
          border-left: 3px solid var(--rust);
        }

        .comparison-image {
          width: 100%;
          aspect-ratio: 16/10;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 12px;
          cursor: pointer;
          background: var(--cream);
        }

        .comparison-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s ease;
        }

        .comparison-image:hover img {
          transform: scale(1.03);
        }

        .comparison-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--warm-gray);
          margin-bottom: 8px;
          display: block;
        }

        .comparison-text {
          font-size: 14px;
          line-height: 1.55;
          color: var(--charcoal);
        }

        /* Image Section */
        .image-section {
          margin-top: 8px;
        }

        .image-section-title {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--warm-gray);
          margin-bottom: 16px;
          padding-left: 4px;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        @media (max-width: 900px) {
          .image-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 600px) {
          .image-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .image-tile {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          background: var(--cream);
        }

        .image-tile:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .image-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-tile-number {
          position: absolute;
          top: 8px;
          left: 8px;
          background: var(--rust);
          color: white;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 6px;
          border-radius: 4px;
        }

        .image-tile-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          padding: 24px 10px 10px;
        }

        .image-tile-title {
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          line-height: 1.3;
        }

        .image-tile-actions {
          position: absolute;
          top: 8px;
          right: 8px;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .image-tile:hover .image-tile-actions {
          opacity: 1;
        }

        .image-tile-actions button {
          padding: 6px;
          background: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Share Section */
        .share-section {
          background: var(--paper);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          padding: 24px;
        }

        .share-preview {
          position: relative;
          background: var(--cream);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          min-height: 80px;
        }

        .share-loading {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .share-text {
          font-size: 15px;
          line-height: 1.65;
          color: var(--charcoal);
          white-space: pre-wrap;
        }

        .share-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .length-toggle {
          display: flex;
          background: var(--cream);
          border-radius: 8px;
          padding: 4px;
        }

        .length-option {
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          color: var(--warm-gray);
          background: transparent;
        }

        .length-option:hover {
          color: var(--charcoal);
        }

        .length-option.active {
          background: white;
          color: var(--ink);
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        .share-buttons {
          display: flex;
          gap: 8px;
        }

        .copy-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          color: white;
          background: var(--rust);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .copy-button:hover {
          background: var(--rust-dark);
        }

        .copy-button.copied {
          background: var(--sage);
        }

        .regen-button {
          padding: 12px;
          background: var(--cream);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .regen-button:hover:not(:disabled) {
          background: white;
          border-color: var(--rust-light);
        }

        .regen-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Follow-up Section */
        .followup-section {
          display: flex;
          gap: 12px;
          background: var(--paper);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          padding: 16px;
        }

        .followup-input {
          flex: 1;
          padding: 12px 16px;
          font-size: 14px;
          font-family: inherit;
          color: var(--ink);
          background: var(--cream);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 8px;
          transition: border-color 0.15s ease;
        }

        .followup-input:focus {
          outline: none;
          border-color: var(--rust);
        }

        .followup-input::placeholder {
          color: var(--warm-gray);
        }

        .followup-button {
          padding: 12px 20px;
          font-size: 18px;
          color: white;
          background: var(--rust);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .followup-button:hover:not(:disabled) {
          background: var(--rust-dark);
        }

        .followup-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .modal-content {
          position: relative;
          max-width: 640px;
          width: 100%;
          background: white;
          border-radius: 12px;
          overflow: hidden;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          z-index: 10;
          transition: all 0.15s ease;
        }

        .modal-close:hover {
          border-color: var(--rust);
          color: var(--rust);
        }

        .modal-image {
          width: 100%;
          display: block;
        }

        .modal-info {
          padding: 16px;
        }

        .modal-reason {
          font-size: 14px;
          color: var(--charcoal);
          margin-bottom: 16px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .modal-copy-btn, .modal-download-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .modal-copy-btn {
          color: white;
          background: var(--rust);
          border: none;
        }

        .modal-copy-btn:hover {
          background: var(--rust-dark);
        }

        .modal-download-btn {
          color: var(--ink);
          background: var(--cream);
          border: 1px solid rgba(0,0,0,0.08);
        }

        .modal-download-btn:hover {
          background: var(--paper);
        }

        /* History Panel */
        .history-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(0,0,0,0.5);
        }

        .history-panel {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          max-width: 400px;
          background: white;
          border-left: 1px solid rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
        }

        .history-panel-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .history-panel-header h2 {
          font-size: 18px;
          font-weight: 600;
        }

        .history-panel-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .clear-history-btn {
          font-size: 12px;
          color: var(--warm-gray);
          background: none;
          border: none;
          cursor: pointer;
        }

        .clear-history-btn:hover {
          color: #DC2626;
        }

        .close-history-btn {
          font-size: 16px;
          color: var(--warm-gray);
          background: none;
          border: none;
          cursor: pointer;
        }

        .close-history-btn:hover {
          color: var(--ink);
        }

        .history-list {
          flex: 1;
          overflow-y: auto;
        }

        .history-empty {
          padding: 48px 24px;
          text-align: center;
          color: var(--warm-gray);
        }

        .history-empty p {
          margin-top: 8px;
        }

        .history-item {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          cursor: pointer;
          transition: background 0.15s ease;
          display: flex;
          gap: 12px;
        }

        .history-item:hover {
          background: var(--cream);
        }

        .history-item-content {
          flex: 1;
          min-width: 0;
        }

        .history-item-text {
          font-size: 14px;
          color: var(--ink);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .history-item-time {
          font-size: 12px;
          color: var(--warm-gray);
        }

        .history-item-delete {
          opacity: 0;
          color: var(--warm-gray);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          transition: opacity 0.15s ease;
        }

        .history-item:hover .history-item-delete {
          opacity: 1;
        }

        .history-item-delete:hover {
          color: #DC2626;
        }

        .history-item-thumb {
          width: 48px;
          height: 48px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--cream);
        }

        .history-item-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Toast */
        .toast {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 24px;
          background: white;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 100;
          animation: slideUp 0.3s ease;
        }

        /* Utility */
        .hidden {
          display: none;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </main>
  );
}

// Icons
function Spinner() {
  return <span style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></span>;
}

function UploadIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B85C3C" strokeWidth="1.5">
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

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
