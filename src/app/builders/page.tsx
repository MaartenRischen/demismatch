import Link from "next/link";

export default function BuildersPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-gray-200">
        <Link href="/" className="text-xl tracking-widest text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
          DEMISMATCH
        </Link>
        <div className="flex gap-8 text-sm text-gray-600">
          <Link href="/framework" className="hover:text-gray-900">Framework</Link>
          <Link href="/builders" className="text-gray-900 font-medium">For Builders</Link>
          <Link href="/foryou" className="hover:text-gray-900">For You</Link>
          <Link href="/projects" className="hover:text-gray-900">Projects</Link>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
        </div>
      </nav>

      <header className="px-8 py-16 max-w-4xl mx-auto">
        <h1 className="text-5xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>For Builders</h1>
        <p className="text-xl text-gray-700">
          You shape environments — whether policy, technology, architecture, therapy practice, parenting, or teaching. You have leverage over others' conditions. Here's what you need to know.
        </p>
      </header>

      {/* Section 1 */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>1. Understand the Hardware</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Before you can build environments that work for humans, you need to understand how humans actually work. Not the cultural layer. The biological machinery underneath.
        </p>
        
        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">The Drives</h3>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Every human behavior traces to survival and reproduction. This isn't reductive — it's clarifying. Status-seeking, belonging, meaning-making, risk assessment — all downstream of these two imperatives, filtered through 300,000 years of hunter-gatherer conditions.
        </p>

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">The Signals</h3>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Emotions aren't irrational noise. They're biological GPS — accurate reports about whether the environment meets the organism's needs. Anxiety signals threat. Loneliness signals isolation. Depression signals that current strategies aren't working. The signals are precise. We've just been taught to override them instead of read them.
        </p>

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">The Dunbar Layers</h3>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Human social cognition has hard limits. Not preferences — limits. These numbers appear cross-culturally because they're neurological constraints:
        </p>
        
        <img
          src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/27_Dunbar_Layers_Detailed.png"
          alt="Dunbar's layers"
          className="rounded-lg w-full my-8"
        />

        <ul className="text-lg text-gray-700 space-y-2 ml-6 list-disc">
          <li><strong>5</strong> — intimate support group (the people you'd call at 3am)</li>
          <li><strong>15</strong> — close friends (you'd be devastated if they died)</li>
          <li><strong>50</strong> — friends (regular meaningful contact)</li>
          <li><strong>150</strong> — meaningful relationships (you know their name and history)</li>
        </ul>
        <p className="text-lg text-gray-700 mt-4 leading-relaxed">
          Build beyond 150 and you're building for strangers. The social dynamics change completely.
        </p>
      </section>

      {/* Section 2 */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>2. See What's Broken</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Current systems aren't failing. They're working exactly as designed — just not for human thriving. They're designed for extraction, engagement, profit. Understanding the anti-patterns helps you avoid replicating them.
        </p>

        <img
          src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/5_Spec_Sheet_Comparison.png"
          alt="EEA vs Modern spec comparison"
          className="rounded-lg w-full my-8"
        />

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">The Exploitation Pattern</h3>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Every exploitative system follows the same formula:
        </p>
        <ol className="text-lg text-gray-700 space-y-2 ml-6 list-decimal">
          <li><strong>Identify a biological drive</strong> (belonging, status, sex, novelty)</li>
          <li><strong>Block the real solution</strong> (make genuine tribe formation hard)</li>
          <li><strong>Offer a proxy</strong> (followers, likes, parasocial relationships)</li>
          <li><strong>Ensure the proxy never satisfies</strong> (infinite scroll, no closure)</li>
          <li><strong>Monetize the gap</strong> (ads, subscriptions, data)</li>
        </ol>
        <p className="text-lg text-gray-700 mt-4 leading-relaxed">
          If your product follows this pattern, you're part of the problem. If it breaks the pattern, you're part of the solution.
        </p>

        <img
          src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/26_Tribe_vs_Cult_Checklist.png"
          alt="Tribe vs Cult checklist"
          className="rounded-lg w-full my-8"
        />
      </section>

      {/* Section 3 */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>3. Build to Spec</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          The EEA (Environment of Evolutionary Adaptedness) isn't a place to return to. It's a spec sheet. A set of constraints your design must satisfy if it's going to work for the hardware.
        </p>

        <img
          src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/33_EEA_Spec_Sheet.png"
          alt="EEA Spec Sheet"
          className="rounded-lg w-full my-8"
        />

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">Key Constraints</h3>
        <ul className="text-lg text-gray-700 space-y-3 ml-6 list-disc">
          <li><strong>Dunbar-scale social structures</strong> — design for 150 max meaningful relationships</li>
          <li><strong>Visible contribution</strong> — people need to see their work matter</li>
          <li><strong>Closed loops</strong> — tasks need completion, not infinite scroll</li>
          <li><strong>Mixed-age interaction</strong> — age segregation is historically abnormal</li>
          <li><strong>Movement integrated</strong> — sitting still 8 hours violates spec</li>
          <li><strong>Real stakes, real feedback</strong> — not gamified proxies</li>
          <li><strong>Darkness at night</strong> — circadian rhythm is not optional</li>
          <li><strong>Regular ritual</strong> — the fire circle function needs to exist</li>
        </ul>

        <img
          src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/6_Build_Checklist.png"
          alt="Build checklist"
          className="rounded-lg w-full my-8"
        />
      </section>

      {/* Section 4 */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>4. What to Build</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          The opportunity is enormous. Almost nothing in the modern world is built to human spec. Every sector is waiting for someone to build the version that actually works for humans.
        </p>

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">Technology</h3>
        <ul className="text-lg text-gray-700 space-y-2 ml-6 list-disc">
          <li>Social platforms with Dunbar limits and decay functions</li>
          <li>Communication tools that create closure, not infinite threads</li>
          <li>AI that understands human nature, not exploits it</li>
          <li>VR/AR for presence, not escapism</li>
        </ul>

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">Physical Spaces</h3>
        <ul className="text-lg text-gray-700 space-y-2 ml-6 list-disc">
          <li>Co-housing at band scale (20-50 people)</li>
          <li>Neighborhoods designed for spontaneous interaction</li>
          <li>Workspaces with movement and varied activity built in</li>
          <li>Third places that aren't optimized for extraction</li>
        </ul>

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">Institutions</h3>
        <ul className="text-lg text-gray-700 space-y-2 ml-6 list-disc">
          <li>Schools without age segregation</li>
          <li>Healthcare that asks about environment before reaching for prescription</li>
          <li>Workplaces where contribution is visible and meaningful</li>
          <li>Governance at scales where everyone can be known</li>
        </ul>

        <div className="bg-white border border-gray-200 rounded-lg p-8 mt-12">
          <p className="text-xl text-gray-900 font-medium" style={{ fontFamily: 'Georgia, serif' }}>
            You're either building environments that fit human nature, or you're building environments that break it. Now you know which is which.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <div className="bg-gray-100 rounded-lg p-8">
          <h3 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Go Deeper</h3>
          <p className="text-lg text-gray-700 mb-6">
            Read the full framework for the complete picture — the machine, the violations, the cascades, and the path forward.
          </p>
          <Link href="/framework" className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-block">
            Read the Full Framework →
          </Link>
        </div>
      </section>

      <footer className="px-8 py-12 border-t border-gray-200 max-w-6xl mx-auto">
        <div className="flex gap-8 text-sm text-gray-600 mb-6">
          <Link href="/framework" className="hover:text-gray-900">Framework</Link>
          <Link href="/builders" className="hover:text-gray-900">For Builders</Link>
          <Link href="/foryou" className="hover:text-gray-900">For You</Link>
          <Link href="/projects" className="hover:text-gray-900">Projects</Link>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
        </div>
        <p className="text-sm text-gray-500">This framework is open. Fork it, improve it, implement it.</p>
      </footer>
    </main>
  );
}
