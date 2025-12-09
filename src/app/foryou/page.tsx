import Link from "next/link";

export default function ForYouPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
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

      {/* Header */}
      <header className="px-8 py-12 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">For You</h1>
        <p className="text-xl text-gray-700 mb-4">
          You&apos;re here because something doesn&apos;t feel right. You&apos;ve been told the problem is you - your brain chemistry, your motivation, your choices.
        </p>
        <p className="text-xl text-gray-700">
          What if the signals are accurate and the environment is wrong?
        </p>
      </header>

      {/* Signals Not Symptoms */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Signals, Not Symptoms</h2>
        <p className="text-lg text-gray-700 mb-8">
          What we call mental illness is often the machinery working correctly in the wrong environment.
        </p>
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/9_Signals_Not_Symptoms__4-Panel_Grid_.png"
            alt="Signals Not Symptoms"
            className="rounded-lg w-full"
          />
        </div>
        <div className="space-y-6 mt-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Anxiety</h3>
            <p className="text-gray-700">A threat detection system that evolved for lions and snakes, now triggered by emails and social media. The system works. The threats have changed.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Depression</h3>
            <p className="text-gray-700">Often a signal of social defeat, resource scarcity, or loss of agency. In ancestral environments, these states triggered rest and social support. Now they&apos;re pathologized.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loneliness</h3>
            <p className="text-gray-700">The pain of social disconnection. It hurts because isolation was lethal for most of human history. The signal is accurate. You need your people.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Addiction</h3>
            <p className="text-gray-700">Reward systems hijacked by superstimuli. The brain is working exactly as designed - it&apos;s the inputs that have been engineered to exploit it.</p>
          </div>
        </div>
      </section>

      {/* The Internal Audience */}
      <section className="px-8 py-16 max-w-4xl mx-auto bg-white -mx-8 px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Internal Audience</h2>
        <p className="text-lg text-gray-700 mb-8">
          You&apos;re never alone in your head. Evolution installed an audience.
        </p>
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/7_Internal_Audience_Illustration.png"
            alt="The Internal Audience"
            className="rounded-lg w-full"
          />
        </div>
        <p className="text-lg text-gray-700 mt-8">
          That voice judging you? It&apos;s running a simulation of how your tribe would react. The shame you feel when no one&apos;s watching? That&apos;s the internal audience. This made sense when reputation determined survival. Now it creates anxiety in isolation.
        </p>
      </section>

      {/* Open Loops */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Open Loops</h2>
        <p className="text-lg text-gray-700 mb-8">
          Modern life is full of started-but-never-finished. Your brain keeps these active, draining resources.
        </p>
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/8_Open_Loops_Visual.png"
            alt="Open Loops"
            className="rounded-lg w-full"
          />
        </div>
        <p className="text-lg text-gray-700 mt-8">
          In ancestral environments, most tasks had completion. Hunt, eat, sleep. Build shelter, use shelter. Modern life creates infinite open loops - emails awaiting response, notifications unchecked, projects half-done, relationships unresolved.
        </p>
        <p className="text-lg text-gray-700 mt-4">
          The exhaustion you feel isn&apos;t laziness. It&apos;s cognitive load from a thousand unclosed loops.
        </p>
      </section>

      {/* What To Do */}
      <section className="px-8 py-16 max-w-4xl mx-auto bg-white -mx-8 px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">What To Do</h2>
        <p className="text-lg text-gray-700 mb-8">
          You can&apos;t change 300,000 years of evolution. But you can change your environment.
        </p>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Audit Your Environment</h3>
            <p className="text-gray-700">Compare your daily reality to the spec sheet. Where are the biggest gaps? Light exposure? Movement? Social contact? Sleep timing? Start there.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Close Loops</h3>
            <p className="text-gray-700">Identify what&apos;s draining you through incompleteness. Either finish it or explicitly decide not to (which closes the loop).</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Find Your 5</h3>
            <p className="text-gray-700">You need 5 people you could call at 3am. Not 500 followers. Five real humans who know you and have your back.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Dissolve the Unhealthy Internal Audience</h3>
            <p className="text-gray-700">That critical voice in your head? It&apos;s often simulating people who don&apos;t actually matter to your survival anymore. Upgrade your internal audience to people who actually support you.</p>
          </div>
        </div>
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/37_Internal_Audience_Dissolution.png"
            alt="Internal Audience Dissolution"
            className="rounded-lg w-full"
          />
        </div>
      </section>

      {/* The Trap */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Trap</h2>
        <p className="text-lg text-gray-700 mb-4">
          Understanding this framework can itself become a trap. Reading about mismatch while sitting alone, scrolling, under artificial light - that&apos;s not progress.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          The point isn&apos;t to understand. It&apos;s to change your environment.
        </p>
        <p className="text-xl font-semibold text-gray-900 mt-8">
          Close this tab. Go outside. Find your people. Do something with your hands.
        </p>
        <p className="text-lg text-gray-700 mt-4">
          The framework will still be here when you need it.
        </p>
      </section>

      {/* Call to Action */}
      <section className="px-8 py-16 max-w-4xl mx-auto bg-white -mx-8 px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Go Deeper</h2>
        <p className="text-lg text-gray-700 mb-8">
          If you want to understand the full picture - the evolutionary logic, the economic forces, the path forward - read the complete framework.
        </p>
        <div className="flex gap-4">
          <Link
            href="/framework"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Read the Framework
          </Link>
          <Link
            href="/sources"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            See the Sources
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-gray-200 max-w-4xl mx-auto">
        <div className="flex gap-8 text-sm text-gray-600 mb-6">
          <Link href="/framework" className="hover:text-gray-900">Framework</Link>
          <Link href="/builders" className="hover:text-gray-900">For Builders</Link>
          <Link href="/foryou" className="hover:text-gray-900">For You</Link>
          <Link href="/projects" className="hover:text-gray-900">Projects</Link>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
        </div>
        <p className="text-sm text-gray-500">
          This framework is open. Fork it, improve it, implement it.
        </p>
      </footer>
    </main>
  );
}
