import Link from "next/link";
import LibraryStrip from "@/components/LibraryStrip";

const IMAGE_BASE = "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/";

export default function PractitionersPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-[#E5E0D8]">
        <Link href="/" className="text-xl tracking-widest text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          DEMISMATCH
        </Link>
        <div className="hidden md:flex gap-8 text-sm text-[#4A4A4A]">
          <Link href="/framework" className="hover:text-[#1A1A1A]">Framework</Link>
          <Link href="/systems" className="hover:text-[#1A1A1A]">For Systems</Link>
          <Link href="/practitioners" className="text-[#C75B39] font-medium">For Practitioners</Link>
          <Link href="/foryou" className="hover:text-[#1A1A1A]">For You</Link>
          <Link href="/projects" className="hover:text-[#1A1A1A]">Projects</Link>
          <Link href="/sources" className="hover:text-[#1A1A1A]">Sources</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-[#C75B39] mb-4">For Practitioners</p>
        <h1 className="text-4xl md:text-5xl text-[#1A1A1A] leading-tight mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          You See What's Happening
        </h1>
        
        <div className="text-lg text-[#4A4A4A] space-y-4 mb-8">
          <p>The child labeled "ADHD" who can focus for hours on what interests them.</p>
          <p>The depressed client whose life actually lacks meaning.</p>
          <p>The anxious patient surrounded by strangers, screens, open loops.</p>
        </div>
        
        <p className="text-xl text-[#1A1A1A] font-medium mb-8">
          You sense the standard approaches are missing something.
        </p>
        <p className="text-xl text-[#C75B39] font-medium mb-8">
          You're right.
        </p>
        
        <a href="#reframe" className="text-[#C75B39] hover:underline text-lg">
          See the Reframe ↓
        </a>
      </section>

      {/* The Signals Reframe */}
      <section id="reframe" className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Accurate Signals, Not Broken Brains
        </h2>
        <p className="text-lg text-[#6b6b6b] mb-12 italic">
          The signal is working correctly. The environment is wrong.
        </p>

        {/* Anxiety */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Anxiety</h3>
          <p className="text-[#6b6b6b] mb-2"><span className="line-through">Not: Disorder requiring management</span></p>
          <p className="text-[#4A4A4A]"><strong>Actually:</strong> Accurate threat detection in environment full of strangers, unpredictability, uncontrollable stressors</p>
        </div>

        {/* Depression */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Depression</h3>
          <p className="text-[#6b6b6b] mb-2"><span className="line-through">Not: Chemical imbalance</span></p>
          <p className="text-[#4A4A4A]"><strong>Actually:</strong> Accurate meaning assessment in life lacking visible contribution, tribe, closure</p>
        </div>

        {/* Loneliness */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Loneliness</h3>
          <p className="text-[#6b6b6b] mb-2"><span className="line-through">Not: Social skills deficit</span></p>
          <p className="text-[#4A4A4A]"><strong>Actually:</strong> Accurate isolation alarm when surrounded by acquaintances and screens—but no actual tribe</p>
        </div>

        {/* Addiction */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Addiction</h3>
          <p className="text-[#6b6b6b] mb-2"><span className="line-through">Not: Moral failing or brain disease</span></p>
          <p className="text-[#4A4A4A]"><strong>Actually:</strong> Drive-seeking accurately redirected to proxies when real satisfaction is blocked</p>
        </div>

        {/* ADHD */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">"ADHD"</h3>
          <p className="text-[#6b6b6b] mb-2"><span className="line-through">Not: Attention disorder</span></p>
          <p className="text-[#4A4A4A]"><strong>Actually:</strong> Hunter cognition—varied attention, movement-seeking, novelty-responsive—trapped in farmer environments</p>
        </div>

        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}9_Signals_Not_Symptoms__4-Panel_Grid_.png`}
            alt="Signals not symptoms - 4 panel grid"
            className="w-full max-w-3xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            Signals are data, not disorder.
          </figcaption>
        </figure>
      </section>

      <div className="px-8">
        <LibraryStrip tags={["anxiety", "depression", "loneliness", "addiction", "signals"]} title="More on Signals" />
      </div>

      {/* The Environment Checklist */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          What Your Client Actually Needs
        </h2>
        <p className="text-lg text-[#6b6b6b] mb-12">
          Before diagnosis, before intervention, before medication—assess environment.
        </p>

        {/* Tribe */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Tribe</h3>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Do they have 5 people who'd show up at 3am?</li>
            <li>• Do they have 15 people they see regularly?</li>
            <li>• Do they have ~150 people who know them?</li>
            <li>• Or are they drowning in acquaintances and followers?</li>
          </ul>
        </div>

        {/* Closure */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Closure</h3>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Can they complete meaningful tasks?</li>
            <li>• Do problems have resolution paths?</li>
            <li>• Or is everything infinite scroll, open-ended, never done?</li>
          </ul>
        </div>

        {/* Visible Contribution */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Visible Contribution</h3>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Can they see who their effort helps?</li>
            <li>• Does anyone need specifically them?</li>
            <li>• Or do they feed metrics that disappear?</li>
          </ul>
        </div>

        {/* Physical Reality */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Physical Reality</h3>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Movement? Daylight? Nature?</li>
            <li>• Face-to-face time vs screen time?</li>
            <li>• Touch? Shared meals? Physical play?</li>
          </ul>
        </div>

        {/* Status at Knowable Scale */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Status at Knowable Scale</h3>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Compared against 150 or 8 billion?</li>
            <li>• Local and stable, or global and impossible?</li>
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
              src={`${IMAGE_BASE}5_Spec_Sheet_Comparison.png`}
              alt="Spec sheet comparison"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">EEA vs Modern comparison</figcaption>
          </figure>
        </div>

        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}25_Closed_Loop_vs_Open_Loop.png`}
            alt="Closed loop vs open loop"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            Closed loops resolve. Open loops accumulate.
          </figcaption>
        </figure>
      </section>

      <div className="px-8">
        <LibraryStrip tags={["dunbar", "tribe", "belonging", "closure"]} title="Understanding Needs" />
      </div>

      {/* Bridge, Not Proxy */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          What You Can Do
        </h2>

        {/* The Proxy Trap */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">The Proxy Trap</h3>
          <p className="text-[#4A4A4A] mb-4">
            Therapy can become a substitute for what the client actually needs. Weekly sessions as replacement for tribe. The therapist as the only person who "really understands." Permanent dependence instead of time-boxed bridge.
          </p>
          <p className="text-[#4A4A4A] font-medium mb-3">Watch for:</p>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Client has more intimacy with you than anyone in their actual life</li>
            <li>• Years of sessions without environmental change</li>
            <li>• You becoming part of their "tribe" instead of pathway to real tribe</li>
            <li>• Insight without action, understanding without building</li>
          </ul>
        </div>

        {/* The Bridge Role */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">The Bridge Role</h3>
          <p className="text-[#4A4A4A] mb-4">
            Your job is to help them build what they need, then exit.
          </p>
          <p className="text-[#4A4A4A] mb-4">
            Time-box from the start. Every session should ask: "What will you build this week in the real world?"
          </p>
          <p className="text-[#1A1A1A] font-medium">
            Success = they don't need you anymore. Not because they've "managed their symptoms" but because they've built what they actually need.
          </p>
        </div>

        <div className="my-12 grid md:grid-cols-2 gap-8">
          <figure>
            <img
              src={`${IMAGE_BASE}31_Therapy_Spectrum.png`}
              alt="Therapy spectrum - proxy to bridge"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">Therapy: proxy or bridge?</figcaption>
          </figure>
          <figure>
            <img
              src={`${IMAGE_BASE}37_Internal_Audience_Dissolution.png`}
              alt="Internal audience dissolution"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">Internal audience → real tribe</figcaption>
          </figure>
        </div>
      </section>

      {/* Domain-Specific Applications */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-12" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          For Your Practice
        </h2>

        {/* For Therapists/Clinicians */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">For Therapists & Clinicians</h3>
          <ul className="space-y-3 text-[#4A4A4A]">
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Ask about environment before reaching for DSM</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Assess tribe, closure, contribution before diagnosis</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Prescribe environmental interventions before medication</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Time-box treatment with explicit bridge framing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Become a voice from inside—you know the system is failing</span>
            </li>
          </ul>
        </div>

        {/* For Parents */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">For Parents</h3>
          <ul className="space-y-3 text-[#4A4A4A]">
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Understand what your child actually needs: alloparenting, mixed-age play, real contribution, physical contact, embodied risk</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Stop pathologizing hunter cognition as "ADHD"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Build village structures—not just your nuclear family</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Resist pressure to medicate signals into silence</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Limit screens not as moralism but as biology</span>
            </li>
          </ul>
        </div>

        {/* For Educators */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">For Educators</h3>
          <ul className="space-y-3 text-[#4A4A4A]">
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Recognize that movement, novelty, varied focus are features not bugs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Design for contribution (students do real things for real people)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Enable mixed-age interaction where possible</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Get kids outside, moving, using their bodies</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C75B39] mt-1">•</span>
              <span>Advocate for systemic change—you see the mismatch every day</span>
            </li>
          </ul>
        </div>

        <div className="my-12 grid md:grid-cols-2 gap-8">
          <figure>
            <img
              src={`${IMAGE_BASE}20_Child-Rearing_Comparison.png`}
              alt="Child-rearing comparison"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">Village vs nuclear parenting</figcaption>
          </figure>
          <figure>
            <img
              src={`${IMAGE_BASE}8_Open_Loops_Visual.png`}
              alt="Open loops visual"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">Open loops drain capacity</figcaption>
          </figure>
        </div>
      </section>

      <div className="px-8">
        <LibraryStrip tags={["parenting", "education", "therapy", "children"]} title="Practice Resources" />
      </div>

      {/* You're Not Alone */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          The Bigger Picture
        </h2>
        
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
          The psychiatric paradigm—brain as isolated organ, symptoms as malfunction, medication as correction—is a 20th century framework that the evidence no longer supports.
        </p>
        
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
          Across fields, practitioners are recognizing:
        </p>
        
        <ul className="space-y-3 text-[#4A4A4A] text-lg mb-8">
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Most conditions labeled "mental illness" are accurate biological responses</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Environmental interventions often outperform medication</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Long-term outcomes of standard treatment are poor</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>The "helping" industry is often part of the problem</span>
          </li>
        </ul>

        <p className="text-xl text-[#1A1A1A] font-medium mb-8">
          You're not crazy for sensing this. Your voice matters.
        </p>

        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}22_WHO_Schizophrenia_Outcomes.png`}
            alt="WHO schizophrenia outcomes"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            WHO: Better outcomes in developing nations.
          </figcaption>
        </figure>

        <Link href="/sources" className="text-[#C75B39] hover:underline text-lg">
          See the full evidence base →
        </Link>
      </section>

      {/* Resources */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-12" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Your Tools
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/framework" className="bg-white rounded-xl border border-[#E5E0D8] p-6 hover:shadow-lg transition-shadow group">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#C75B39]">The Framework</h3>
            <p className="text-[#6b6b6b]">The complete theoretical foundation. Share with colleagues.</p>
          </Link>
          
          <Link href="/app" className="bg-white rounded-xl border border-[#E5E0D8] p-6 hover:shadow-lg transition-shadow group">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#C75B39]">The Mismatch Analyzer</h3>
            <p className="text-[#6b6b6b]">Analyze client situations, generate environmental assessments.</p>
          </Link>
          
          <Link href="/library" className="bg-white rounded-xl border border-[#E5E0D8] p-6 hover:shadow-lg transition-shadow group">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#C75B39]">The Image Library</h3>
            <p className="text-[#6b6b6b]">2,500+ images for client education and workshops.</p>
          </Link>
        </div>
      </section>

      {/* The Call */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <div className="bg-[#1A1A1A] text-white rounded-xl p-8 md:p-12">
          <h2 className="text-3xl mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Be the Bridge
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            You see people in pain every day. Most of that pain is environmental. You can be the bridge that helps them build what they actually need—then step back as they thrive.
          </p>
          <p className="text-xl text-white font-medium mb-8">
            That's the work.
          </p>
          <Link href="/framework" className="bg-[#C75B39] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-block">
            Enter the Full Framework →
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

