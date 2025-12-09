import Link from "next/link";

const IMAGE_BASE = "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/";

// Sample library images to showcase
const SAMPLE_IMAGES = [
  "1_Fish_on_Land__Hero_Metaphor_.png",
  "9_Signals_Not_Symptoms__4-Panel_Grid_.png",
  "27_Dunbar_Layers_Detailed.png",
  "15_Fire_Circle_vs_Modern_Evening.png",
  "5_Spec_Sheet_Comparison.png",
  "38_The_Exploitation_Players.png",
  "7_Internal_Audience_Illustration.png",
  "8_Open_Loops_Visual.png",
];

const CATEGORIES = [
  "Social Connection",
  "Work & Purpose",
  "Mental/Emotional",
  "Technology",
  "Solutions",
  "Exploitation",
  "Dunbar",
  "Evolution",
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-gray-200">
        <Link href="/" className="text-xl tracking-widest text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
          DEMISMATCH
        </Link>
        <div className="hidden md:flex gap-8 text-sm text-gray-600">
          <Link href="/framework" className="hover:text-gray-900">Framework</Link>
          <Link href="/systems" className="hover:text-gray-900">For Systems</Link>
          <Link href="/practitioners" className="hover:text-gray-900">For Practitioners</Link>
          <Link href="/foryou" className="hover:text-gray-900">For You</Link>
          <Link href="/projects" className="text-gray-900 font-medium">Projects</Link>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
        </div>
      </nav>

      <header className="px-8 py-16 max-w-4xl mx-auto">
        <h1 className="text-5xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Projects</h1>
        <p className="text-xl text-gray-700">
          Tools and resources built on the framework. Use them, learn from them, build better ones.
        </p>
      </header>

      {/* The Mismatch Analyzer - HERO */}
      <section className="px-8 py-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>The Mismatch Analyzer</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">LIVE</span>
            </div>
            <p className="text-xl text-gray-700 mb-6">
              AI that's internalized the entire framework.
            </p>
            
            <img
              src={`${IMAGE_BASE}Mismatch analyzer.png`}
              alt="Mismatch Analyzer preview"
              className="rounded-lg w-full border border-gray-200 mb-6"
            />

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">For Builders:</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#c75b3a] mt-1">•</span>
                    <span>Paste your product spec → see if it exploits or serves</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c75b3a] mt-1">•</span>
                    <span>Describe your community design → check against constraints</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c75b3a] mt-1">•</span>
                    <span>Test any proposal against the spec sheet</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">For Everyone:</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#c75b3a] mt-1">•</span>
                    <span>Paste any article → see the mismatch dynamics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c75b3a] mt-1">•</span>
                    <span>Describe any situation → get framework-grounded insight</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c75b3a] mt-1">•</span>
                    <span>Analyze what you're feeling → see what it's signaling</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What it does:</h3>
            <ul className="text-gray-700 space-y-2 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>Analyzes through evolutionary psychology lens</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>Identifies mismatch patterns and exploitation dynamics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>Suggests environment-level interventions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>Pulls relevant images from 2,500+ library</span>
              </li>
            </ul>

            {/* Sample Analysis */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Sample Analysis</h4>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">INPUT:</p>
                <p className="text-gray-900 bg-white p-3 rounded border border-gray-200">"Instagram's infinite scroll and like counts"</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">OUTPUT:</p>
                <p className="text-gray-700 bg-white p-3 rounded border border-gray-200 text-sm">
                  "Classic exploitation pattern. Targets status drive (likes as proxy for tribal standing). 
                  Blocks genuine satisfaction (strangers, not tribe). Offers proxy that never satisfies 
                  (infinite scroll, no completion). Monetizes return visits through attention economy..."
                </p>
              </div>
            </div>

            <Link href="/app" className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-block">
              Try the Analyzer →
            </Link>
          </div>
        </div>
      </section>

      {/* The Image Library - HERO */}
      <section className="px-8 py-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>The Image Library</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">LIVE</span>
            </div>
            <p className="text-xl text-gray-700 mb-6">
              2,500+ educational images explaining evolutionary psychology, mismatch theory, and human nature.
            </p>
            
            <img
              src={`${IMAGE_BASE}Image Library.png`}
              alt="Image Library preview"
              className="rounded-lg w-full border border-gray-200 mb-6"
            />

            {/* Sample Image Grid */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {SAMPLE_IMAGES.map((img, idx) => (
                <img
                  key={idx}
                  src={`${IMAGE_BASE}${img}`}
                  alt="Library sample"
                  className="rounded-lg w-full aspect-square object-cover"
                />
              ))}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/library?search=${encodeURIComponent(cat)}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition"
                >
                  {cat}
                </Link>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">For Builders:</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#c75b3a] mt-1">•</span>
                    <span>Design inspiration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c75b3a] mt-1">•</span>
                    <span>Visual specs (Dunbar layers, EEA requirements)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c75b3a] mt-1">•</span>
                    <span>Pattern recognition (exploitation vs service)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">For Educators:</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#c75b3a] mt-1">•</span>
                    <span>Ready-made teaching materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c75b3a] mt-1">•</span>
                    <span>Concept visualizations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c75b3a] mt-1">•</span>
                    <span>Shareable graphics</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What's inside:</h3>
            <ul className="text-gray-700 space-y-2 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>Diagrams explaining evolutionary concepts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>Before/after comparisons (EEA vs modern)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>Exploitation pattern breakdowns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>Mismatch visualizations across domains</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>All AI-analyzed and tagged for searchability</span>
              </li>
            </ul>
            <Link href="/library" className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-block">
              Browse the Library →
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Coming Soon</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tribe Formation Tools</h3>
            <p className="text-gray-600">
              Infrastructure for finding and building Dunbar-scale communities. Matching, coordination, and maintenance tools.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Environment Audit</h3>
            <p className="text-gray-600">
              Systematic assessment of your current environment against the EEA spec sheet. Identify your biggest mismatches.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Builder Templates</h3>
            <p className="text-gray-600">
              Design patterns and checklists for building spec-aligned technology, spaces, and institutions.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Case Study Database</h3>
            <p className="text-gray-600">
              Documented examples of successful and failed de-mismatch interventions. Learn from what's been tried.
            </p>
          </div>
        </div>
      </section>

      {/* Build With Us */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <div className="bg-gray-900 text-white rounded-xl p-8">
          <h2 className="text-2xl font-medium mb-4" style={{ fontFamily: 'Georgia, serif' }}>Build With Us</h2>
          <p className="text-lg text-gray-300 mb-4">
            The framework is open. The tools are open. If you're building something that helps humans de-mismatch — technology, spaces, communities, institutions — we want to know about it.
          </p>
          <p className="text-xl text-white font-medium mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            What are you going to build?
          </p>
          <Link href="/app" className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-block">
            Test Your Idea →
          </Link>
        </div>
      </section>

      <footer className="px-8 py-12 border-t border-gray-200 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-8 text-sm text-gray-600 mb-6">
          <Link href="/framework" className="hover:text-gray-900">Framework</Link>
          <Link href="/systems" className="hover:text-gray-900">For Systems</Link>
          <Link href="/practitioners" className="hover:text-gray-900">For Practitioners</Link>
          <Link href="/foryou" className="hover:text-gray-900">For You</Link>
          <Link href="/projects" className="hover:text-gray-900">Projects</Link>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
        </div>
        <p className="text-sm text-gray-500">This framework is open. Fork it, improve it, implement it.</p>
      </footer>
    </main>
  );
}
