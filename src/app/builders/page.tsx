import Link from "next/link";

export default function BuildersPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
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

      {/* Header */}
      <header className="px-8 py-12 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">For Builders</h1>
        <p className="text-xl text-gray-700 mb-4">
          You&apos;re building something. This framework gives you a lens for what actually works - and what&apos;s just repackaging the problem.
        </p>
        <p className="text-lg text-gray-600">
          Whether you&apos;re creating technology, communities, products, or systems - these principles separate solutions that address root causes from those that exploit symptoms.
        </p>
      </header>

      {/* The Core Question */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Core Question</h2>
        <p className="text-2xl text-gray-900 font-semibold mb-6">
          Does this close the gap between evolved needs and modern reality?
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Or does it monetize the gap?
        </p>
        <p className="text-lg text-gray-700">
          Every intervention either moves people toward baseline (meeting evolved needs) or extracts value from the distance between where they are and where their biology expects to be.
        </p>
      </section>

      {/* Dunbar Layers */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Social Architecture</h2>
        <p className="text-lg text-gray-700 mb-8">
          Human social systems have a specific architecture. Dunbar&apos;s numbers aren&apos;t arbitrary - they reflect cognitive limits shaped by 300,000 years of evolution.
        </p>
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/4_Dunbar_Layers_Diagram.png"
            alt="Dunbar's Layers - Social group size limits"
            className="rounded-lg w-full"
          />
        </div>
        <div className="space-y-4 text-lg text-gray-700">
          <p><strong>5:</strong> Intimate support group (daily contact, unconditional support)</p>
          <p><strong>15:</strong> Close friends (weekly contact, high trust)</p>
          <p><strong>50:</strong> Good friends (monthly contact, mutual aid)</p>
          <p><strong>150:</strong> Meaningful relationships (known history, social obligation)</p>
          <p><strong>500:</strong> Acquaintances (recognized, limited interaction)</p>
          <p><strong>1,500:</strong> Names you can attach to faces</p>
        </div>
        <p className="text-lg text-gray-700 mt-8">
          Most social technology ignores this architecture. Building with it means designing for depth over breadth, for layers over scale.
        </p>
      </section>

      {/* Spec Sheet Comparison */}
      <section className="px-8 py-16 max-w-4xl mx-auto bg-white -mx-8 px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Environment Spec Sheet</h2>
        <p className="text-lg text-gray-700 mb-8">
          What the hardware was built for vs. what most people are running:
        </p>
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/5_Spec_Sheet_Comparison.png"
            alt="EEA vs Modern Environment Comparison"
            className="rounded-lg w-full"
          />
        </div>
      </section>

      {/* Build Checklist */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Build Checklist</h2>
        <p className="text-lg text-gray-700 mb-8">
          Before shipping, run through this:
        </p>
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/6_Build_Checklist.png"
            alt="Build Checklist for Demismatch Design"
            className="rounded-lg w-full"
          />
        </div>
        <div className="space-y-6 mt-12">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Does it close loops?</h3>
            <p className="text-gray-700">Modern life is full of open loops - started but never finished, effort without completion. Good design provides closure.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Does it enable real reciprocity?</h3>
            <p className="text-gray-700">Not transactional exchange, but the mutual aid that characterized ancestral life. Giving and receiving in ongoing relationships.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Does it respect Dunbar limits?</h3>
            <p className="text-gray-700">Scale often breaks social function. Design for the right layer of intimacy.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Does it provide visible contribution?</h3>
            <p className="text-gray-700">People need to see that their effort matters. Abstract impact isn&apos;t enough.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Does it allow for earned status?</h3>
            <p className="text-gray-700">Status seeking is hardwired. The question is whether your system allows status through genuine contribution.</p>
          </div>
        </div>
      </section>

      {/* Tribe vs Cult */}
      <section className="px-8 py-16 max-w-4xl mx-auto bg-white -mx-8 px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Community Architecture</h2>
        <p className="text-lg text-gray-700 mb-8">
          The difference between a tribe and a cult:
        </p>
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/26_Tribe_vs_Cult_Checklist.png"
            alt="Tribe vs Cult Comparison"
            className="rounded-lg w-full"
          />
        </div>
        <p className="text-lg text-gray-700 mt-8">
          Many modern &quot;communities&quot; are cults in tribe clothing. They exploit the need for belonging while preventing the autonomy and exit options that characterized ancestral bands.
        </p>
      </section>

      {/* EEA Spec Sheet */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Full Spec Sheet</h2>
        <p className="text-lg text-gray-700 mb-8">
          This is what human beings actually need:
        </p>
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/33_EEA_Spec_Sheet.png"
            alt="Complete EEA Specification Sheet"
            className="rounded-lg w-full"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Start Building</h2>
        <p className="text-lg text-gray-700 mb-8">
          The framework is open. The need is real. The tools exist. What&apos;s missing are people who understand the problem deeply enough to build real solutions.
        </p>
        <div className="flex gap-4">
          <Link
            href="/framework"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Read the Full Framework
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            See Projects
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
