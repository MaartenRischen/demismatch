"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";

// News categories
const CATEGORIES = [
  { id: "all", name: "All", color: "#1a1a1a" },
  { id: "ai-tech", name: "AI/Tech", color: "#7c3aed" },
  { id: "policy", name: "Policy", color: "#0891b2" },
  { id: "mental-health", name: "Mental Health", color: "#be185d" },
  { id: "institutional", name: "Institutional Failure", color: "#dc2626" },
];

interface NewsArticle {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  readTime: string;
  source?: {
    name: string;
    url: string;
  };
}

// News articles data - newest first
export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: "china-ai-companion-regulations",
    title: "China's AI Companion Law: The First Government to Say the Quiet Part Loud",
    date: "2025-12-31",
    category: "policy",
    tags: ["AI/Tech", "Policy", "Regulation", "China", "Mental Health", "Loneliness Crisis"],
    excerpt: "China's internet regulator just released draft rules specifically targeting AI emotional companions — the first major government framework acknowledging that AI-human parasocial relationships constitute genuine harm requiring intervention.",
    readTime: "8 min",
    source: {
      name: "Cyberspace Administration of China",
      url: "https://www.cac.gov.cn/2025-12/27/c_1768571207311996.htm"
    }
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getCategoryColor(categoryId: string): string {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category?.color || "#1a1a1a";
}

function getCategoryName(categoryId: string): string {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category?.name || categoryId;
}

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-20">
      <Navigation />

      {/* Header */}
      <header className="py-16 md:py-20 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Signals
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            News Through the Mismatch Lens
          </h1>
          <p
            className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Current events analyzed through the DEMISMATCH framework. Not just what's happening — why it matters for the species-environment gap.
          </p>
        </div>
      </header>

      {/* Articles Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-8">

          {/* Articles List */}
          <div className="space-y-8">
            {NEWS_ARTICLES.map((article) => (
              <article
                key={article.slug}
                className="border-b border-[#E5E0D8] pb-8 last:border-b-0"
              >
                <Link href={`/news/${article.slug}`} className="block group">
                  {/* Category & Date */}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-2 py-1"
                      style={{
                        backgroundColor: `${getCategoryColor(article.category)}15`,
                        color: getCategoryColor(article.category)
                      }}
                    >
                      {getCategoryName(article.category)}
                    </span>
                    <span className="text-sm text-[#8B8B8B]">
                      {formatDate(article.date)}
                    </span>
                    <span className="text-sm text-[#8B8B8B]">
                      · {article.readTime} read
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-xl md:text-2xl text-[#1A1A1A] leading-tight mb-3 group-hover:text-[#C75B39] transition-colors"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  <p
                    className="text-[#4A4A4A] leading-relaxed mb-4"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {article.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-[#6A6A6A] bg-[#F0EDE6] px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Source attribution */}
                  {article.source && (
                    <p className="text-xs text-[#8B8B8B] mt-3">
                      Source: {article.source.name}
                    </p>
                  )}
                </Link>
              </article>
            ))}
          </div>

          {/* Empty state for when there are no articles */}
          {NEWS_ARTICLES.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#8B8B8B] text-lg">No articles yet. Check back soon.</p>
            </div>
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[#F5F3EF]">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl text-[#1A1A1A] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            News vs. Case Studies
          </h2>
          <p
            className="text-[#4A4A4A] leading-relaxed mb-6"
            style={{ fontFamily: "Georgia, serif" }}
          >
            <strong>News</strong> tracks current events through the mismatch lens — real-time pattern recognition. <strong>Case Studies</strong> are deep-dive analyses of specific instances where mismatch caused harm.
          </p>
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 text-[#C75B39] hover:text-[#A84A2D] font-medium transition-colors"
          >
            Browse Case Studies
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
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
