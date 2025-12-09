import Link from "next/link";

export default function Home() {
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
          <Link href="/foryou" className="hover:text-gray-900">For You</Link>
          <Link href="/projects" className="hover:text-gray-900">Projects</Link>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-8">
          Modern civilization is incompatible with human nature.
        </h1>
        <p className="text-xl text-gray-700 mb-4">
          This is not metaphor. This is biology.
        </p>
        <p className="text-xl text-gray-700 mb-4">
          Every condition we call mental illness is the machinery working correctly in the wrong environment. A fish on land isn&apos;t broken. It&apos;s misplaced.
        </p>
        <p className="text-xl text-gray-700 mb-8">
          This framework explains the what, the why, and the &apos;now what?&apos;
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/framework"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Enter the Framework
          </Link>
          <Link
            href="/framework"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Download
          </Link>
        </div>

        {/* Hero Image */}
        <div className="mt-12">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/1_Fish_on_Land__Hero_Metaphor_.png"
            alt="Fish on land metaphor"
            className="rounded-lg mx-auto w-full max-w-3xl"
          />
        </div>
      </section>

      {/* The Problem Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">The Problem</h2>
        <p className="text-lg text-gray-700 mb-4">
          For 300,000 years, humans lived in conditions that remained remarkably consistent. Small bands. Known faces. Visible contribution. Daily closure. The hardware was built for this.
        </p>
        <p className="text-lg text-gray-700 mb-8">
          10,000 years of agriculture. 200 years of industry. 15 years of smartphones.
        </p>
        <p className="text-lg text-gray-700 mb-8">
          The hardware hasn&apos;t changed. The operating environment is unrecognizable.
        </p>

        {/* Fire Circle Image */}
        <div className="my-12">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/15_Fire_Circle_vs_Modern_Evening.png"
            alt="Fire circle vs modern evening"
            className="rounded-lg w-full"
          />
        </div>

        <p className="text-lg text-gray-700 mb-4">
          What we call anxiety, depression, addiction, loneliness - these aren&apos;t malfunctions. They&apos;re accurate signals from systems that work exactly as designed, reporting that the environment doesn&apos;t meet spec.
        </p>
        <p className="text-xl font-semibold text-gray-900">
          The signals aren&apos;t broken. The environment is.
        </p>
      </section>

      {/* The Timeline Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">The Timeline</h2>

        {/* Timeline Image */}
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/18_Timeline_Compression.png"
            alt="Timeline compression"
            className="rounded-lg w-full"
          />
        </div>

        <div className="font-mono text-lg text-gray-700 space-y-2 my-8">
          <p>300,000 years &nbsp;&nbsp;&nbsp; — consistent conditions</p>
          <p>10,000 years &nbsp;&nbsp;&nbsp;&nbsp; — agriculture</p>
          <p>200 years &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; — industrialization</p>
          <p>15 years &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; — smartphones</p>
        </div>

        <p className="text-xl font-semibold text-gray-900">
          Four numbers. The entire story.
        </p>
      </section>

      {/* The Economy of Mismatch Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">The Economy of Mismatch</h2>
        <p className="text-xl text-gray-700 mb-8">
          This isn&apos;t conspiracy. It&apos;s documented business strategy.
        </p>

        {/* Exploitation Players Image */}
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/38_The_Exploitation_Players.png"
            alt="Exploitation economy players"
            className="rounded-lg w-full"
          />
        </div>

        <p className="text-lg text-gray-700 mb-4">
          Internal Facebook research showed Instagram harms teen mental health. Nothing changed. Pharmaceutical companies market signal-override for conditions with no biomarkers. Food scientists optimize for &quot;bliss points&quot; that override satiety. Dating apps profit most from users who never find partners.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          No shadowy cabal. Just incentives. The truth isn&apos;t profitable. The profitable isn&apos;t true.
        </p>
        <p className="text-lg text-gray-700 mb-8">
          Every unmet human need is a market. The systems aren&apos;t failing - they&apos;re working exactly as designed. Just not for you.
        </p>
        <Link href="/sources" className="text-gray-900 underline hover:no-underline">
          See the evidence →
        </Link>
      </section>

      {/* The Vision Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">The Vision</h2>
        <p className="text-2xl font-bold text-gray-900 mb-6">
          Demismatch first. Then augment.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Not return to the past. Conscious alignment of environment with biology - enhanced by technology, chosen deliberately. The path forward isn&apos;t backward. It&apos;s through.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Build environments that fit the hardware. Then extend what humans can do and be, without breaking what we are.
        </p>
        <p className="text-xl italic text-gray-900 mt-8">
          The most human post-human.
        </p>
      </section>

      {/* The Call Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">The Call</h2>
        <p className="text-lg text-gray-700 mb-8">This framework is for:</p>

        <div className="space-y-4 mb-12">
          <p className="text-lg">
            <span className="font-semibold text-gray-900">Systems changers</span>
            <span className="text-gray-600"> — policy makers, researchers, journalists shifting the paradigm</span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-900">Builders</span>
            <span className="text-gray-600"> — technologists, architects, entrepreneurs building what comes next</span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-900">Gatekeepers</span>
            <span className="text-gray-600"> — clinicians, parents, educators shaping others&apos; environments</span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-900">The questioning</span>
            <span className="text-gray-600"> — those who sensed something was wrong</span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-900">Those in pain</span>
            <span className="text-gray-600"> — your signals are accurate</span>
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/builders"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            For Builders →
          </Link>
          <Link
            href="/foryou"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            For You →
          </Link>
        </div>
      </section>

      {/* The Foundation Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">The Foundation</h2>
        <p className="text-lg text-gray-700 mb-4">
          This framework synthesizes evolutionary psychology, anthropology, and neuroscience into a single coherent lens. It explains human behavior from first principles - every action traces to survival and reproduction, every emotion is biological GPS, every &quot;disorder&quot; is a signal.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          It&apos;s not the only lens. But it&apos;s the one that makes everything else click into place.
        </p>
        <p className="text-xl font-semibold text-gray-900 mt-8">
          Once you see it, you can&apos;t unsee it.
        </p>
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
