import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-gray-200">
        <Link href="/" className="text-xl tracking-widest text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
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
      <section className="px-8 py-24 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl text-gray-900 leading-tight mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          Modern civilization is incompatible with human nature.
        </h1>
        <p className="text-xl text-gray-600 mb-3">
          This is not metaphor. This is biology.
        </p>
        <p className="text-xl text-gray-600 mb-3">
          Every condition we call mental illness is the machinery working correctly in the wrong environment. A fish on land isn't broken. It's misplaced.
        </p>
        <p className="text-xl text-gray-600 mb-10">
          This framework explains the what, the why, and the 'now what?'
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/framework" className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition">
            Enter the Framework
          </Link>
          <a 
            href="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/mothership-full.md"
            download
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Download
          </a>
        </div>
        
        {/* Hero Image */}
        <div className="mt-16">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/1_Fish_on_Land__Hero_Metaphor_.png"
            alt="Fish on land metaphor - the fish isn't broken, it's misplaced"
            className="rounded-lg mx-auto max-w-2xl w-full"
          />
        </div>
      </section>

      {/* The Problem Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>The Problem</h2>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          For 300,000 years, humans lived in conditions that remained remarkably consistent. Small bands. Known faces. Visible contribution. Daily closure. The hardware was built for this.
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          10,000 years of agriculture. 200 years of industry. 15 years of smartphones.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          The hardware hasn't changed. The operating environment is unrecognizable.
        </p>
        
        {/* Fire Circle Image */}
        <div className="my-12">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/15_Fire_Circle_vs_Modern_Evening.png"
            alt="Fire circle vs modern evening - communal gathering vs isolated screen time"
            className="rounded-lg w-full"
          />
        </div>
        
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          What we call anxiety, depression, addiction, loneliness — these aren't malfunctions. They're accurate signals from systems that work exactly as designed, reporting that the environment doesn't meet spec.
        </p>
        <p className="text-xl text-gray-900 font-medium" style={{ fontFamily: 'Georgia, serif' }}>
          The signals aren't broken. The environment is.
        </p>
      </section>

      {/* The Timeline Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>The Timeline</h2>
        
        {/* Timeline Image */}
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/18_Timeline_Compression.png"
            alt="Timeline compression - 300,000 years of evolution vs 15 years of smartphones"
            className="rounded-lg w-full"
          />
        </div>
        
        <div className="font-mono text-lg text-gray-700 space-y-2 my-8 bg-white p-6 rounded-lg border border-gray-200">
          <p>300,000 years &nbsp;&nbsp;&nbsp; — consistent conditions</p>
          <p>10,000 years &nbsp;&nbsp;&nbsp;&nbsp; — agriculture</p>
          <p>200 years &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; — industrialization</p>
          <p>15 years &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; — smartphones</p>
        </div>
        
        <p className="text-xl text-gray-900 font-medium" style={{ fontFamily: 'Georgia, serif' }}>
          Four numbers. The entire story.
        </p>
      </section>

      {/* The Economy of Mismatch Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>The Economy of Mismatch</h2>
        <p className="text-xl text-gray-700 mb-8">
          This isn't conspiracy. It's documented business strategy.
        </p>
        
        {/* Exploitation Players Image */}
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/38_The_Exploitation_Players.png"
            alt="The exploitation economy players"
            className="rounded-lg w-full"
          />
        </div>
        
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Internal Facebook research showed Instagram harms teen mental health. Nothing changed. Pharmaceutical companies market signal-override for conditions with no biomarkers. Food scientists optimize for "bliss points" that override satiety. Dating apps profit most from users who never find partners.
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          No shadowy cabal. Just incentives. The truth isn't profitable. The profitable isn't true.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Every unmet human need is a market. The systems aren't failing — they're working exactly as designed. Just not for you.
        </p>
        <Link href="/sources" className="text-[#c75b3a] hover:underline text-lg">
          See the evidence →
        </Link>
      </section>

      {/* The Vision Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>The Vision</h2>
        <p className="text-2xl text-gray-900 font-medium mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Demismatch first. Then augment.
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Not return to the past. Conscious alignment of environment with biology — enhanced by technology, chosen deliberately. The path forward isn't backward. It's through.
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Build environments that fit the hardware. Then extend what humans can do and be, without breaking what we are.
        </p>
        <p className="text-xl text-gray-900 italic mt-8" style={{ fontFamily: 'Georgia, serif' }}>
          The most human post-human.
        </p>
      </section>

      {/* The Call Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>The Call</h2>
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
            <span className="text-gray-600"> — clinicians, parents, educators shaping others' environments</span>
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
          <Link href="/builders" className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition">
            For Builders →
          </Link>
          <Link href="/foryou" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition">
            For You →
          </Link>
        </div>
      </section>

      {/* The Foundation Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-4xl text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>The Foundation</h2>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          This framework synthesizes evolutionary psychology, anthropology, and neuroscience into a single coherent lens. It explains human behavior from first principles — every action traces to survival and reproduction, every emotion is biological GPS, every "disorder" is a signal.
        </p>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          It's not the only lens. But it's the one that makes everything else click into place.
        </p>
        <p className="text-xl text-gray-900 font-medium mt-8" style={{ fontFamily: 'Georgia, serif' }}>
          Once you see it, you can't unsee it.
        </p>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-gray-200 max-w-6xl mx-auto">
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
