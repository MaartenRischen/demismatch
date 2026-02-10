"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";

// Helper component for glossary links
function G({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <Link
      href={`/glossary#${term}`}
      className="text-[#C75B39] hover:text-[#A84A2D] underline decoration-[#C75B39]/30 hover:decoration-[#C75B39] transition-colors"
    >
      {children}
    </Link>
  );
}

export default function TheFuture() {
  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-20">
      <Navigation />

      {/* Page Header */}
      <header className="py-10 md:py-12">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h1
            className="text-2xl md:text-3xl text-[#1A1A1A] leading-[1.2] mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Destination
          </h1>
          <p
            className="text-base text-[#6A6A6A] leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: "Georgia, serif" }}
          >
            De-mismatch first. Then augment. The most human post-human.
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#292524] py-24 md:py-36 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C75B39] to-transparent" />

        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-[#C75B39] font-bold mb-10 leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            We're Approaching a Fork
          </h2>

          <p
            className="text-xl md:text-2xl text-white leading-[1.7] mb-12 max-w-3xl mx-auto"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The next wave of technology — superintelligent AI, full-immersion VR, brain-computer interfaces — will either exploit human nature harder than anything before, or finally meet it. Which future we get depends on understanding the spec sheet.
          </p>

          <Link
            href="/framework"
            className="inline-flex items-center gap-3 bg-[#C75B39] text-white px-8 py-4 text-lg font-semibold hover:bg-[#A84A2D] transition-colors"
          >
            Read the Spec Sheet
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Section 1: Automation Changes Everything */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">01</p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#C75B39] mb-12 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Automation Changes Everything
          </h2>

          <div className="space-y-6 text-lg text-[#3A3A3A] leading-[1.8] max-w-4xl mb-12" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              AI and robotics are eliminating human roles in production. Not just factory work — accounting, legal work, medical diagnosis, coding, driving, content creation. Most of it. Maybe not fully, but enough to break the current structure.
            </p>
            <p>
              <strong>Current arrangement:</strong> Humans do delayed-return labor → get money → buy survival → work provides (<G term="proxy">proxy</G>) purpose, structure, identity.
            </p>
            <p>
              <strong>Post-automation:</strong> Robots do labor → humans get... what?
            </p>
            <p>
              This makes <G term="demismatch">de-mismatch</G> more urgent, not less relevant. The inadequate, proxy purpose that work currently provides is disappearing. What remains is atomized consumption until death — or humans rebuilding tribal-scale contribution and meaning.
            </p>
          </div>

          {/* UBI Callout Box */}
          <div className="bg-[#292524] p-8 md:p-10 rounded-xl mb-12">
            <h3
              className="text-xl md:text-2xl text-[#C75B39] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              UBI is not the answer.
            </h3>
            <div className="space-y-4 text-[#D6D3D1] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
              <p>
                Universal Basic Income solves resource distribution but not meaning. You can have money without having role, tribe, purpose, or reason to get out of bed.
              </p>
              <p className="text-white font-medium">
                UBI + <G term="atomized-individual">atomized individual</G> = Netflix until death, punctuated by antidepressants.
              </p>
              <p>
                UBI may be necessary as transitional mechanism — a bridge while tribal structures develop. But it must stay basic. Survival floor, not abundance.
              </p>
            </div>
          </div>

          {/* Fork Image */}
          <figure className="mb-8">
            <img
              src="/storage/frontpage/MAIN%20presentation%20graphic.png"
              alt="The fork: from ancestral baseline through modern mismatch to the technological choice ahead"
              className="w-full rounded-xl shadow-lg"
            />
            <figcaption
              className="mt-4 text-center text-[0.9em] italic text-[#666] leading-[1.6]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Post-automation: two futures.
            </figcaption>
          </figure>

          {/* Two Paths Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-6 border-2 border-[#E5E0D8] rounded-lg bg-[#F8F6F2]">
              <h4 className="text-lg font-semibold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Path A: Atomized Consumption
              </h4>
              <p className="text-sm text-[#6A6A6A]" style={{ fontFamily: "Georgia, serif" }}>
                UBI + isolation + infinite content = managed decline
              </p>
            </div>
            <div className="text-center p-6 border-2 border-[#C75B39] rounded-lg bg-white">
              <h4 className="text-lg font-semibold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Path B: Tribal Meaning
              </h4>
              <p className="text-sm text-[#6A6A6A]" style={{ fontFamily: "Georgia, serif" }}>
                Resources + tribe + visible contribution = thriving
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Scarcity and Meaning */}
      <section className="bg-[#F8F6F2] py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">02</p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#C75B39] mb-8 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Scarcity and Meaning
          </h2>

          <div className="max-w-4xl mb-12">
            <p className="text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
              A tension appears: automation reduces material scarcity, yet the framework argues scarcity creates meaning. Does this mean we need artificial poverty? No. The distinction is between types of scarcity.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Left Column - Toxic Scarcity */}
            <div className="bg-white p-8 rounded-xl border border-[#E5E0D8]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A8A8A] mb-2">Automation Eliminates This</p>
              <h3
                className="text-2xl text-[#1A1A1A] mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Toxic Scarcity
              </h3>
              <ul className="space-y-3 text-[#3A3A3A]" style={{ fontFamily: "Georgia, serif" }}>
                <li className="flex items-start gap-3">
                  <span className="text-[#C75B39] mt-1">×</span>
                  <span>Food insecurity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C75B39] mt-1">×</span>
                  <span>Shelter insecurity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C75B39] mt-1">×</span>
                  <span>Healthcare access</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C75B39] mt-1">×</span>
                  <span>Material resource competition</span>
                </li>
              </ul>
              <p className="mt-6 text-sm text-[#6A6A6A] italic" style={{ fontFamily: "Georgia, serif" }}>
                This scarcity is toxic. It creates desperation, breaks cooperation, produces suffering without purpose. Good riddance.
              </p>
            </div>

            {/* Right Column - Constructive Scarcity */}
            <div className="bg-[#292524] p-8 rounded-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A8A29E] mb-2">Remains Regardless</p>
              <h3
                className="text-2xl text-[#C75B39] mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Constructive Scarcity
              </h3>
              <ul className="space-y-3 text-[#D6D3D1]" style={{ fontFamily: "Georgia, serif" }}>
                <li className="flex items-start gap-3">
                  <span className="text-[#C75B39] mt-1">✓</span>
                  <span>Time (still 24 hours, still must prioritize)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C75B39] mt-1">✓</span>
                  <span>Attention (still limited, still must choose)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C75B39] mt-1">✓</span>
                  <span>Skill mastery (still takes effort, can't download competence)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C75B39] mt-1">✓</span>
                  <span>Relationship depth (can't shortcut to trust)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C75B39] mt-1">✓</span>
                  <span>Creative challenges (making, building, solving)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C75B39] mt-1">✓</span>
                  <span>Contribution uniqueness (your specific gifts only you can offer)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C75B39] mt-1">✓</span>
                  <span>Coordination problems (raising children, maintaining habitat, resolving conflicts)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Below columns text */}
          <div className="max-w-4xl space-y-5 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              This is why billionaires are miserable: no constructive scarcity. Lottery winners report decreased happiness: sudden removal of challenge. Retirement without purpose kills: nothing left to overcome together.
            </p>
            <p>
              The <G term="tribe">tribe</G> collectively overcomes meaningful challenges. Effort is real. Interdependence is real. Your contribution matters because it's actually needed.
            </p>
            <p className="font-medium text-[#1A1A1A]">
              UBI provides the floor. The tribe provides the meaning. These are complementary, not contradictory.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Technology as Pharmakon */}
      <section className="bg-[#292524] py-28 md:py-36 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C75B39] to-transparent" />

        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">03</p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#C75B39] mb-12 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Technology as <G term="pharmakon">Pharmakon</G>
          </h2>

          <div className="space-y-6 text-lg md:text-xl text-[#D6D3D1] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              Technology is <G term="pharmakon">pharmakon</G>: simultaneously poison and cure, the nature determined by application.
            </p>
            <p className="text-white">
              Current technology already de-mismatches when used correctly. Video calls with actual tribe: real connection across distance. AI that helps think, create, organize: extended capability. Coordination tools for real groups: shared calendars, collaborative work.
            </p>
            <p>
              Current technology also increases mismatch. <G term="infinite-scroll">Infinite scroll</G>. <G term="parasocial-relationships">Parasocial content</G>. Stranger validation. <G term="open-loop">Open loops</G> by design.
            </p>
            <p className="text-white font-medium pt-4">
              The question is not technology yes or no. The question is which technology, designed how, used for what.
            </p>
            <p>
              The same capabilities creating mismatch can serve de-mismatching when designed against the constraints.
            </p>
          </div>

          {/* IMAGE SLOT: Technology as Pharmakon
              When image is ready, uncomment and update src:
          <figure className="mt-12">
            <img
              src="/storage/frontpage/[IMAGE_FILENAME].png"
              alt="Technology as pharmakon - simultaneously poison and cure, the nature determined by design"
              className="w-full max-w-md mx-auto rounded-xl opacity-80"
            />
            <figcaption
              className="mt-4 text-center text-[0.9em] italic text-[#78716C] leading-[1.6]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Poison and cure. The difference is design.
            </figcaption>
          </figure>
          */}
        </div>
      </section>

      {/* Section 4: What We're Building */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">04</p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#C75B39] mb-6 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            What We're Building
          </h2>
          <p className="text-lg text-[#6A6A6A] mb-12 max-w-3xl" style={{ fontFamily: "Georgia, serif" }}>
            Technology designed for human nature, not against it. These are directions, not blueprints.
          </p>

          {/* 6 Card Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Card 1 */}
            <div className="bg-[#F8F6F2] p-6 rounded-xl border border-[#E5E0D8]">
              <h3
                className="text-xl text-[#1A1A1A] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Mixed Reality Presence
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-[1.7]" style={{ fontFamily: "Georgia, serif" }}>
                Full sensory presence across distance. Not video calls but actual shared space. Touch, proximity, smell, ambient awareness. Hard-capped at ~150 connections because the system understands you cannot maintain more. Facilitating shared work on shared goals, not passive consumption of strangers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F8F6F2] p-6 rounded-xl border border-[#E5E0D8]">
              <h3
                className="text-xl text-[#1A1A1A] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Tribe Formation AI
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-[1.7]" style={{ fontFamily: "Georgia, serif" }}>
                Deep compatibility matching based on nervous system regulation, conflict styles, values, complementary skills. Not dating app swiping but genuine assessment of who you could build a life with. The village matchmaker, scaled. Once candidates are found, the AI's job is done. Trust-building happens through real human interaction.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F8F6F2] p-6 rounded-xl border border-[#E5E0D8]">
              <h3
                className="text-xl text-[#1A1A1A] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Coordination Infrastructure
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-[1.7]" style={{ fontFamily: "Georgia, serif" }}>
                Consensus tools that work at tribal scale. Resource sharing with full transparency. Reputation systems bounded to your 150, not global score. Shared calendars syncing with <G term="circadian-rhythm">circadian rhythms</G>. Conflict resolution scaffolding.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#F8F6F2] p-6 rounded-xl border border-[#E5E0D8]">
              <h3
                className="text-xl text-[#1A1A1A] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <G term="decay-function">Decay Functions</G>
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-[1.7]" style={{ fontFamily: "Georgia, serif" }}>
                Technology that degrades without physical presence. Features that lock if you haven't been physically present with tribe members. Notifications that decrease as you increase real-world interaction. Success measured by decreasing use. Business model cannot depend on engagement.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-[#F8F6F2] p-6 rounded-xl border border-[#E5E0D8]">
              <h3
                className="text-xl text-[#1A1A1A] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Architecture for Tribes
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-[1.7]" style={{ fontFamily: "Georgia, serif" }}>
                Physical spaces designed for <G term="the-50-band">band-level</G> density. Shared kitchens, visible common areas, private retreats. Neighborhoods at <G term="dunbars-numbers">Dunbar scale</G>. Childcare distributed by design. <G term="fire-circle">Fire circle</G> spaces — evening gathering built into communities.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-[#F8F6F2] p-6 rounded-xl border border-[#E5E0D8]">
              <h3
                className="text-xl text-[#1A1A1A] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <G term="visible-contribution">Visible Work</G>
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-[1.7]" style={{ fontFamily: "Georgia, serif" }}>
                Platforms making labor-to-benefit visible. You see exactly who your work helps. <G term="immediate-return-economy">Immediate-return</G> cycles where possible. Shared enterprise at tribal scale. Work experience redesigned toward shorter feedback loops.
              </p>
            </div>
          </div>

          <p className="text-lg text-[#6A6A6A] mb-8 max-w-3xl" style={{ fontFamily: "Georgia, serif" }}>
            The paths will be built by technologists, communities, researchers, and people redesigning their own lives.
          </p>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[#C75B39] hover:text-[#A84A2D] font-medium transition-colors"
          >
            See what's being built now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Section 5: The Most Human Post-Human */}
      <section className="bg-[#292524] py-28 md:py-40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C75B39] to-transparent" />

        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">05</p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#C75B39] mb-12 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <G term="the-most-human-post-human">The Most Human Post-Human</G>
          </h2>

          <div className="space-y-6 text-lg md:text-xl text-[#D6D3D1] leading-[1.8] text-left md:text-center" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              This isn't a call to abandon modernity or return to prehistoric conditions. That's neither possible nor desirable.
            </p>
            <p className="text-white">
              The vision is conscious alignment — designing environments, technologies, and social structures that work with human nature rather than against it.
            </p>
            <p>
              For the first time in hundreds of generations, technology may make full <G term="demismatch">de-mismatch</G> achievable again. Not returning to the past but going forward to something new: conscious alignment of environment with biology, enhanced by technology, chosen deliberately.
            </p>
            <p className="text-white">
              The first humans to achieve this will feel something their ancestors could not articulate because they had no contrast. The anxiety that seemed like personality dissolves because there's nothing to be anxious about. The loneliness that seemed like fate evaporates because you're actually not alone.
            </p>
            <p>
              We can have connection without exploitation, technology without addiction, progress without self-destruction. But only if we understand the hardware we're working with.
            </p>
          </div>

          <p
            className="text-3xl md:text-4xl lg:text-5xl text-white mt-16 font-bold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The most human post-human.
          </p>

          {/* IMAGE SLOT: The Most Human Post-Human
              When image is ready, uncomment and update src:
          <figure className="mt-16">
            <img
              src="/storage/frontpage/[IMAGE_FILENAME].png"
              alt="Human figure enhanced by technology but radiating connection - enhanced, not replaced"
              className="w-full max-w-2xl mx-auto rounded-xl"
            />
            <figcaption
              className="mt-4 text-center text-[0.9em] italic text-[#78716C] leading-[1.6]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Enhanced, not replaced. Connected, not isolated.
            </figcaption>
          </figure>
          */}
        </div>
      </section>

      {/* Section 6: The Test */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">06</p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#C75B39] mb-12 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Test
          </h2>

          <div className="space-y-6 text-lg text-[#3A3A3A] leading-[1.8] mb-12" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              Any solution that works will produce this:
            </p>
            <p>
              A stable social world of ~150 known people. Daily presence with 25-50. Work that visibly benefits people you know. Problems that can be resolved through action. Real feedback from real people who have stake in you. Children raised by many, not few. Technology that connects without substituting.
            </p>
          </div>

          <div className="bg-[#F8F6F2] p-8 md:p-12 rounded-xl mb-12">
            <p
              className="text-2xl md:text-3xl text-[#1A1A1A] leading-[1.4]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Simple test: Do you wake up with a role, in a group, with a goal?
            </p>
            <p
              className="text-xl md:text-2xl text-[#6A6A6A] mt-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              If yes, you've arrived. If no, you haven't.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-3 bg-[#C75B39] text-white px-10 py-5 text-lg font-semibold hover:bg-[#A84A2D] transition-colors"
          >
            Start Building
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#C75B39] py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <p
            className="text-2xl md:text-3xl text-white mb-6 leading-snug"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The fish doesn't need therapy.<br />
            The fish needs water.
          </p>
          <p className="text-white/60 text-sm">
            demismatch.com
          </p>
        </div>
      </footer>
    </main>
  );
}
