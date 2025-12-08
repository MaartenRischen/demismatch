import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function ForYouPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-8">
            For You
          </h1>
          <p className="text-xl md:text-2xl text-[#a3a3a3] leading-relaxed max-w-3xl">
            You&apos;re not here because you&apos;re broken. You&apos;re here because
            something feels wrong and the standard explanations don&apos;t fit.
          </p>
        </div>
      </section>

      {/* What You Might Be Feeling Section */}
      <section className="py-20 px-6 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            What You Might Be Feeling
          </h2>
          <div className="space-y-6">
            <div className="p-6 border-l-2 border-[#ff3d00] bg-[#1a1a1a]">
              <p className="text-lg text-[#a3a3a3]">
                &quot;I have everything I&apos;m supposed to want, but something still feels empty.&quot;
              </p>
            </div>
            <div className="p-6 border-l-2 border-[#ff3d00] bg-[#1a1a1a]">
              <p className="text-lg text-[#a3a3a3]">
                &quot;I can&apos;t stop scrolling even though I know it&apos;s not making me feel better.&quot;
              </p>
            </div>
            <div className="p-6 border-l-2 border-[#ff3d00] bg-[#1a1a1a]">
              <p className="text-lg text-[#a3a3a3]">
                &quot;I feel anxious all the time but there&apos;s nothing specific to be anxious about.&quot;
              </p>
            </div>
            <div className="p-6 border-l-2 border-[#ff3d00] bg-[#1a1a1a]">
              <p className="text-lg text-[#a3a3a3]">
                &quot;I&apos;m surrounded by people but feel deeply alone.&quot;
              </p>
            </div>
            <div className="p-6 border-l-2 border-[#ff3d00] bg-[#1a1a1a]">
              <p className="text-lg text-[#a3a3a3]">
                &quot;I work hard but can&apos;t see what difference it makes.&quot;
              </p>
            </div>
          </div>
          <p className="text-xl text-white mt-12">
            These aren&apos;t symptoms of a broken person. They&apos;re accurate signals
            from a healthy person in a mismatched environment.
          </p>
        </div>
      </section>

      {/* The Reframe Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            The Reframe
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-12">
            What if the problem isn&apos;t you?
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#666] line-through">The Old Story</h3>
              <ul className="space-y-4 text-[#666]">
                <li className="flex items-start gap-3">
                  <span className="text-[#333]">x</span>
                  You&apos;re lazy
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#333]">x</span>
                  You&apos;re weak-willed
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#333]">x</span>
                  You have a chemical imbalance
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#333]">x</span>
                  You need to try harder
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#333]">x</span>
                  You&apos;re not grateful enough
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#333]">x</span>
                  You need fixing
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#ff3d00]">The Mismatch View</h3>
              <ul className="space-y-4 text-[#a3a3a3]">
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  You&apos;re responding accurately to wrong conditions
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  Your brain is working exactly as designed
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  The environment violates your specs
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  Willpower can&apos;t override biology
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  Gratitude doesn&apos;t fix mismatched needs
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff3d00]">+</span>
                  The environment needs changing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What Actually Helps Section */}
      <section className="py-20 px-6 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What Actually Helps
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-12">
            Not tips. Not hacks. Structural changes that address the mismatch.
          </p>

          <div className="space-y-8">
            <div className="p-8 bg-[#1a1a1a] border border-[#333]">
              <h3 className="text-xl font-bold text-[#ff3d00] mb-4">Small, Stable Groups</h3>
              <p className="text-[#a3a3a3] mb-4">
                We evolved for bands of ~150. Find or create groups where you actually know
                people, see them regularly, and have real relationships - not audiences.
              </p>
              <p className="text-[#666] text-sm">
                Book clubs, sports teams, maker spaces, local communities. Quality over reach.
              </p>
            </div>

            <div className="p-8 bg-[#1a1a1a] border border-[#333]">
              <h3 className="text-xl font-bold text-[#ff3d00] mb-4">Visible Contribution</h3>
              <p className="text-[#a3a3a3] mb-4">
                We evolved to see our impact. Find ways to help where you can directly
                witness the result - not metrics, not abstractions.
              </p>
              <p className="text-[#666] text-sm">
                Teach someone. Build something tangible. Help a neighbor. Cook for people you know.
              </p>
            </div>

            <div className="p-8 bg-[#1a1a1a] border border-[#333]">
              <h3 className="text-xl font-bold text-[#ff3d00] mb-4">Physical Movement</h3>
              <p className="text-[#a3a3a3] mb-4">
                We evolved to move constantly. Your body expects miles of walking, lifting,
                carrying. Sitting is as novel as skyscrapers.
              </p>
              <p className="text-[#666] text-sm">
                Not for fitness - for baseline function. Move more. Then more.
              </p>
            </div>

            <div className="p-8 bg-[#1a1a1a] border border-[#333]">
              <h3 className="text-xl font-bold text-[#ff3d00] mb-4">Nature Contact</h3>
              <p className="text-[#a3a3a3] mb-4">
                We evolved outdoors. Trees, sky, seasons, weather. Indoor climate-controlled
                boxes are biologically unprecedented.
              </p>
              <p className="text-[#666] text-sm">
                Not vacations - daily exposure. Outside time every day, in all weather.
              </p>
            </div>

            <div className="p-8 bg-[#1a1a1a] border border-[#333]">
              <h3 className="text-xl font-bold text-[#ff3d00] mb-4">Natural Light Cycles</h3>
              <p className="text-[#a3a3a3] mb-4">
                We evolved with sunrise and sunset. Screens after dark, artificial light at
                night - your circadian rhythm is under assault.
              </p>
              <p className="text-[#666] text-sm">
                Morning light. Evening dimness. Sleep with the dark.
              </p>
            </div>

            <div className="p-8 bg-[#1a1a1a] border border-[#333]">
              <h3 className="text-xl font-bold text-[#ff3d00] mb-4">Real Skills</h3>
              <p className="text-[#a3a3a3] mb-4">
                We evolved to be competent. Status came from what you could do, not what you
                consumed. Build skills that create real value.
              </p>
              <p className="text-[#666] text-sm">
                Things you make with your hands. Knowledge others need. Abilities that help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            A Warning
          </h2>
          <div className="p-8 border border-[#ff3d00] bg-[#1a1a1a]">
            <p className="text-xl text-[#a3a3a3] mb-6">
              Understanding the mismatch won&apos;t fix it. Reading this won&apos;t fix it.
              More content won&apos;t fix it. Only changing your actual environment will.
            </p>
            <p className="text-lg text-white">
              If you find yourself consuming mismatch content instead of making changes,
              that&apos;s the mismatch at work too. Understanding becomes a substitute for action.
              Don&apos;t let this framework become another thing you scroll through.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-[#ff3d00]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">
            Start Now
          </h2>
          <p className="text-xl text-black/80 mb-10">
            Pick one thing. The smallest structural change you can make today.
            Move more. See a friend in person. Go outside. Build something.
            Close this tab and do it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/framework"
              className="px-8 py-4 bg-black text-white font-semibold tracking-wide hover:bg-[#1a1a1a] transition-colors"
            >
              READ THE FRAMEWORK
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 bg-transparent border-2 border-black text-black font-semibold tracking-wide hover:bg-black/10 transition-colors"
            >
              USE THE TOOLS
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <Link href="/" className="text-2xl font-bold tracking-[0.2em] text-white hover:text-[#ff3d00] transition-colors">
                DEMISMATCH
              </Link>
              <p className="text-[#666] mt-2 text-sm">
                Understanding the gap between evolved needs and modern reality.
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              <Link href="/framework" className="text-[#a3a3a3] hover:text-white transition-colors">
                Framework
              </Link>
              <Link href="/builders" className="text-[#a3a3a3] hover:text-white transition-colors">
                For Builders
              </Link>
              <Link href="/foryou" className="text-[#ff3d00]">
                For You
              </Link>
              <Link href="/projects" className="text-[#a3a3a3] hover:text-white transition-colors">
                Projects
              </Link>
              <Link href="/sources" className="text-[#a3a3a3] hover:text-white transition-colors">
                Sources
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
