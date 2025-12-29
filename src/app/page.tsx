"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import CollapsibleAISection from "@/components/CollapsibleAISection";
import DemismatchCarouselMorphing from "@/components/DemismatchCarouselMorphing";

// Scroll animation hook
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = ref.current?.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

// The Call card data with tint colors and links
const callCards = [
  {
    title: "Systems Changers",
    description: "Policy makers, researchers, journalists shifting the paradigm",
    href: "/systems",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    tint: "card-tint-terracotta",
    accentColor: "#C75B39"
  },
  {
    title: "Builders",
    description: "Technologists, architects, entrepreneurs building what comes next",
    href: "/projects",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    tint: "card-tint-forest",
    accentColor: "#2D4A3E"
  },
  {
    title: "Gatekeepers",
    description: "Clinicians, parents, educators shaping others' environments",
    href: "/practitioners",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    tint: "card-tint-gold",
    accentColor: "#C9A962"
  },
  {
    title: "The Questioning",
    description: "Those who sensed something was wrong",
    href: "/foryou",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
    tint: "card-tint-charcoal",
    accentColor: "#1A1A1A"
  },
  {
    title: "Those in Pain",
    description: "Your signals are accurate",
    href: "/foryou",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    tint: "card-tint-rust",
    accentColor: "#8B4513"
  }
];

export default function Home() {
  const scrollRef = useScrollAnimation();

  return (
    <main ref={scrollRef} className="min-h-screen bg-[#faf9f6] pt-20 relative">
      <Navigation />

      {/* Hero Section - Three Column Layout with Central Image */}
      <section className="relative overflow-hidden bg-[#faf9f6] wave-divider">
        <div className="px-6 md:px-8 py-16 md:py-20 lg:py-24 max-w-7xl mx-auto">
          {/* Desktop Layout: Cards with Image row */}
          <div className="hidden lg:block">
            {/* Cards + Image Row */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center mb-12 relative">
              {/* LEFT - Signal Card */}
              <div
                className="relative p-8 overflow-hidden rounded-2xl border-2 border-[#E8DFD4] h-full card-connected-left"
                style={{
                  background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EDE3 50%, #FDF9F5 100%)'
                }}
              >
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-amber-200/40 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-orange-200/30 to-transparent rounded-full blur-2xl" />
                </div>
                {/* Ambient light from eye - warm glow on right edge */}
                <div
                  className="absolute top-0 right-0 w-32 h-full pointer-events-none card-inner-glow-left"
                  style={{
                    background: 'linear-gradient(to left, rgba(199, 91, 57, 0.4), rgba(199, 91, 57, 0.15) 50%, transparent)',
                  }}
                />
                <div className="relative z-10">
                  <h1
                    className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-[#0A0A0A] leading-[1.1] mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    We evolved for a world that no longer exists.
                  </h1>
                  <p className="text-base lg:text-lg text-[#3A3A3A] leading-relaxed" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    That's why you feel the way you feel — and why society is fracturing. Depression, anxiety, addiction, loneliness: these aren't malfunctions. They're your <strong>biology correctly signaling that something is wrong with your environment, not with you.</strong>
                  </p>
                </div>
              </div>

              {/* CENTER - Eye Image with Feathered Edges, Slow Zoom, and Glow */}
              <div className="relative w-64 xl:w-80 eye-glow-pulse self-stretch flex items-center">
                {/* Fixed mask wrapper - stays locked */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                    WebkitMaskComposite: 'destination-in',
                    maskComposite: 'intersect'
                  }}
                >
                  {/* Image zooms inside the fixed mask */}
                  <img
                    src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/frontpage/eye.png"
                    alt="Human eye - bridging signal and stakes"
                    className="w-full h-auto object-contain animate-[slow-zoom_4s_ease-in-out_infinite_alternate]"
                  />
                </div>
              </div>

              {/* RIGHT - Stakes Card */}
              <div
                className="relative p-8 overflow-hidden rounded-2xl h-full card-connected-right"
                style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)'
                }}
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/30 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-2xl" />
                </div>
                {/* Ambient light from eye - cool glow on left edge */}
                <div
                  className="absolute top-0 left-0 w-32 h-full pointer-events-none card-inner-glow-right"
                  style={{
                    background: 'linear-gradient(to right, rgba(120, 160, 220, 0.5), rgba(100, 150, 200, 0.2) 50%, transparent)',
                  }}
                />
                <div className="relative z-10">
                  <h2
                    className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] mb-6"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
                  >
                    The most powerful technologies in history are arriving.
                  </h2>
                  <p className="text-base lg:text-lg text-white/90 leading-relaxed font-medium">
                    AI and total immersion will either <strong>exploit human nature</strong> harder than anything before — <strong>or finally meet it.</strong> This is the framework for knowing the difference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout: The Convergence */}
          <div className="lg:hidden">
            {/* Eye as Central Anchor with Split Background */}
            <div className="relative mb-4">
              {/* Split gradient background - warm/cool duality */}
              <div className="absolute inset-0 flex overflow-hidden">
                <div className="w-1/2 bg-gradient-to-br from-amber-100/60 via-orange-50/40 to-transparent" />
                <div className="w-1/2 bg-gradient-to-bl from-slate-800/20 via-indigo-900/10 to-transparent" />
              </div>

              {/* Eye Image - Prominent, commanding */}
              <div className="relative flex justify-center py-6 sm:py-8">
                <div className="relative w-52 sm:w-64 eye-glow-pulse">
                  <div
                    className="relative overflow-hidden"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
                      maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
                      WebkitMaskComposite: 'destination-in',
                      maskComposite: 'intersect'
                    }}
                  >
                    <img
                      src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/frontpage/eye.png"
                      alt="Human eye - bridging signal and stakes"
                      className="w-full h-auto object-contain animate-[slow-zoom_4s_ease-in-out_infinite_alternate]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Converging Cards - Overlapping at collision point */}
            <div className="relative px-3 sm:px-4">
              {/* Signal Card - Warm, tilted slightly */}
              <div
                className="relative z-10 transform -rotate-[0.5deg] origin-bottom-right"
                style={{ marginBottom: '-24px' }}
              >
                <div
                  className="relative p-5 sm:p-6 overflow-hidden border-2 border-[#E8DFD4]"
                  style={{
                    background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EDE3 50%, #FDF9F5 100%)',
                    boxShadow: '0 15px 40px -12px rgba(166, 124, 82, 0.2)',
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), 0 100%)'
                  }}
                >
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-amber-200/50 to-transparent rounded-full blur-2xl" />
                  </div>
                  {/* Warm glow on bottom edge */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(199, 91, 57, 0.15), transparent)' }}
                  />
                  <div className="relative z-10 pb-4">
                    <h1
                      className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A0A] leading-[1.15] mb-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      We evolved for a world that no longer exists.
                    </h1>
                    <p className="text-sm sm:text-base text-[#3A3A3A] leading-relaxed" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      That's why you feel the way you feel. Depression, anxiety, addiction — these aren't malfunctions. They're your <strong>biology correctly signaling that something is wrong with your environment, not with you.</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Stakes Card - Cool, counter-tilted, overlapping */}
              <div className="relative z-20 transform rotate-[0.5deg] origin-top-left">
                <div
                  className="relative p-5 sm:p-6 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
                    boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
                    clipPath: 'polygon(0 20px, 100% 0, 100% 100%, 0 100%)'
                  }}
                >
                  <div className="absolute inset-0 opacity-15">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-400/40 to-transparent rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/30 to-transparent rounded-full blur-xl" />
                  </div>
                  {/* Cool glow on top edge */}
                  <div
                    className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, rgba(100, 150, 220, 0.2), transparent)' }}
                  />
                  <div className="relative z-10 pt-3">
                    <h2
                      className="text-2xl sm:text-3xl font-bold tracking-tight leading-[1.15] mb-3"
                      style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF', textShadow: '0 2px 15px rgba(0,0,0,0.4)' }}
                    >
                      The most powerful technologies in history are arriving.
                    </h2>
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
                      AI and total immersion will either <strong>exploit human nature</strong> harder than anything before — <strong>or finally meet it.</strong> This is the framework for knowing the difference.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - Centered */}
          <div className="text-center animate-fade-in-up delay-300">
            <Link href="/framework" className="btn-primary btn-shimmer btn-press inline-flex flex-col items-center text-center px-10 py-5">
              <span className="text-lg font-bold tracking-wide">SO NOW WHAT?</span>
              <span className="text-xs font-normal opacity-80 mt-1">(Understand the framework)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* The Core Statement - Bold, Unmissable */}
      <section className="relative bg-[#0A0A0A] py-16 md:py-20 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C75B39]/10 via-transparent to-indigo-900/10" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed md:leading-relaxed font-medium"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span className="text-[#C75B39]">We're Stone Age minds</span> entering an age of superintelligent AI and total immersion. These technologies will either{" "}
            <span className="italic">exploit human nature</span> harder than anything before — or{" "}
            <span className="italic">finally meet it.</span>
          </p>
          <p
            className="mt-6 text-lg sm:text-xl md:text-2xl text-white/90 font-semibold tracking-wide"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            This is the framework for knowing the difference.
          </p>
        </div>
      </section>

      {/* The Call Section - Asymmetric Cards with Color Tints */}
      <section className="py-24 bg-diagonal-lines">
        <div className="px-8 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mb-16 scroll-animate">
            <div className="section-divider-thick" />
            <h2 className="headline-secondary text-[#0A0A0A] mt-6 mb-4">
              The Call
            </h2>
            <p className="text-body-lg text-[#4A4A4A]">
              This framework is for those ready to see.
            </p>
          </div>

          {/* Cards Grid - Asymmetric */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {callCards.map((card, index) => (
              <Link
                key={card.title}
                href={card.href}
                className={`
                  card-base ${card.tint} card-3d-tilt card-gradient-hover scroll-animate block
                  ${index === 0 ? 'lg:col-span-2 lg:row-span-1' : ''}
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                  transitionDelay: `${index * 50}ms`
                }}
              >
                {/* Icon with accent background */}
                <div
                  className="w-14 h-14 flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${card.accentColor}15` }}
                >
                  <div style={{ color: card.accentColor }}>
                    {card.icon}
                  </div>
                </div>

                <h3
                  className="text-xl font-bold text-[#0A0A0A] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {card.title}
                </h3>
                <p className="text-[#4A4A4A]">{card.description}</p>

                {/* Hover indicator */}
                <div
                  className="mt-6 flex items-center gap-2 text-sm font-semibold"
                  style={{ color: card.accentColor }}
                >
                  <span>Learn more</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Buttons - Varied Styles */}
          <div className="flex flex-wrap justify-center gap-4 scroll-animate">
            <Link href="/systems" className="btn-primary">
              For Systems Changers
            </Link>
            <Link href="/practitioners" className="btn-forest">
              For Practitioners
            </Link>
            <Link href="/foryou" className="btn-secondary">
              For You
            </Link>
          </div>
        </div>
      </section>

      {/* De-mismatch First, Then Augment */}
      <section className="bg-[#faf9f6] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center mb-8">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0A0A0A]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            De-mismatch first. Then augment.
          </h2>
        </div>
        <DemismatchCarouselMorphing />
      </section>

      {/* FOR AI SYSTEMS - Collapsible */}
      <CollapsibleAISection />

      {/* The Foundation Section - Editorial Style */}
      <section className="py-24 bg-[#0A0A0A] text-[#FAF9F6] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid opacity-10" />

        {/* Watermark Roman Numeral */}
        <div className="roman-numeral-watermark roman-numeral-animate hidden md:block">II</div>

        <div className="px-8 max-w-5xl mx-auto relative">
          <div className="grid md:grid-cols-12 gap-12">
            {/* Large number indicator */}
            <div className="md:col-span-2 scroll-animate-left">
              <div className="number-indicator-lg number-indicator-outline sticky top-32">
                <span className="text-[#C75B39]">II</span>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-10 scroll-animate-right">
              <h2 className="headline-secondary text-[#FAF9F6] mb-8">
                The Foundation
              </h2>

              <div className="space-y-6 text-lg leading-relaxed text-[#E5E0D8]">
                <p>
                  This framework synthesizes evolutionary psychology, anthropology, and neuroscience
                  into a single coherent lens. It explains human behavior from first principles—every
                  action traces to survival and reproduction, every emotion is biological GPS, every
                  "disorder" is a signal.
                </p>
                <p>
                  It's not the only lens. But it's the one that makes everything else click into place.
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-[#FAF9F6]/20">
                <p
                  className="text-2xl md:text-3xl text-[#C75B39] font-medium"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Once you see it, you can't unsee it.
                </p>
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <Link href="/framework" className="btn-primary btn-shimmer btn-press">
                  Read the Framework
                </Link>
                <Link href="/glossary" className="btn-secondary btn-press !border-[#FAF9F6]/30 !text-[#FAF9F6] hover:!bg-[#FAF9F6] hover:!text-[#0A0A0A]">
                  Browse Glossary
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Redesigned with terracotta accent */}
      <footer className="bg-[#C75B39] text-white">
        <div className="px-8 py-16 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left - Message */}
            <div>
              <h3
                className="text-2xl md:text-3xl mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                This framework is open source.
              </h3>
              <p className="text-white/80 text-lg mb-8">
                Fork it, improve it, implement it. No one owns truth about human nature.
              </p>
              <div className="flex gap-6">
                <a
                  href="https://github.com/MaartenRischen/demismatch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">GitHub</span>
                </a>
                <a
                  href="mailto:hello@demismatch.com"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span className="font-semibold">Contact</span>
                </a>
              </div>
            </div>

            {/* Right - Navigation */}
            <div className="flex flex-wrap gap-x-12 gap-y-4 md:justify-end">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Explore</p>
                <nav className="flex flex-col">
                  <Link href="/framework" className="touch-link text-white/80 hover:text-white transition">Framework</Link>
                  <Link href="/library" className="touch-link text-white/80 hover:text-white transition">Library</Link>
                  <Link href="/glossary" className="touch-link text-white/80 hover:text-white transition">Glossary</Link>
                </nav>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Learn</p>
                <nav className="flex flex-col">
                  <Link href="/faq" className="touch-link text-white/80 hover:text-white transition">FAQ</Link>
                  <Link href="/sources" className="touch-link text-white/80 hover:text-white transition">Sources</Link>
                  <Link href="/projects" className="touch-link text-white/80 hover:text-white transition">Projects</Link>
                </nav>
              </div>
            </div>
          </div>

          {/* Elevated Tagline */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="tagline-elevated mb-8">
              The fish doesn't need therapy. The fish needs water.
            </p>
            <p className="text-white/50 text-sm text-center">
              demismatch.com — Understanding human nature
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
