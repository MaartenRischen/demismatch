"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-20">
      <Navigation />

      {/* Hero */}
      <header className="py-12 md:py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] mb-4 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            About DEMISMATCH
          </h1>
          <p
            className="text-lg md:text-xl text-[#6A6A6A] leading-relaxed"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Building the technological future that serves human nature.
          </p>
        </div>
      </header>

      {/* Section 1: The Fork */}
      <section className="bg-[#292524] py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C75B39] to-transparent" />

        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2
            className="text-2xl md:text-3xl text-[#C75B39] mb-8"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Fork
          </h2>

          <div className="space-y-6 text-lg text-[#D6D3D1] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              We're approaching a technological singularity. AI that understands human psychology better than we understand ourselves. Full-immersion virtual reality. Brain-computer interfaces. Genetic editing. Neural enhancement.
            </p>
            <p className="text-white">
              This technology will either exploit every vulnerability humans have — running the extraction formula faster and harder than ever before — or it will finally meet human needs in ways nothing else has.
            </p>
            <p>
              Which future we get depends entirely on whether the people building these technologies understand human nature.
            </p>
            <p className="text-xl text-[#C75B39] font-medium pt-4">
              DEMISMATCH exists to make sure they do.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: The Framework */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2
            className="text-2xl md:text-3xl text-[#C75B39] mb-8"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Framework
          </h2>

          <div className="space-y-6 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              The DEMISMATCH framework provides the spec sheet for human nature — what our biology actually needs to thrive, based on 300,000 years of evolution.
            </p>
            <p>
              It identifies the systematic gap between what humans evolved for and what modern environments provide. It documents how this mismatch has been exploited for profit. And it defines what technology, architecture, policy, and community would need to look like to actually work with human nature rather than against it.
            </p>
            <p>
              The evolutionary psychology isn't the destination — it's the foundation. The exploitation documentation isn't doom-mongering — it's the warning. The augmented future is the actual point.
            </p>
            <p className="text-xl text-[#1A1A1A] font-medium pt-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              De-mismatch first. Then augment. The most human post-human.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: The Principle */}
      <section className="bg-[#F8F6F2] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2
            className="text-2xl md:text-3xl text-[#C75B39] mb-8"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Principle
          </h2>

          <div className="space-y-6 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              Before any intervention — pharmaceutical, technological, therapeutic — ask which ancestral needs are going unmet.
            </p>
            <p>
              Before any enhancement — AI assistant, neural interface, virtual world — establish baseline human thriving.
            </p>
            <p className="text-[#1A1A1A] font-medium">
              You can't augment broken. Technology applied to a depleted human creates dependency. Technology applied to a thriving human extends capability.
            </p>
            <p className="text-xl text-[#C75B39] pt-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              The sequence matters.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: The Stakes */}
      <section className="bg-[#292524] py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C75B39] to-transparent" />

        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2
            className="text-2xl md:text-3xl text-[#C75B39] mb-8"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Stakes
          </h2>

          <div className="space-y-6 text-lg text-[#D6D3D1] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              A 29-year-old was euthanized because psychiatrists said "there's nothing more we can do" — without ever trying environmental interventions. That's the cost of not understanding mismatch.
            </p>
            <p>
              Billions spent on social platforms that increase loneliness. Food engineered to override satiety. Dating apps that profit from failed matching. Medication that suppresses signals without addressing what they're signaling. That's the cost of building technology without the spec sheet.
            </p>
            <p className="text-white">
              We're about to build AI systems that will shape human experience more profoundly than anything before. If those systems are built by people who don't understand human nature, we get the dystopian singularity.
            </p>
            <p className="text-xl text-[#C75B39] font-medium pt-4">
              If they're built by people who do — we might finally get it right.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Who Made This */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2
            className="text-2xl md:text-3xl text-[#C75B39] mb-8"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Who Made This
          </h2>

          <div className="space-y-6 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              DEMISMATCH synthesizes decades of research in evolutionary psychology, anthropology, neuroscience, and environmental design into a practical framework for understanding and building for human nature.
            </p>
            <p className="text-[#1A1A1A] font-medium">
              The framework is open. Fork it, improve it, implement it. No one owns truth about human nature.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: The Evidence Base */}
      <section className="bg-[#F8F6F2] py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <h2
            className="text-2xl md:text-3xl text-[#C75B39] mb-8"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Evidence Base
          </h2>

          <p className="text-lg text-[#3A3A3A] leading-[1.8] mb-8" style={{ fontFamily: "Georgia, serif" }}>
            The DEMISMATCH framework draws on peer-reviewed research across multiple disciplines:
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-6">
              <p className="font-semibold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Evolutionary Psychology
              </p>
              <p className="text-sm text-[#4A4A4A]" style={{ fontFamily: "Georgia, serif" }}>
                Tooby, Cosmides, Buss, Pinker
              </p>
            </div>
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-6">
              <p className="font-semibold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Anthropology
              </p>
              <p className="text-sm text-[#4A4A4A]" style={{ fontFamily: "Georgia, serif" }}>
                Sahlins, Lee, Dunbar, Hrdy
              </p>
            </div>
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-6">
              <p className="font-semibold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Social Psychology
              </p>
              <p className="text-sm text-[#4A4A4A]" style={{ fontFamily: "Georgia, serif" }}>
                Baumeister, Cacioppo, Haidt
              </p>
            </div>
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-6">
              <p className="font-semibold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Public Health
              </p>
              <p className="text-sm text-[#4A4A4A]" style={{ fontFamily: "Georgia, serif" }}>
                WHO, Lancet, CDC research
              </p>
            </div>
            <div className="bg-[#292524] border border-[#292524] rounded-xl p-6">
              <p className="font-semibold text-[#C75B39] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Technology & Futures
              </p>
              <p className="text-sm text-[#D6D3D1]" style={{ fontFamily: "Georgia, serif" }}>
                Automation, AI alignment, VR presence, human-computer interaction
              </p>
            </div>
          </div>

          <Link
            href="/sources"
            className="inline-flex items-center gap-2 text-[#C75B39] hover:text-[#A84A2D] font-medium transition-colors"
          >
            View the full sources and bibliography
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Section 7: Get Involved */}
      <section className="bg-[#292524] py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C75B39] to-transparent" />

        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2
            className="text-2xl md:text-3xl text-[#C75B39] mb-8"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Get Involved
          </h2>

          <p className="text-lg text-[#D6D3D1] leading-[1.8] mb-8" style={{ fontFamily: "Georgia, serif" }}>
            We're looking for:
          </p>

          <ul className="space-y-4 text-[#D6D3D1] mb-10" style={{ fontFamily: "Georgia, serif" }}>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>AI developers building systems that serve human nature</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>VR/AR designers creating presence technology</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Architects designing for Dunbar-scale community</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Researchers studying environmental interventions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Community builders forming tribes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Policy makers rethinking mental health, urban planning, work</span>
            </li>
          </ul>

          <p className="text-xl text-white mb-10" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            The future is being built now. Build it right.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/framework"
              className="inline-flex items-center gap-2 bg-[#C75B39] text-white px-8 py-4 font-semibold hover:bg-[#A84A2D] transition-colors"
            >
              Read the Framework
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="mailto:contact@demismatch.com"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-semibold hover:bg-white/10 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* Section 8: Stay Updated */}
      <section className="bg-[#1A1A1A] py-16 md:py-20">
        <div className="max-w-xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Stay Updated
          </h2>
          <p className="text-[#A8A29E] mb-8" style={{ fontFamily: "Georgia, serif" }}>
            Get notified about new research, framework updates, and tools.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Newsletter signup coming soon!");
            }}
          >
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#C75B39]"
            />
            <button
              type="submit"
              className="bg-[#C75B39] text-white px-6 py-3 font-semibold hover:bg-[#A84A2D] transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-[#78716C] mt-4" style={{ fontFamily: "Georgia, serif" }}>
            No spam. Unsubscribe anytime.
          </p>
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
