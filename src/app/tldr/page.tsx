"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import DemismatchCarouselMorphing from "@/components/DemismatchCarouselMorphing";

export default function TLDR() {
  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-20">
      <Navigation />

      {/* Hero - Compact, understated */}
      <header className="py-10 md:py-12">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h1
            className="text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2] mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Framework in 2 Minutes
          </h1>
          <p
            className="text-base text-[#6A6A6A] leading-relaxed max-w-xl mx-auto mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Everything you need to understand the Demismatch framework, without reading the full specification.
          </p>
          <p
            className="text-sm text-[#8A8A8A] mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The complete framework, with evidence, mechanisms, and implications.
          </p>
          <Link
            href="/framework"
            className="inline-flex items-center gap-2 text-[#C75B39] hover:text-[#A84A2D] text-sm font-medium transition-colors"
          >
            Read the Full Framework
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Section 1: The Problem - Text left, large image right */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">01</p>
              <h2
                className="text-3xl md:text-4xl text-[#1A1A1A] mb-8 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                The Problem
              </h2>
              <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
                <p>
                  For 300,000 years, humans lived in conditions that remained remarkably consistent. Small bands of people who knew each other deeply. Daily movement through natural environments. Clear roles, real stakes, immediate feedback from the physical world.
                </p>
                <p>
                  Then everything changed — agriculture 12,000 years ago, industrialization 250 years ago, the internet 30 years ago, smartphones 18 years ago. On an evolutionary timescale, this is the blink of an eye.
                </p>
                <p>
                  Our biology evolved for one world. We now live in a completely different one. This gap — between what our bodies and minds expect and what they actually encounter — is <em>mismatch</em>.
                </p>
              </div>
            </div>
            <figure className="relative">
              <img
                src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/frontpage/timeline.png"
                alt="Timeline showing the compression of human history"
                className="w-full rounded-xl shadow-lg"
              />
              <figcaption
                className="mt-4 text-center text-[0.9em] italic text-[#666] leading-[1.6]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                300,000 years of consistency, then everything changed in an evolutionary blink. We're running ancient hardware in an environment it was never designed for.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Section 2: The Signal - Image left, text right */}
      <section className="bg-[#F8F6F2] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <figure>
              <HeroCarousel />
              <figcaption
                className="mt-4 text-center text-[0.9em] italic text-[#666] leading-[1.6]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                The signal isn't broken. The environment is.
              </figcaption>
            </figure>
            <div>
              <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">02</p>
              <h2
                className="text-3xl md:text-4xl text-[#1A1A1A] mb-8 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                The Signal
              </h2>
              <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
                <p>
                  When we label something a "disorder," we imply the system is malfunctioning. But what if the system is working exactly as designed — just in the wrong environment?
                </p>
                <p>
                  Depression often functions as a withdrawal response when social bonds are absent or goals seem unreachable. Anxiety spikes when we face threats we can't fight or flee. Addiction fills voids left by missing tribe, purpose, or genuine reward. Loneliness is a biological alarm telling us our social needs are unmet.
                </p>
                <p>
                  These signals aren't errors. They're accurate readings of a bad environment. The problem isn't the dashboard warning light — it's what the light is detecting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: What We Evolved For - Title updated, text right, image left */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-center">
            <figure>
              <img
                src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/frontpage/MAIN%20presentation%20graphic.png"
                alt="What we evolved for versus modern substitutes"
                className="w-full rounded-xl shadow-lg"
              />
              <figcaption
                className="mt-4 text-center text-[0.9em] italic text-[#666] leading-[1.6]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                The full map: what we evolved for, what we got instead, and the technological layer being built on top. That layer forks into two futures — one exploits human nature harder than ever, the other finally meets it.
              </figcaption>
            </figure>
            <div>
              <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">03</p>
              <h2
                className="text-3xl md:text-4xl text-[#1A1A1A] mb-8 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                What We Evolved For, What We Got, and What Comes Next
              </h2>
              <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
                <p>
                  Every domain of human life has been transformed in ways that trigger the same receptors but don't deliver the same outcomes.
                </p>
                <p>
                  We evolved for movement through varied terrain — we got sitting at desks and running on treadmills. We evolved for deep bonds with a stable group — we got thousands of shallow connections and algorithmic feeds. We evolved for natural light cycles — we got screens at midnight. We evolved for real stakes and tangible goals — we got abstract metrics and infinite scroll.
                </p>
                <p>
                  The substitutes feel similar enough to be accepted by our biology, but different enough to leave us depleted rather than fulfilled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: The Stakes - Dark section about AI/VR futures */}
      <section className="bg-[#292524] py-28 md:py-36 relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C75B39] to-transparent" />

        <div className="max-w-6xl mx-auto px-6 md:px-8 relative">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">04</p>
              <h2
                className="text-3xl md:text-4xl mb-10 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#C75B39" }}
              >
                The Stakes
              </h2>
              <div className="space-y-6 text-lg text-[#D6D3D1] leading-[1.9]" style={{ fontFamily: "Georgia, serif" }}>
                <p>
                  Understanding mismatch has always mattered, but it's about to matter much more.
                </p>
                <p>
                  Social media exploited human nature somewhat accidentally — engineers optimizing for engagement discovered what hooks attention. AI and immersive VR are different. These technologies will understand human psychology better than we understand ourselves, and they'll be able to simulate anything.
                </p>
                <p className="text-[#FAFAF9]">
                  They could exploit every vulnerability we have, or they could be designed to actually meet human needs — real tribe, real purpose, real presence. The difference depends entirely on whether the people building these technologies understand mismatch.
                </p>
                <p
                  className="text-xl text-white pt-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  This framework is an attempt to make sure they do.
                </p>
              </div>
            </div>

            <figure className="hidden lg:block">
              <img
                src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/2_Exploitation_Loop_Diagram.png"
                alt="The exploitation loop - how unmet needs create markets that profit from keeping needs unmet"
                className="w-full rounded-xl opacity-60"
              />
              <figcaption
                className="mt-4 text-center text-[0.9em] italic text-[#78716C] leading-[1.6]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                The exploitation loop. AI could run this cycle faster than ever — or break it entirely.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Section 5: The Economy of Mismatch - Text first, image below */}
      <section className="bg-[#F8F6F2] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">05</p>
          <h2
            className="text-3xl md:text-4xl text-[#1A1A1A] mb-8 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Economy of Mismatch
          </h2>

          <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8] mb-12" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              This isn't conspiracy — it's documented business strategy.
            </p>
            <p>
              Internal Facebook research showed Instagram harms teen mental health. Pharmaceutical companies market signal-suppression for conditions with environmental roots. Food scientists optimize for "bliss points" that override satiety. Dating apps profit most from users who never find lasting partners. Social platforms are designed for engagement, not wellbeing.
            </p>
            <p>
              Every unmet human need is a market. The systems aren't failing — they're succeeding at what they're designed for. The problem is that their goals aren't aligned with human flourishing.
            </p>
          </div>

          <figure>
            <img
              src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/38_The_Exploitation_Players.png"
              alt="The exploitation economy"
              className="w-full rounded-xl shadow-lg"
            />
            <figcaption
              className="mt-4 text-center text-[0.9em] italic text-[#666] leading-[1.6]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Every unmet human need is a market. The players, the playbook, the profit.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Section 6: The Principle - Demismatch First, Then Augment */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">06</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-stretch">
            {/* Left: Text blocks stacked with spacing */}
            <div className="space-y-16">
              {/* Part 1: Demismatch First */}
              <div>
                <h2
                  className="text-3xl md:text-4xl text-[#1A1A1A] mb-6 leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Demismatch First
                </h2>
                <div className="space-y-4 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
                  <p>
                    Before reaching for any intervention — pharmaceutical, technological, therapeutic — ask which ancestral needs are going unmet.
                  </p>
                  <p>
                    Does this person have genuine community? Daily movement? Exposure to nature? A sense of purpose? Adequate sleep in sync with light cycles?
                  </p>
                  <p>
                    Address those foundations first. You can't optimize a system that's missing its basic inputs.
                  </p>
                </div>
              </div>

              {/* Part 2: Then Augment */}
              <div>
                <h2
                  className="text-3xl md:text-4xl text-[#1A1A1A] mb-6 leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Then Augment
                </h2>
                <div className="space-y-4 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
                  <p>
                    Once the baseline is established — real tribe, real movement, real purpose — technology becomes a force multiplier rather than a substitute.
                  </p>
                  <p>
                    AI that extends capability. Communication tools that coordinate an actual tribe. Productivity systems that amplify meaningful work.
                  </p>
                  <p>
                    You can't augment broken. Technology applied to a thriving human extends what's already working.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Vertical Carousel - stretches to match text height */}
            <div className="hidden lg:block">
              <DemismatchCarouselMorphing minimal vertical />
            </div>
          </div>

          {/* Mobile: Show horizontal carousel below */}
          <div className="lg:hidden mt-12">
            <DemismatchCarouselMorphing minimal />
          </div>
        </div>
      </section>

      {/* Section 7: The Vision - Warmer background, visual separator */}
      <section className="bg-[#F5F3EF] py-24 md:py-32 border-t border-[#E5E0D8]">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">07</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <h2
                className="text-3xl md:text-4xl text-[#1A1A1A] mb-8 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                The Vision
              </h2>
              <div className="space-y-6 text-lg text-[#3A3A3A] leading-[1.9]" style={{ fontFamily: "Georgia, serif" }}>
                <p>
                  This isn't a call to abandon modernity or return to prehistoric conditions. That's neither possible nor desirable.
                </p>
                <p>
                  The vision is conscious alignment — designing environments, technologies, and social structures that work with human nature rather than against it. Understanding what our biology actually needs, and building systems that deliver it in modern form.
                </p>
                <p
                  className="text-[#1A1A1A] text-xl md:text-2xl font-medium pt-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  We can have connection without exploitation, technology without addiction, progress without self-destruction. But only if we understand the hardware we're working with.
                </p>
              </div>
            </div>

            {/* Right: Eye Image with Animation */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-64 eye-glow-pulse">
                <div
                  className="relative overflow-hidden"
                  style={{
                    maskImage: 'radial-gradient(ellipse 100% 100% at center, black 50%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at center, black 50%, transparent 75%)',
                  }}
                >
                  <img
                    src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/frontpage/eye.png"
                    alt="Human eye - understanding the hardware"
                    className="w-full h-auto object-contain animate-[slow-zoom_4s_ease-in-out_infinite_alternate]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1C1917] py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <p className="text-[#A8A29E] text-lg mb-6" style={{ fontFamily: "Georgia, serif" }}>
            The complete framework, with evidence, mechanisms, and implications.
          </p>
          <Link
            href="/framework"
            className="inline-flex items-center gap-3 bg-[#C75B39] text-white px-10 py-5 text-lg font-semibold hover:bg-[#A84A2D] transition-colors"
          >
            Read the Full Framework
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
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
