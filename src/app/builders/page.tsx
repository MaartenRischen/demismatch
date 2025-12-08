import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function BuildersPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-8">
            For Builders
          </h1>
          <p className="text-xl md:text-2xl text-[#a3a3a3] leading-relaxed max-w-3xl">
            You build products, systems, or communities. The mismatch framework
            is your competitive advantage - or your ethical compass.
          </p>
        </div>
      </section>

      {/* The Choice Section */}
      <section className="py-20 px-6 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            The Choice
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 border border-[#ff3d00] bg-[#1a1a1a]">
              <h3 className="text-2xl font-bold text-[#ff3d00] mb-4">Exploit the Mismatch</h3>
              <p className="text-[#a3a3a3] mb-6">
                Design for addiction. Hijack reward circuits. Manufacture anxiety
                then sell the cure. It works. Billions of dollars prove it works.
              </p>
              <ul className="space-y-3 text-[#666]">
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">-</span>
                  Infinite scroll to exploit novelty-seeking
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">-</span>
                  Social comparison metrics to trigger status anxiety
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">-</span>
                  Variable reward schedules for dopamine manipulation
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">-</span>
                  Fear-based content for engagement optimization
                </li>
              </ul>
            </div>
            <div className="p-8 border border-[#333] bg-[#1a1a1a]">
              <h3 className="text-2xl font-bold text-white mb-4">Solve the Mismatch</h3>
              <p className="text-[#a3a3a3] mb-6">
                Design for human flourishing. Build products that help people meet
                evolved needs in modern contexts. Harder. Less immediately profitable.
                More meaningful.
              </p>
              <ul className="space-y-3 text-[#a3a3a3]">
                <li className="flex items-start gap-3">
                  <span className="text-white">+</span>
                  Tools for real-world connection
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white">+</span>
                  Systems that facilitate contribution
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white">+</span>
                  Products with natural stopping points
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white">+</span>
                  Communities scaled for actual belonging
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Design Principles Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Design Principles for De-Mismatched Products
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-12">
            If you choose to build for human flourishing, here&apos;s the framework.
          </p>

          <div className="space-y-12">
            <div className="border-l-2 border-[#ff3d00] pl-8">
              <h3 className="text-2xl font-bold mb-4">1. Match the Scale</h3>
              <p className="text-[#a3a3a3] text-lg mb-4">
                Humans evolved for groups of ~150 (Dunbar&apos;s number). Design for
                meaningful connection, not mass reach. A Discord server of 50 active
                members beats a subreddit of 5 million lurkers.
              </p>
              <p className="text-[#666] italic">
                Question: Does your product help users build deep relationships with
                a small number of people, or shallow connections with infinite strangers?
              </p>
            </div>

            <div className="border-l-2 border-[#ff3d00] pl-8">
              <h3 className="text-2xl font-bold mb-4">2. Create Visible Impact</h3>
              <p className="text-[#a3a3a3] text-lg mb-4">
                We evolved to see direct results from our efforts. Abstract metrics
                and delayed feedback cause learned helplessness. Show users their
                impact in tangible, immediate ways.
              </p>
              <p className="text-[#666] italic">
                Question: Can users see the direct, real-world effect of their actions?
              </p>
            </div>

            <div className="border-l-2 border-[#ff3d00] pl-8">
              <h3 className="text-2xl font-bold mb-4">3. Design Natural Endpoints</h3>
              <p className="text-[#a3a3a3] text-lg mb-4">
                Ancestral activities had natural stopping points - the hunt ends,
                the berry bush is picked clean. Infinite scroll destroys this.
                Build in completion, satisfaction, and permission to stop.
              </p>
              <p className="text-[#666] italic">
                Question: Does your product have clear moments of &quot;done,&quot; or does it
                maximize time-on-site at the expense of user wellbeing?
              </p>
            </div>

            <div className="border-l-2 border-[#ff3d00] pl-8">
              <h3 className="text-2xl font-bold mb-4">4. Facilitate Real Status</h3>
              <p className="text-[#a3a3a3] text-lg mb-4">
                Status seeking is hardwired. The question is what status signals you
                optimize for. Likes reward performance. Contribution metrics reward
                actually helping.
              </p>
              <p className="text-[#666] italic">
                Question: Does your status system reward genuine contribution or mere
                visibility?
              </p>
            </div>

            <div className="border-l-2 border-[#ff3d00] pl-8">
              <h3 className="text-2xl font-bold mb-4">5. Respect Biological Rhythms</h3>
              <p className="text-[#a3a3a3] text-lg mb-4">
                We evolved with sunrise and sunset, seasonal variation, periods of
                activity and rest. 24/7 availability, constant notifications, and
                always-on culture violate basic biological needs.
              </p>
              <p className="text-[#666] italic">
                Question: Does your product respect users&apos; time, attention, and need
                for recovery?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-20 px-6 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Mismatch-Aware Opportunities
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-12">
            Every mismatch is a business opportunity. Here are some waiting to be solved.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#1a1a1a] border border-[#333]">
              <h3 className="text-xl font-bold mb-3">Movement Integration</h3>
              <p className="text-[#a3a3a3]">
                We evolved to move constantly. Sitting is novel. Products that
                integrate movement into work, learning, and socializing.
              </p>
            </div>
            <div className="p-6 bg-[#1a1a1a] border border-[#333]">
              <h3 className="text-xl font-bold mb-3">Skill-Based Community</h3>
              <p className="text-[#a3a3a3]">
                Status came from visible skills. Products that help people develop
                and demonstrate real competencies to real communities.
              </p>
            </div>
            <div className="p-6 bg-[#1a1a1a] border border-[#333]">
              <h3 className="text-xl font-bold mb-3">Contribution Networks</h3>
              <p className="text-[#a3a3a3]">
                We evolved for mutual aid. Platforms that facilitate genuine
                reciprocity beyond transactional exchange.
              </p>
            </div>
            <div className="p-6 bg-[#1a1a1a] border border-[#333]">
              <h3 className="text-xl font-bold mb-3">Local Intelligence</h3>
              <p className="text-[#a3a3a3]">
                We evolved to know our territory deeply. Tools that help people
                understand and connect with their immediate physical environment.
              </p>
            </div>
            <div className="p-6 bg-[#1a1a1a] border border-[#333]">
              <h3 className="text-xl font-bold mb-3">Real-Time Coordination</h3>
              <p className="text-[#a3a3a3]">
                We evolved for spontaneous group activity. Tools that enable
                &quot;who&apos;s available now?&quot; rather than calendar scheduling weeks out.
              </p>
            </div>
            <div className="p-6 bg-[#1a1a1a] border border-[#333]">
              <h3 className="text-xl font-bold mb-3">Circadian Tech</h3>
              <p className="text-[#a3a3a3]">
                We evolved with natural light cycles. Technology that works with
                rather than against biological rhythms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Build Something That Matters
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-10">
            The world is full of products that exploit human vulnerabilities.
            We need more that actually help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/framework"
              className="px-8 py-4 bg-[#ff3d00] text-white font-semibold tracking-wide hover:bg-[#e63600] transition-colors"
            >
              READ THE FULL FRAMEWORK
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 border border-[#333] text-white font-semibold tracking-wide hover:bg-[#1a1a1a] transition-colors"
            >
              SEE OUR TOOLS
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
              <Link href="/builders" className="text-[#ff3d00]">
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
