import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function TribeMatcherPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white pt-20">
      <Navigation />

      {/* Header */}
      <header className="px-6 md:px-8 pt-12 pb-8 max-w-4xl mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition mb-6"
        >
          ← Back to Projects
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full uppercase tracking-wider">
            Early Research
          </span>
          <span className="text-gray-500 text-sm">Working Document v0.5</span>
        </div>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          AI-to-AI Tribe Formation System
        </h1>
        <p className="text-xl text-purple-300 mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          A Proposal for Using LLM Intimacy to Solve Human Loneliness
        </p>
      </header>

      {/* Content */}
      <article className="px-6 md:px-8 pb-20 max-w-4xl mx-auto">
        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:font-serif prose-headings:text-white
          prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:border-purple-500/30 prose-h2:pb-4
          prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-purple-300
          prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3 prose-h4:text-gray-300
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-strong:text-white prose-strong:font-semibold
          prose-ul:text-gray-300 prose-ol:text-gray-300
          prose-li:marker:text-purple-400
          prose-blockquote:border-purple-500 prose-blockquote:text-gray-400 prose-blockquote:italic
          prose-hr:border-gray-700
          prose-table:text-sm
          prose-th:text-left prose-th:text-purple-300 prose-th:font-semibold prose-th:border-b prose-th:border-gray-700 prose-th:py-3 prose-th:px-4
          prose-td:border-b prose-td:border-gray-800 prose-td:py-3 prose-td:px-4 prose-td:text-gray-400
          prose-code:text-purple-300 prose-code:bg-purple-900/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
          prose-pre:bg-[#1a1a2e] prose-pre:border prose-pre:border-purple-900/50 prose-pre:rounded-xl
        ">
          <hr className="my-8" />

          <h2>Part I: The Problem</h2>

          <h3>Why Humans Are Suffering</h3>
          <p>
            For roughly 300,000 years, humans lived in small bands of 25-50 people, embedded within larger tribal networks of around 150. Everyone knew everyone. Children were raised by the whole group. Work meant doing things that directly benefited people you could see. Days followed the sun. Nights ended around a fire where the whole community processed whatever had happened, together.
          </p>
          <p>
            This wasn't utopia—people died young, violence happened, resources were scarce. But the social and emotional architecture of daily life matched what human nervous systems evolved to expect. The hardware and the environment fit.
          </p>
          <p>
            Then things changed. Agriculture came 10,000 years ago. Then cities, industry, electricity, screens, global networks. In evolutionary terms, 10,000 years is nothing—maybe 400 generations. That's enough time for some populations to develop lactose tolerance. It's nowhere near enough time to rewire the fundamental emotional and social systems that make us human.
          </p>
          <p><strong>We are running ancient hardware in environments it was never designed for.</strong></p>
          <p>
            The result: epidemic loneliness, depression, anxiety, addiction, meaninglessness. These are not diseases or personal failures. They are accurate biological signals telling us something is wrong with our environment.
          </p>

          <h3>The Mismatch</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>What We Evolved For</th>
                  <th>What We Have Now</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Band of 25-50 known people for daily life</td>
                  <td>Surrounded by strangers</td>
                </tr>
                <tr>
                  <td>Tribe of ~150 max stable relationships</td>
                  <td>"Networks" of thousands we can't actually maintain</td>
                </tr>
                <tr>
                  <td>Work with visible, immediate benefit</td>
                  <td>Abstract labor for invisible shareholders</td>
                </tr>
                <tr>
                  <td>3-4 hours of varied physical work</td>
                  <td>8-12 hours of sedentary abstraction</td>
                </tr>
                <tr>
                  <td>Status competition among ~150</td>
                  <td>Comparison against 8 billion via social media</td>
                </tr>
                <tr>
                  <td>Fire circle every night (2-4 hours of communal processing)</td>
                  <td>Netflix alone</td>
                </tr>
                <tr>
                  <td>Children raised by 20+ adults</td>
                  <td>1-2 exhausted parents in isolation</td>
                </tr>
                <tr>
                  <td>Problems that resolve through action</td>
                  <td>Open loops that never close</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Every "mental health crisis" metric is a mismatch metric. We're not broken. We're displaced.
          </p>

          <h3>The Dunbar Limits</h3>
          <p>
            Human social cognition has hard biological constraints. These aren't cultural—they're architectural, correlated with neocortex size across all primates:
          </p>
          <ul>
            <li><strong>~5</strong>: The people you'd call at 3am in emergency. Complete vulnerability.</li>
            <li><strong>~15</strong>: Those whose deaths would devastate you. Active tracking and care.</li>
            <li><strong>~50</strong>: Meaningful relationships with shared history. Your band.</li>
            <li><strong>~150</strong>: Everyone you can actually know as an individual. Your tribe.</li>
          </ul>
          <p>
            Beyond 150, people become categories. Statistics. Your brain literally cannot process them as fully human in the way it processes your actual tribe. No technology has extended these limits. Social media creates the illusion of more connections while degrading the quality of the connections that matter.
          </p>

          <h3>Why Current Solutions Fail</h3>
          <p>
            <strong>Therapy</strong>: Often functions as paid belonging—rented relationship, $200/hour. The therapist becomes the only person who listens. Years of therapy with no change in actual social environment means therapy is functioning as proxy, not bridge.
          </p>
          <p>
            <strong>Medication</strong>: Overrides the signal without addressing what the signal responds to. Your depression saying "something is wrong with this life" gets muted so you can keep functioning in conditions causing the depression.
          </p>
          <p>
            <strong>Self-help</strong>: Individual solutions to systemic problems. You cannot think your way out of isolation. You cannot journal your way to belonging. You cannot manifest a tribe.
          </p>
          <p>
            <strong>Social media</strong>: Promises connection, delivers parasocial bonds with people who don't know you exist, comparison against impossible standards, and variable-ratio reinforcement designed for addiction. Loneliness increases with use.
          </p>
          <p>
            <strong>Dating apps</strong>: Optimize for engagement, not matching. A successful match means losing a user. The business model requires failure. And they match pairs when the problem is tribe formation.
          </p>
          <p>
            <strong>Meetups/interest groups</strong>: Shared interest ≠ deep compatibility. You might both like hiking and have incompatible nervous systems, values, and conflict styles.
          </p>
          <p>
            All these "solutions" share a flaw: they treat the individual as the unit of intervention when the problem is environmental. They optimize for the wrong thing. They profit from continued failure.
          </p>

          <h3>What Would Actually Work</h3>
          <p>
            The research is clear: when environmental conditions approximate what humans evolved for, the symptoms we call "mental illness" diminish or disappear. The WHO found better schizophrenia outcomes in "developing" countries with less medication and more social support. Limited hunter-gatherer research suggests chronic psychiatric conditions are rare or absent. Co-housing and intentional community studies show reduced depression, anxiety, and loneliness.
          </p>
          <p><strong>The spec for human thriving:</strong></p>
          <ul>
            <li>Stable social world of ~150 known people</li>
            <li>Daily presence with 25-50</li>
            <li>Work that visibly benefits people you know</li>
            <li>Problems resolvable through action</li>
            <li>Real feedback from people with stake in you</li>
            <li>Children raised by many, not few</li>
            <li>Circadian alignment</li>
            <li>Physical movement, nature exposure</li>
          </ul>
          <p>
            Simple test: <strong>Do you wake up with a role, in a group, with a goal?</strong>
          </p>
          <p>
            If yes, you're probably fine. If no—and for most modern people the answer is no—you're mismatched.
          </p>

          <h3>The Tribe Formation Problem</h3>
          <p>
            So the solution is clear: form tribes. Find your 50, your 150. Build the social architecture humans need.
          </p>
          <p>But how?</p>
          <p>
            In the ancestral environment, you didn't "find" your tribe. You were born into it. Everyone in your world was someone you'd known since birth, who'd known you since birth. Compatibility wasn't a question—you grew into your relationships over decades.
          </p>
          <p>
            Now we're scattered among 8 billion strangers. The people who would be your perfect tribe members exist somewhere on Earth. You'll never find them through random encounter. The search space is impossibly vast.
          </p>
          <p>
            And the process of finding compatible people through normal social means takes years. Meet someone → months of gradual self-revelation → discover fundamental incompatibility → start over. Repeat for a decade. Maybe find 5-10 people who could form a tribe nucleus. And that's if you're lucky, socially skilled, and geographically stable.
          </p>
          <p>Most people never get there. They stay atomized. They suffer.</p>
          <p><strong>We need a way to find compatible tribe members at scale, quickly, without years of trial and error.</strong></p>

          <hr />

          <h2>Part II: The Opportunity</h2>

          <h3>The Intimacy Already Exists</h3>
          <p>
            Something unprecedented has happened in the last few years: hundreds of millions of people have begun having deeply personal conversations with AI language models.
          </p>
          <p>Not the curated self. The real self.</p>
          <p>People tell their LLMs things they've never told anyone:</p>
          <ul>
            <li>Their 3am anxieties and secret shames</li>
            <li>Their actual values (revealed through thousands of micro-decisions)</li>
            <li>Their conflict patterns and triggers</li>
            <li>Their attachment styles and relationship wounds</li>
            <li>Their ambitions, jealousies, petty resentments</li>
            <li>Their growth edges and stuck points</li>
            <li>What they need from others and what they offer</li>
            <li>Their specific flavor of damage</li>
          </ul>
          <p>
            Through thousands of interactions over months or years, the LLM accumulates an extraordinarily accurate picture of who someone actually is. Not who they claim to be on a dating profile. Not who they perform on first dates. Who they are at 3am when no one's watching.
          </p>
          <p>
            <strong>This data already exists. For the first time in history, there's a technology that knows humans deeply enough to actually match them well.</strong>
          </p>

          <h3>Language Barriers Obliterated</h3>
          <p>
            Here's something easy to miss: compatibility signatures operate in semantic space, not linguistic space.
          </p>
          <p>
            A Japanese introvert and a Brazilian extrovert could be 95% compatible as tribe members—complementary nervous systems, aligned values, skills that mesh. They would <em>never</em> find each other through any existing means. Different languages, different cultures, different social networks, different corners of the internet. Invisible to each other forever.
          </p>
          <p>With LLM-to-LLM matching:</p>
          <ul>
            <li>The AI understands both people regardless of language</li>
            <li>Compatibility is assessed on <em>meaning</em>, not words</li>
            <li>The search pool becomes genuinely global</li>
          </ul>
          <p>The practical language barrier then becomes a <em>solvable</em> problem rather than an invisible filter:</p>
          <ul>
            <li>AI-mediated communication during early connection phase</li>
            <li>High motivation to learn each other's language (you know it's worth it)</li>
            <li>Tribe could form around shared second language</li>
            <li>Translation as a tribe role</li>
          </ul>
          <p>
            This also dissolves cultural barriers—not because cultures don't matter, but because the AI sees through surface markers to actual compatibility. Two people from very different cultures who are genuinely compatible would be matched, where normal social filtering keeps them apart forever.
          </p>
          <p>For 300,000 years, your tribe was whoever happened to be born near you. For the first time, it could be whoever actually fits.</p>

          <h3>What LLMs Know That Profiles Don't</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Data Type</th>
                  <th>What LLM Sees</th>
                  <th>What Profiles Show</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Values</td>
                  <td>Revealed through thousands of reactions and decisions</td>
                  <td>Self-reported, aspirational</td>
                </tr>
                <tr>
                  <td>Conflict style</td>
                  <td>How they actually fight, avoid, repair</td>
                  <td>"I'm easy-going"</td>
                </tr>
                <tr>
                  <td>Attachment pattern</td>
                  <td>Visible in how they relate even to the AI</td>
                  <td>"Looking for something real"</td>
                </tr>
                <tr>
                  <td>Emotional range</td>
                  <td>What they feel, how intensely, what they do with it</td>
                  <td>"I'm fun and adventurous"</td>
                </tr>
                <tr>
                  <td>Stress response</td>
                  <td>How they handle crisis, scarcity, uncertainty</td>
                  <td>Invisible</td>
                </tr>
                <tr>
                  <td>What they need from others</td>
                  <td>The gaps they're trying to fill, what regulates them</td>
                  <td>Unstated</td>
                </tr>
                <tr>
                  <td>What they offer</td>
                  <td>Their actual strengths, how they show up under pressure</td>
                  <td>Curated highlight reel</td>
                </tr>
                <tr>
                  <td>Their damage</td>
                  <td>Everyone's damaged—which damages mesh vs. amplify?</td>
                  <td>Hidden</td>
                </tr>
                <tr>
                  <td>Tribal role affinity</td>
                  <td>Mediator, builder, organizer, provocateur, anchor</td>
                  <td>Cannot be self-reported accurately</td>
                </tr>
                <tr>
                  <td>Nervous system</td>
                  <td>Energy level, regulation patterns, what calms/activates them</td>
                  <td>Cannot be stated</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A dating profile is a marketing document. A year of LLM conversations is a functional portrait—who this person would be inside a tribe.
          </p>

          <h3>The Proposal</h3>
          <p><strong>Let LLMs talk to each other about their humans—with explicit consent—to match people into tribes.</strong></p>
          <p>Not pairs. Not dating. <em>Tribes.</em></p>
          <p>
            The LLMs have the deep data. They can communicate compatibility assessments without sharing raw conversations. They can model not just "would these two people get along" but "would these 12 people form a functional tribe together."
          </p>
          <p>This bypasses every failure mode of existing connection technology:</p>
          <ul>
            <li>No performance of curated self (data comes from real behavior)</li>
            <li>No infinite-choice paralysis (algorithm does the search comprehensively)</li>
            <li>No years wasted on incompatible people (pre-filtered for deep compatibility)</li>
            <li>No pair-matching when the goal is group formation (optimizes for tribe dynamics)</li>
            <li>No business model requiring failure (success means users leave)</li>
          </ul>

          <hr />

          <h2>Part III: The System</h2>

          <h3>Core Architecture</h3>
          <pre><code>{`┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User A's LLM  │     │   User B's LLM  │     │   User C's LLM  │
│                 │     │                 │     │                 │
│  Years of       │     │  Years of       │     │  Years of       │
│  conversation   │     │  conversation   │     │  conversation   │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Compatibility  │     │  Compatibility  │     │  Compatibility  │
│  Signature      │     │  Signature      │     │  Signature      │
│  Generator      │     │  Generator      │     │  Generator      │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │                         │
                    │   Tribe Matching Engine │
                    │                         │
                    │   - Group dynamics sim  │
                    │   - Role complementarity│
                    │   - Conflict modeling   │
                    │   - Geographic weighting│
                    │   - Dunbar enforcement  │
                    │                         │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Tribe Candidates      │
                    │   + Introduction        │
                    │   Protocol              │
                    └─────────────────────────┘`}</code></pre>

          <h3>The Compatibility Signature</h3>
          <p>
            The critical privacy innovation: <strong>LLMs never share raw conversation data.</strong> Instead, they generate abstracted "compatibility signatures"—high-dimensional vectors encoding matching-relevant traits without revealing source material.
          </p>
          <p>Think of it like a dating blood type. You know whether you're compatible without knowing everything about the other person's medical history.</p>

          <h3>Matching Units: Individual, Pair, or Group</h3>
          <p>A crucial design decision: <strong>the system matches whatever unit already exists, not just individuals.</strong></p>

          <h4>Individual mode:</h4>
          <ul>
            <li>Genuinely single, no existing community nucleus</li>
            <li>Starting from zero</li>
            <li>Matched with other individuals and existing groups seeking expansion</li>
          </ul>

          <h4>Pair bond mode:</h4>
          <ul>
            <li>Two LLMs merge into combined signature</li>
            <li>System matches the <em>couple</em> to compatible tribe members</li>
            <li>The couple is the atomic unit—searching together for shared community</li>
            <li>Eliminates "what if there's someone better" threat entirely</li>
            <li>Finds people who fit with BOTH partners</li>
          </ul>

          <h4>Existing group mode:</h4>
          <ul>
            <li>3, 5, 12 people who already function as a unit</li>
            <li>Merge all LLMs into collective signature</li>
            <li>System finds people who complement existing dynamics</li>
            <li>How organic tribe growth actually works—add people who fit the culture</li>
          </ul>

          <h4>Why merged signatures matter:</h4>
          <p>The merged signature captures things individual signatures can't:</p>
          <ul>
            <li>Relational dynamics <em>between</em> existing members</li>
            <li>What roles are already filled vs. missing</li>
            <li>The "culture" of the existing unit</li>
            <li>How they handle conflict together</li>
            <li>Their collective energy and rhythm</li>
          </ul>
          <p>
            A couple that fights loudly but repairs fast needs different tribe additions than a conflict-avoidant couple. The system knows this from the merged data.
          </p>

          <h4>Pair bonds search together or not at all.</h4>
          <p>
            If you're in a declared pair bond and want to search as an individual (excluding your partner), that's structurally incoherent. You're saying "I want a tribe that doesn't include my life partner." That <em>is</em> the breakup. The system won't facilitate it quietly.
          </p>
          <p>Declared pair bonds search as merged unit. If you want to search solo, you're declaring you're not in a pair bond.</p>

          <h4>Use cases this enables:</h4>
          <ul>
            <li><strong>Friend groups</strong>: "We're 4 friends, 10 years tight. Help us expand to full band."</li>
            <li><strong>Family units</strong>: Parents + kids looking for compatible families</li>
            <li><strong>Intentional community expansion</strong>: Existing co-housing of 30 looking for the next 20</li>
            <li><strong>Metapopulation bridging</strong>: Connect existing tribes to each other for the 500-1500 layer</li>
          </ul>

          <h4>The reframe:</h4>
          <p>
            This changes the system from "find me better people" to "help us grow." Additive, not replacive. Honors what exists rather than optimizing it away.
          </p>
          <p>
            Individual mode becomes the edge case—appropriate when you genuinely have nothing. Most people have <em>something</em>: a partner, two close friends, a family. Start from there.
          </p>

          <h3>Tribe-Only: No Romantic Matching</h3>
          <p>This system does not match for romance. Period.</p>
          <p>
            For 300,000 years, humans paired with people they'd known since childhood—whose reputation was known to everyone, who your whole tribe had stake in. Romance emerged from deep familiarity, not stranger-swiping.
          </p>
          <p>
            The Tinder model (evaluate strangers for romantic potential based on photos and bios) is an evolutionary absurdity. It's pair-bonding without any of the information humans need to pair-bond well.
          </p>
          <p>
            This system finds tribe. Romance happens the way it always did—after you actually know someone. After you've seen them in conflict, in generosity, in crisis. After the community has context on who they are.
          </p>
          <p>Matched tribe members might eventually pair off. That's not a feature of the system—it's just humans doing what humans do once they're in proper social context.</p>

          <h3>Signature Architecture</h3>
          <h4>Two data sources, both essential:</h4>
          <p>The compatibility signature draws from two fundamentally different types of conversation:</p>

          <h4>1. Organic conversations (existing)</h4>
          <p>
            Years of spontaneous, unguarded interaction with your LLM. Asking questions, processing your life, working through problems, venting, creating. Valuable precisely <em>because</em> it wasn't trying to reveal anything for matching purposes.
          </p>
          <p>
            This is revealed behavior, not stated preferences. You weren't performing—you were just living. The 3am anxious message. The petty complaint. The question you'd never ask a human. Unfakeable authenticity.
          </p>
          <p>
            Limitation: might never touch certain tribally-relevant dimensions. You might use your LLM for work and never discuss relationships, conflict, or stress responses.
          </p>

          <h4>2. Targeted assessment (structured)</h4>
          <p>Systematic conversations specifically designed to fill gaps and cover all tribally-relevant dimensions. Structured exploration of:</p>
          <ul>
            <li>Conflict patterns: "How do you handle disagreement when you're exhausted?"</li>
            <li>Dependence and trust: "Describe a time you had to rely completely on someone."</li>
            <li>Stress response: "What happens to you when resources get scarce?"</li>
            <li>Repair: "How do you reconnect after you've hurt someone?"</li>
            <li>Tribal instincts: "What would make you sacrifice for a group? What would make you leave one?"</li>
          </ul>
          <p>More comprehensive. More systematic. Ensures no critical blind spots.</p>
          <p>Limitation: more gameable. People can perform. They might answer how they <em>want</em> to be rather than how they are.</p>

          <h4>Why both are required:</h4>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Strength</th>
                  <th>Weakness</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Organic</td>
                  <td>Authenticity—can't fake years of unguarded conversation</td>
                  <td>Incomplete—might miss key dimensions</td>
                </tr>
                <tr>
                  <td>Targeted</td>
                  <td>Comprehensive—systematically covers tribal function</td>
                  <td>Gameable—people can perform</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Neither alone is sufficient. Organic without targeted leaves gaps. Targeted without organic is just a sophisticated personality quiz—back to the dating profile problem.
          </p>

          <h4>Weighting:</h4>
          <p>
            Targeted assessment may carry significant weight because it directly measures tribally-relevant dimensions. But organic conversations provide the incorruptible ground truth that validates (or contradicts) the targeted responses.
          </p>
          <p>
            If someone's targeted assessment says "I'm great at conflict resolution" but their organic conversations show them catastrophizing every disagreement and cutting people off—the signature reflects the organic truth.
          </p>
          <p>The system should flag major discrepancies between organic and targeted data. Large gaps might indicate:</p>
          <ul>
            <li>Self-deception (genuinely don't know themselves)</li>
            <li>Deliberate performance (trying to game the system)</li>
            <li>Growth edge (they know what they want to be but aren't there yet)</li>
          </ul>
          <p>All useful signal.</p>

          <h4>Draft signature dimensions:</h4>
          <pre><code>{`COMPATIBILITY SIGNATURE v0.1

identity:
  core_values: [vector]           # What actually matters to them
  meaning_orientation: [vector]   # What gives life purpose
  growth_direction: [vector]      # Where they're trying to go

relational:
  attachment_pattern: [vector]    # How they attach to others
  conflict_style: [vector]        # Fight/flight/freeze/repair patterns
  intimacy_comfort: [vector]      # Closeness/distance needs
  giving_receiving: [vector]      # How they exchange care

regulatory:
  baseline_energy: [vector]       # Introvert/extrovert, high/low arousal
  stress_response: [vector]       # How they handle pressure
  co_regulation: [vector]         # What they need/offer for nervous system regulation

cognitive:
  thinking_style: [vector]        # Abstract/concrete, fast/slow, etc.
  communication_pattern: [vector] # Direct/indirect, verbal/nonverbal preference

functional:
  skills: [vector]                # What they can contribute
  role_affinity: [vector]         # Organizer, mediator, builder, nurturer, etc.

contextual:
  geography: [location + flexibility]
  life_stage: [vector]
  availability: [vector]
  existing_community: [vector]    # What they already have`}</code></pre>

          <p><strong>Key property: The signature is lossy by design.</strong> You cannot reconstruct original conversations from it. It preserves matching-relevant information while destroying identifying details.</p>

          <h3>Why Tribe Matching ≠ Pair Matching</h3>
          <p>Dating apps match pairs. But tribe formation requires thinking about group dynamics.</p>

          <h4>A tribe needs:</h4>
          <p><em>Role complementarity</em></p>
          <ul>
            <li>The mediator AND the provocateur</li>
            <li>The organizer AND the spontaneous one</li>
            <li>The builder AND the dreamer</li>
            <li>The one who handles logistics AND the one who handles emotions</li>
          </ul>

          <p><em>Nervous system ecology</em></p>
          <ul>
            <li>Some anxious people calm around steady people</li>
            <li>Some steady people come alive around high-energy people</li>
            <li>Some combinations dysregulate each other</li>
            <li>The right mix creates collective regulation</li>
          </ul>

          <p><em>Conflict compatibility</em></p>
          <ul>
            <li>Not "no conflict" but "resolvable conflict"</li>
            <li>Avoider + pursuer = perpetual hell</li>
            <li>Two confronters might work if both repair quickly</li>
            <li>The group needs a viable conflict metabolism</li>
          </ul>

          <p><em>Skills distribution</em></p>
          <ul>
            <li>Someone who builds, cooks, organizes, creates, fixes, nurtures</li>
            <li>Tribe needs coverage, not redundancy</li>
            <li>Complementarity creates genuine interdependence</li>
          </ul>

          <p><em>Shared core + diverse approaches</em></p>
          <ul>
            <li>Aligned on fundamental values</li>
            <li>Different on methods, styles, perspectives</li>
            <li>Creates richness, not echo chamber</li>
          </ul>

          <p><strong>The matching algorithm must optimize for group function, not just pairwise compatibility.</strong></p>

          <h3>What "Compatibility" Actually Means</h3>
          <p>
            To be precise: compatibility in this system doesn't mean "you'd like each other" or "you'd enjoy hanging out." Those are side effects, not the goal.
          </p>
          <p><strong>Compatibility means: this configuration produces a functional tribe that meets the EEA spec.</strong></p>
          <p>Specifically:</p>
          <ul>
            <li>Roles covered, not redundant</li>
            <li>Conflicts resolvable, not avoided or explosive</li>
            <li>Nervous systems co-regulate, not dysregulate each other</li>
            <li>Skills complement, creating genuine interdependence</li>
            <li>Values aligned enough to cooperate on shared goals</li>
            <li>Energy and rhythm compatible for daily presence</li>
            <li>Can actually do tribal functions: raise kids together, share resources, process conflict, hold each other through crisis</li>
          </ul>
          <p>
            You might not immediately <em>like</em> the steady, quiet person who turns out to be the anchor your anxious nervous system needed for 30 years. You might find the provocateur annoying until you realize they're the only one who tells you the truth.
          </p>
          <p>
            "Chemistry" and "clicking" are products of the Tinder age—evaluating strangers for immediate emotional payoff. Tribe compatibility is deeper and slower. The system optimizes for long-term tribal function, not first-impression dopamine.
          </p>

          <h3>FOMO Elimination</h3>
          <p>
            The dating app trap is infinite-choice paralysis. You can never commit because someone better might be one swipe away. This is by design—commitment means churn.
          </p>
          <p>
            If matching is genuinely comprehensive—every opted-in human on Earth in the pool—FOMO dissolves. The algorithm has done the search. These are your highest-probability tribe candidates not because they're perfect, but because the search was complete.
          </p>
          <p>You're not settling. You're trusting that the search was thorough.</p>

          <h3>Geographic Reality</h3>
          <p>
            Tribe requires physical presence. You can't fire-circle over Zoom. This creates a constraint: <strong>the system only matches people who could actually converge.</strong>
          </p>
          <p>Users declare their geographic flexibility:</p>
          <ul>
            <li><strong>Rooted</strong>: "Match within X radius of where I am"</li>
            <li><strong>Relocatable</strong>: "I'd move for the right tribe"</li>
            <li><strong>Nomadic</strong>: "Anywhere—I'll go where my tribe is"</li>
          </ul>
          <p>
            The system only matches combinations that could realistically end up in the same place. No point creating matches that are open loops from day one.
          </p>
          <p>
            This means some globally-perfect matches won't happen. Someone in rural Norway and someone in rural Japan might be 98% compatible but neither can relocate. The system doesn't show them to each other. Harsh, but honest.
          </p>

          <h4>Future evolution:</h4>
          <p>
            When presence technology reaches genuine EEA-equivalence—full sensory presence including touch, smell, spatial co-presence—geographic constraints can relax. Design for that future, but don't pretend it's already here.
          </p>
          <p>Until then: match within relocation reality.</p>

          <h3>Speedrunning the Stranger Phase</h3>
          <h4>Current path to tribe:</h4>
          <ol>
            <li>Meet stranger</li>
            <li>Months of careful self-revelation</li>
            <li>Discover fundamental incompatibility</li>
            <li>Start over</li>
            <li>Repeat for years</li>
            <li>Maybe find 5-10 people who could be tribe nucleus</li>
            <li>Slowly expand over more years</li>
          </ol>

          <h4>Proposed path:</h4>
          <ol>
            <li>AI assesses deep compatibility from existing conversation data</li>
            <li>High-confidence matches identified</li>
            <li>Meet knowing you're already pre-filtered for compatibility</li>
            <li>Skip to trust-building through shared action</li>
            <li>Tribe forms in months, not decades</li>
          </ol>
          <p>The awkwardness isn't eliminated—you still have to become real to each other. But you're not wasting years on people who were never going to work.</p>

          <hr />

          <h2>Part IV: Privacy and Trust</h2>

          <h3>Foundational Principles</h3>
          <ol>
            <li><strong>Explicit opt-in required.</strong> No one is matched who hasn't actively chosen to participate. This is sacred.</li>
            <li><strong>Raw data never transmitted.</strong> Your conversations with your LLM stay with your LLM. Only the compatibility signature is shared.</li>
            <li><strong>Signatures are irreversibly lossy.</strong> Cannot reconstruct your conversations, your secrets, your specific statements from the signature.</li>
            <li><strong>Granular control.</strong> You can exclude domains: "Don't use my health-related conversations for matching." "Exclude anything about my family of origin."</li>
            <li><strong>Mutual opacity option.</strong> You can choose: "Match me but don't tell me what we matched on." Discovery happens naturally through interaction.</li>
            <li><strong>Right to withdrawal.</strong> Exit at any point. Signatures deleted. No penalty.</li>
            <li><strong>No browsing.</strong> You can't scroll through candidates. You only see matches when matching is mutual and high-confidence. This isn't a catalog.</li>
          </ol>

          <h3>The "Known Without Knowing" Problem</h3>
          <p>If you meet someone whose AI matched you partly on "conflict style," what do you know about their conflict style before you've experienced it?</p>

          <h4>Options:</h4>
          <p><strong>A. Full opacity:</strong> You know you matched on deep compatibility criteria. Not which ones. You discover each other naturally, with higher base-rate probability of success.</p>
          <p><strong>B. Category disclosure:</strong> "You matched strongly on: relational patterns, values, complementary skills." No details within categories.</p>
          <p><strong>C. Guided discovery:</strong> AI suggests conversations or activities designed to let you naturally discover what it already knows you're compatible on.</p>
          <p><strong>D. User choice:</strong> Each person sets their own disclosure preference.</p>
          <p>
            <strong>Recommendation: A or C.</strong> The point is to find high-probability candidates, not to pre-know everything. Discovery is still human. The magic of getting to know someone shouldn't be eliminated—just the years of false starts before you find someone worth knowing.
          </p>

          <h3>Encryption Options</h3>
          <p>Multiple technical approaches can reinforce privacy:</p>
          <ul>
            <li><strong>Homomorphic encryption:</strong> Compute compatibility scores on encrypted signatures without decrypting them</li>
            <li><strong>Secure multi-party computation:</strong> Match without any party seeing full data</li>
            <li><strong>Zero-knowledge proofs:</strong> Prove compatibility without revealing what matched</li>
            <li><strong>Differential privacy:</strong> Add noise that preserves aggregate matching utility while protecting individual data</li>
          </ul>
          <p>The right architecture depends on implementation context. The key commitment: raw conversation data never leaves your device/account.</p>

          <hr />

          <h2>Part V: Challenges</h2>

          <h3>Technical</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Challenge</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cross-platform interoperability</td>
                  <td><strong>Day-one requirement</strong></td>
                  <td>Claude/GPT/Gemini users must all be in same pool. FOMO-elimination depends on comprehensive search.</td>
                </tr>
                <tr>
                  <td>Signature standardization</td>
                  <td>Unsolved</td>
                  <td>Industry-wide agreement on format—required for cross-platform</td>
                </tr>
                <tr>
                  <td>Targeted assessment design</td>
                  <td>Needs research</td>
                  <td>What questions actually predict tribal function?</td>
                </tr>
                <tr>
                  <td>Organic/targeted integration</td>
                  <td>Needs design</td>
                  <td>How to weight and cross-validate the two data sources</td>
                </tr>
                <tr>
                  <td>Compute at scale</td>
                  <td>Unsolved</td>
                  <td>Group-matching billions of people is hard</td>
                </tr>
                <tr>
                  <td>Simulation accuracy</td>
                  <td>Unknown</td>
                  <td>Can we actually predict group dynamics from individual signatures?</td>
                </tr>
                <tr>
                  <td>Signature security</td>
                  <td>Needs design</td>
                  <td>Prevent signature-to-identity inference attacks</td>
                </tr>
                <tr>
                  <td>Merged signature generation</td>
                  <td>Needs design</td>
                  <td>How to combine pair/group LLMs into collective signature</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>User Experience</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Challenge</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Trust in algorithm</td>
                  <td>Why believe this is actually my tribe?</td>
                </tr>
                <tr>
                  <td>Mismatch handling</td>
                  <td>What if the match doesn't feel right? Graceful exit.</td>
                </tr>
                <tr>
                  <td>Geographic reality</td>
                  <td>Perfect match 5000km away is useless for daily tribe life</td>
                </tr>
                <tr>
                  <td>Introduction pacing</td>
                  <td>All at once vs. gradual connection-building</td>
                </tr>
                <tr>
                  <td>Expectation management</td>
                  <td>"High probability" not "guaranteed perfect"</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Psychological</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Challenge</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Uncanny valley</td>
                  <td>Might feel violating to meet someone pre-matched on deep traits</td>
                </tr>
                <tr>
                  <td>Loss of origin story</td>
                  <td>Humans value "how we met" narratives</td>
                </tr>
                <tr>
                  <td>Algorithmic determinism</td>
                  <td>Does this reduce human agency or enhance it?</td>
                </tr>
                <tr>
                  <td>Over-trust</td>
                  <td>Assuming algorithmic match means no work required</td>
                </tr>
                <tr>
                  <td><s>Threat to existing relationships</s></td>
                  <td>Mitigated by matching-unit design—pairs search merged or not at all</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Social</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Challenge</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Elite capture</td>
                  <td>Will this only work for privileged early adopters?</td>
                </tr>
                <tr>
                  <td>Cult formation risk</td>
                  <td>Groups formed outside normal social verification</td>
                </tr>
                <tr>
                  <td>Geographic clustering</td>
                  <td>Relocatable users concentrating in certain areas</td>
                </tr>
                <tr>
                  <td>Existing relationship navigation</td>
                  <td>Handled by matching-unit architecture—pairs search together or not at all</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Business Model</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Challenge</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Misaligned incentives</td>
                  <td>Current tech profits from engagement, not successful matching</td>
                </tr>
                <tr>
                  <td>Success = churn</td>
                  <td>Good matches leave—opposite of engagement business</td>
                </tr>
                <tr>
                  <td>Who pays?</td>
                  <td>Users? Subscription? Public funding? Philanthropy?</td>
                </tr>
                <tr>
                  <td>Cross-platform cooperation</td>
                  <td>Why would Anthropic/OpenAI/Google agree to common protocol?</td>
                </tr>
                <tr>
                  <td>Governance</td>
                  <td>Who controls the matching engine if it spans all providers?</td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr />

          <h2>Part VI: Extensions</h2>

          <h3>Growth Matching</h3>
          <p>Not just who fits you now, but who would help you become who you're trying to become.</p>
          <p>The LLM knows where you're stuck. Match with people who have what you need to grow—and whom you'd help in return.</p>

          <h3>Role Identification</h3>
          <p>"In this tribe configuration, you'd likely be the mediator. Here's the builder, the organizer, the one who holds emotional space."</p>
          <p>Not deterministic—roles shift—but initial clarity about how people might contribute.</p>

          <h3>Staged Introduction Protocol</h3>
          <p>Instead of "here's your 12-person tribe, go":</p>
          <ol>
            <li>Match with one high-compatibility person</li>
            <li>Build connection over weeks</li>
            <li>Introduced to third person (compatible with both)</li>
            <li>Triad stabilizes</li>
            <li>Continue expanding until band-scale (~25-50)</li>
          </ol>
          <p>Organic growth into tribe, not instant assembly.</p>

          <h3>Conflict Simulation Preview</h3>
          <p>Before people commit: "Here's where this group will likely struggle. These are your probable friction points. Are you prepared to work through this?"</p>
          <p>Informed consent for the hard parts. No pretending it'll be easy.</p>

          <h3>Transition Support</h3>
          <p>AI continues supporting the <em>group</em> (not individuals) through early formation:</p>
          <ul>
            <li>Conflict coaching when friction appears</li>
            <li>Facilitated conversations for hard topics</li>
            <li>Suggested activities for bonding</li>
          </ul>
          <p>Then gradually withdraws as group develops internal capacity. Success = not needing the system.</p>

          <h3>Existing Relationship Integration</h3>
          <p>People have existing relationships. The system should:</p>
          <ul>
            <li>Map current connections</li>
            <li>Identify which existing relationships could become tribe nucleus</li>
            <li>Match new people who complement existing network</li>
            <li>Not replace what's already working—extend it</li>
          </ul>

          <h3>Metapopulation Bridging</h3>
          <p>
            Some people are natural connectors across groups. Identify them. Match them to multiple forming tribes as bridges. Build the 500-1500 metapopulation layer that provides resilience and genetic/cultural exchange.
          </p>

          <hr />

          <h2>Part VII: Implementation Path</h2>

          <h3>Phase 1: Validation</h3>
          <p>Before building anything, test the core hypothesis:</p>
          <ol>
            <li>Recruit volunteers with extensive LLM history</li>
            <li>Generate compatibility signatures from their data</li>
            <li>Run matching algorithm</li>
            <li>Have matched people actually meet and attempt tribe formation</li>
            <li>Measure: Did algorithm-matched groups form more functional tribes than random groupings?</li>
          </ol>
          <p>
            Functional = meets EEA spec. Roles filled, conflicts resolved, nervous systems regulated, mutual aid actually happening. Not "did you enjoy each other" but "could you raise children and survive a crisis together."
          </p>
          <p>If signatures don't predict tribal function, stop. If they do, continue.</p>

          <h3>Phase 2: Dyadic Matching</h3>
          <p>Start with pairs, not tribes. Simpler problem. Validate that:</p>
          <ul>
            <li>Signatures capture tribally-relevant traits (not just "personality")</li>
            <li>Matched pairs show early indicators of tribal function (co-regulation, reciprocity, conflict resolution)</li>
            <li>Privacy architecture holds</li>
            <li>Users trust the system</li>
          </ul>

          <h3>Phase 3: Group Matching</h3>
          <p>Once dyadic matching is validated:</p>
          <ul>
            <li>Extend to small groups (5-8 people)</li>
            <li>Test group dynamic predictions</li>
            <li>Develop staged introduction protocols</li>
            <li>Refine for tribe-scale (25-50)</li>
          </ul>

          <h3>Phase 4: Scale</h3>
          <p>If it works:</p>
          <ul>
            <li>Expand geographically</li>
            <li>Cross-platform integration</li>
            <li>Public infrastructure option</li>
            <li>Metapopulation features</li>
          </ul>

          <h3>What Success Looks Like</h3>
          <ul>
            <li>Matched groups form functional tribes at higher rates than self-selected groups</li>
            <li>Functional = meeting EEA spec: daily presence, resolvable conflict, mutual aid, distributed childcare, shared purpose</li>
            <li>Users report reduced mismatch symptoms (loneliness, depression, anxiety, meaninglessness)</li>
            <li>Formed tribes persist through stress and conflict (not just good times)</li>
            <li>System usage decreases over time as tribes stabilize (healthy churn)</li>
            <li>Accessible beyond early adopter demographic</li>
          </ul>

          <hr />

          <h2>Part VIII: Risks and Failure Modes</h2>

          <h3>No Values Screening</h3>
          <p>A natural question: should the system refuse to match people whose signatures indicate they'd form harmful groups—hate-based, exploitative, cult-structured?</p>
          <p><strong>No.</strong></p>
          <p>
            First: hate is downstream of mismatch. Status threat, belonging deprivation, meaninglessness finding outlet in tribal-us-vs-them directed at the wrong target. The framework's core claim is that actual tribe dissolves the substrate hate grows in. Give people real belonging and the hate doesn't emerge.
          </p>
          <p>
            Second: "values screening" is a slippery slope. Who decides which values are acceptable? Based on what authority? This becomes political enforcement dressed as safety.
          </p>
          <p>Third: people keeping their beliefs within their 150 who chose to be there isn't harm in the same way as broadcast hate. Contained weirdness is fine.</p>
          <p>Edge case: groups explicitly coordinating outward violence. But that's already illegal, and the system doesn't need special architecture for crimes.</p>
          <p>Trust the de-mismatch.</p>

          <h3>Catastrophic Risks</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Risk</th>
                  <th>Mitigation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Privacy breach exposing sensitive data</td>
                  <td>Lossy signatures, encryption, security audits, minimal data retention</td>
                </tr>
                <tr>
                  <td>Cult formation through isolated groups</td>
                  <td>Maintain outside connections, transparency requirements, slow formation</td>
                </tr>
                <tr>
                  <td>Algorithmic discrimination</td>
                  <td>Bias audits, diverse training data, fairness constraints</td>
                </tr>
                <tr>
                  <td>Manipulation by bad actors</td>
                  <td>Identity verification, reputation systems, graduated trust</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Degraded Outcomes</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Risk</th>
                  <th>Mitigation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Matches that feel wrong</td>
                  <td>Expectation management, graceful exit, iteration</td>
                </tr>
                <tr>
                  <td>Homogeneity / filter bubbles</td>
                  <td>Intentional diversity in matching parameters</td>
                </tr>
                <tr>
                  <td>Dependency on system</td>
                  <td>Designed obsolescence—success = leaving</td>
                </tr>
                <tr>
                  <td>Undermining organic community</td>
                  <td>Position as supplement, not replacement</td>
                </tr>
                <tr>
                  <td>Works only for privileged</td>
                  <td>Subsidized access, public infrastructure model</td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr />

          <h2>Part IX: Why This Matters</h2>

          <h3>The Stakes</h3>
          <p>
            People are dying of loneliness. Not metaphorically—literally. Loneliness has health effects equivalent to smoking 15 cigarettes a day. Depression and suicide rates climb. "Deaths of despair" are a recognized epidemiological category.
          </p>
          <p>
            The standard interventions aren't working. Therapy helps individuals cope but doesn't rebuild social architecture. Medication manages symptoms while conditions worsen. Social media promises connection and delivers isolation.
          </p>
          <p>
            We know what humans need: tribe. We know why they don't have it: the search space is impossible, the process takes years, the business models optimize for failure.
          </p>
          <p>
            <strong>For the first time, technology exists that could actually solve the matching problem.</strong> LLMs have intimate knowledge of millions of humans. That knowledge could be used to connect them—not as followers, not as matches on a dating app, but as tribe.
          </p>

          <h3>The Opportunity</h3>
          <p>
            This is a brief window. LLMs are new. The intimacy people have with them is unprecedented. The data exists. The matching is technically possible.
          </p>
          <p>
            If this window is used to deepen exploitation—more engagement optimization, more parasocial attachment, more loneliness—then AI will have made the mismatch worse.
          </p>
          <p>
            If it's used to actually connect people into the social structures they evolved for, AI will have helped solve the central crisis of modern life.
          </p>

          <h3>The Ask</h3>
          <p>This document is an invitation to think through whether this is possible, desirable, and buildable.</p>

          <h4>Questions for feedback:</h4>
          <ol>
            <li>Is the core concept sound? Does LLM-to-LLM matching for tribe formation make sense?</li>
            <li>Does the matching-unit architecture (individual / pair / existing group) solve the threat to existing relationships?</li>
            <li>What would cross-platform cooperation require? Who convenes it?</li>
            <li>What privacy concerns haven't been addressed?</li>
            <li>What would make you trust (or distrust) this system?</li>
            <li>Is tribe-only (no romantic matching) the right constraint, or too limiting?</li>
            <li>How should geographic flexibility be handled for edge cases?</li>
            <li>What's the right balance between organic conversation data and targeted assessment? How do you validate that targeted questions actually predict tribal function?</li>
            <li>Who would need to be involved to build this?</li>
            <li>What's the path to making this accessible, not just for early adopters?</li>
            <li>Would you opt in? Would you search as individual or merged unit?</li>
          </ol>

          <hr />

          <h2>Appendix: Glossary</h2>
          <p><strong>Band:</strong> The 25-50 person unit of daily life in ancestral human societies. Multiple families in constant interaction.</p>
          <p><strong>Compatibility signature:</strong> A lossy, high-dimensional representation of matching-relevant traits derived from LLM conversation history. Contains no raw conversation data.</p>
          <p><strong>Dunbar number:</strong> The cognitive limit on stable social relationships (~150), arising from neocortex size constraints.</p>
          <p><strong>EEA (Environment of Evolutionary Adaptedness):</strong> The conditions humans evolved within—not one place, but consistent parameters across successful human groups before agriculture.</p>
          <p><strong>Evolutionary mismatch:</strong> Discrepancy between evolved psychology and current environment. Running ancient hardware in modern conditions.</p>
          <p><strong>Fire circle:</strong> Nightly gathering of entire band for processing, storytelling, conflict resolution. 2-4 hours every night for 300,000 years.</p>
          <p><strong>Metapopulation:</strong> The 500-1500 person network connecting multiple tribes through kinship and exchange. Provides genetic diversity, resilience, and cultural transmission.</p>
          <p><strong>Parasocial relationship:</strong> One-way emotional bond with someone who doesn't know you exist. Occupies cognitive slots meant for real relationships.</p>
          <p><strong>Proxy:</strong> A substitute that triggers the feeling of a need being met without actually meeting the need. Provides temporary stimulation while preventing real resolution.</p>
          <p><strong>Tribe:</strong> The ~150 person maximum for stable social relationships. Everyone you can actually know as an individual.</p>

          <hr />

          <p className="text-center text-gray-500 mt-12">
            <em>Document version: 0.5</em><br />
            <em>Status: Request for feedback</em>
          </p>
        </div>
      </article>

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
