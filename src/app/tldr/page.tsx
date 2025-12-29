"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import DemismatchCarouselMorphing from "@/components/DemismatchCarouselMorphing";

export default function TLDR() {
  return (
    <main className="min-h-screen bg-[#faf9f6] pt-20">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#faf9f6] to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-[#c75b3a] text-sm uppercase tracking-widest mb-4">TL;DR</p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The Framework in 2 Minutes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to understand the demismatch framework, without reading the full specification.
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-16">
          {/* The Problem */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl text-gray-900 mb-6" style={{ fontFamily: "Georgia, serif" }}>
              The Problem
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              For 300,000 years, humans lived in conditions that remained remarkably consistent. Small bands. Known faces. Visible contribution. Daily closure. The hardware was built for this.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              10,000 years of agriculture. 200 years of industry. 15 years of smartphones. The hardware hasn't changed. The operating environment is unrecognizable.
            </p>
            <figure className="my-10">
              <HeroCarousel />
            </figure>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              What we call anxiety, depression, addiction, loneliness - these aren't malfunctions. They're accurate signals from systems that work exactly as designed, reporting that the environment doesn't meet spec.
            </p>
            <p className="text-xl text-gray-900 font-medium mt-6" style={{ fontFamily: "Georgia, serif" }}>
              The signals aren't broken. The environment is.
            </p>
          </section>

          {/* The Timeline */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl text-gray-900 mb-6" style={{ fontFamily: "Georgia, serif" }}>
              The Timeline
            </h2>
            <figure className="my-8">
              <img
                src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/frontpage/timeline.png"
                alt="Timeline: How every domain of life has shifted"
                className="rounded-lg w-full shadow-sm"
              />
            </figure>
            <p className="text-lg text-gray-700 leading-relaxed">
              For 300,000 years, our ancestors lived in small bands of known faces. The rules didn't change. Then agriculture arrived 10,000 years ago — a blink in evolutionary time. Industrialization followed just 200 years ago. Smartphones? Fifteen years.
            </p>
            <p className="text-lg text-gray-700 mt-4 leading-relaxed">
              Your body is running software optimized for a world that vanished before your great-grandparents were born. The hardware hasn't had time to update. It never will.
            </p>
          </section>

          {/* What We Evolved For */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl text-gray-900 mb-6" style={{ fontFamily: "Georgia, serif" }}>
              What We Evolved For vs. What We Got
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Every domain of human life has been transformed. Movement, food, connection, attention, status, meaning - all replaced with substitutes that trigger the same receptors but don't deliver the same outcomes.
            </p>
            <figure className="my-8">
              <img
                src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/frontpage/MAIN%20presentation%20graphic.png"
                alt="The Demismatch Framework: What we evolved for versus modern substitutes"
                className="rounded-lg w-full shadow-sm"
              />
            </figure>
          </section>

          {/* The Economy */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl text-gray-900 mb-6" style={{ fontFamily: "Georgia, serif" }}>
              The Economy of Mismatch
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              This isn't conspiracy. It's documented business strategy.
            </p>
            <figure className="my-8">
              <img
                src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/38_The_Exploitation_Players.png"
                alt="The exploitation economy players"
                className="rounded-lg w-full max-w-xl mx-auto shadow-sm"
              />
            </figure>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Internal Facebook research showed Instagram harms teen mental health. Nothing changed. Pharmaceutical companies market signal-override for conditions with no biomarkers. Food scientists optimize for "bliss points" that override satiety. Dating apps profit most from users who never find partners.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every unmet human need is a market. The systems aren't failing - they're working exactly as designed. Just not for you.
            </p>
          </section>

          {/* The Vision */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl text-gray-900 mb-6" style={{ fontFamily: "Georgia, serif" }}>
              The Vision
            </h2>
            <p className="text-xl text-gray-900 font-medium mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Demismatch first. Then augment.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Not return to the past. Conscious alignment of environment with biology - enhanced by technology, chosen deliberately. The path forward isn't backward. It's through.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Build environments that fit the hardware. Then extend what humans can do and be, without breaking what we are.
            </p>
            <figure className="my-8">
              <DemismatchCarouselMorphing />
            </figure>
            <p className="text-xl text-gray-900 italic text-center mt-8" style={{ fontFamily: "Georgia, serif" }}>
              The most human post-human.
            </p>
          </section>
        </div>
      </article>

      {/* CTA Section */}
      <section className="bg-[#0A0A0A] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl text-white mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Ready for the full specification?
          </h2>
          <p className="text-gray-400 mb-8">
            The complete framework with evidence, mechanisms, and implications.
          </p>
          <Link
            href="/framework"
            className="inline-flex items-center gap-2 bg-[#C75B39] text-white px-8 py-4 font-semibold hover:bg-[#A84A2D] transition"
          >
            Read the Full Framework
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#C75B39] text-white py-12">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-xl mb-4" style={{ fontFamily: "Georgia, serif" }}>
            The fish doesn't need therapy. The fish needs water.
          </p>
          <p className="text-white/60 text-sm">
            demismatch.com — Understanding human nature
          </p>
        </div>
      </footer>
    </main>
  );
}
