import Link from "next/link";
import LibraryStrip from "@/components/LibraryStrip";
import Navigation from "@/components/Navigation";

const IMAGE_BASE = "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/";

export default function SystemsPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] pt-20">
      <Navigation />

      {/* Hero Section - Bold and impactful */}
      <section className="px-8 py-16 md:py-24 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-[#C75B39] mb-4">For Builders & Policy Makers</p>
            <h1 className="text-4xl md:text-6xl text-[#1A1A1A] leading-tight mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Build for Biology
            </h1>
            <p className="text-xl text-[#4A4A4A] leading-relaxed mb-6">
              Technology, cities, and institutions were built without human specs. This is why they fail. Here are the specs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/app" className="bg-[#C75B39] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-flex items-center gap-2">
                Test Your Design
                <span>→</span>
              </Link>
              <a href="#spec-sheet" className="border border-[#C75B39] text-[#C75B39] px-6 py-3 rounded-lg hover:bg-[#C75B39] hover:text-white transition">
                Read the Specs
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src={`${IMAGE_BASE}33_EEA_Spec_Sheet.png`}
              alt="Human spec sheet"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Quick Stats - Visual impact */}
      <section className="px-8 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#C75B39]">10x</p>
            <p className="text-sm text-[#6b6b6b] mt-2">Depression rates vs traditional societies</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#C75B39]">7hrs</p>
            <p className="text-sm text-[#6b6b6b] mt-2">Daily screen time (replacing real contact)</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#C75B39]">150</p>
            <p className="text-sm text-[#6b6b6b] mt-2">Max meaningful relationships (Dunbar)</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#C75B39]">0</p>
            <p className="text-sm text-[#6b6b6b] mt-2">Systems designed for human specs</p>
          </div>
        </div>
      </section>

      {/* The Scale of the Problem */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          The Mismatch
        </h2>
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
          Depression rates 10x higher in modern vs traditional societies. Anxiety disorders affect 30%+ of the population. Loneliness is now a public health epidemic. Suicide rates rising despite unprecedented material wealth.
        </p>
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
          The standard response-medicating individuals to tolerate intolerable conditions-has failed. The systems themselves must change.
        </p>
        
        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}18_Timeline_Compression.png`}
            alt="Timeline compression - 300,000 years of evolution vs 15 years of smartphones"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            300,000 years of consistent conditions. 15 years of smartphones.
          </figcaption>
        </figure>
        
        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}34_Modern_Defaults_vs_Spec.png`}
            alt="Modern defaults vs evolutionary spec"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            Modern defaults violate every biological constraint.
          </figcaption>
        </figure>
      </section>

      <div className="px-8">
        <LibraryStrip tags={["mismatch", "modern", "comparison"]} title="From the Library" />
      </div>

      {/* The Spec Sheet */}
      <section id="spec-sheet" className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          What Humans Actually Require
        </h2>
        <p className="text-lg text-[#6b6b6b] mb-12">
          Any system that works with humans must account for these biological constraints.
        </p>

        {/* The Limits */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-6">The Limits (Non-Negotiable)</h3>
          <ul className="space-y-3 text-[#4A4A4A]">
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Dunbar layers:</strong> 5 intimate → 15 close → 50 friends → 150 meaningful</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Attention:</strong> Finite, easily hijacked, requires closure</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Status:</strong> Evaluated against ~150, not 8 billion</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Return windows:</strong> Days to weeks, not years to decades</span>
            </li>
          </ul>
        </div>

        {/* The Signals */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-6">The Signals (Information, Not Malfunction)</h3>
          <ul className="space-y-3 text-[#4A4A4A]">
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Anxiety</strong> = threat detection working correctly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Depression</strong> = meaning assessment working correctly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Loneliness</strong> = isolation alarm working correctly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Addiction</strong> = drive-seeking working correctly</span>
            </li>
          </ul>
        </div>

        {/* The Requirements */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-6">The Requirements</h3>
          <ul className="space-y-3 text-[#4A4A4A]">
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Visible contribution</strong> (see who your work helps)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Closure</strong> (problems resolvable through action)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Real feedback</strong> (from people with stake, not metrics)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Physical presence</strong> (Dunbar relationships require it)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Movement & nature</strong> (bodies evolved outdoors)</span>
            </li>
          </ul>
        </div>

        <div className="my-12 grid md:grid-cols-2 gap-8">
          <figure>
            <img
              src={`${IMAGE_BASE}27_Dunbar_Layers_Detailed.png`}
              alt="Dunbar layers detailed"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">Dunbar layers: 5 → 15 → 50 → 150</figcaption>
          </figure>
          <figure>
            <img
              src={`${IMAGE_BASE}33_EEA_Spec_Sheet.png`}
              alt="EEA spec sheet"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">The evolutionary spec sheet</figcaption>
          </figure>
        </div>
        
        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}9_Signals_Not_Symptoms__4-Panel_Grid_.png`}
            alt="Signals not symptoms"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            Signals are information, not malfunction.
          </figcaption>
        </figure>
      </section>

      <div className="px-8">
        <LibraryStrip tags={["dunbar", "signals", "limits"]} title="Related from Library" />
      </div>

      {/* The Exploitation Economy */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          What You're Up Against
        </h2>
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
          The mismatch isn't accidental. It's profitable. Every unmet human need is a market.
        </p>
        
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-8">
          <ul className="space-y-4 text-[#4A4A4A]">
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Social media</strong> profits from loneliness (connection proxies that never satisfy)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Pharma</strong> profits from signal override (medication as tolerance training)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Food industry</strong> profits from hijacked satiety (bliss points, supernormal stimuli)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Dating apps</strong> profit from failed matching (successful couples stop paying)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>Self-help</strong> profits from failure (if it worked, you'd stop buying)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span><strong>News media</strong> profits from anxiety (open loops that never close)</span>
            </li>
          </ul>
        </div>

        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
          This is documented. Internal Facebook research showed Instagram harms teens. Pharma knew long-term outcomes were poor. Food scientists engineer addiction. The exploitation is the business model.
        </p>
        <p className="text-lg text-[#1A1A1A] font-medium mb-8">
          Whatever you build will compete against systems that profit from suffering. Plan accordingly.
        </p>

        <div className="my-12 grid md:grid-cols-2 gap-8">
          <figure>
            <img
              src={`${IMAGE_BASE}2_Exploitation_Loop_Diagram.png`}
              alt="Exploitation loop diagram"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">The exploitation loop</figcaption>
          </figure>
          <figure>
            <img
              src={`${IMAGE_BASE}3_Proxy_vs_Real_Graph.png`}
              alt="Proxy vs real satisfaction"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">Proxy vs real satisfaction</figcaption>
          </figure>
        </div>

        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}38_The_Exploitation_Players.png`}
            alt="The exploitation economy players"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            The players profiting from your suffering.
          </figcaption>
        </figure>

        <Link href="/sources" className="text-[#C75B39] hover:underline text-lg">
          See the evidence →
        </Link>
      </section>

      <div className="px-8">
        <LibraryStrip tags={["exploitation", "proxy", "social media"]} title="More on Exploitation" />
      </div>

      {/* What to Build */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          The Opportunity
        </h2>
        <p className="text-lg text-[#6b6b6b] mb-12">
          The exploitation economy has saturated the market with systems that harm. There's massive unmet demand for systems that work.
        </p>

        {/* Technology */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Technology</h3>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Social platforms with hard Dunbar limits (not 5,000 "friends")</li>
            <li>• Communication tools that create closure (not infinite threads)</li>
            <li>• AI that serves human judgment (not replaces it)</li>
            <li>• Matching systems for tribe formation (not engagement farming)</li>
            <li>• Decay functions-features that degrade without physical presence</li>
          </ul>
        </div>

        {/* Policy */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Policy</h3>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Mental health policy mandating environmental assessment before medication</li>
            <li>• Urban planning requiring third places and mixed-use at band scale</li>
            <li>• Work regulations limiting always-on availability</li>
            <li>• Education policy ending age segregation and allowing movement</li>
            <li>• Research funding for environmental interventions (not just drug trials)</li>
          </ul>
        </div>

        {/* Architecture & Urban Planning */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Architecture & Urban Planning</h3>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Co-housing at band scale (20-50 people)</li>
            <li>• Neighborhoods with spontaneous interaction designed in</li>
            <li>• Workspaces with movement and daylight integrated</li>
            <li>• Third places not optimized for extraction</li>
            <li>• Fire circle spaces-evening gathering built into communities</li>
          </ul>
        </div>

        {/* Institutions */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Institutions</h3>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Schools without age segregation</li>
            <li>• Healthcare that asks about environment first</li>
            <li>• Workplaces where contribution is visible</li>
            <li>• Governance at knowable scale</li>
          </ul>
        </div>

        <div className="my-12 grid md:grid-cols-2 gap-8">
          <figure>
            <img
              src={`${IMAGE_BASE}6_Build_Checklist.png`}
              alt="Build checklist"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">Build checklist</figcaption>
          </figure>
          <figure>
            <img
              src={`${IMAGE_BASE}26_Tribe_vs_Cult_Checklist.png`}
              alt="Tribe vs cult checklist"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">Tribe vs cult: know the difference</figcaption>
          </figure>
        </div>

        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}15_Fire_Circle_vs_Modern_Evening.png`}
            alt="Fire circle vs modern evening"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            Fire circle vs. modern evening: what we lost.
          </figcaption>
        </figure>
      </section>

      <div className="px-8">
        <LibraryStrip tags={["solutions", "tribe", "community", "technology"]} title="Building Solutions" />
      </div>

      {/* The Evidence Base */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Ammunition for Your Case
        </h2>
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
          This framework synthesizes research across evolutionary psychology, anthropology, neuroscience, and clinical research. Key findings include WHO studies showing better schizophrenia outcomes in developing nations, environmental intervention trials outperforming medication, and industry internal research documenting deliberate exploitation.
        </p>

        <div className="my-12 grid md:grid-cols-2 gap-8">
          <figure>
            <img
              src={`${IMAGE_BASE}12_Evidence_Categories_Diagram.png`}
              alt="Evidence categories"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">Evidence categories</figcaption>
          </figure>
          <figure>
            <img
              src={`${IMAGE_BASE}22_WHO_Schizophrenia_Outcomes.png`}
              alt="WHO schizophrenia outcomes"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">WHO: better outcomes in developing nations</figcaption>
          </figure>
        </div>

        <Link href="/sources" className="bg-[#C75B39] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-block">
          Full Evidence Base →
        </Link>
      </section>

      {/* The Vision */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Demismatch First. Then Augment.
        </h2>
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
          The goal is not return to the past. It's conscious alignment of environment with biology-then enhancement.
        </p>
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
          The sequence matters:
        </p>
        <ol className="text-lg text-[#4A4A4A] mb-8 list-decimal list-inside space-y-2">
          <li><strong>DEMISMATCH</strong> - Return to baseline human thriving</li>
          <li><strong>AUGMENT</strong> - Extend capability from healthy foundation</li>
        </ol>
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
          Technology built on broken humans creates broken outcomes. Fix the foundation first. Then build beyond.
        </p>
        <p className="text-xl text-[#1A1A1A] italic mt-8 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          The most human post-human.
        </p>
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
          This is the destination. Everything else is foundation.
        </p>
        <Link href="/future" className="text-[#C75B39] hover:underline text-lg inline-flex items-center gap-2 mb-12">
          See the full vision
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}Demismatch_Augment.png`}
            alt="The progression: EEA → MISMATCH → DEMISMATCH → AUGMENTED"
            className="w-full max-w-3xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            EEA → MISMATCH → DEMISMATCH → AUGMENTED
          </figcaption>
        </figure>
      </section>

      {/* Resources */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-12" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Start Building
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/framework" className="bg-white rounded-xl border border-[#E5E0D8] p-6 hover:shadow-lg transition-shadow group">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#C75B39]">The Framework</h3>
            <p className="text-[#6b6b6b]">The complete spec sheet for human nature. 50,000+ words.</p>
          </Link>
          
          <Link href="/app" className="bg-white rounded-xl border border-[#E5E0D8] p-6 hover:shadow-lg transition-shadow group">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#C75B39]">The Mismatch Analyzer</h3>
            <p className="text-[#6b6b6b]">AI that's internalized the framework. Test your designs.</p>
          </Link>
          
          <Link href="/library" className="bg-white rounded-xl border border-[#E5E0D8] p-6 hover:shadow-lg transition-shadow group">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#C75B39]">The Image Library</h3>
            <p className="text-[#6b6b6b]">2,500+ visuals for presentations and proposals.</p>
          </Link>
          
          <Link href="/sources" className="bg-white rounded-xl border border-[#E5E0D8] p-6 hover:shadow-lg transition-shadow group">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#C75B39]">The Sources</h3>
            <p className="text-[#6b6b6b]">Full evidence base. Clickable citations.</p>
          </Link>
        </div>
      </section>

      {/* The Call */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <div className="bg-[#1A1A1A] text-white rounded-xl p-8 md:p-12">
          <h2 className="text-3xl mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            What Will You Build?
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            The framework is open. Fork it, improve it, implement it. No one owns truth about human nature. Everyone can build on it.
          </p>
          <Link href="/framework" className="bg-[#C75B39] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-block">
            Enter the Framework →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-[#E5E0D8] max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-8 text-sm text-[#6b6b6b] mb-6">
          <Link href="/framework" className="hover:text-[#1A1A1A]">Framework</Link>
          <Link href="/systems" className="hover:text-[#1A1A1A]">For Systems</Link>
          <Link href="/practitioners" className="hover:text-[#1A1A1A]">For Practitioners</Link>
          <Link href="/foryou" className="hover:text-[#1A1A1A]">For You</Link>
          <Link href="/projects" className="hover:text-[#1A1A1A]">Projects</Link>
          <Link href="/sources" className="hover:text-[#1A1A1A]">Sources</Link>
        </div>
        <p className="text-sm text-[#6b6b6b]">
          This framework is open. Fork it, improve it, implement it.
        </p>
      </footer>
    </main>
  );
}

