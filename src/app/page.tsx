import Link from "next/link";
import Navigation from "@/components/Navigation";
import DemismatchCarousel from "@/components/DemismatchCarousel";
import CollapsibleAISection from "@/components/CollapsibleAISection";

// Single best image per goal (replacing carousels)
const GOAL_IMAGES = {
  goal1: {
    alt: "THE OUTRAGE HOOK",
    src: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/4_THE_OUTRAGE_HOOK.png",
  },
  goal2: {
    alt: "THE DEBT TRAP",
    src: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/90_THE_DEBT_TRAP.png",
  },
  goal3: {
    alt: "THE AI COMPANION",
    src: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/1_THE_AI_COMPANION.png",
  },
  goal4: {
    alt: "THE BELONGING SIGNALS",
    src: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/74_THE_BELONGING_SIGNALS.png",
  },
  goal5: {
    alt: "THE SKILL SHARING PLATFORM",
    src: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/66_THE_SKILL_SHARING_PLATFORM.png",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6] pt-20">
      <Navigation />

      {/* Hero Section - Fixed metaphor, added CTA */}
      <section className="px-8 py-24 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl text-gray-900 leading-tight mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          Modern civilization is incompatible with human nature.
        </h1>
        <p className="text-xl text-gray-600 mb-3">
          This is not metaphor. This is biology.
        </p>
        <p className="text-xl text-gray-600 mb-3">
          Every condition we call mental illness is the machinery working correctly in the wrong environment. The signals aren't broken — the environment is.
        </p>
        <p className="text-xl text-gray-600 mb-10 font-bold">
          This framework explains the what, the why, and the 'now what?'
        </p>

        {/* Clear CTA */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/framework"
            className="bg-[#c75b3a] text-white px-8 py-4 rounded-lg hover:bg-[#b54d2e] transition text-lg font-medium"
          >
            Explore the Framework
          </Link>
          <Link
            href="/app"
            className="border-2 border-[#c75b3a] text-[#c75b3a] px-8 py-4 rounded-lg hover:bg-[#c75b3a] hover:text-white transition text-lg font-medium"
          >
            Try the Analyzer
          </Link>
        </div>
      </section>

      {/* START HERE - Clear user journey */}
      <section className="px-8 py-16 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <p className="text-[#c75b3a] text-sm uppercase tracking-widest mb-2">New here?</p>
            <h2 className="text-3xl md:text-4xl text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              Start Here
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Three paths to understanding. Pick the one that fits how you learn.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Path 1: Quick Understanding */}
            <Link href="/faq" className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-all">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl text-white font-semibold mb-2 group-hover:text-[#c75b3a] transition-colors">
                5-Minute Overview
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Quick answers to key questions. Perfect if you're short on time.
              </p>
              <span className="text-[#c75b3a] text-sm font-medium">Read the FAQ →</span>
            </Link>

            {/* Path 2: Interactive */}
            <Link href="/app" className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-all">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl text-white font-semibold mb-2 group-hover:text-[#c75b3a] transition-colors">
                Try It Yourself
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Paste any situation into the Analyzer. See the framework in action immediately.
              </p>
              <span className="text-[#c75b3a] text-sm font-medium">Open the Analyzer →</span>
            </Link>

            {/* Path 3: Deep Dive */}
            <Link href="/framework" className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-all">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-xl text-white font-semibold mb-2 group-hover:text-[#c75b3a] transition-colors">
                The Full Framework
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                50,000+ words. 10 parts. The complete theory from first principles.
              </p>
              <span className="text-[#c75b3a] text-sm font-medium">Start reading →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Demismatch First, Then Augment Carousel */}
      <DemismatchCarousel />

      {/* GOALS Section - Single images, no arrows */}
      <section className="relative py-20 bg-gradient-to-r from-[#faf9f6] via-white to-[#faf9f6] border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-4 text-center tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            The Mission
          </h2>
          <p className="text-xl text-gray-500 text-center mb-14 max-w-2xl mx-auto">
            Five objectives. One framework. A different future.
          </p>

          {/* Goal cards - single images, no arrows between */}
          <div className="space-y-6">
            {/* Goal 1 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="relative w-full h-48 md:h-full min-h-[200px] rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={GOAL_IMAGES.goal1.src}
                      alt={GOAL_IMAGES.goal1.alt}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 flex flex-col justify-center">
                  <div className="text-sm font-medium text-[#c75b3a] mb-2">01</div>
                  <h3 className="text-2xl text-gray-900 mb-3 font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                    Establish Evolutionary Mismatch as the Primary Lens
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    For understanding human suffering. Make mismatch theory the default framework for analyzing modern psychological, social, and systemic issues.
                  </p>
                </div>
              </div>
            </div>

            {/* Goal 2 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="relative w-full h-48 md:h-full min-h-[200px] rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={GOAL_IMAGES.goal2.src}
                      alt={GOAL_IMAGES.goal2.alt}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 flex flex-col justify-center">
                  <div className="text-sm font-medium text-[#c75b3a] mb-2">02</div>
                  <h3 className="text-2xl text-gray-900 mb-3 font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                    Expose How Systems Exploit These Mismatches
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Document and reveal the business strategies and political incentives that profit from human suffering caused by mismatch.
                  </p>
                </div>
              </div>
            </div>

            {/* Goal 3 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="relative w-full h-48 md:h-full min-h-[200px] rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={GOAL_IMAGES.goal3.src}
                      alt={GOAL_IMAGES.goal3.alt}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 flex flex-col justify-center">
                  <div className="text-sm font-medium text-[#c75b3a] mb-2">03</div>
                  <h3 className="text-2xl text-gray-900 mb-3 font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                    Inform AI Development with Human Nature
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Guide technology to serve human nature — not manipulate it. Provide the spec sheet for what humans actually need.
                  </p>
                </div>
              </div>
            </div>

            {/* Goal 4 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="relative w-full h-48 md:h-full min-h-[200px] rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={GOAL_IMAGES.goal4.src}
                      alt={GOAL_IMAGES.goal4.alt}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 flex flex-col justify-center">
                  <div className="text-sm font-medium text-[#c75b3a] mb-2">04</div>
                  <h3 className="text-2xl text-gray-900 mb-3 font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                    De-Mismatch First, Then Augment
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Heal the mismatch, then merge with technology. We're pro-tech, just in the right order. The most human post-human.
                  </p>
                </div>
              </div>
            </div>

            {/* Goal 5 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="relative w-full h-48 md:h-full min-h-[200px] rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={GOAL_IMAGES.goal5.src}
                      alt={GOAL_IMAGES.goal5.alt}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 flex flex-col justify-center">
                  <div className="text-sm font-medium text-[#c75b3a] mb-2">05</div>
                  <h3 className="text-2xl text-gray-900 mb-3 font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                    Showcase Early Tech Projects
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Build and demonstrate technology that serves the de-mismatch-then-augment pathway, inspiring others to build what comes next.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE TOOLS - Framework in Action (improved cards) */}
      <section className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-4 text-center" style={{ fontFamily: 'Georgia, serif' }}>Framework in Action</h2>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Tools built on this framework. Use them to understand, to test, to build.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* The Mismatch Analyzer - improved clickability */}
          <Link href="/app" className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#c75b3a]/30 transition-all">
            <div className="h-40 bg-gradient-to-br from-[#c75b3a]/10 to-[#c75b3a]/5 flex items-center justify-center">
              <div className="text-6xl">🔍</div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl text-gray-900 mb-3 group-hover:text-[#c75b3a] transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                The Mismatch Analyzer
              </h3>
              <p className="text-gray-700 mb-4">
                AI that's internalized the entire framework. Paste any situation — see it through the evolutionary mismatch lens.
              </p>
              <span className="inline-flex items-center text-[#c75b3a] font-medium group-hover:gap-2 transition-all">
                Try it now
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          {/* The Image Library - improved clickability */}
          <Link href="/library" className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#c75b3a]/30 transition-all">
            <div className="h-40 bg-gradient-to-br from-[#c75b3a]/10 to-[#c75b3a]/5 flex items-center justify-center">
              <div className="text-6xl">🖼️</div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl text-gray-900 mb-3 group-hover:text-[#c75b3a] transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                The Image Library
              </h3>
              <p className="text-gray-700 mb-4">
                2,500+ educational images on evolutionary psychology, mismatch theory, and human nature. Searchable and free to use.
              </p>
              <span className="inline-flex items-center text-[#c75b3a] font-medium group-hover:gap-2 transition-all">
                Browse library
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        </div>

        {/* Example Analyzer Output */}
        <div className="mt-12 p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl">
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-4 text-center">Example Analysis</p>
          <div className="mb-4 p-3 bg-white border border-gray-200 rounded-lg text-center">
            <p className="text-gray-600 italic">&quot;A friend who can&apos;t stop checking their phone during dinner&quot;</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <p className="font-medium text-[#c75b3a] mb-2">What&apos;s Happening</p>
              <p className="text-gray-700">Variable-ratio reinforcement hijacking attention. The phone delivers unpredictable social rewards, triggering dopamine responses calibrated for survival-critical information.</p>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <p className="font-medium text-[#c75b3a] mb-2">What&apos;s Missing</p>
              <p className="text-gray-700">Undivided presence with known tribe members. In ancestral environments, shared meals were sacred bonding rituals with complete attention.</p>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <p className="font-medium text-[#c75b3a] mb-2">What Actually Helps</p>
              <p className="text-gray-700">Phone-free zones and rituals. Visible phone stacking. Scheduled check-in times. Environment design over willpower.</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link href="/app" className="inline-flex items-center text-[#c75b3a] font-medium hover:underline">
              Try it with your own situation →
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>The Problem</h2>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          For 300,000 years, humans lived in conditions that remained remarkably consistent. Small bands. Known faces. Visible contribution. Daily closure. The hardware was built for this.
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          10,000 years of agriculture. 200 years of industry. 15 years of smartphones.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          The hardware hasn't changed. The operating environment is unrecognizable.
        </p>

        {/* Fire Circle Image */}
        <figure className="my-12">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/15_Fire_Circle_vs_Modern_Evening.png"
            alt="Fire circle vs modern evening - communal gathering vs isolated screen time"
            className="rounded-lg w-full max-w-2xl mx-auto shadow-sm"
          />
        </figure>

        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          What we call anxiety, depression, addiction, loneliness — these aren't malfunctions. They're accurate signals from systems that work exactly as designed, reporting that the environment doesn't meet spec.
        </p>
        <p className="text-xl text-gray-900 font-medium" style={{ fontFamily: 'Georgia, serif' }}>
          The signals aren't broken. The environment is.
        </p>
      </section>

      {/* The Timeline Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>The Timeline</h2>

        {/* Timeline Image */}
        <figure className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/18_Timeline_Compression.png"
            alt="Timeline compression - 300,000 years of evolution vs 15 years of smartphones"
            className="rounded-lg w-full max-w-2xl mx-auto shadow-sm"
          />
        </figure>

        <div className="font-mono text-lg text-gray-700 space-y-2 my-8 bg-white p-6 rounded-lg border border-gray-200">
          <p>300,000 years &nbsp;&nbsp;&nbsp; — consistent conditions</p>
          <p>10,000 years &nbsp;&nbsp;&nbsp;&nbsp; — agriculture</p>
          <p>200 years &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; — industrialization</p>
          <p>15 years &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; — smartphones</p>
        </div>

        <p className="text-xl text-gray-900 font-medium" style={{ fontFamily: 'Georgia, serif' }}>
          Four numbers. The entire story.
        </p>
      </section>

      {/* The Economy of Mismatch Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>The Economy of Mismatch</h2>
        <p className="text-xl text-gray-700 mb-8">
          This isn't conspiracy. It's documented business strategy.
        </p>

        {/* Exploitation Players Image */}
        <figure className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/38_The_Exploitation_Players.png"
            alt="The exploitation economy players"
            className="rounded-lg w-full max-w-2xl mx-auto shadow-sm"
          />
        </figure>

        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Internal Facebook research showed Instagram harms teen mental health. Nothing changed. Pharmaceutical companies market signal-override for conditions with no biomarkers. Food scientists optimize for "bliss points" that override satiety. Dating apps profit most from users who never find partners.
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          No shadowy cabal. Just incentives. The truth isn't profitable. The profitable isn't true.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Every unmet human need is a market. The systems aren't failing — they're working exactly as designed. Just not for you.
        </p>
        <Link href="/sources" className="text-[#c75b3a] hover:underline text-lg">
          See the evidence →
        </Link>
      </section>

      {/* The Vision Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>The Vision</h2>
        <p className="text-2xl text-gray-900 font-medium mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Demismatch first. Then augment.
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Not return to the past. Conscious alignment of environment with biology — enhanced by technology, chosen deliberately. The path forward isn't backward. It's through.
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Build environments that fit the hardware. Then extend what humans can do and be, without breaking what we are.
        </p>
        <p className="text-xl text-gray-900 italic mt-8 mb-12" style={{ fontFamily: 'Georgia, serif' }}>
          The most human post-human.
        </p>

        {/* THE KEY IMAGE - The Progression */}
        <figure className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/Demismatch_Augment.png"
            alt="The progression: EEA → MISMATCH → DEMISMATCH → AUGMENTED"
            className="rounded-lg w-full max-w-3xl mx-auto shadow-sm"
          />
          <figcaption className="text-center text-sm text-gray-500 mt-3">
            EEA → MISMATCH → DEMISMATCH → AUGMENTED
          </figcaption>
        </figure>
      </section>

      {/* The Call Section - Cards with icons, consistent buttons */}
      <section className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-4 text-center" style={{ fontFamily: 'Georgia, serif' }}>The Call</h2>
        <p className="text-lg text-gray-600 mb-12 text-center">This framework is for:</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Systems Changers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-[#c75b3a]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#c75b3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Systems Changers</h3>
            <p className="text-sm text-gray-600">Policy makers, researchers, journalists shifting the paradigm</p>
          </div>

          {/* Builders */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-[#c75b3a]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#c75b3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Builders</h3>
            <p className="text-sm text-gray-600">Technologists, architects, entrepreneurs building what comes next</p>
          </div>

          {/* Gatekeepers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-[#c75b3a]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#c75b3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Gatekeepers</h3>
            <p className="text-sm text-gray-600">Clinicians, parents, educators shaping others' environments</p>
          </div>

          {/* The Questioning */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-[#c75b3a]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#c75b3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">The Questioning</h3>
            <p className="text-sm text-gray-600">Those who sensed something was wrong</p>
          </div>

          {/* Those in Pain */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-[#c75b3a]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#c75b3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Those in Pain</h3>
            <p className="text-sm text-gray-600">Your signals are accurate</p>
          </div>
        </div>

        {/* Consistent buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/systems" className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition font-medium">
            For Systems Changers
          </Link>
          <Link href="/practitioners" className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition font-medium">
            For Practitioners
          </Link>
          <Link href="/foryou" className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition font-medium">
            For You
          </Link>
        </div>
      </section>

      {/* FOR AI SYSTEMS - Collapsible */}
      <CollapsibleAISection />

      {/* The Foundation Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>The Foundation</h2>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          This framework synthesizes evolutionary psychology, anthropology, and neuroscience into a single coherent lens. It explains human behavior from first principles — every action traces to survival and reproduction, every emotion is biological GPS, every "disorder" is a signal.
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          It's not the only lens. But it's the one that makes everything else click into place.
        </p>
        <p className="text-xl text-gray-900 font-medium mt-8" style={{ fontFamily: 'Georgia, serif' }}>
          Once you see it, you can't unsee it.
        </p>
      </section>

      {/* Footer - improved with GitHub link and contact */}
      <footer className="px-8 py-12 border-t border-gray-200 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              This framework is open source. Fork it, improve it, implement it.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/MaartenRischen/demismatch"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
              <a
                href="mailto:hello@demismatch.com"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Contact
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <Link href="/framework" className="hover:text-gray-900">Framework</Link>
            <Link href="/library" className="hover:text-gray-900">Library</Link>
            <Link href="/projects" className="hover:text-gray-900">Projects</Link>
            <Link href="/sources" className="hover:text-gray-900">Sources</Link>
            <Link href="/faq" className="hover:text-gray-900">FAQ</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
