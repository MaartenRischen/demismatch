import Link from "next/link";
import Navigation from "@/components/Navigation";

// Types for Medium RSS feed
interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
  categories: string[];
}

// Strip HTML tags and get plain text excerpt
function stripHtml(html: string): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  const decoded = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  // Trim and limit to ~150 chars
  const trimmed = decoded.trim();
  if (trimmed.length <= 150) return trimmed;
  return trimmed.slice(0, 147).trim() + '...';
}

// Parse date string to formatted date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Simple XML parser for Medium RSS feed
function parseRSSFeed(xml: string): MediumPost[] {
  const posts: MediumPost[] = [];

  // Match all <item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    // Extract title
    const titleMatch = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract link
    const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
    const link = linkMatch ? linkMatch[1].trim() : '';

    // Extract pubDate
    const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';

    // Extract content:encoded for excerpt
    const contentMatch = itemContent.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
    const content = contentMatch ? contentMatch[1] : '';
    const excerpt = stripHtml(content);

    // Extract categories
    const categories: string[] = [];
    const categoryRegex = /<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g;
    let categoryMatch;
    while ((categoryMatch = categoryRegex.exec(itemContent)) !== null) {
      categories.push(categoryMatch[1].trim());
    }

    if (title && link) {
      posts.push({ title, link, pubDate, excerpt, categories });
    }
  }

  return posts;
}

// Fetch Medium RSS feed with caching
async function getMediumPosts(): Promise<MediumPost[]> {
  try {
    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch('https://medium.com/feed/@demismatch', {
      next: { revalidate: 3600 }, // Revalidate every hour
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DEMISMATCH/1.0)',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Failed to fetch Medium feed:', response.status);
      return [];
    }

    const xml = await response.text();
    return parseRSSFeed(xml);
  } catch (error) {
    // Handle abort/timeout gracefully
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Medium feed fetch timed out');
    } else {
      console.error('Error fetching Medium feed:', error);
    }
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getMediumPosts();

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

      {/* Blog Posts */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post, index) => (
                <article
                  key={post.link}
                  className="bg-white border border-[#E5E0D8] p-6 md:p-8 rounded-xl hover:border-[#C75B39] transition-all duration-300 hover:shadow-lg"
                >
                  {/* Categories */}
                  {post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.categories.slice(0, 3).map((category) => (
                        <span
                          key={category}
                          className="text-xs font-medium uppercase tracking-wide px-2 py-1 bg-[#C75B39]/10 text-[#C75B39]"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h2
                    className="text-xl md:text-2xl text-[#1A1A1A] leading-tight mb-3 hover:text-[#C75B39] transition-colors"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.title}
                    </a>
                  </h2>

                  {/* Date */}
                  {post.pubDate && (
                    <p className="text-sm text-[#8B8B8B] mb-4">
                      {formatDate(post.pubDate)}
                    </p>
                  )}

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p
                      className="text-[#4A4A4A] leading-relaxed mb-4"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {post.excerpt}
                    </p>
                  )}

                  {/* Read more link */}
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#C75B39] hover:text-[#A84A2D] font-medium transition-colors"
                  >
                    Read on Medium
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
                </article>
              ))}
            </div>
          ) : (
            /* Fallback when no posts */
            <div className="text-center py-16">
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
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
                </svg>
              </div>
              <h2
                className="text-2xl text-[#1A1A1A] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                New writing coming soon
              </h2>
              <p
                className="text-[#4A4A4A] max-w-md mx-auto mb-8"
                style={{ fontFamily: "Georgia, serif" }}
              >
                We're working on new articles exploring evolutionary mismatch and the path forward. Check back soon.
              </p>
              <a
                href="https://medium.com/@demismatch"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C75B39] hover:text-[#A84A2D] font-medium transition-colors"
              >
                Follow on Medium
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
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[#F5F3EF]">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl text-[#1A1A1A] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Explore the Framework
          </h2>
          <p
            className="text-lg text-[#4A4A4A] mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Dive deeper into the science of evolutionary mismatch and discover practical ways to restore balance.
          </p>
          <Link
            href="/framework"
            className="inline-flex items-center gap-2 bg-[#C75B39] text-white px-6 py-3 font-medium hover:bg-[#A84A2D] transition-colors"
          >
            View Framework
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
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
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

export const metadata = {
  title: 'Blog | DEMISMATCH',
  description: 'Thoughts on evolutionary mismatch, technology, and reclaiming what makes us human.',
};
