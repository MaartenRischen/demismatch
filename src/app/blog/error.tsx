"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-20">
      <Navigation />

      {/* Hero Header */}
      <header className="py-16 md:py-20 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Writing
          </p>
          <h1
            className="text-3xl md:text-5xl text-white leading-[1.1] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Blog
          </h1>
          <p
            className="text-lg text-white/80"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Thoughts on evolutionary mismatch, technology, and reclaiming what makes us human.
          </p>
        </div>
      </header>

      {/* Error State */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C75B39]/10 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C75B39"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2
            className="text-2xl text-[#1A1A1A] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Unable to load blog posts
          </h2>
          <p
            className="text-[#4A4A4A] max-w-md mx-auto mb-8"
            style={{ fontFamily: "Georgia, serif" }}
          >
            We're having trouble fetching the latest posts. Please try again.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-[#C75B39] text-white px-6 py-3 font-medium hover:bg-[#A84A2D] transition-colors"
            >
              Try again
            </button>
            <a
              href="https://medium.com/@demismatch"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#C75B39] text-[#C75B39] px-6 py-3 font-medium hover:bg-[#C75B39]/10 transition-colors"
            >
              Visit Medium
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-white/60 text-sm">
            DEMISMATCH — Restore baseline first. Then augment.
          </p>
        </div>
      </footer>
    </main>
  );
}
