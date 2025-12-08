"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Navigation from "@/components/Navigation";

const SOURCES_URL = "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/sources.md";

export default function SourcesPage() {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch(SOURCES_URL);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error("Failed to fetch sources:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#ff3d00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#a3a3a3]">Loading sources...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />

      {/* Content */}
      <div className="pt-20 pb-16">
        <header className="px-6 py-16 text-center border-b border-[#1a1a1a]">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Sources & Research</h1>
          <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto">
            The research, books, and studies behind the mismatch framework.
            We stand on the shoulders of decades of scientific inquiry.
          </p>
        </header>

        <article className="max-w-3xl mx-auto px-6 py-12">
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-white mt-12 mb-6 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-white mt-10 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-white mt-8 mb-3">{children}</h3>
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
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff3d00] hover:underline"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#ff3d00] pl-4 my-6 italic text-[#666]">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-white">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
                hr: () => (
                  <hr className="my-8 border-[#1a1a1a]" />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Back to Framework */}
        <div className="text-center py-8 border-t border-[#1a1a1a]">
          <Link
            href="/framework"
            className="inline-flex items-center gap-2 text-[#ff3d00] font-medium hover:underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Framework
          </Link>
        </div>
      </div>

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
              <Link href="/framework" className="text-[#a3a3a3] hover:text-white transition-colors">
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
              <Link href="/sources" className="text-[#ff3d00]">
                Sources
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
