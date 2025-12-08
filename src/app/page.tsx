import Navigation from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";

const GRAPHICS_BASE = "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8">
              You are not broken.
              <br />
              <span className="text-[#ff3d00]">The world is.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#a3a3a3] mb-10 leading-relaxed max-w-xl">
              Modern life violates every condition we evolved to thrive in.
              Your anxiety, depression, and addiction aren&apos;t malfunctions.
              They&apos;re accurate signals from ancient hardware running in an alien environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/framework"
                className="px-8 py-4 bg-[#ff3d00] text-white font-semibold tracking-wide hover:bg-[#e63600] transition-colors text-center"
              >
                READ THE FRAMEWORK
              </Link>
              <Link
                href="/projects"
                className="px-8 py-4 border border-[#333] text-white font-semibold tracking-wide hover:bg-[#1a1a1a] transition-colors text-center"
              >
                EXPLORE TOOLS
              </Link>
            </div>
          </div>
          <div className="relative aspect-square max-w-lg mx-auto lg:mx-0">
            <Image
              src={`${GRAPHICS_BASE}/1_Fish_on_Land__Hero_Metaphor_.png`}
              alt="Fish on land - the mismatch metaphor"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Problem
            </h2>
            <p className="text-xl text-[#a3a3a3] leading-relaxed">
              For 99.9% of human history, we lived in small bands of 50-150 people.
              Face-to-face. Immediate feedback. Visible purpose. Real stakes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3]">
              <Image
                src={`${GRAPHICS_BASE}/15_Fire_Circle_vs_Modern_Evening.png`}
                alt="Fire circle vs modern evening - ancestral vs modern life"
                fill
                className="object-contain"
              />
            </div>
            <div className="space-y-8">
              <div className="border-l-2 border-[#ff3d00] pl-6">
                <h3 className="text-2xl font-bold mb-3">Then</h3>
                <p className="text-[#a3a3a3] text-lg">
                  Firelight conversations with your band. Everyone knew your name.
                  Your work had visible impact. Status came from contribution.
                  The future was tomorrow.
                </p>
              </div>
              <div className="border-l-2 border-[#333] pl-6">
                <h3 className="text-2xl font-bold mb-3">Now</h3>
                <p className="text-[#a3a3a3] text-lg">
                  Scrolling alone in blue light. Anonymous in crowds of millions.
                  Abstract labor for invisible outcomes. Status from consumption.
                  The future is a crushing abstraction.
                </p>
              </div>
              <p className="text-[#666] italic">
                The environment changed. We didn&apos;t.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Timeline Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                The Timeline
              </h2>
              <p className="text-xl text-[#a3a3a3] leading-relaxed mb-8">
                If human history were a 24-hour clock, the agricultural revolution
                happened at 11:58 PM. The industrial revolution at 11:59:58.
                The smartphone at 11:59:59.9.
              </p>
              <p className="text-xl text-[#a3a3a3] leading-relaxed mb-8">
                Evolution takes thousands of generations to adapt.
                We&apos;ve had a few hundred years.
              </p>
              <p className="text-lg text-white font-medium">
                Your brain is Paleolithic hardware running a post-industrial operating system.
                The bugs are features.
              </p>
            </div>
            <div className="relative aspect-square order-1 lg:order-2">
              <Image
                src={`${GRAPHICS_BASE}/18_Timeline_Compression.png`}
                alt="Timeline compression - evolutionary mismatch"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Economy of Mismatch Section */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Economy of Mismatch
            </h2>
            <p className="text-xl text-[#a3a3a3] leading-relaxed">
              Your suffering isn&apos;t an accident. It&apos;s profitable.
              Entire industries exist to exploit the gap between what you evolved
              to need and what the modern world provides.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3]">
              <Image
                src={`${GRAPHICS_BASE}/38_The_Exploitation_Players.png`}
                alt="The exploitation players - who profits from mismatch"
                fill
                className="object-contain"
              />
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-[#1a1a1a] border border-[#333]">
                <h3 className="text-xl font-bold text-[#ff3d00] mb-2">The Problem Sellers</h3>
                <p className="text-[#a3a3a3]">
                  Social media, junk food, gambling, pornography - engineering superstimuli
                  that hijack reward circuits designed for scarcity.
                </p>
              </div>
              <div className="p-6 bg-[#1a1a1a] border border-[#333]">
                <h3 className="text-xl font-bold text-[#ff3d00] mb-2">The Solution Sellers</h3>
                <p className="text-[#a3a3a3]">
                  Self-help, therapy, pharmaceuticals, wellness - profiting from the symptoms
                  they don&apos;t want cured. A customer healed is a customer lost.
                </p>
              </div>
              <div className="p-6 bg-[#1a1a1a] border border-[#333]">
                <h3 className="text-xl font-bold text-[#ff3d00] mb-2">The Diagnosis</h3>
                <p className="text-[#a3a3a3]">
                  We call it anxiety, depression, ADHD. We medicalize appropriate responses
                  to inappropriate conditions. The fish gets therapy. The land stays dry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Vision Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            The Vision
          </h2>
          <p className="text-xl md:text-2xl text-[#a3a3a3] leading-relaxed mb-12">
            What if we stopped trying to fix humans and started fixing environments?
            What if we designed lives, communities, and systems that actually match
            what we evolved to need?
          </p>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            <div>
              <div className="w-12 h-12 border border-[#ff3d00] flex items-center justify-center mb-4">
                <span className="text-[#ff3d00] font-bold">01</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Understand</h3>
              <p className="text-[#a3a3a3]">
                Learn the evolutionary logic behind your struggles. See the mismatch clearly.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 border border-[#ff3d00] flex items-center justify-center mb-4">
                <span className="text-[#ff3d00] font-bold">02</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Recognize</h3>
              <p className="text-[#a3a3a3]">
                Spot mismatch dynamics everywhere - in media, advice, products, and systems.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 border border-[#ff3d00] flex items-center justify-center mb-4">
                <span className="text-[#ff3d00] font-bold">03</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Rebuild</h3>
              <p className="text-[#a3a3a3]">
                Engineer your environment toward baseline conditions. Help others do the same.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Call Section */}
      <section className="py-24 px-6 bg-[#ff3d00]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black">
            The Call
          </h2>
          <p className="text-xl md:text-2xl text-black/80 leading-relaxed mb-12">
            This isn&apos;t self-help. This is a framework for understanding reality.
            A lens that reveals what&apos;s actually happening when you&apos;re struggling,
            when someone&apos;s selling you something, when the world feels wrong.
          </p>
          <Link
            href="/framework"
            className="inline-block px-12 py-5 bg-black text-white font-bold text-lg tracking-wide hover:bg-[#1a1a1a] transition-colors"
          >
            START READING
          </Link>
        </div>
      </section>

      {/* The Foundation Section */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            The Foundation
          </h2>
          <p className="text-xl text-[#a3a3a3] leading-relaxed mb-12 text-center">
            DEMISMATCH synthesizes insights from evolutionary psychology, anthropology,
            behavioral economics, and neuroscience. The framework stands on the shoulders
            of decades of research.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              href="/sources"
              className="p-8 bg-[#1a1a1a] border border-[#333] hover:border-[#ff3d00] transition-colors group"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-[#ff3d00] transition-colors">
                Sources & Research
              </h3>
              <p className="text-[#a3a3a3]">
                Academic papers, books, and studies behind the framework.
              </p>
            </Link>
            <Link
              href="/framework"
              className="p-8 bg-[#1a1a1a] border border-[#333] hover:border-[#ff3d00] transition-colors group"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-[#ff3d00] transition-colors">
                Full Framework
              </h3>
              <p className="text-[#a3a3a3]">
                The complete mismatch framework in detail.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <Link href="/" className="text-2xl font-bold tracking-[0.2em] text-white hover:text-[#ff3d00] transition-colors">
                DEMISMATCH
              </Link>
              <p className="text-[#666] mt-2 text-sm">
                Understanding the gap between evolved needs and modern reality.
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              <Link href="/framework" className="text-[#a3a3a3] hover:text-white transition-colors">
                Framework
              </Link>
              <Link href="/builders" className="text-[#a3a3a3] hover:text-white transition-colors">
                For Builders
              </Link>
              <Link href="/foryou" className="text-[#a3a3a3] hover:text-white transition-colors">
                For You
              </Link>
              <Link href="/projects" className="text-[#a3a3a3] hover:text-white transition-colors">
                Projects
              </Link>
              <Link href="/sources" className="text-[#a3a3a3] hover:text-white transition-colors">
                Sources
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
