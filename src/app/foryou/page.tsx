import Link from "next/link";

const IMAGE_BASE = "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/";

export default function ForYouPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-gray-200">
        <Link href="/" className="text-xl tracking-widest text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
          DEMISMATCH
        </Link>
        <div className="flex gap-8 text-sm text-gray-600">
          <Link href="/framework" className="hover:text-gray-900">Framework</Link>
          <Link href="/builders" className="hover:text-gray-900">For Builders</Link>
          <Link href="/foryou" className="text-gray-900 font-medium">For You</Link>
          <Link href="/projects" className="hover:text-gray-900">Projects</Link>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
        </div>
      </nav>

      <header className="px-8 py-16 max-w-4xl mx-auto">
        <h1 className="text-5xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>For You</h1>
        <p className="text-xl text-gray-700 mb-4">
          You're here because something feels wrong. Maybe you've tried therapy, medication, self-help, optimization. Maybe it helped a little. Maybe it didn't. Either way, something still isn't right.
        </p>
        <p className="text-xl text-gray-700">
          Here's what no one told you.
        </p>
      </header>

      {/* Section 1: You're Not Broken */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>1. You're Not Broken</h2>
        
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          A fish on land flops around gasping. You don't diagnose it with "Flopping Disorder" and prescribe anti-flopping medication. You put it back in water.
        </p>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          You are the fish. Modern life is the land.
        </p>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          What you're experiencing — the anxiety, the depression, the loneliness, the sense that something is deeply wrong — these aren't malfunctions. They're accurate signals from biological systems that work exactly as designed.
        </p>

        <img
          src={`${IMAGE_BASE}9_Signals_Not_Symptoms__4-Panel_Grid_.png`}
          alt="Signals not symptoms - your emotions are information, not malfunction"
          className="rounded-lg w-full my-8"
        />

        <ul className="text-lg text-gray-700 space-y-4 ml-6 list-disc">
          <li><strong>Anxiety</strong> is accurate threat detection. Your environment contains more strangers, more uncertainty, more uncontrollable variables than any human was designed to handle.</li>
          <li><strong>Depression</strong> is accurate meaning assessment. It's signaling that your current strategies aren't working, that something fundamental needs to change.</li>
          <li><strong>Loneliness</strong> is accurate isolation alarm. You're surrounded by people but known by almost no one. The signal is correct.</li>
          <li><strong>The feeling that something is wrong</strong> — that's the most accurate signal of all.</li>
        </ul>

        <p className="text-xl text-gray-900 font-medium mt-8" style={{ fontFamily: 'Georgia, serif' }}>
          Your signals aren't broken. Your environment is.
        </p>
      </section>

      {/* Section 2: Why You Feel This Way */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>2. Why You Feel This Way</h2>
        
        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">The Internal Audience</h3>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Humans evolved to live in groups of ~150 where everyone knew everyone. Your brain still thinks it lives there. So it simulates an audience — running predictions about what "people" think of you.
        </p>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          But in a world of strangers, there's no real feedback. The simulation never updates. You're performing for phantoms, being judged by a crowd that doesn't exist, exhausted by an audience that never claps and never leaves.
        </p>

        <img
          src={`${IMAGE_BASE}7_Internal_Audience_Illustration.png`}
          alt="The internal audience - performing for phantoms"
          className="rounded-lg w-full my-8"
        />

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">Open Loops</h3>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Your brain was designed for a world where most things that started also ended. Hunt, eat, done. Conflict, resolution, done. Day's work, fire circle, sleep.
        </p>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Now nothing ever closes. Infinite email. Infinite scroll. Infinite news. Global problems you can do nothing about. Relationships that never quite resolve. Your brain is running hundreds of background processes with no end state, burning energy on loops that never complete.
        </p>

        <img
          src={`${IMAGE_BASE}8_Open_Loops_Visual.png`}
          alt="Open loops - nothing ever closes in modern life"
          className="rounded-lg w-full my-8"
        />

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">The Proxy Trap</h3>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          You have real needs — belonging, status, intimacy, meaning. The modern world offers proxies — social media followers, dating app matches, Netflix instead of a fire circle.
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          The proxies trigger the same reward circuits as the real thing, but they don't satisfy the underlying need. So you consume more. And more. The drive never quiets because the need is never met.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          It's like drinking salt water for thirst. The more you drink, the thirstier you get.
        </p>
      </section>

      {/* Section 3: It's Not Your Fault */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>3. It's Not Your Fault</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          This isn't about personal failure. It's not about needing more willpower, better habits, a more positive mindset.
        </p>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          The environment you live in was not designed for your wellbeing. It was designed for profit. And your suffering is a feature, not a bug.
        </p>
        <ul className="text-lg text-gray-700 space-y-3 ml-6 list-disc mb-6">
          <li>Social media companies profit when you keep scrolling — so they design for addiction, not satisfaction</li>
          <li>Pharmaceutical companies profit when you stay medicated — so they market signal-override, not environmental change</li>
          <li>The self-help industry profits when nothing quite works — so you buy the next book, the next course, the next fix</li>
          <li>Food companies profit when you overeat — so they engineer "bliss points" that override your satiety signals</li>
        </ul>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Every unmet human need is a market. Your loneliness is a profit center. Your anxiety is a customer acquisition strategy.
        </p>
        <p className="text-xl text-gray-900 font-medium" style={{ fontFamily: 'Georgia, serif' }}>
          You are not failing at life. You are living in an environment that fails you.
        </p>
      </section>

      {/* Section 4: What Actually Helps */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>4. What Actually Helps</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          If the problem is environmental, the solution is environmental. Not mindset. Not medication. Environment.
        </p>

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">Build Real Tribe</h3>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Not followers. Not "community." Actual people who know you, see you regularly, depend on you and are depended upon. This is the single most important factor. Start small — 5 people who would show up at 3am. Then 15. The structure matters more than the speed.
        </p>

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">Close the Loops</h3>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Create completion. Make things with your hands and finish them. Have conversations that resolve. Do work where you can see the result. Reduce the open tabs — literal and metaphorical. Your brain needs endings.
        </p>

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">Replace Proxies with Reality</h3>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          For every proxy you consume, ask: what's the real need underneath? Then find a real way to meet it. Social media → actual face time. Porn → actual intimacy. News → actual local engagement. It's harder. It's also the only thing that works.
        </p>

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">Dissolve the Phantom Audience</h3>
        <img
          src={`${IMAGE_BASE}37_Internal_Audience_Dissolution.png`}
          alt="Internal audience dissolution - real tribe replaces phantom judges"
          className="rounded-lg w-full my-8"
        />
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          The internal audience quiets when you have a real one. When actual people actually know you, your brain stops running simulations about what hypothetical people might think. This is why tribe comes first.
        </p>

        <h3 className="text-xl text-gray-900 mt-8 mb-4 font-semibold">Read Your Signals</h3>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Stop treating your emotions as problems to solve and start treating them as information to read. What is your anxiety actually pointing at? What is your depression actually saying? The signals are accurate. Learn to listen.
        </p>

        <p className="text-xl text-gray-900 font-medium mt-8" style={{ fontFamily: 'Georgia, serif' }}>
          This isn't about fixing yourself. It's about fixing your environment. You are not broken. You're just in the wrong habitat.
        </p>
      </section>

      {/* Section 5: The Path */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>5. The Path</h2>
        
        <img
          src={`${IMAGE_BASE}Demismatch_Augment.png`}
          alt="The progression: EEA → MISMATCH → DEMISMATCH → AUGMENTED"
          className="rounded-lg w-full my-8"
        />

        <div className="bg-white border border-gray-200 rounded-lg p-6 my-8">
          <p className="text-lg text-gray-700 mb-2"><strong>EEA</strong> — What we evolved for. The baseline.</p>
          <p className="text-lg text-gray-700 mb-2"><strong>MISMATCH</strong> — Where most of us are. Signals firing, needs unmet.</p>
          <p className="text-lg text-gray-700 mb-2"><strong>DEMISMATCH</strong> — Realigning environment with biology.</p>
          <p className="text-lg text-gray-700"><strong>AUGMENTED</strong> — Building from healthy baseline to something even better.</p>
        </div>

        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          You're probably somewhere in MISMATCH. The path is through DEMISMATCH toward AUGMENTED.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          You can't skip steps. But you can start moving.
        </p>
      </section>

      {/* Section 6: What Now? */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>6. What Now?</h2>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Understanding is step one. But understanding alone changes nothing.
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Will you restructure your environment? Build tribe? Close loops?
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Will you build for others? Spread understanding?
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          The framework will still be here. But don't let reading become another proxy.
        </p>

        <div className="p-6 bg-[#c75b3a]/10 border border-[#c75b3a]/20 rounded-lg mb-8">
          <p className="text-lg text-gray-900 mb-4 font-medium">Analyze your situation</p>
          <p className="text-gray-700 mb-4">Paste what you're struggling with. Get framework-grounded insight.</p>
          <Link href="/app?prompt=Why%20do%20I%20feel%20this%20way%3F" className="bg-[#c75b3a] text-white px-5 py-2.5 rounded-lg hover:bg-[#b54d2e] transition inline-block">
            Open the Analyzer →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <div className="bg-gray-100 rounded-lg p-8">
          <h3 className="text-2xl text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Go Deeper</h3>
          <p className="text-lg text-gray-700 mb-6">
            This page is the beginning. The full framework explains the entire machine — how humans work, what went wrong, and the complete path forward.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/framework" className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-block">
              Read the Framework
            </Link>
            <Link href="/sources" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition inline-block">
              See the Sources
            </Link>
            <Link href="/builders" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition inline-block">
              Ready to Build →
            </Link>
          </div>
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
