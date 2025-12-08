import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-8">
            Projects
          </h1>
          <p className="text-xl md:text-2xl text-[#a3a3a3] leading-relaxed max-w-3xl">
            Tools for applying the mismatch framework. See the pattern everywhere.
            Stop being played.
          </p>
        </div>
      </section>

      {/* Main Projects */}
      <section className="py-20 px-6 bg-[#0f0f0f]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Analyzer */}
            <Link
              href="/app"
              className="group p-10 bg-[#1a1a1a] border border-[#333] hover:border-[#ff3d00] transition-all"
            >
              <div className="w-16 h-16 border border-[#ff3d00] flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff3d00" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4 group-hover:text-[#ff3d00] transition-colors">
                Mismatch Analyzer
              </h2>
              <p className="text-[#a3a3a3] mb-6 text-lg">
                Paste any content - articles, social media, advice, news - and see it
                through the mismatch lens. Understand what&apos;s really happening.
              </p>
              <ul className="space-y-3 text-[#666]">
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  Analyze text, URLs, YouTube videos, screenshots
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  See who benefits from your attention
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  Get actionable alternatives
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  Generate shareable insights
                </li>
              </ul>
              <div className="mt-8 text-[#ff3d00] font-semibold tracking-wide flex items-center gap-2">
                OPEN ANALYZER
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Library */}
            <Link
              href="/library"
              className="group p-10 bg-[#1a1a1a] border border-[#333] hover:border-[#ff3d00] transition-all"
            >
              <div className="w-16 h-16 border border-[#ff3d00] flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff3d00" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4 group-hover:text-[#ff3d00] transition-colors">
                Image Library
              </h2>
              <p className="text-[#a3a3a3] mb-6 text-lg">
                Browse and search visual explanations of mismatch concepts.
                Use them to share the framework with others.
              </p>
              <ul className="space-y-3 text-[#666]">
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  Hundreds of illustrations
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  Semantic search by concept
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  Copy or download with attribution
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  Organized by category
                </li>
              </ul>
              <div className="mt-8 text-[#ff3d00] font-semibold tracking-wide flex items-center gap-2">
                BROWSE LIBRARY
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            How to Use These Tools
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 border border-[#ff3d00] flex items-center justify-center flex-shrink-0">
                <span className="text-[#ff3d00] font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">See Content Differently</h3>
                <p className="text-[#a3a3a3]">
                  Run anything through the Analyzer. That viral tweet. That self-help article.
                  That ad. See who benefits and what&apos;s actually being sold.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 border border-[#ff3d00] flex items-center justify-center flex-shrink-0">
                <span className="text-[#ff3d00] font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Learn the Patterns</h3>
                <p className="text-[#a3a3a3]">
                  Browse the Library to see mismatch dynamics visualized. The same patterns
                  repeat everywhere once you know what to look for.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 border border-[#ff3d00] flex items-center justify-center flex-shrink-0">
                <span className="text-[#ff3d00] font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Share the Framework</h3>
                <p className="text-[#a3a3a3]">
                  Use the analysis and images to help others see through the same lens.
                  Not to convert - to equip.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 border border-[#ff3d00] flex items-center justify-center flex-shrink-0">
                <span className="text-[#ff3d00] font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Take Real Action</h3>
                <p className="text-[#a3a3a3]">
                  Don&apos;t get stuck in analysis. Use the insights to make actual changes.
                  Close the app and go do something in the physical world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="py-20 px-6 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 border border-[#ff3d00]">
            <h2 className="text-2xl font-bold mb-4 text-[#ff3d00]">
              A Note on These Tools
            </h2>
            <p className="text-[#a3a3a3] mb-4">
              These tools are themselves potential mismatch traps. If you find yourself
              spending hours analyzing content instead of changing your environment,
              that&apos;s the mismatch at work.
            </p>
            <p className="text-white">
              Use them for insight. Then act. The goal is less screen time, not more.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Understand the Framework First
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-10">
            These tools are more powerful when you understand the underlying theory.
            Read the full framework to get the most out of them.
          </p>
          <Link
            href="/framework"
            className="inline-block px-8 py-4 bg-[#ff3d00] text-white font-semibold tracking-wide hover:bg-[#e63600] transition-colors"
          >
            READ THE FRAMEWORK
          </Link>
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
              <Link href="/framework" className="text-[#a3a3a3] hover:text-white transition-colors">
                Framework
              </Link>
              <Link href="/builders" className="text-[#a3a3a3] hover:text-white transition-colors">
                For Builders
              </Link>
              <Link href="/foryou" className="text-[#a3a3a3] hover:text-white transition-colors">
                For You
              </Link>
              <Link href="/projects" className="text-[#ff3d00]">
                Projects
              </Link>
              <Link href="/sources" className="text-[#a3a3a3] hover:text-white transition-colors">
                Sources
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
