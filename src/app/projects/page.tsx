import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-gray-200">
        <Link href="/" className="text-xl tracking-widest text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
          DEMISMATCH
        </Link>
        <div className="flex gap-8 text-sm text-gray-600">
          <Link href="/framework" className="hover:text-gray-900">Framework</Link>
          <Link href="/builders" className="hover:text-gray-900">For Builders</Link>
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

      {/* Mismatch Analyzer */}
      <section className="px-8 py-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>The Mismatch Analyzer</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Live</span>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              AI-powered tool that analyzes any situation through the evolutionary mismatch lens. Paste content, describe a situation, or ask a question — get framework-grounded analysis with relevant supporting images from the library.
            </p>
            
            <img
              src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/13_App_Preview___Mismatch_Analyzer.png"
              alt="Mismatch Analyzer preview"
              className="rounded-lg w-full border border-gray-200 mb-6"
            />
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What it does:</h3>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>Analyzes situations through evolutionary psychology lens</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>Identifies mismatch patterns and exploitation dynamics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>Suggests environment-level interventions, not just coping strategies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c75b3a] mt-1">✓</span>
                <span>Pulls relevant images from 2,500+ educational graphics library</span>
              </li>
            </ul>
            <Link href="/app" className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-block">
              Try the Analyzer →
            </Link>
          </div>
        </div>
      </section>

      {/* Image Library */}
      <section className="px-8 py-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>The Image Library</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Live</span>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              2,500+ educational images explaining evolutionary psychology, mismatch theory, and human nature. Searchable, tagged, and free to use. Built to spread understanding.
            </p>
            
            <img
              src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/14_Image_Library_Preview.png"
              alt="Image Library preview"
              className="rounded-lg w-full border border-gray-200 mb-6"
            />
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What's inside:</h3>
            <ul className="text-gray-700 space-y-2 mb-6">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Builder Resources</h3>
            <p className="text-gray-600">
              Templates, checklists, and design patterns for building spec-aligned technology, spaces, and institutions.
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
          <p className="text-gray-400">
            This framework is open. Fork it, improve it, implement it.
          </p>
        </div>
      </section>

      <footer className="px-8 py-12 border-t border-gray-200 max-w-6xl mx-auto">
        <div className="flex gap-8 text-sm text-gray-600 mb-6">
          <Link href="/framework" className="hover:text-gray-900">Framework</Link>
          <Link href="/builders" className="hover:text-gray-900">For Builders</Link>
          <Link href="/foryou" className="hover:text-gray-900">For You</Link>
          <Link href="/projects" className="hover:text-gray-900">Projects</Link>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
        </div>
        <p className="text-sm text-gray-500">This framework is open. Fork it, improve it, implement it.</p>
      </footer>
    </main>
  );
}
