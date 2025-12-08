"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Navigation from "@/components/Navigation";

interface Chapter {
  id: string;
  part: string;
  title: string;
  content: string;
  infographic: string;
}

const CHAPTERS: Omit<Chapter, "content">[] = [
  { id: "part-i", part: "I", title: "The Pattern", infographic: "pt1.jpeg" },
  { id: "part-ii", part: "II", title: "The Machine", infographic: "pt2.jpeg" },
  { id: "part-iii", part: "III", title: "The Spec Sheet", infographic: "pt3.jpeg" },
  { id: "part-iv", part: "IV", title: "The Violations", infographic: "pt4.jpeg" },
  { id: "part-v", part: "V", title: "The Cascades", infographic: "pt5.jpeg" },
  { id: "part-vi", part: "VI", title: "The Misdiagnosis", infographic: "pt6.jpeg" },
  { id: "part-vii", part: "VII", title: "The Constraints", infographic: "pt7.jpeg" },
  { id: "part-viii", part: "VIII", title: "The Destination", infographic: "pt8.jpeg" },
  { id: "part-ix", part: "IX", title: "Honest Uncertainty", infographic: "pt9.jpeg" },
];

const INFOGRAPHIC_BASE = "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/infographics/";
const FRAMEWORK_URL = "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/mothership-full.md";

export default function FrameworkPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapter, setActiveChapter] = useState<string>("part-i");
  const [isLoading, setIsLoading] = useState(true);
  const [showIndex, setShowIndex] = useState(false);
  const [noteOnEvidence, setNoteOnEvidence] = useState<string>("");
  const chapterRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch(FRAMEWORK_URL);
        const text = await response.text();

        // Parse chapters from markdown
        const parsedChapters = parseChapters(text);
        setChapters(parsedChapters);

        // Extract "A Note on Evidence" section
        const noteMatch = text.match(/## A Note on Evidence[\s\S]*?(?=## Part I|$)/i);
        if (noteMatch) {
          setNoteOnEvidence(noteMatch[0]);
        }
      } catch (error) {
        console.error("Failed to fetch framework content:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContent();
  }, []);

  // Track scroll position to update active chapter
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const chapter of CHAPTERS) {
        const element = chapterRefs.current[chapter.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveChapter(chapter.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash navigation
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.slice(1);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, [chapters]);

  const parseChapters = (markdown: string): Chapter[] => {
    const result: Chapter[] = [];

    for (const chapterMeta of CHAPTERS) {
      // Match the chapter heading and its content
      const partRegex = new RegExp(
        `## Part ${chapterMeta.part}[:\\s]+${chapterMeta.title}([\\s\\S]*?)(?=## Part [IVX]+|## A Note|$)`,
        "i"
      );
      const match = markdown.match(partRegex);

      if (match) {
        result.push({
          ...chapterMeta,
          content: match[1].trim(),
        });
      } else {
        // Fallback: try simpler pattern
        const simpleRegex = new RegExp(
          `## Part ${chapterMeta.part}[^\\n]*\\n([\\s\\S]*?)(?=## Part [IVX]+|## A Note|$)`,
          "i"
        );
        const simpleMatch = markdown.match(simpleRegex);
        result.push({
          ...chapterMeta,
          content: simpleMatch ? simpleMatch[1].trim() : "",
        });
      }
    }

    return result;
  };

  const scrollToChapter = (chapterId: string) => {
    const element = document.getElementById(chapterId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setShowIndex(false);
  };

  const downloadImage = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create canvas for watermark
      const img = new Image();
      img.crossOrigin = "anonymous";

      return new Promise<void>((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.drawImage(img, 0, 0);

          // Add watermark
          const watermarkText = "demismatch.com";
          const fontSize = Math.max(16, img.width / 40);
          ctx.font = `${fontSize}px sans-serif`;
          ctx.textBaseline = "bottom";
          ctx.textAlign = "right";

          const padding = 15;
          const textWidth = ctx.measureText(watermarkText).width;

          ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
          ctx.fillRect(
            img.width - textWidth - padding * 2,
            img.height - fontSize - padding * 2,
            textWidth + padding * 2,
            fontSize + padding * 2
          );

          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.fillText(watermarkText, img.width - padding, img.height - padding);

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${title.replace(/[^a-z0-9]/gi, "_")}_demismatch.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
            resolve();
          }, "image/png");
        };
        img.src = URL.createObjectURL(blob);
      });
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#ff3d00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#a3a3a3]">Loading framework...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />

      {/* Chapter Navigation Sidebar (desktop) */}
      <aside className="hidden lg:block fixed left-0 top-[73px] bottom-0 w-64 border-r border-[#1a1a1a] bg-[#0a0a0a] overflow-y-auto z-30">
        <div className="p-6">
          <h2 className="text-xs font-bold tracking-[0.15em] text-[#666] uppercase mb-4">
            Chapters
          </h2>
          <nav className="space-y-1">
            {CHAPTERS.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => scrollToChapter(chapter.id)}
                className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  activeChapter === chapter.id
                    ? "bg-[#ff3d00]/10 text-[#ff3d00] font-medium"
                    : "text-[#a3a3a3] hover:bg-[#1a1a1a]"
                }`}
              >
                <span className="text-xs text-[#666] mr-2">Part {chapter.part}</span>
                {chapter.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Chapter Toggle */}
      <button
        onClick={() => setShowIndex(!showIndex)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#ff3d00] text-white rounded-full shadow-lg flex items-center justify-center"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile Chapter Index */}
      {showIndex && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/80" onClick={() => setShowIndex(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#0f0f0f] rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-white mb-4">From Mismatch to Baseline</h2>
            <nav className="space-y-2">
              {CHAPTERS.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => scrollToChapter(chapter.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeChapter === chapter.id
                      ? "bg-[#ff3d00] text-white"
                      : "bg-[#1a1a1a] text-white border border-[#333]"
                  }`}
                >
                  <span className="text-xs opacity-70 mr-2">Part {chapter.part}</span>
                  {chapter.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64 pt-20">
        {/* Hero */}
        <header className="px-6 py-16 text-center border-b border-[#1a1a1a]">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            From Mismatch to Baseline
          </h1>
          <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto">
            A framework for understanding why modern life makes us suffer, and what we can actually do about it.
          </p>
        </header>

        {/* Note on Evidence (collapsible) */}
        {noteOnEvidence && (
          <details className="mx-auto max-w-3xl px-6 py-8 border-b border-[#1a1a1a]">
            <summary className="cursor-pointer text-sm font-medium text-[#666] hover:text-[#ff3d00]">
              A Note on Evidence
            </summary>
            <div className="mt-4 prose prose-invert prose-sm max-w-none text-[#a3a3a3]">
              <ReactMarkdown>{noteOnEvidence.replace(/## A Note on Evidence/i, "")}</ReactMarkdown>
            </div>
          </details>
        )}

        {/* Chapters */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          {chapters.map((chapter, index) => (
            <section
              key={chapter.id}
              id={chapter.id}
              ref={(el) => { chapterRefs.current[chapter.id] = el; }}
              className="mb-24"
            >
              {/* Chapter Header */}
              <div className="mb-8">
                <span className="text-sm font-medium text-[#ff3d00] tracking-wide">
                  Part {chapter.part}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-1">
                  {chapter.title}
                </h2>
              </div>

              {/* Infographic */}
              <div className="mb-8 relative group">
                <img
                  src={`${INFOGRAPHIC_BASE}${chapter.infographic}`}
                  alt={`Part ${chapter.part}: ${chapter.title}`}
                  className="w-full rounded-lg"
                />
                <button
                  onClick={() => downloadImage(`${INFOGRAPHIC_BASE}${chapter.infographic}`, `Part_${chapter.part}_${chapter.title}`)}
                  className="absolute bottom-4 right-4 px-4 py-2 bg-black/80 hover:bg-black rounded-lg text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </button>
              </div>

              {/* Chapter Content */}
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold text-white mt-8 mb-4">{children}</h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg font-bold text-white mt-6 mb-3">{children}</h4>
                    ),
                    p: ({ children }) => (
                      <p className="text-[#a3a3a3] leading-relaxed mb-4">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-[#a3a3a3]">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-[#a3a3a3]">{children}</ol>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#ff3d00] pl-4 my-6 italic text-[#666]">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-white">{children}</strong>
                    ),
                  }}
                >
                  {chapter.content}
                </ReactMarkdown>
              </div>

              {/* Chapter Navigation */}
              <div className="mt-12 pt-8 border-t border-[#1a1a1a] flex justify-between">
                {index > 0 && (
                  <button
                    onClick={() => scrollToChapter(CHAPTERS[index - 1].id)}
                    className="text-sm text-[#a3a3a3] hover:text-[#ff3d00] flex items-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Part {CHAPTERS[index - 1].part}: {CHAPTERS[index - 1].title}
                  </button>
                )}
                <div className="flex-1" />
                {index < CHAPTERS.length - 1 && (
                  <button
                    onClick={() => scrollToChapter(CHAPTERS[index + 1].id)}
                    className="text-sm text-[#a3a3a3] hover:text-[#ff3d00] flex items-center gap-2"
                  >
                    Part {CHAPTERS[index + 1].part}: {CHAPTERS[index + 1].title}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Footer CTA */}
        <section className="py-16 px-6 bg-[#0f0f0f] border-t border-[#1a1a1a]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Finished reading?</h2>
            <p className="text-[#a3a3a3] mb-8">
              Put it into practice. Or explore the research behind the framework.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/app"
                className="px-8 py-4 bg-[#ff3d00] text-white font-semibold tracking-wide hover:bg-[#e63600] transition-colors"
              >
                TRY THE ANALYZER
              </Link>
              <Link
                href="/sources"
                className="px-8 py-4 border border-[#333] text-white font-semibold tracking-wide hover:bg-[#1a1a1a] transition-colors"
              >
                VIEW SOURCES
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <Link href="/" className="text-2xl font-bold tracking-[0.2em] text-white hover:text-[#ff3d00] transition-colors">
                  DEMISMATCH
                </Link>
                <p className="text-[#666] mt-2 text-sm">
                  Understanding the gap between evolved needs and modern reality.
                </p>
              </div>
              <div className="flex flex-wrap gap-8">
                <Link href="/framework" className="text-[#ff3d00]">
                  Framework
                </Link>
                <Link href="/builders" className="text-[#a3a3a3] hover:text-white transition-colors">
                  For Builders
                </Link>
                <Link href="/foryou" className="text-[#a3a3a3] hover:text-white transition-colors">
                  For You
                </Link>
                <Link href="/projects" className="text-[#a3a3a3] hover:text-white transition-colors">
                  Projects
                </Link>
                <Link href="/sources" className="text-[#a3a3a3] hover:text-white transition-colors">
                  Sources
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
