import Link from "next/link";
import Navigation from "@/components/Navigation";

const IMAGE_BASE = "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/";

// Sample library images to showcase
const SAMPLE_IMAGES = [
  "1_Fish_on_Land__Hero_Metaphor_.png",
  "9_Signals_Not_Symptoms__4-Panel_Grid_.png",
  "27_Dunbar_Layers_Detailed.png",
  "15_Fire_Circle_vs_Modern_Evening.png",
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white pt-20">
      <Navigation />

      {/* Hero Header */}
      <header className="px-6 md:px-8 pt-12 pb-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-6 mb-2">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Building the Good Singularity
          </h1>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 pb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>2 Live • 1 Beta • 1 Research • 4 In Development</span>
          </div>
        </div>
        <p className="text-lg text-gray-400 max-w-xl mb-6">
          Technology that serves human nature. Use these, learn from them, build better ones.
        </p>
        <p className="text-gray-300 max-w-3xl leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
          The same capabilities creating mismatch can serve de-mismatching when designed against the constraints. These projects are prototypes for the technological future — AI that forms tribes instead of exploiting loneliness, tools that create closure instead of infinite scroll, systems that enhance human capability from a foundation of thriving.
        </p>
      </header>

      {/* Early Research Section - Flagship */}
      <section className="px-6 md:px-8 pb-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400">Early Research</h2>
          <div className="flex-1 h-px bg-purple-400/20"></div>
        </div>

        {/* AI Tribe Matcher - Flagship */}
        <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#2d1f4e] via-[#1a1a2e] to-[#0d0d1a] border border-purple-500/30 hover:border-purple-400/50 transition-all">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 grid md:grid-cols-12 gap-6 p-6 md:p-8">
            {/* Left - Logo & Badges */}
            <div className="md:col-span-3 flex flex-col items-center md:items-start">
              <div className="relative mb-4">
                <img
                  src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/icons/tribematcherlogo.png"
                  alt="AI Tribe Matcher"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg shadow-purple-500/20"
                />
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse">
                  New
                </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full uppercase tracking-wider">
                  Early Research
                </span>
              </div>
            </div>

            {/* Right - Content */}
            <div className="md:col-span-9">
              <h3 className="text-2xl md:text-3xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                AI Tribe Matcher
              </h3>
              <p className="text-lg text-purple-300 mb-4" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Your LLM knows you. Let it find your tribe.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                The first matching system designed for tribe formation, not dating. Your AI has years of intimate conversation data—who you actually are, not who you perform on profiles. With consent, LLMs communicate to find people who would form functional tribes together.
              </p>

              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span> Matches tribes, not pairs
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span> Pair bonds search merged or not at all
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span> Cross-platform from day one
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span> Language barriers dissolved
                </li>
                <li className="flex items-center gap-2 text-gray-300 sm:col-span-2">
                  <span className="text-purple-400">✓</span> Optimizes for EEA-spec tribal function
                </li>
              </ul>

              <div className="flex flex-wrap gap-3">
                <button className="bg-purple-500 hover:bg-purple-400 text-white px-5 py-2.5 rounded-lg font-medium transition">
                  Read Working Document →
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg font-medium transition border border-white/20">
                  Get notified →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="px-6 md:px-8 pb-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Live & In Development</h2>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">

          {/* The Mismatch Analyzer - Featured */}
          <Link 
            href="/app" 
            className="group relative col-span-1 md:col-span-2 row-span-2 rounded-2xl overflow-hidden bg-gradient-to-br from-[#c75b3a] to-[#8b3d26] transition-transform hover:scale-[1.01]"
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <img
              src={`${IMAGE_BASE}Mismatch analyzer.png`}
              alt="Mismatch Analyzer"
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
            <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    Live
                  </span>
                  <span className="text-white/70 text-sm">AI-Powered</span>
                </div>
                <h2 className="text-3xl md:text-4xl text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  The Mismatch Analyzer
                </h2>
                <p className="text-white/80 text-lg max-w-lg">
                  AI that's internalized the spec sheet for human nature. Analyze any situation, design, or technology through the evolutionary lens. See exploitation patterns. Find intervention points. The first step toward AI that understands humans.
                </p>
              </div>
              <div className="flex items-end justify-between">
                <ul className="text-white/70 text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span> Analyzes exploitation patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span> Suggests interventions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-white">✓</span> Pulls from 2,500+ images
                  </li>
                </ul>
                <span className="text-white text-2xl group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* Image Library */}
          <Link
            href="/library"
            className="group relative col-span-1 row-span-2 rounded-2xl overflow-hidden bg-[#1a1a1a] border border-gray-800 hover:border-[#c75b3a]/50 transition-all"
          >
            <div className="absolute inset-0">
              <div className="grid grid-cols-2 gap-1 p-1 opacity-60">
                {SAMPLE_IMAGES.map((img, idx) => (
                  <img
                    key={idx}
                    src={`${IMAGE_BASE}${img}`}
                    alt=""
                    className="w-full aspect-square object-cover rounded"
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/80 to-[#1a1a1a]/40"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col p-6">
              {/* Top section */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                  Live
                </span>
                <span className="text-gray-400 text-sm">2,500+ Images</span>
              </div>

              {/* Spacer to push content apart */}
              <div className="flex-1" />

              {/* Bottom section */}
              <div>
                <h3 className="text-2xl text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Image Library
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  2,500+ visualizations of evolutionary psychology concepts. Use them to explain mismatch, design presentations, build understanding. Visual language for the framework.
                </p>
                <span className="text-[#c75b3a] text-sm font-medium group-hover:translate-x-1 inline-block transition-transform">
                  Browse Library →
                </span>
              </div>
            </div>
          </Link>

          {/* HUD Generator - NEW */}
          <div className="group relative col-span-1 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a2f1a] to-[#0d1a0d] border border-emerald-900/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    Beta
                  </span>
                </div>
                <h3 className="text-xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Evolutionary HUD
                </h3>
                <p className="text-gray-400 text-sm">
                  Upload any image. See what your brain is computing beneath conscious awareness — threat assessment, resource detection, status calculation. Making the invisible visible.
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                </div>
                <Link href="/projects/hud/app" className="text-emerald-400 text-sm hover:text-emerald-300 transition">
                  Try →
                </Link>
              </div>
            </div>
          </div>

          {/* Environment Audit */}
          <div className="group relative col-span-1 rounded-2xl overflow-hidden bg-[#1a1a1a] border border-gray-800">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    In Development
                  </span>
                </div>
                <h3 className="text-xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Environment Audit
                </h3>
                <p className="text-gray-500 text-sm">
                  Systematic assessment against the EEA spec sheet. Score your environment on tribal structure, visible purpose, closed loops, circadian alignment. Find your biggest mismatches. Prioritize interventions.
                </p>
              </div>
            </div>
          </div>

          {/* Tribe Formation */}
          <div className="group relative col-span-1 rounded-2xl overflow-hidden bg-[#1a1a1a] border border-gray-800">
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    In Development
                  </span>
                </div>
                <h3 className="text-xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Tribe Formation
                </h3>
                <p className="text-gray-500 text-sm">
                  Infrastructure for Dunbar-scale communities. Compatibility matching based on nervous system regulation, conflict styles, values. Coordination tools. The village matchmaker, digitized — then it gets out of the way.
                </p>
              </div>
              <div className="flex -space-x-2 mt-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#1a1a1a]"></div>
                ))}
                <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#1a1a1a] flex items-center justify-center text-xs text-gray-500">
                  +145
                </div>
              </div>
            </div>
          </div>

          {/* Builder Templates */}
          <div className="group relative col-span-1 rounded-2xl overflow-hidden bg-[#1a1a1a] border border-gray-800">
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    In Development
                  </span>
                </div>
                <h3 className="text-xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Builder Templates
                </h3>
                <p className="text-gray-500 text-sm">
                  Design patterns and checklists for building spec-aligned technology, spaces, and institutions. What does a social platform look like with hard Dunbar limits? A workspace designed for visible contribution? A neighborhood built for fire circles?
                </p>
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="px-2 py-1 bg-gray-800 text-gray-500 text-xs rounded">Tech</span>
                <span className="px-2 py-1 bg-gray-800 text-gray-500 text-xs rounded">Spaces</span>
                <span className="px-2 py-1 bg-gray-800 text-gray-500 text-xs rounded">Policy</span>
              </div>
            </div>
          </div>

          {/* Case Study Database */}
          <div className="group relative col-span-1 rounded-2xl overflow-hidden bg-[#1a1a1a] border border-gray-800">
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    In Development
                  </span>
                </div>
                <h3 className="text-xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Case Study Database
                </h3>
                <p className="text-gray-500 text-sm">
                  Documented examples of de-mismatch interventions — what worked, what failed, and why. Learn from attempts. Don't reinvent mistakes.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4 text-gray-600">
                <span className="flex items-center gap-1 text-xs">
                  <span className="text-emerald-500">●</span> Success
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <span className="text-red-500">●</span> Failed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Build With Us - Compact CTA */}
      <section className="px-6 md:px-8 pb-20 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#c75b3a]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-10">
            <div>
              <h2 className="text-2xl md:text-3xl text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Build With Us
              </h2>
              <p className="text-gray-400 max-w-lg" style={{ fontFamily: 'Georgia, serif' }}>
                The future is being built now. If you're creating technology, spaces, or institutions that serve human nature — we want to know about it. If you need the framework to make the case — use it.
              </p>
            </div>
            <Link 
              href="/app" 
              className="shrink-0 bg-[#c75b3a] text-white px-8 py-4 rounded-xl hover:bg-[#b54d2e] transition font-medium"
            >
              Test Your Idea →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#C75B39] py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <p
            className="text-2xl md:text-3xl text-white mb-6 leading-snug"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The fish doesn't need therapy.<br />
            The fish needs water.
          </p>
          <p className="text-white/60 text-sm">
            demismatch.com
          </p>
        </div>
      </footer>
    </main>
  );
}
