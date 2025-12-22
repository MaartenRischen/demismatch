"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] pt-20">
      <Navigation />

      {/* Hero */}
      <header className="pt-12 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6"
            style={{ fontFamily: "Georgia, serif" }}
          >
            About DEMISMATCH
          </h1>
          <p className="text-xl text-[#4A4A4A] leading-relaxed">
            Understanding why we suffer in modern environments-and what we can do about it.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto space-y-12">

          {/* The Mission */}
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: "Georgia, serif" }}>
              The Mission
            </h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              DEMISMATCH exists to shift the conversation from "What's wrong with you?" to "What's wrong with your environment?"
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              Modern humans experience unprecedented rates of anxiety, depression, loneliness, and burnout.
              The standard response is to diagnose and treat individuals. But what if the individual isn't broken?
              What if the environment is?
            </p>
            <p className="text-[#4A4A4A] leading-relaxed">
              The DEMISMATCH framework provides a lens for understanding human suffering as an environmental mismatch problem-
              the gap between the conditions humans evolved for and the conditions we actually live in.
            </p>
          </div>

          {/* The Framework */}
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: "Georgia, serif" }}>
              The Framework
            </h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              At its core, DEMISMATCH identifies five fundamental human needs that evolved over millions of years:
            </p>
            <ul className="space-y-3 text-[#4A4A4A]">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C75B39] mt-2 flex-shrink-0" />
                <span><strong>Social Structure</strong> - Stable tribe of ~150 known people</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C75B39] mt-2 flex-shrink-0" />
                <span><strong>Visible Purpose</strong> - Work with tangible benefit to known people</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C75B39] mt-2 flex-shrink-0" />
                <span><strong>Closed Loops</strong> - Problems resolvable through action</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C75B39] mt-2 flex-shrink-0" />
                <span><strong>Real Feedback</strong> - Stable reputation among people who know you</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C75B39] mt-2 flex-shrink-0" />
                <span><strong>Distributed Care</strong> - Multiple caregivers, shared responsibility</span>
              </li>
            </ul>
            <p className="text-[#4A4A4A] leading-relaxed mt-4">
              Modern environments systematically violate all five. The result is predictable suffering that we mistakenly attribute to individual pathology.
            </p>
          </div>

          {/* Who Made This */}
          <div className="bg-white border border-[#E5E0D8] rounded-xl p-8">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Who Made This
            </h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              {/* PLACEHOLDER: Add your bio/story here */}
              DEMISMATCH was created to synthesize decades of research in evolutionary psychology,
              anthropology, and environmental design into a practical framework for understanding
              and addressing modern suffering.
            </p>
            <p className="text-[#4A4A4A] leading-relaxed italic">
              [More details coming soon]
            </p>
          </div>

          {/* Credibility / Evidence */}
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4" style={{ fontFamily: "Georgia, serif" }}>
              The Evidence Base
            </h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              The DEMISMATCH framework draws on peer-reviewed research across multiple disciplines:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg p-4">
                <p className="font-semibold text-[#1A1A1A] mb-1">Evolutionary Psychology</p>
                <p className="text-sm text-[#4A4A4A]">Tooby, Cosmides, Buss, Pinker</p>
              </div>
              <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg p-4">
                <p className="font-semibold text-[#1A1A1A] mb-1">Anthropology</p>
                <p className="text-sm text-[#4A4A4A]">Sahlins, Lee, Dunbar, Hrdy</p>
              </div>
              <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg p-4">
                <p className="font-semibold text-[#1A1A1A] mb-1">Social Psychology</p>
                <p className="text-sm text-[#4A4A4A]">Baumeister, Cacioppo, Haidt</p>
              </div>
              <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg p-4">
                <p className="font-semibold text-[#1A1A1A] mb-1">Public Health</p>
                <p className="text-sm text-[#4A4A4A]">WHO, Lancet, CDC research</p>
              </div>
            </div>
            <p className="text-sm text-[#4A4A4A] mt-4">
              <Link href="/sources" className="text-[#C75B39] hover:underline">
                View the full sources and bibliography →
              </Link>
            </p>
          </div>

          {/* Contact / Get Involved */}
          <div className="bg-gray-900 text-white rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Get Involved
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              DEMISMATCH is an evolving project. We're looking for researchers, practitioners,
              and systems thinkers who want to contribute.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/framework"
                className="bg-[#C75B39] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b54d2e] transition"
              >
                Read the Framework
              </Link>
              <a
                href="mailto:contact@demismatch.com"
                className="border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition"
              >
                Get in Touch
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Newsletter Signup Placeholder */}
      <section className="px-6 py-16 bg-[#1A1A1A]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Stay Updated
          </h2>
          <p className="text-gray-400 mb-6">
            Get notified about new research, framework updates, and tools.
          </p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => { e.preventDefault(); alert('Newsletter signup coming soon!'); }}>
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#C75B39]"
            />
            <button
              type="submit"
              className="bg-[#C75B39] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b54d2e] transition whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-gray-400">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/framework" className="hover:text-white transition">Framework</Link>
            <Link href="/cases" className="hover:text-white transition">Case Studies</Link>
            <Link href="/stats" className="hover:text-white transition">Evidence</Link>
            <Link href="/library" className="hover:text-white transition">Library</Link>
            <Link href="/sources" className="hover:text-white transition">Sources</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
