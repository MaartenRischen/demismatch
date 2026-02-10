"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import CollapsibleAISection from "@/components/CollapsibleAISection";

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

export default function Home() {
  const scrollRef = useScrollAnimation();

  return (
    <main ref={scrollRef} className="min-h-screen bg-[#faf9f6] pt-20 relative">
      <Navigation />

      {/* Hero Section - Three Column Layout with Central Image */}
      <section className="relative overflow-hidden bg-[#faf9f6] wave-divider">
        <div className="px-6 md:px-8 py-16 md:py-20 lg:py-24 max-w-7xl mx-auto">
          {/* Desktop Layout: Text overlaid on eye */}
          <div className="hidden lg:block">
            <div className="relative -mx-6 md:-mx-8">
              {/* Eye Image - Full width background with iris focus effect */}
              <div className="relative w-full eye-glow-pulse">
                <div
                  className="relative overflow-hidden aspect-video"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
                    WebkitMaskComposite: 'destination-in',
                    maskComposite: 'intersect'
                  }}
                >
                  {/* Blurred background layer - gets more blurry as zoom increases */}
                  <img
                    src="/storage/frontpage/eye.png?v=2"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover eye-blur-layer"
                    style={{ objectPosition: '50% 40%' }}
                  />
                  {/* Sharp iris layer - circular mask keeps iris sharp */}
                  <img
                    src="/storage/frontpage/eye.png?v=2"
                    alt="Human eye - bridging signal and stakes"
                    className="relative w-full h-full object-cover eye-sharp-layer"
                    style={{ objectPosition: '50% 40%' }}
                  />
                </div>
              </div>

              {/* Text overlaid on eye - top-left and bottom-right corners */}
              <div className="absolute inset-0 px-12 xl:px-20 py-10 xl:py-14">
                {/* Top-left text - Signal */}
                <div className="absolute top-10 xl:top-14 left-12 xl:left-20 max-w-md">
                  <h1
                    className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-white"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.5)' }}
                  >
                    We evolved for a world that no longer exists.
                  </h1>
                  <p className="text-base lg:text-lg text-white/95 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textShadow: '0 1px 6px rgba(0,0,0,0.9), 0 2px 15px rgba(0,0,0,0.7), 0 0 30px rgba(0,0,0,0.5)' }}>
                    That's why you feel the way you feel. Depression, anxiety, addiction: these aren't malfunctions. They're your <strong>biology correctly signaling that something is wrong with your environment, not with you.</strong>
                  </p>
                </div>

                {/* Bottom-right text - Stakes */}
                <div className="absolute bottom-10 xl:bottom-14 right-12 xl:right-20 max-w-xl text-right">
                  <h2
                    className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-white"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.5)' }}
                  >
                    The most powerful technologies in history are arriving.
                  </h2>
                  <p className="text-base lg:text-lg text-white/95 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textShadow: '0 1px 6px rgba(0,0,0,0.9), 0 2px 15px rgba(0,0,0,0.7), 0 0 30px rgba(0,0,0,0.5)' }}>
                    AI and total immersion will either <strong>exploit human nature</strong> harder than anything before — <strong>or finally meet it.</strong> This is the framework for knowing the difference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout: Text overlaid on eye */}
          <div className="lg:hidden">
            <div className="relative -mx-6 md:-mx-8">
              {/* Eye Image - Full width background with iris focus effect */}
              <div className="relative w-full eye-glow-pulse">
                <div
                  className="relative overflow-hidden aspect-[9/10] sm:aspect-video"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)',
                    WebkitMaskComposite: 'destination-in',
                    maskComposite: 'intersect'
                  }}
                >
                  {/* Blurred background layer - gets more blurry as zoom increases */}
                  <img
                    src="/storage/frontpage/eye.png?v=2"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover eye-blur-layer-mobile"
                    style={{ objectPosition: '50% 20%' }}
                  />
                  {/* Sharp iris layer - circular mask keeps iris sharp */}
                  <img
                    src="/storage/frontpage/eye.png?v=2"
                    alt="Human eye - bridging signal and stakes"
                    className="relative w-full h-full object-cover eye-sharp-layer-mobile"
                    style={{ objectPosition: '50% 20%' }}
                  />
                </div>
              </div>

              {/* Text overlaid on eye - stacked vertically */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
                {/* Top text - Signal */}
                <div className="max-w-sm">
                  <h1
                    className="text-2xl sm:text-3xl font-bold tracking-tight leading-[1.15] mb-3 text-white"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.5)' }}
                  >
                    We evolved for a world that no longer exists.
                  </h1>
                  <p className="text-sm sm:text-base text-white/95 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textShadow: '0 1px 6px rgba(0,0,0,0.9), 0 2px 15px rgba(0,0,0,0.7), 0 0 30px rgba(0,0,0,0.5)' }}>
                    That's why you feel the way you feel. Depression, anxiety, addiction — these aren't malfunctions. They're your <strong>biology correctly signaling that something is wrong with your environment, not with you.</strong>
                  </p>
                </div>

                {/* Bottom text - Stakes */}
                <div className="max-w-sm self-end text-right">
                  <h2
                    className="text-2xl sm:text-3xl font-bold tracking-tight leading-[1.15] mb-3 text-white"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.5)' }}
                  >
                    The most powerful technologies in history are arriving.
                  </h2>
                  <p className="text-sm sm:text-base text-white/95 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textShadow: '0 1px 6px rgba(0,0,0,0.9), 0 2px 15px rgba(0,0,0,0.7), 0 0 30px rgba(0,0,0,0.5)' }}>
                    AI and total immersion will either <strong>exploit human nature</strong> harder than anything before — <strong>or finally meet it.</strong> This is the framework for knowing the difference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - Centered */}
          <div className="text-center animate-fade-in-up delay-300">
            <Link href="/tldr" className="btn-primary btn-shimmer btn-press inline-flex flex-col items-center text-center px-10 py-5">
              <span className="text-lg font-bold tracking-wide">SO NOW WHAT?</span>
              <span className="text-xs font-normal opacity-80 mt-1">(2 minute overview)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Frame-breaker STICKER - Overlaid, unmissable */}
      <div className="relative py-8 md:py-12 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div
            className="relative bg-[#FFFEF5] border-2 border-[#1A1A1A] p-6 md:p-10 shadow-[8px_8px_0px_0px_#1A1A1A] transform rotate-[-0.5deg] hover:rotate-0 transition-transform duration-300"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 27px, #E8E4D9 28px)',
              backgroundSize: '100% 28px'
            }}
          >
            {/* Tape effect top */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-[#F5E6C8] opacity-80 rotate-1" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />

            {/* NOT section */}
            <div className="mb-6 pb-6 border-b-2 border-dashed border-[#C75B39]">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#C75B39] mb-3 text-center">
                ✕ What this is NOT ✕
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {['Going back', 'A commune', 'Primitivism', 'Anti-tech', 'Forced togetherness', 'Lifestyle advice', 'Utopia'].map((item) => (
                  <span key={item} className="px-3 py-1 bg-[#1A1A1A] text-white text-sm font-bold line-through decoration-[#C75B39] decoration-2">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* IS section */}
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#2D5A27] mb-4">
                ✓ What this IS ✓
              </p>
              <p className="text-xl md:text-2xl text-[#1A1A1A] leading-snug mb-4 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Your suffering is not a chemical accident.<br />
                It's an accurate signal that something essential is missing.
              </p>
              <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
                This framework identifies what's missing, why it's missing, and what would need to exist for humans to actually thrive — using every tool available, including technology.
              </p>
              <p className="text-2xl md:text-3xl text-[#C75B39] font-black mt-6 tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                ESPECIALLY TECHNOLOGY.
              </p>
            </div>

            {/* Corner fold effect */}
            <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] border-b-[#E5E0D8]" />
          </div>
        </div>
      </div>

      {/* Navigation Grid - Two-tier magazine layout */}
      <section className="py-20 md:py-28 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">

          {/* TOP TIER - Hero Size (9 tiles) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 scroll-animate">
            {/* TL;DR */}
            <Link href="/tldr" className="group bg-white border border-[#E5E0D8] p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#1A1A1A]/5">
                <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" d="M16 4l2 2M8 4L6 6" />
                </svg>
              </div>
              <p className="text-lg text-[#1A1A1A] font-semibold mb-2 group-hover:text-[#C75B39] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Get the idea in two minutes.</p>
              <p className="text-sm text-[#6A6A6A] leading-relaxed">The short version.</p>
            </Link>

            {/* Framework */}
            <Link href="/framework" className="group bg-white border border-[#E5E0D8] p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#1A1A1A]/5">
                <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
                </svg>
              </div>
              <p className="text-lg text-[#1A1A1A] font-semibold mb-2 group-hover:text-[#C75B39] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>See the full framework.</p>
              <p className="text-sm text-[#6A6A6A] leading-relaxed">Pattern, machinery, violations, exploitation, destination.</p>
            </Link>

            {/* Future */}
            <Link href="/future" className="group bg-white border border-[#E5E0D8] p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#1A1A1A]/5">
                <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M12 5l-4 6M12 5l4 6M6 19h12" />
                </svg>
              </div>
              <p className="text-lg text-[#1A1A1A] font-semibold mb-2 group-hover:text-[#C75B39] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>See where technology is taking us.</p>
              <p className="text-sm text-[#6A6A6A] leading-relaxed">The fork ahead.</p>
            </Link>

            {/* Projects */}
            <Link href="/projects" className="group bg-white border border-[#E5E0D8] p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#1A1A1A]/5">
                <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
              <p className="text-lg text-[#1A1A1A] font-semibold mb-2 group-hover:text-[#C75B39] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>See what's already being built.</p>
              <p className="text-sm text-[#6A6A6A] leading-relaxed">Live tools and what's coming.</p>
            </Link>
          </div>

          {/* Middle row - 3 wide hero tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 scroll-animate">
            {/* Analyzer */}
            <Link href="/app" className="group bg-white border border-[#E5E0D8] p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#C75B39]/10">
                <svg className="w-8 h-8 text-[#C75B39]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                  <path d="M11 8v6M8 11h6" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-lg text-[#1A1A1A] font-semibold mb-2 group-hover:text-[#C75B39] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Analyze any situation through the framework.</p>
              <p className="text-sm text-[#6A6A6A] leading-relaxed">AI-powered.</p>
            </Link>

            {/* Library */}
            <Link href="/library" className="group bg-white border border-[#E5E0D8] p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#1A1A1A]/5">
                <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <p className="text-lg text-[#1A1A1A] font-semibold mb-2 group-hover:text-[#C75B39] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Browse the visual library.</p>
              <p className="text-sm text-[#6A6A6A] leading-relaxed">2,500+ images, searchable.</p>
            </Link>

            {/* For You */}
            <Link href="/foryou" className="group bg-white border border-[#E5E0D8] p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#1A1A1A]/5">
                <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="12" cy="7" r="4" />
                  <path strokeLinecap="round" d="M5.5 21v-2a5 5 0 015-5h3a5 5 0 015 5v2" />
                  <path d="M17 10l2 2m0-2l-2 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-lg text-[#1A1A1A] font-semibold mb-2 group-hover:text-[#C75B39] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Understand what's actually happening to you.</p>
              <p className="text-sm text-[#6A6A6A] leading-relaxed">For those in pain.</p>
            </Link>
          </div>

          {/* Bottom hero row - 2 wide tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10 scroll-animate">
            {/* Practitioners */}
            <Link href="/practitioners" className="group bg-white border border-[#E5E0D8] p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#1A1A1A]/5">
                <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="8" cy="7" r="3" />
                  <circle cx="16" cy="7" r="3" />
                  <path strokeLinecap="round" d="M3 21v-1a4 4 0 014-4h2a4 4 0 014 4v1M15 21v-1a4 4 0 014-4h0a4 4 0 014 4v1" />
                  <path d="M12 12v4M10 14h4" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-lg text-[#1A1A1A] font-semibold mb-2 group-hover:text-[#C75B39] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Get a reframe for the people you help.</p>
              <p className="text-sm text-[#6A6A6A] leading-relaxed">For therapists, parents, educators.</p>
            </Link>

            {/* Systems */}
            <Link href="/systems" className="group bg-white border border-[#E5E0D8] p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#1A1A1A]/5">
                <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <path d="M3 9h18M9 9v11M15 9v11M3 14h18" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-lg text-[#1A1A1A] font-semibold mb-2 group-hover:text-[#C75B39] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>See what humans actually require.</p>
              <p className="text-sm text-[#6A6A6A] leading-relaxed">For builders and policy makers.</p>
            </Link>
          </div>

          {/* SECOND TIER - Smaller Size (8 tiles) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 scroll-animate">
            {/* Cases */}
            <Link href="/cases" className="group bg-white border border-[#E5E0D8] p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-9 h-9 mb-3 flex items-center justify-center rounded-lg bg-[#6B7B8A]/10">
                <svg className="w-5 h-5 text-[#6B7B8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  <circle cx="12" cy="13" r="2" />
                </svg>
              </div>
              <p className="text-sm text-[#1A1A1A] font-medium mb-1 group-hover:text-[#6B7B8A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>See the mismatch in real cases.</p>
              <p className="text-xs text-[#8B8B8B]">Hikikomori. Foxconn. The loneliness epidemic.</p>
            </Link>

            {/* Stats */}
            <Link href="/stats" className="group bg-white border border-[#E5E0D8] p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-9 h-9 mb-3 flex items-center justify-center rounded-lg bg-[#6B7B8A]/10">
                <svg className="w-5 h-5 text-[#6B7B8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <p className="text-sm text-[#1A1A1A] font-medium mb-1 group-hover:text-[#6B7B8A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>See the damage in numbers.</p>
              <p className="text-xs text-[#8B8B8B]">Loneliness. Obesity. Sleep. Screen time.</p>
            </Link>

            {/* Glossary */}
            <Link href="/glossary" className="group bg-white border border-[#E5E0D8] p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-9 h-9 mb-3 flex items-center justify-center rounded-lg bg-[#6B7B8A]/10">
                <svg className="w-5 h-5 text-[#6B7B8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-sm text-[#1A1A1A] font-medium mb-1 group-hover:text-[#6B7B8A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Learn the vocabulary.</p>
              <p className="text-xs text-[#8B8B8B]">65 terms defined.</p>
            </Link>

            {/* Research */}
            <Link href="/research" className="group bg-white border border-[#E5E0D8] p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-9 h-9 mb-3 flex items-center justify-center rounded-lg bg-[#6B7B8A]/10">
                <svg className="w-5 h-5 text-[#6B7B8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M6 4v16M18 4v16M3 8h18M3 16h18" />
                </svg>
              </div>
              <p className="text-sm text-[#1A1A1A] font-medium mb-1 group-hover:text-[#6B7B8A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>See how we measure this.</p>
              <p className="text-xs text-[#8B8B8B]">The methodology.</p>
            </Link>

            {/* Sources */}
            <Link href="/sources" className="group bg-white border border-[#E5E0D8] p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-9 h-9 mb-3 flex items-center justify-center rounded-lg bg-[#6B7B8A]/10">
                <svg className="w-5 h-5 text-[#6B7B8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
              <p className="text-sm text-[#1A1A1A] font-medium mb-1 group-hover:text-[#6B7B8A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Check where every claim comes from.</p>
              <p className="text-xs text-[#8B8B8B]">Full bibliography.</p>
            </Link>

            {/* About */}
            <Link href="/about" className="group bg-white border border-[#E5E0D8] p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-9 h-9 mb-3 flex items-center justify-center rounded-lg bg-[#6B7B8A]/10">
                <svg className="w-5 h-5 text-[#6B7B8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 5v2M12 17v2M5 12h2M17 12h2" strokeLinecap="round" />
                  <path d="M7.05 7.05l1.41 1.41M15.54 15.54l1.41 1.41M7.05 16.95l1.41-1.41M15.54 8.46l1.41-1.41" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-sm text-[#1A1A1A] font-medium mb-1 group-hover:text-[#6B7B8A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>See why this project exists.</p>
              <p className="text-xs text-[#8B8B8B]">The mission.</p>
            </Link>

            {/* HUD */}
            <Link href="/projects/hud/app" className="group bg-white border border-[#E5E0D8] p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-9 h-9 mb-3 flex items-center justify-center rounded-lg bg-[#6B7B8A]/10">
                <svg className="w-5 h-5 text-[#6B7B8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 9v.01M15 12h.01M12 15v.01M9 12h.01" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-sm text-[#1A1A1A] font-medium mb-1 group-hover:text-[#6B7B8A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>See what your brain computes in any image.</p>
              <p className="text-xs text-[#8B8B8B]">Upload and find out.</p>
            </Link>

            {/* FAQ */}
            <Link href="/faq" className="group bg-white border border-[#E5E0D8] p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-9 h-9 mb-3 flex items-center justify-center rounded-lg bg-[#6B7B8A]/10">
                <svg className="w-5 h-5 text-[#6B7B8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-[#1A1A1A] font-medium mb-1 group-hover:text-[#6B7B8A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Get your questions answered.</p>
              <p className="text-xs text-[#8B8B8B]">162 of them.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* What This Is For - 4 Audience Columns */}
      <section className="py-16 md:py-24 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">

          {/* Section Title */}
          <h2
            className="text-2xl md:text-3xl text-center text-[#1A1A1A] mb-12 md:mb-16"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            What this is for
          </h2>

          {/* 4 Audience Columns */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">

            {/* Column 1: For you */}
            <div className="audience-column audience-you">
              <h3 className="audience-header audience-header-you">For you</h3>
              <ul className="audience-list">
                <li><strong>Stop blaming yourself. You're not broken, you're mismatched</strong></li>
                <li>Trust your signals: they're telling you something real</li>
                <li>Find out what you actually need, not what you're sold</li>
                <li>See who profits from your pain. Stop feeding them</li>
                <li><strong>Demand meaning, not just money. UBI isn't enough</strong></li>
                <li>Understand what's coming: AI and VR will either exploit you harder than ever, or finally give you what you need</li>
                <li>Know if it's working. Test your own life against the spec sheet</li>
                <li>Use the tools</li>
                <li><strong>Find your people: role, group, goal</strong></li>
              </ul>
            </div>

            {/* Column 2: For builders */}
            <div className="audience-column audience-builders">
              <h3 className="audience-header audience-header-builders">For builders</h3>
              <ul className="audience-list">
                <li><strong>Build for the spec sheet, not against human nature</strong></li>
                <li>Treat emotions as data. Design systems that listen to signals</li>
                <li>Know the spec sheet: Dunbar layers, fire circles, visible contribution, closed loops, alloparenting</li>
                <li>Stop monetizing mismatch. Every unmet need doesn't have to be a market</li>
                <li>Make automation serve meaning, not just efficiency</li>
                <li><strong>You're building the fork right now. Exploit or meet?</strong></li>
                <li>The most powerful technologies in history are arriving. Point them at the spec sheet</li>
                <li>Test what you build: falsifiable claims, defined failure conditions</li>
                <li><strong>The blueprint exists. Now build</strong></li>
              </ul>
            </div>

            {/* Column 3: For practitioners */}
            <div className="audience-column audience-practitioners">
              <h3 className="audience-header audience-header-practitioners">For practitioners</h3>
              <ul className="audience-list">
                <li><strong>Change the question: from "what's wrong with you" to "what's wrong with your environment"</strong></li>
                <li>Stop overriding signals. Address what they're pointing to</li>
                <li>Know the spec sheet: Dunbar layers, fire circles, visible contribution, closed loops, alloparenting</li>
                <li>Name the exploitation. Help people see the systems, not just their symptoms</li>
                <li><strong>Prepare them for the automation crisis. Meaning won't come from UBI</strong></li>
                <li>Prepare people for immersion. Total immersion is coming whether you like it or not</li>
                <li>Measure what matters: 7 domains, geometric mean, pre-registered weights, defined kill conditions</li>
                <li>Give them tools, not just coping strategies</li>
              </ul>
            </div>

            {/* Column 4: For systems changers */}
            <div className="audience-column audience-systems">
              <h3 className="audience-header audience-header-systems">For systems changers</h3>
              <ul className="audience-list">
                <li><strong>Reframe the crisis: it's environmental, not individual</strong></li>
                <li>Fund mismatch research, not just more drug trials</li>
                <li>Build for tribes. 150 people, not 8 billion strangers</li>
                <li>Regulate the exploitation economy: social media, pharma, food, dating apps, porn, news</li>
                <li>Design automation for meaning. Jobs disappear, purpose doesn't have to</li>
                <li><strong>The exploit path is default. Meeting human nature requires intention</strong></li>
                <li>Regulate before the fork. After is too late</li>
                <li>Demand falsifiability: pre-registered weights, defined kill conditions</li>
              </ul>
            </div>

          </div>

          {/* Footer - The Destination */}
          <div className="mt-16 pt-12 border-t border-[#E5E0D8]">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B8B8B] mb-4">
                The destination
              </p>
              <p
                className="text-lg md:text-xl text-[#1A1A1A] leading-relaxed mb-2 font-semibold"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Do you wake up with a role, in a group, with a goal?
              </p>
              <p
                className="text-lg md:text-xl text-[#1A1A1A] leading-relaxed mb-8"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Demismatch first, then augment. The most human post-human
              </p>
              <p className="text-sm text-[#6A6A6A]">
                53 case studies · 162 FAQs · 65 terms · 2,500+ images · AI analyzer
              </p>
            </div>
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
                  className="text-2xl md:text-3xl text-[#C75B39] font-medium mb-6"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                >
                  Once you see it, you can't unsee it.
                </p>
                <p className="text-lg text-[#E5E0D8] leading-relaxed">
                  The evolutionary psychology is the spec sheet. The exploitation is the warning. The augmented future is the destination.
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
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
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
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
              <img src="/logo.svg" alt="" className="w-5 h-5 opacity-50" />
              <span>demismatch.com — Understanding human nature</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
