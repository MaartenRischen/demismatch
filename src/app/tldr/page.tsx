"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import DemismatchCarouselMorphing from "@/components/DemismatchCarouselMorphing";

export default function TLDR() {
  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-20">
      <Navigation />

      {/* Hero - Clean, centered, confident */}
      <header className="py-20 md:py-28 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.25em] mb-6">
            TL;DR
          </p>
          <h1
            className="text-[2.5rem] md:text-5xl lg:text-6xl text-[#1A1A1A] leading-[1.1] mb-8"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Framework in 2 Minutes
          </h1>
          <p
            className="text-xl md:text-2xl text-[#5A5A5A] leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Everything you need to understand the Demismatch framework, without reading the full specification.
          </p>
        </div>
      </header>

      {/* Section 1: The Problem */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">01</p>
          <h2
            className="text-3xl md:text-4xl text-[#1A1A1A] mb-8 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Problem
          </h2>

          {/* Image underneath title */}
          <figure className="mb-10">
            <img
              src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/frontpage/timeline.png"
              alt="Timeline showing the compression of human history"
              className="w-full rounded-xl shadow-sm"
            />
          </figure>

          <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              For 300,000 years, humans lived in conditions that remained remarkably consistent. Small bands of people who knew each other deeply. Daily movement through natural environments. Clear roles, real stakes, immediate feedback from the physical world.
            </p>
            <p>
              Then everything changed — agriculture 10,000 years ago, industrialization 200 years ago, digital technology 30 years ago, smartphones 15 years ago. On an evolutionary timescale, this is the blink of an eye.
            </p>
            <p>
              Our biology evolved for one world. We now live in a completely different one. This gap — between what our bodies and minds expect and what they actually encounter — is <em>mismatch</em>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: The Signal */}
      <section className="bg-[#F8F6F2] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <figure>
                <HeroCarousel />
              </figure>
            </div>
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

      {/* Section 3: What We Evolved For vs. What We Got */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">03</p>
          <h2
            className="text-3xl md:text-4xl text-[#1A1A1A] mb-8 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            What We Evolved For vs. What We Got
          </h2>

          <figure className="mb-10">
            <img
              src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/frontpage/MAIN%20presentation%20graphic.png"
              alt="What we evolved for versus modern substitutes"
              className="w-full rounded-xl shadow-sm"
            />
          </figure>

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
      </section>

      {/* Section 4: The Economy of Mismatch */}
      <section className="bg-[#F8F6F2] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">04</p>
          <h2
            className="text-3xl md:text-4xl text-[#1A1A1A] mb-8 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Economy of Mismatch
          </h2>

          <figure className="mb-10">
            <img
              src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/38_The_Exploitation_Players.png"
              alt="The exploitation economy"
              className="w-full rounded-xl shadow-sm"
            />
          </figure>

          <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
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
        </div>
      </section>

      {/* Section 5: The Stakes - Dark, weighty */}
      <section className="bg-[#0F0F0F] py-24 md:py-32 relative overflow-hidden">
        {/* Subtle gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C75B39] to-transparent opacity-60" />

        <div className="max-w-3xl mx-auto px-6 md:px-8 relative">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">05</p>
          <h2
            className="text-3xl md:text-4xl text-white mb-10 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Stakes
          </h2>
          <div className="space-y-6 text-lg text-[#B0B0B0] leading-[1.9]" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              Understanding mismatch has always mattered, but it's about to matter much more.
            </p>
            <p>
              Social media exploited human nature somewhat accidentally — engineers optimizing for engagement discovered what hooks attention. AI and immersive VR are different. These technologies will understand human psychology better than we understand ourselves, and they'll be able to simulate anything.
            </p>
            <p className="text-white">
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
      </section>

      {/* Section 6: The Principle */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">06</p>
            <h2
              className="text-3xl md:text-4xl text-[#1A1A1A] mb-8 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              The Principle
            </h2>
            <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8] text-left md:text-center" style={{ fontFamily: "Georgia, serif" }}>
              <p
                className="text-2xl text-[#1A1A1A] mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                De-mismatch first, then augment.
              </p>
              <p>
                Before reaching for any intervention — pharmaceutical, technological, therapeutic — ask which ancestral needs are going unmet. Does this person have genuine community? Daily movement? Exposure to nature? A sense of purpose and contribution? Adequate sleep in sync with light cycles?
              </p>
              <p>
                Address those foundations first. Then, once the baseline is established, use technology and modern tools to extend human capability. The sequence matters. You can't optimize a system that's missing its basic inputs.
              </p>
            </div>
          </div>

          {/* Carousel */}
          <div className="mt-16">
            <DemismatchCarouselMorphing />
          </div>
        </div>
      </section>

      {/* Section 7: The Vision */}
      <section className="bg-[#F8F6F2] py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">07</p>
          <h2
            className="text-3xl md:text-4xl text-[#1A1A1A] mb-10 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Vision
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-[#3A3A3A] leading-[1.9]" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              This isn't a call to abandon modernity or return to prehistoric conditions. That's neither possible nor desirable.
            </p>
            <p>
              The vision is conscious alignment — designing environments, technologies, and social structures that work with human nature rather than against it. Understanding what our biology actually needs, and building systems that deliver it in modern form.
            </p>
            <p className="text-[#1A1A1A] font-medium">
              We can have connection without exploitation, technology without addiction, progress without self-destruction. But only if we understand the hardware we're working with.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0F0F0F] py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <p className="text-[#888] text-lg mb-6" style={{ fontFamily: "Georgia, serif" }}>
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
