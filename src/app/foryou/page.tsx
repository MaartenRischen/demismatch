import Link from "next/link";
import LibraryStrip from "@/components/LibraryStrip";
import Navigation from "@/components/Navigation";

const IMAGE_BASE = "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/";

export default function ForYouPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] pt-20">
      <Navigation />

      {/* Hero Section */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-[#C75B39] mb-4">For You</p>
        <h1 className="text-4xl md:text-5xl text-[#1A1A1A] leading-tight mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          You're Not Broken
        </h1>
        
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
          You're here because something feels wrong. Maybe you've tried therapy. Medication. Self-help. Maybe some of it helped, temporarily. But something's still not right.
        </p>
        <p className="text-xl text-[#1A1A1A] font-medium mb-8">
          Here's what no one told you.
        </p>
        
        <a href="#signals" className="text-[#C75B39] hover:underline text-lg">
          Read On ↓
        </a>

        <figure className="mt-12">
          <img
            src={`${IMAGE_BASE}1_Fish_on_Land__Hero_Metaphor_.png`}
            alt="Fish on land metaphor - the fish isn't broken, it's misplaced"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            The fish isn't broken. It's misplaced.
          </figcaption>
        </figure>
      </section>

      {/* The Signals */}
      <section id="signals" className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Your Feelings Are Data
        </h2>
        <p className="text-lg text-[#6b6b6b] mb-12">
          Every feeling you have is information. Not malfunction. Not disorder. Information.
        </p>

        {/* Anxiety */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Anxiety</h3>
          <p className="text-[#6b6b6b] mb-4">They tell you it's a disorder. It's not.</p>
          <p className="text-[#4A4A4A] mb-4">
            You're surrounded by strangers. You can't predict what's coming. You have no control over forces that shape your life. Your environment is full of threats-social, financial, existential-that you can't resolve through action.
          </p>
          <p className="text-[#1A1A1A] font-medium">
            Your threat detection system is working correctly. The environment is actually threatening.
          </p>
        </div>

        {/* Depression */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Depression</h3>
          <p className="text-[#6b6b6b] mb-4">They tell you it's a chemical imbalance. It's not.</p>
          <p className="text-[#4A4A4A] mb-4">
            Your life lacks visible purpose. You can't see who your effort helps. You're not needed by anyone in particular. Nothing you do feels like it matters.
          </p>
          <p className="text-[#1A1A1A] font-medium">
            Your meaning assessment system is working correctly. The meaning is actually missing.
          </p>
        </div>

        {/* Loneliness */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Loneliness</h3>
          <p className="text-[#6b6b6b] mb-4">They tell you to work on your social skills. That's not it.</p>
          <p className="text-[#4A4A4A] mb-4">
            You have hundreds of followers and no one to call at 3am. You're surrounded by people and known by none of them.
          </p>
          <p className="text-[#1A1A1A] font-medium">
            Your isolation alarm is working correctly. You are actually isolated.
          </p>
        </div>

        {/* Addiction */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Addiction</h3>
          <p className="text-[#6b6b6b] mb-4">They tell you it's a disease. It's more complicated.</p>
          <p className="text-[#4A4A4A] mb-4">
            You have drives-for connection, status, stimulation, meaning. Those drives evolved to be satisfied in specific ways. Those ways are blocked. So you reach for what's available.
          </p>
          <p className="text-[#1A1A1A] font-medium">
            Your drives are working correctly. The real satisfactions are actually blocked.
          </p>
        </div>

        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}9_Signals_Not_Symptoms__4-Panel_Grid_.png`}
            alt="Signals not symptoms"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            Your signals are working correctly. The environment is wrong.
          </figcaption>
        </figure>
      </section>

      <div className="px-8">
        <LibraryStrip tags={["anxiety", "depression", "loneliness", "addiction"]} title="Understanding Your Signals" />
      </div>

      {/* The Mismatch */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Why You're Here
        </h2>
        
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
          For 300,000 years, your ancestors lived in conditions that remained remarkably consistent:
        </p>
        
        <ul className="space-y-3 text-[#4A4A4A] text-lg mb-8">
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Small bands of 20-50, nested in tribes of ~150</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Known faces, stable relationships, predictable social world</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Daily closure-hunt, gather, make, eat, sleep, done</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Visible contribution-everyone saw what you did</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Physical life-moving, outdoors, using your body</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Real status-evaluated against ~150 knowable people</span>
          </li>
        </ul>

        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">Then:</p>
        
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 mb-8">
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• 10,000 years of agriculture</li>
            <li>• 200 years of industrialization</li>
            <li>• 15 years of smartphones</li>
          </ul>
        </div>

        <p className="text-xl text-[#1A1A1A] font-medium mb-12">
          The hardware hasn't changed. The operating environment is unrecognizable.
        </p>

        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}18_Timeline_Compression.png`}
            alt="Timeline compression"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            300,000 years. 15 years. The hardware hasn't caught up.
          </figcaption>
        </figure>

        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}15_Fire_Circle_vs_Modern_Evening.png`}
            alt="Fire circle vs modern evening"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            What we evolved for vs. what we have.
          </figcaption>
        </figure>
      </section>

      <div className="px-8">
        <LibraryStrip tags={["mismatch", "history", "evolution", "comparison"]} title="The Mismatch" />
      </div>

      {/* What's Happening to You */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-12" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          The Machinery
        </h2>

        {/* Open Loops */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-4">Open Loops</h3>
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
            Your brain evolved for closure. Hunt → eat → done. Conflict → resolution → done.
          </p>
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
            Now nothing ever closes. Infinite scroll. Infinite email. Infinite news. Your background processes are maxed with open loops that have no end state.
          </p>
          <figure className="mt-6">
            <img
              src={`${IMAGE_BASE}8_Open_Loops_Visual.png`}
              alt="Open loops visual"
              className="w-full max-w-xl mx-auto rounded-lg shadow-sm"
            />
          </figure>
        </div>

        {/* The Internal Audience */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-4">The Internal Audience</h3>
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
            You evolved to be watched by ~150 people. Your brain simulates what they think of you.
          </p>
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
            But you don't have 150 people who know you. So the simulation runs on phantoms. You're performing for an audience that doesn't exist.
          </p>
          <figure>
            <img
              src={`${IMAGE_BASE}7_Internal_Audience_Illustration.png`}
              alt="Internal audience illustration"
              className="w-full max-w-xl mx-auto rounded-lg shadow-sm"
            />
          </figure>
        </div>

        {/* Stranger Overload */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-4">Stranger Overload</h3>
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
            You evolved for a world of known faces. Maybe 1,000 people total in your lifetime.
          </p>
          <p className="text-lg text-[#4A4A4A] leading-relaxed">
            Now you encounter more strangers in a day than your ancestors met in years. Your brain can't stop assessing. You're exhausted by the sheer quantity of humans.
          </p>
        </div>

        {/* Status at Global Scale */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-4">Status at Global Scale</h3>
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
            You evolved to compete for status among ~150. Now you're compared against 8 billion. You see the highlight reels of everyone, everywhere.
          </p>
          <figure>
            <img
              src={`${IMAGE_BASE}19_Status_Competition_Scale.png`}
              alt="Status competition scale"
              className="w-full max-w-xl mx-auto rounded-lg shadow-sm"
            />
          </figure>
        </div>

        {/* Proxy Consumption */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-4">Proxy Consumption</h3>
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
            You have real needs: connection, status, intimacy, meaning. What you're offered: followers, matches, likes, content. Proxies. Salt water for thirst.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <figure>
              <img
                src={`${IMAGE_BASE}3_Proxy_vs_Real_Graph.png`}
                alt="Proxy vs real graph"
                className="w-full rounded-lg shadow-sm"
              />
              <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">Proxy vs real satisfaction</figcaption>
            </figure>
            <figure>
              <img
                src={`${IMAGE_BASE}16_Salt_Water_Metaphor.png`}
                alt="Salt water metaphor"
                className="w-full rounded-lg shadow-sm"
              />
              <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">Salt water for thirst</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <div className="px-8">
        <LibraryStrip tags={["open loops", "internal audience", "proxy", "status"]} title="Understanding the Machinery" />
      </div>

      {/* It's Not Your Fault */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          The Exploitation Economy
        </h2>
        
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
          Your suffering is profitable. Every unmet need is a market.
        </p>
        
        <ul className="space-y-3 text-[#4A4A4A] text-lg mb-8">
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Social media profits from your loneliness</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Pharma profits from your signals</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Food industry profits from your hijacked appetites</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Dating apps profit from your failed search</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>Self-help profits from your continued failure</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C75B39] mt-1">•</span>
            <span>News media profits from your anxiety</span>
          </li>
        </ul>

        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
          This isn't conspiracy. It's documented business strategy.
        </p>
        <p className="text-xl text-[#1A1A1A] font-medium mb-8">
          You are not failing at life. You are living in an environment designed to fail you.
        </p>

        <div className="my-12 grid md:grid-cols-2 gap-8">
          <figure>
            <img
              src={`${IMAGE_BASE}38_The_Exploitation_Players.png`}
              alt="The exploitation players"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">Who profits from your suffering</figcaption>
          </figure>
          <figure>
            <img
              src={`${IMAGE_BASE}2_Exploitation_Loop_Diagram.png`}
              alt="Exploitation loop diagram"
              className="w-full rounded-lg shadow-sm"
            />
            <figcaption className="text-center text-sm text-[#6b6b6b] mt-2">The exploitation loop</figcaption>
          </figure>
        </div>

        <Link href="/sources" className="text-[#C75B39] hover:underline text-lg">
          See the evidence →
        </Link>
      </section>

      <div className="px-8">
        <LibraryStrip tags={["exploitation", "profit", "manipulation"]} title="The Exploitation Economy" />
      </div>

      {/* What Doesn't Work */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-12" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          The False Solutions
        </h2>

        {/* Medication */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Medication</h3>
          <p className="text-[#4A4A4A]">
            If your depression is accurate assessment that your life lacks meaning-medication doesn't add meaning. It's covering the oil light instead of checking the engine.
          </p>
        </div>

        <figure className="my-8">
          <img
            src={`${IMAGE_BASE}17_Oil_Light_Override.png`}
            alt="Oil light override metaphor"
            className="w-full max-w-xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            Medication covers the oil light. It doesn't fix the engine.
          </figcaption>
        </figure>

        {/* Self-Help */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Self-Help</h3>
          <p className="text-[#4A4A4A]">
            "Change your mindset." If the problem is environmental, mindset change is asking the fish to think positive thoughts about land.
          </p>
        </div>

        {/* Therapy (As Proxy) */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Therapy (As Proxy)</h3>
          <p className="text-[#4A4A4A]">
            Good therapy is a bridge. But therapy can become a proxy-the therapist as your only intimate relationship. Ask: Is my therapy helping me build real-world tribe? Or has it become the thing itself?
          </p>
        </div>
      </section>

      {/* What Actually Helps */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Environment, Not Mindset
        </h2>
        <p className="text-lg text-[#6b6b6b] mb-12">
          What actually works.
        </p>

        {/* Build Real Tribe */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Build Real Tribe</h3>
          <p className="text-[#4A4A4A] mb-4">
            Start small. You need 5 people who'd show up at 3am. Not followers. Actual humans.
          </p>
          <p className="text-[#6b6b6b] mb-3">How:</p>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Regular, repeated contact (same people, same time, same place)</li>
            <li>• Vulnerability (share real things, not performance)</li>
            <li>• Practical interdependence (help each other)</li>
            <li>• Physical presence (screens don't count)</li>
          </ul>
        </div>

        {/* Close the Loops */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Close the Loops</h3>
          <p className="text-[#4A4A4A] mb-4">Your brain needs completion.</p>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Make things and finish them</li>
            <li>• Have conversations that resolve</li>
            <li>• Reduce open tabs-literal and metaphorical</li>
            <li>• Do one thing at a time, to completion</li>
          </ul>
        </div>

        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}25_Closed_Loop_vs_Open_Loop.png`}
            alt="Closed loop vs open loop"
            className="w-full max-w-xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            Closed loops resolve. Open loops accumulate.
          </figcaption>
        </figure>

        {/* Replace Proxies with Reality */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Replace Proxies with Reality</h3>
          <p className="text-[#4A4A4A] mb-4">For every proxy, ask: what's the real need?</p>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Social media → actual face time</li>
            <li>• Porn → actual intimacy</li>
            <li>• News → actual local engagement</li>
            <li>• Shopping → actual needs met</li>
          </ul>
        </div>

        {/* Find Visible Contribution */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Find Visible Contribution</h3>
          <p className="text-[#4A4A4A] mb-4">You need to see who your effort helps.</p>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Work where you see the impact</li>
            <li>• Volunteer with visible results</li>
            <li>• Care for humans or animals who need you</li>
          </ul>
        </div>

        {/* Get Physical */}
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Get Physical</h3>
          <p className="text-[#4A4A4A] mb-4">You have a body.</p>
          <ul className="space-y-2 text-[#4A4A4A]">
            <li>• Movement every day</li>
            <li>• Daylight, especially morning</li>
            <li>• Nature when possible</li>
            <li>• Touch with humans you care about</li>
          </ul>
        </div>

        <figure className="my-12">
          <img
            src={`${IMAGE_BASE}37_Internal_Audience_Dissolution.png`}
            alt="Internal audience dissolution"
            className="w-full max-w-xl mx-auto rounded-lg shadow-sm"
          />
          <figcaption className="text-center text-sm text-[#6b6b6b] mt-3">
            Replace the phantom audience with real tribe.
          </figcaption>
        </figure>
      </section>

      <div className="px-8">
        <LibraryStrip tags={["solutions", "tribe", "belonging", "nature", "community"]} title="Building What You Need" />
      </div>

      {/* The Path */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Demismatch First. Then Augment.
        </h2>
        
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
          This is the progression:
        </p>

        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 mb-8 text-center">
          <p className="text-xl text-[#1A1A1A] font-medium">
            EEA → MISMATCH → DEMISMATCH → AUGMENTED
          </p>
        </div>
        
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
          You're somewhere in MISMATCH. The path is through DEMISMATCH (returning to baseline) toward something even better.
        </p>
        <p className="text-xl text-[#1A1A1A] font-medium mb-8">
          You can't skip steps. You can't augment from broken. But you can start moving. Today.
        </p>
        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
          This isn't the end. It's the foundation for something better.
        </p>
        <Link href="/future" className="text-[#C75B39] hover:underline text-lg inline-flex items-center gap-2 mb-12">
          See what we're building toward
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

      {/* The Call */}
      <section className="px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <div className="bg-[#1A1A1A] text-white rounded-xl p-8 md:p-12">
          <h2 className="text-3xl mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            What Will You Build?
          </h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            Understanding changes nothing by itself. Knowing you're a fish on land doesn't put you back in water.
          </p>
          <p className="text-xl text-white font-medium mb-6">
            You have to build.
          </p>
          
          <p className="text-lg text-gray-300 mb-4">What will you build?</p>
          <ul className="space-y-2 text-gray-300 mb-8">
            <li>• Your own tribe? (Start with one dinner)</li>
            <li>• Your own closure? (Finish one thing today)</li>
            <li>• Your own contribution? (Help one person who can see you)</li>
            <li>• Or something bigger?</li>
          </ul>

          <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4 mb-8">
            <p className="text-amber-200 text-sm">
              <strong>The trap:</strong> Reading about mismatch while sitting alone, scrolling, under artificial light is not progress.
            </p>
          </div>

          <p className="text-xl text-white font-medium mb-8">
            Close this tab. Go outside. Find your people. Build something.
          </p>
          <p className="text-gray-400 mb-8">
            The framework will still be here when you need it.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/framework" className="bg-[#C75B39] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-block">
              Read the Full Framework →
            </Link>
            <Link href="/app" className="border border-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition inline-block">
              Try the Analyzer →
            </Link>
            <Link href="/library" className="border border-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition inline-block">
              Browse the Library →
            </Link>
          </div>
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
