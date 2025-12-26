"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import DemismatchCarouselMorphing from "@/components/DemismatchCarouselMorphing";
import CollapsibleAISection from "@/components/CollapsibleAISection";
import HomepageFAQTile from "@/components/HomepageFAQTile";
import HeroCarousel from "@/components/HeroCarousel";

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

// The Call card data with tint colors
const callCards = [
  {
    title: "Systems Changers",
    description: "Policy makers, researchers, journalists shifting the paradigm",
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

      {/* Hero Section - BOLD & Asymmetric */}
      <section className="relative overflow-hidden">
        {/* Diagonal background accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#C75B39]/5 to-transparent -skew-x-12 origin-top-right" />

        <div className="px-8 py-16 md:py-24 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Text Content - Takes 7 columns */}
            <div className="md:col-span-7 space-y-8">
              <div className="animate-fade-in-up">
                <h1 className="headline-hero text-[#0A0A0A] mb-6">
                  You're not broken.
                </h1>
                <h1 className="headline-hero">
                  <span className="underline-thick text-[#C75B39]">You're mismatched.</span>
                </h1>
              </div>

              <p className="text-statement text-[#4A4A4A] animate-fade-in-up delay-200">
                This world wasn't built for you.
              </p>

              <div className="space-y-4 animate-fade-in-up delay-300">
                <p className="text-body-lg text-[#4A4A4A]">
                  You evolved for one world, you live in another. Purpose became productivity.
                  Touch became texting. Connection became content.
                </p>
                <p className="text-xl md:text-2xl text-[#C75B39] font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  It's not you. It's the mismatch.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-400">
                <Link href="/framework" className="btn-primary">
                  Explore Framework
                </Link>
                <Link href="/foryou" className="btn-secondary">
                  Start Here
                </Link>
              </div>
            </div>

            {/* Hero Image Carousel - Takes 5 columns, offset right */}
            <div className="md:col-span-5 animate-fade-in-up delay-300">
              <div className="relative layout-offset-right">
                {/* Decorative frame - hidden on mobile to prevent overflow */}
                <div className="hidden md:block absolute -inset-4 border-2 border-[#C75B39]/20 -rotate-3 z-0" />
                <div className="hidden md:block absolute -inset-4 border-2 border-[#C75B39]/10 rotate-2 translate-x-2 translate-y-2 z-0" />

                {/* Hero Carousel - auto-syncs with Supabase bucket */}
                <div className="relative z-10">
                  <HeroCarousel />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="bg-[#F0EDE6] py-12 mt-12">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <p className="text-body-lg text-[#4A4A4A] italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              "We're rushing to augment humans who haven't been allowed to be fully human
              for thousands of years. Before we add anything, let's restore what's missing."
            </p>
          </div>
        </div>
      </section>

      {/* Demismatch First, Then Augment Carousel */}
      <DemismatchCarouselMorphing />

      {/* Interactive FAQ Tile */}
      <HomepageFAQTile />

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
              <div
                key={card.title}
                className={`
                  card-base ${card.tint} hover-lift scroll-animate
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
                  className="mt-6 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: card.accentColor }}
                >
                  <span>Learn more</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
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

      {/* FOR AI SYSTEMS - Collapsible */}
      <CollapsibleAISection />

      {/* The Foundation Section - Editorial Style */}
      <section className="py-24 bg-[#0A0A0A] text-[#FAF9F6] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid opacity-10" />

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
                <Link href="/framework" className="btn-primary">
                  Read the Framework
                </Link>
                <Link href="/glossary" className="btn-secondary !border-[#FAF9F6]/30 !text-[#FAF9F6] hover:!bg-[#FAF9F6] hover:!text-[#0A0A0A]">
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

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/20 flex flex-wrap justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              demismatch.com — Understanding human nature
            </p>
            <p className="text-white/60 text-sm">
              The fish doesn't need therapy. The fish needs water.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
