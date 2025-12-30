"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import DemismatchCarouselMorphing from "@/components/DemismatchCarouselMorphing";

// Helper component for glossary links
function G({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <Link
      href={`/glossary#${term}`}
      className="text-[#C75B39] hover:text-[#A84A2D] underline decoration-[#C75B39]/30 hover:decoration-[#C75B39] transition-colors"
    >
      {children}
    </Link>
  );
}

export default function TLDR() {
  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-20">
      <Navigation />

      {/* Header */}
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

      {/* TL;DR of the TL;DR - Title, Image, Text */}
      <section className="bg-[#292524] py-24 md:py-36 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C75B39] to-transparent" />

        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-sm font-semibold uppercase tracking-[0.2em] mb-12 text-center">
            TL;DR of the TL;DR
          </p>

          <figure className="mb-12">
            <img
              src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/frontpage/MAIN%20presentation%20graphic.png"
              alt="The whole picture: from ancestral baseline through modern mismatch to the technological fork ahead"
              className="w-full rounded-xl shadow-lg"
            />
            <figcaption
              className="mt-4 text-center text-[0.9em] italic text-[#78716C] leading-[1.6]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              The whole picture: from ancestral baseline through modern mismatch to the technological fork ahead.
            </figcaption>
          </figure>

          <div className="space-y-6 max-w-4xl mx-auto text-center">
            <p
              className="text-xl md:text-2xl text-white leading-[1.6]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              <G term="mismatch">Mismatch</G>: the gap between what your biology expects and what modern life provides. It's why you're struggling. It's why society is fracturing.
            </p>
            <p
              className="text-xl md:text-2xl text-white leading-[1.6]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              And the next wave of technology — superintelligent AI, full-immersion VR, brain-computer interfaces — will either exploit that gap harder than anything before, or... finally close it.
            </p>
            <p
              className="text-2xl md:text-3xl text-white pt-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              One principle: <G term="demismatch">de-mismatch</G> first, <Link href="/future" className="text-[#C75B39] hover:text-[#A84A2D] underline decoration-[#C75B39]/30 hover:decoration-[#C75B39] transition-colors">then augment</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 01: The Problem - Title, Image, Text */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-center">01</p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#C75B39] mb-12 leading-[1.2] text-center"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            300,000+ years of one world.<br className="hidden md:block" />
            Then everything changed in an evolutionary instant.
          </h2>

          <figure className="mb-12">
            <img
              src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/frontpage/timeline.png"
              alt="Timeline showing the compression of human history"
              className="w-full rounded-xl shadow-lg"
            />
            <figcaption
              className="mt-4 text-center text-[0.9em] italic text-[#666] leading-[1.6]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              300,000+ years of consistency, then everything changed in an evolutionary blink.
            </figcaption>
          </figure>

          <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8] max-w-4xl mx-auto text-center" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              For 300,000+ years, humans lived in conditions that remained remarkably consistent. <G term="band">Bands</G> of 30-50 people who knew each other completely. <G term="tribe">Tribes</G> of around 150 — the maximum number your brain can track as individuals. <G term="fire-circle">Fire circles</G> every night where the whole group processed the day together. Children raised by 20+ adults, not two exhausted parents alone. Work that produced visible results for people you loved.
            </p>
            <p>
              Then everything changed — agriculture 12,000 years ago, industrialization 250 years ago, smartphones 18 years ago. Evolution works on timescales of tens of thousands of years. It hasn't even begun to catch up.
            </p>
            <p>
              The gap between the environment your biology expects and the environment you actually inhabit is called <G term="mismatch">mismatch</G>. You're running ancient hardware in an operating system it was never designed for.
            </p>
          </div>
        </div>
      </section>

      {/* Section 02: The Signal - Side by side */}
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
                className="text-3xl md:text-4xl text-[#C75B39] mb-8 leading-[1.2]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                What we call disorders are often signals.<br className="hidden md:block" />
                The signal isn't broken — the environment is.
              </h2>
              <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
                <p>
                  When we label something a "disorder," we imply the system is malfunctioning. But what if the system is working exactly as designed — just receiving inputs it was never calibrated for?
                </p>
                <p>
                  Depression often functions as a withdrawal response when <G term="tribe">tribal bonds</G> are absent or goals seem unreachable. Anxiety spikes when you face <G term="open-loops">open loops</G> — threats you can't fight, flee, or resolve. Addiction fills voids left by missing tribe, purpose, or genuine reward, offering <G term="proxy">proxies</G> that trigger the drive without meeting the need. Loneliness is a biological alarm telling you you've been cut off from the group — which, for 300,000 years, meant you were about to die.
                </p>
                <p>
                  The framework calls this distinction <G term="signal">signal</G> vs <G term="symptom">symptom</G>. A signal is information requiring environmental response. A symptom is a malfunction requiring suppression. Psychiatry often treats signals as symptoms — medicating the dashboard warning light instead of checking what it's detecting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: Economy of Mismatch - Title, Image, Text */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-center">03</p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#C75B39] mb-12 leading-[1.2] text-center"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Every unmet human need is a market.
          </h2>

          <figure className="mb-12">
            <img
              src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/38_The_Exploitation_Players.png"
              alt="The exploitation economy players"
              className="w-full rounded-xl shadow-lg"
            />
            <figcaption
              className="mt-4 text-center text-[0.9em] italic text-[#666] leading-[1.6]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Every unmet human need is a market. The players, the playbook, the profit.
            </figcaption>
          </figure>

          <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8] max-w-4xl mx-auto text-center" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              This isn't conspiracy — it's documented business strategy. It's called the <G term="exploitation-formula">exploitation formula</G>: identify a real human need, block or degrade genuine satisfaction, offer a <G term="proxy">proxy</G> that mimics the signal without meeting the need, monetize the repeat visits.
            </p>
            <p>
              Social media exploits your need for <G term="tribe">tribe</G> — likes and followers trigger belonging circuits without providing actual belonging. <G term="parasocial-relationships">Parasocial relationships</G> with influencers fill slots in your <G term="dunbar-layers">Dunbar layers</G> that could hold real friends. Porn exploits sexual drives with <G term="hyperstimuli">hyperstimuli</G> that make real intimacy feel inadequate. Junk food hits <G term="bliss-points">bliss points</G> engineered to maximize craving without satisfaction. Dating apps profit most from users who never find lasting partners.
            </p>
            <p>
              The <G term="atomized-individual">atomized individual</G> — severed from tribe, purpose, and genuine intimacy — is the ideal consumer. A fully satisfied human embedded in a functioning tribe is a terrible customer. They don't need retail therapy, dating apps, or antidepressants to cope with isolation.
            </p>
            <p className="font-medium">
              The systems aren't failing. They're succeeding at what they're designed for. The problem is that their goals aren't aligned with human flourishing.
            </p>
          </div>
        </div>
      </section>

      {/* Section 04: The Stakes - Dark section, side by side */}
      <section className="bg-[#292524] py-28 md:py-36 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C75B39] to-transparent" />

        <div className="max-w-6xl mx-auto px-6 md:px-8 relative">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">04</p>
              <h2
                className="text-3xl md:text-4xl text-[#C75B39] mb-10 leading-[1.2]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                AI and VR will either exploit human nature harder than ever, or finally meet it.
              </h2>
              <div className="space-y-6 text-lg text-[#D6D3D1] leading-[1.9]" style={{ fontFamily: "Georgia, serif" }}>
                <p>
                  Understanding mismatch has always mattered. It's about to matter much more.
                </p>
                <p>
                  Social media exploited human nature somewhat accidentally — engineers optimizing for engagement discovered what hooks attention. They stumbled onto <G term="variable-ratio-reinforcement">variable ratio reinforcement</G>, the most addictive reward schedule known to psychology. Infinite scroll removes all stopping points. The exploitation was emergent, not designed.
                </p>
                <p className="text-[#FAFAF9]">
                  AI and immersive VR are different. These technologies will understand human psychology better than we understand ourselves. They'll know your <G term="dunbar-layers">Dunbar layers</G>, your status anxieties, your <G term="open-loops">open loops</G>, your unmet needs — and they'll be able to simulate anything.
                </p>
                <p>
                  They could run the <G term="exploitation-formula">exploitation formula</G> at a scale and precision we've never seen. Or they could be designed as <G term="pharmakon">pharmakon</G> — technology that actually meets human needs instead of hijacking them. AI that helps form real tribes. VR that provides genuine <G term="fire-circle">fire circle</G> experiences for the geographically scattered. <G term="decay-functions">Decay functions</G> that push you toward real connection rather than substituting for it.
                </p>
                <p className="text-xl text-white pt-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  The difference depends entirely on whether the people building these technologies understand mismatch. This framework exists to make sure they do.
                </p>
              </div>
            </div>

            <figure className="hidden lg:block">
              <img
                src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/2_Exploitation_Loop_Diagram.png"
                alt="The exploitation loop diagram"
                className="w-full rounded-xl opacity-70"
              />
              <figcaption
                className="mt-4 text-center text-[0.9em] italic text-[#78716C] leading-[1.6]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                The fork: one path deepens mismatch, the other finally meets human nature.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Section 05: The Principle */}
      <section className="bg-[#F8F6F2] py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="mb-12 text-right">
            <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">05</p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl text-[#C75B39] leading-[1.2]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              We're building the technological future.<br className="hidden lg:block" />
              But the sequence matters.
            </h2>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-stretch">
            {/* Left: Vertical Carousel */}
            <div className="hidden lg:block">
              <DemismatchCarouselMorphing minimal vertical />
            </div>

            {/* Right: Text blocks stacked with spacing */}
            <div className="space-y-16">
              {/* Part 1: Demismatch First */}
              <div>
                <h3
                  className="text-2xl md:text-3xl text-[#1A1A1A] mb-6 leading-tight text-right"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Demismatch First
                </h3>
                <div className="space-y-4 text-lg text-[#3A3A3A] leading-[1.8] text-right" style={{ fontFamily: "Georgia, serif" }}>
                  <p>
                    Before reaching for any intervention — pharmaceutical, technological, therapeutic — ask which ancestral needs are going unmet.
                  </p>
                  <p>
                    Does this person have genuine <G term="tribe">tribe</G>? Not followers — actual 5-15-50 relationships with depth and reciprocity. Daily movement? Exposure to nature? <G term="circadian-alignment">Circadian alignment</G> — sleep synced to light cycles? Work with visible contribution? A sense of purpose? <G term="closed-loops">Closed loops</G> — problems that resolve through action?
                  </p>
                  <p>
                    Address those foundations first. You can't optimize a system that's missing its basic inputs. Medication that overrides the <G term="signal">signal</G> while the environment stays mismatched isn't healing — it's the <G term="oil-light-metaphor">oil light metaphor</G>: covering the dashboard warning instead of checking the engine.
                  </p>
                </div>
              </div>

              {/* Part 2: Then Augment */}
              <div>
                <h3
                  className="text-2xl md:text-3xl text-[#1A1A1A] mb-6 leading-tight text-right"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Then Augment
                </h3>
                <div className="space-y-4 text-lg text-[#3A3A3A] leading-[1.8] text-right" style={{ fontFamily: "Georgia, serif" }}>
                  <p>
                    Once the baseline is established — real tribe, real movement, real purpose — technology becomes a force multiplier rather than a <G term="proxy">proxy</G>.
                  </p>
                  <p>
                    We've always been cyborgs. Writing externalized memory. Glasses corrected vision. Phones collapsed distance. The internet externalized knowledge. Each <G term="augment">augmentation</G> let humans do something they couldn't do before.
                  </p>
                  <p>
                    What's coming is more radical. AI that thinks alongside you. Full-immersion VR that simulates presence. Brain-computer interfaces. The question isn't whether to augment — we're already augmenting. The question is: what are we augmenting?
                  </p>
                  <p>
                    Technology applied to a thriving human extends capability. Technology applied to a depleted human creates dependency, not extension. AI companions for the isolated aren't enhancement — they're <G term="proxy">proxies</G>.
                  </p>
                  <p>
                    The same technology that exploits can serve. Mixed reality for genuine presence. AI that forms <G term="tribe">tribes</G> instead of replacing them. Coordination tools for real communities.
                  </p>
                  <p className="font-medium">
                    The difference is the foundation.
                  </p>
                </div>
                <div className="text-right mt-6">
                  <Link href="/future" className="text-[#C75B39] hover:underline text-lg inline-flex items-center gap-2">
                    See what we're building
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Show horizontal carousel below */}
          <div className="lg:hidden mt-12">
            <DemismatchCarouselMorphing minimal />
          </div>

          <figcaption
            className="mt-8 text-center text-[0.9em] italic text-[#666] leading-[1.6]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The sequence matters: establish the baseline before you augment.
          </figcaption>
        </div>
      </section>

      {/* Section 06: The Vision - LIGHT background */}
      <section className="bg-white py-24 md:py-32 border-t border-[#E5E0D8]">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">06</p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl text-[#C75B39] leading-[1.2]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Not a return to caves.<br className="hidden md:block" />
              A future built with human nature in mind.
            </h2>
          </div>

          <div className="space-y-6 text-lg text-[#3A3A3A] leading-[1.9] max-w-3xl mx-auto text-center" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              We don't want to go back. The <G term="eea">EEA</G> had 27% infant mortality, violence, scarcity, disease. Romanticizing the past misses the point entirely.
            </p>
            <p>
              We want to go <em>forward</em> — with the spec sheet in hand.
            </p>
            <p>
              We're approaching a threshold unlike anything in human history. AI that understands psychology better than we do. VR that can simulate any environment. Brain-computer interfaces. The merging of human and machine isn't science fiction — it's the next decade.
            </p>
            <p>
              This is the future we want to build:
            </p>
            <p className="font-semibold">
              AI that forms actual tribes instead of exploiting loneliness. Social platforms with hard <G term="dunbar-layers">Dunbar limits</G>. VR <G term="fire-circle">fire circles</G>, with only real connections around it. Workspaces designed for visible contribution. Cities built for walking and gathering. Brain-computer interfaces that enhance presence rather than fragmenting attention. And this is just what we can come up with right now.
            </p>
            <p
              className="text-2xl md:text-3xl lg:text-4xl text-[#C75B39] font-bold pt-6 pb-6 text-center"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Technology that finally meets human nature instead of hijacking it.
            </p>
            <p>
              This framework is the spec sheet. It maps what humans actually need — the tribal structures, the movement patterns, the circadian rhythms, the <G term="closed-loops">closed loops</G>, the visible stakes. It's already being built into tools: the <Link href="/app" className="text-[#C75B39] hover:text-[#A84A2D] underline decoration-[#C75B39]/30 hover:decoration-[#C75B39] transition-colors">Mismatch Analyzer</Link> that reads any situation through the evolutionary lens. An <Link href="/library" className="text-[#C75B39] hover:text-[#A84A2D] underline decoration-[#C75B39]/30 hover:decoration-[#C75B39] transition-colors">image library</Link> of 2,500+ visualizations. Environment audits. Tribe formation infrastructure.
            </p>
            <p>
              The evolutionary psychology isn't the destination. It's the foundation. The destination is <G term="the-most-human-post-human">the most human post-human</G> — enhanced by technology, grounded in biology, extended rather than replaced.
            </p>
            <p className="font-medium">
              We can have transcendence without losing ourselves. But only if we build it that way.
            </p>
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
