import Link from "next/link";
import Navigation from "@/components/Navigation";

// SVG Components
const DunbarCirclesSVG = () => (
  <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto my-8">
    {/* Outer circle - 150 */}
    <circle cx="200" cy="200" r="180" fill="none" stroke="#7C3AED" strokeWidth="2" strokeDasharray="4 2" opacity="0.3" />
    <text x="200" y="30" textAnchor="middle" fill="#7C3AED" fontSize="12" fontFamily="Georgia">~150 — Your Tribe</text>

    {/* 50 circle */}
    <circle cx="200" cy="200" r="130" fill="none" stroke="#7C3AED" strokeWidth="2" strokeDasharray="4 2" opacity="0.5" />
    <text x="340" y="120" textAnchor="start" fill="#6D28D9" fontSize="11" fontFamily="Georgia">~50 — Your Band</text>

    {/* 15 circle */}
    <circle cx="200" cy="200" r="80" fill="none" stroke="#7C3AED" strokeWidth="2" opacity="0.7" />
    <text x="60" y="150" textAnchor="end" fill="#6D28D9" fontSize="11" fontFamily="Georgia">~15 — Close friends</text>

    {/* 5 circle - innermost */}
    <circle cx="200" cy="200" r="40" fill="#7C3AED" opacity="0.2" stroke="#7C3AED" strokeWidth="2" />
    <text x="200" y="205" textAnchor="middle" fill="#1A1A1A" fontSize="12" fontWeight="bold" fontFamily="Georgia">~5</text>
    <text x="200" y="220" textAnchor="middle" fill="#374151" fontSize="9" fontFamily="Georgia">3am call</text>

    {/* You at center */}
    <circle cx="200" cy="200" r="8" fill="#7C3AED" />

    {/* People dots in each layer */}
    {/* 5 layer */}
    {[0, 72, 144, 216, 288].map((angle, i) => (
      <circle key={`inner-${i}`} cx={200 + 25 * Math.cos(angle * Math.PI / 180)} cy={200 + 25 * Math.sin(angle * Math.PI / 180)} r="4" fill="#7C3AED" opacity="0.8" />
    ))}
    {/* 15 layer */}
    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
      <circle key={`mid-${i}`} cx={200 + 60 * Math.cos(angle * Math.PI / 180)} cy={200 + 60 * Math.sin(angle * Math.PI / 180)} r="3" fill="#7C3AED" opacity="0.6" />
    ))}
    {/* 50 layer */}
    {Array.from({length: 20}).map((_, i) => (
      <circle key={`outer1-${i}`} cx={200 + 105 * Math.cos(i * 18 * Math.PI / 180)} cy={200 + 105 * Math.sin(i * 18 * Math.PI / 180)} r="2.5" fill="#7C3AED" opacity="0.4" />
    ))}
    {/* 150 layer */}
    {Array.from({length: 30}).map((_, i) => (
      <circle key={`outer2-${i}`} cx={200 + 155 * Math.cos(i * 12 * Math.PI / 180)} cy={200 + 155 * Math.sin(i * 12 * Math.PI / 180)} r="2" fill="#7C3AED" opacity="0.25" />
    ))}
  </svg>
);

const SystemArchitectureSVG = () => (
  <svg viewBox="0 0 600 450" className="w-full max-w-2xl mx-auto my-8">
    {/* User LLMs */}
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={50 + i * 200} y="20" width="100" height="80" rx="8" fill="#7C3AED" opacity="0.1" stroke="#7C3AED" strokeWidth="2" />
        <text x={100 + i * 200} y="50" textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="bold">User {String.fromCharCode(65 + i)}'s</text>
        <text x={100 + i * 200} y="65" textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="bold">LLM</text>
        <text x={100 + i * 200} y="85" textAnchor="middle" fill="#374151" fontSize="9">Years of</text>
        <text x={100 + i * 200} y="95" textAnchor="middle" fill="#374151" fontSize="9">conversation</text>

        {/* Arrow down */}
        <line x1={100 + i * 200} y1="100" x2={100 + i * 200} y2="130" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#arrowhead)" />

        {/* Signature Generator */}
        <rect x={50 + i * 200} y="140" width="100" height="60" rx="8" fill="white" stroke="#7C3AED" strokeWidth="2" />
        <text x={100 + i * 200} y="165" textAnchor="middle" fill="#6D28D9" fontSize="10" fontWeight="bold">Compatibility</text>
        <text x={100 + i * 200} y="180" textAnchor="middle" fill="#6D28D9" fontSize="10" fontWeight="bold">Signature</text>
      </g>
    ))}

    {/* Arrowhead definition */}
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#7C3AED" />
      </marker>
    </defs>

    {/* Converging lines to matching engine */}
    <line x1="100" y1="200" x2="300" y2="270" stroke="#7C3AED" strokeWidth="2" />
    <line x1="300" y1="200" x2="300" y2="270" stroke="#7C3AED" strokeWidth="2" />
    <line x1="500" y1="200" x2="300" y2="270" stroke="#7C3AED" strokeWidth="2" />

    {/* Matching Engine */}
    <rect x="175" y="280" width="250" height="100" rx="12" fill="#7C3AED" opacity="0.15" stroke="#7C3AED" strokeWidth="2" />
    <text x="300" y="305" textAnchor="middle" fill="#1A1A1A" fontSize="13" fontWeight="bold">Tribe Matching Engine</text>
    <text x="300" y="325" textAnchor="middle" fill="#374151" fontSize="10">Group dynamics simulation</text>
    <text x="300" y="340" textAnchor="middle" fill="#374151" fontSize="10">Role complementarity</text>
    <text x="300" y="355" textAnchor="middle" fill="#374151" fontSize="10">Conflict modeling</text>
    <text x="300" y="370" textAnchor="middle" fill="#374151" fontSize="10">Geographic weighting</text>

    {/* Arrow to output */}
    <line x1="300" y1="380" x2="300" y2="410" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#arrowhead)" />

    {/* Output */}
    <rect x="200" y="420" width="200" height="25" rx="6" fill="#7C3AED" />
    <text x="300" y="437" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Tribe Candidates + Intro Protocol</text>
  </svg>
);

const MatchingUnitsSVG = () => (
  <svg viewBox="0 0 600 200" className="w-full max-w-2xl mx-auto my-8">
    {/* Individual */}
    <g>
      <circle cx="80" cy="80" r="25" fill="#7C3AED" opacity="0.2" stroke="#7C3AED" strokeWidth="2" />
      <circle cx="80" cy="80" r="8" fill="#7C3AED" />
      <text x="80" y="130" textAnchor="middle" fill="#1A1A1A" fontSize="12" fontWeight="bold">Individual</text>
      <text x="80" y="145" textAnchor="middle" fill="#374151" fontSize="9">Starting from zero</text>
    </g>

    {/* Pair */}
    <g>
      <ellipse cx="280" cy="80" rx="50" ry="35" fill="#7C3AED" opacity="0.2" stroke="#7C3AED" strokeWidth="2" />
      <circle cx="260" cy="80" r="8" fill="#7C3AED" />
      <circle cx="300" cy="80" r="8" fill="#7C3AED" />
      <path d="M265 80 Q280 70 295 80" stroke="#7C3AED" strokeWidth="2" fill="none" />
      <text x="280" y="130" textAnchor="middle" fill="#1A1A1A" fontSize="12" fontWeight="bold">Pair Bond</text>
      <text x="280" y="145" textAnchor="middle" fill="#374151" fontSize="9">Search merged or not at all</text>
    </g>

    {/* Group */}
    <g>
      <ellipse cx="480" cy="80" rx="70" ry="45" fill="#7C3AED" opacity="0.2" stroke="#7C3AED" strokeWidth="2" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <circle key={i} cx={480 + 30 * Math.cos(angle * Math.PI / 180)} cy={80 + 25 * Math.sin(angle * Math.PI / 180)} r="7" fill="#7C3AED" opacity={0.6 + i * 0.05} />
      ))}
      <text x="480" y="145" textAnchor="middle" fill="#1A1A1A" fontSize="12" fontWeight="bold">Existing Group</text>
      <text x="480" y="160" textAnchor="middle" fill="#374151" fontSize="9">Expand the tribe you have</text>
    </g>

    {/* Arrows between */}
    <path d="M120 80 L180 80" stroke="#7C3AED" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
    <path d="M350 80 L400 80" stroke="#7C3AED" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
  </svg>
);

const MismatchComparisonSVG = () => (
  <svg viewBox="0 0 600 300" className="w-full max-w-2xl mx-auto my-8">
    {/* Left side - Evolved For */}
    <rect x="20" y="20" width="250" height="260" rx="12" fill="#7C3AED" opacity="0.08" />
    <text x="145" y="50" textAnchor="middle" fill="#7C3AED" fontSize="14" fontWeight="bold">What We Evolved For</text>

    {/* Tribe icon */}
    <g transform="translate(70, 80)">
      <circle cx="75" cy="40" r="35" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <circle key={i} cx={75 + 25 * Math.cos(angle * Math.PI / 180)} cy={40 + 25 * Math.sin(angle * Math.PI / 180)} r="5" fill="#7C3AED" opacity="0.7" />
      ))}
      <circle cx="75" cy="40" r="7" fill="#7C3AED" />
    </g>

    <text x="145" y="160" textAnchor="middle" fill="#374151" fontSize="10">25-50 known people daily</text>
    <text x="145" y="180" textAnchor="middle" fill="#374151" fontSize="10">Work with visible benefit</text>
    <text x="145" y="200" textAnchor="middle" fill="#374151" fontSize="10">Fire circle every night</text>
    <text x="145" y="220" textAnchor="middle" fill="#374151" fontSize="10">Children raised by 20+ adults</text>
    <text x="145" y="240" textAnchor="middle" fill="#374151" fontSize="10">Problems resolve through action</text>
    <text x="145" y="265" textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="bold">Hardware fits environment</text>

    {/* Right side - What We Have */}
    <rect x="330" y="20" width="250" height="260" rx="12" fill="#DC2626" opacity="0.08" />
    <text x="455" y="50" textAnchor="middle" fill="#DC2626" fontSize="14" fontWeight="bold">What We Have Now</text>

    {/* Scattered dots icon */}
    <g transform="translate(380, 80)">
      {Array.from({length: 25}).map((_, i) => (
        <circle key={i} cx={75 + (Math.random() - 0.5) * 100} cy={40 + (Math.random() - 0.5) * 60} r="3" fill="#DC2626" opacity={0.3 + Math.random() * 0.3} />
      ))}
      <circle cx="75" cy="40" r="7" fill="#DC2626" />
      <text x="75" y="45" textAnchor="middle" fill="white" fontSize="8">?</text>
    </g>

    <text x="455" y="160" textAnchor="middle" fill="#374151" fontSize="10">Surrounded by strangers</text>
    <text x="455" y="180" textAnchor="middle" fill="#374151" fontSize="10">Abstract labor for shareholders</text>
    <text x="455" y="200" textAnchor="middle" fill="#374151" fontSize="10">Netflix alone</text>
    <text x="455" y="220" textAnchor="middle" fill="#374151" fontSize="10">1-2 exhausted parents</text>
    <text x="455" y="240" textAnchor="middle" fill="#374151" fontSize="10">Open loops that never close</text>
    <text x="455" y="265" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="bold">Hardware ≠ environment</text>

    {/* VS divider */}
    <circle cx="300" cy="150" r="20" fill="white" stroke="#374151" strokeWidth="1" />
    <text x="300" y="155" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="bold">vs</text>
  </svg>
);

const PrivacyFlowSVG = () => (
  <svg viewBox="0 0 500 150" className="w-full max-w-xl mx-auto my-8">
    {/* Raw conversations */}
    <rect x="10" y="40" width="100" height="70" rx="8" fill="#7C3AED" opacity="0.1" stroke="#7C3AED" strokeWidth="2" />
    <text x="60" y="65" textAnchor="middle" fill="#374151" fontSize="9">Years of</text>
    <text x="60" y="80" textAnchor="middle" fill="#374151" fontSize="9">intimate</text>
    <text x="60" y="95" textAnchor="middle" fill="#374151" fontSize="9">conversations</text>

    {/* Arrow with X */}
    <line x1="120" y1="75" x2="170" y2="75" stroke="#DC2626" strokeWidth="2" strokeDasharray="5 3" />
    <text x="145" y="65" textAnchor="middle" fill="#DC2626" fontSize="16" fontWeight="bold">✕</text>
    <text x="145" y="100" textAnchor="middle" fill="#DC2626" fontSize="8">Never shared</text>

    {/* Lossy transformation */}
    <rect x="180" y="30" width="90" height="90" rx="8" fill="white" stroke="#7C3AED" strokeWidth="2" />
    <text x="225" y="55" textAnchor="middle" fill="#6D28D9" fontSize="10" fontWeight="bold">Lossy</text>
    <text x="225" y="70" textAnchor="middle" fill="#6D28D9" fontSize="10" fontWeight="bold">Transform</text>
    <text x="225" y="90" textAnchor="middle" fill="#374151" fontSize="8">Irreversible</text>
    <text x="225" y="102" textAnchor="middle" fill="#374151" fontSize="8">abstraction</text>

    {/* Arrow */}
    <line x1="280" y1="75" x2="320" y2="75" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#arrowhead2)" />
    <defs>
      <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#7C3AED" />
      </marker>
    </defs>

    {/* Compatibility Signature */}
    <rect x="330" y="40" width="100" height="70" rx="8" fill="#7C3AED" opacity="0.2" stroke="#7C3AED" strokeWidth="2" />
    <text x="380" y="65" textAnchor="middle" fill="#1A1A1A" fontSize="10" fontWeight="bold">Compatibility</text>
    <text x="380" y="80" textAnchor="middle" fill="#1A1A1A" fontSize="10" fontWeight="bold">Signature</text>
    <text x="380" y="98" textAnchor="middle" fill="#374151" fontSize="8">Safe to share</text>

    {/* Checkmark */}
    <circle cx="460" cy="75" r="20" fill="#7C3AED" opacity="0.1" stroke="#7C3AED" strokeWidth="2" />
    <text x="460" y="82" textAnchor="middle" fill="#7C3AED" fontSize="20">✓</text>

    {/* Labels */}
    <text x="60" y="130" textAnchor="middle" fill="#374151" fontSize="9">Your secrets</text>
    <text x="380" y="130" textAnchor="middle" fill="#374151" fontSize="9">Matching vectors</text>
  </svg>
);

const TribeVsPairSVG = () => (
  <svg viewBox="0 0 500 200" className="w-full max-w-xl mx-auto my-8">
    {/* Dating Apps - Pair */}
    <g>
      <text x="125" y="25" textAnchor="middle" fill="#DC2626" fontSize="12" fontWeight="bold">Dating Apps</text>
      <circle cx="100" cy="80" r="15" fill="#DC2626" opacity="0.3" stroke="#DC2626" strokeWidth="2" />
      <circle cx="150" cy="80" r="15" fill="#DC2626" opacity="0.3" stroke="#DC2626" strokeWidth="2" />
      <path d="M115 80 L135 80" stroke="#DC2626" strokeWidth="2" />
      <text x="125" y="120" textAnchor="middle" fill="#374151" fontSize="10">Match pairs</text>
      <text x="125" y="135" textAnchor="middle" fill="#374151" fontSize="10">Infinite choice</text>
      <text x="125" y="150" textAnchor="middle" fill="#374151" fontSize="10">Success = churn</text>
      <text x="125" y="170" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="bold">Optimize for engagement</text>
    </g>

    {/* Divider */}
    <line x1="250" y1="20" x2="250" y2="180" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

    {/* This System - Tribe */}
    <g>
      <text x="375" y="25" textAnchor="middle" fill="#7C3AED" fontSize="12" fontWeight="bold">This System</text>
      <ellipse cx="375" cy="80" rx="60" ry="45" fill="#7C3AED" opacity="0.1" stroke="#7C3AED" strokeWidth="2" />
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
        <circle key={i} cx={375 + 40 * Math.cos(angle * Math.PI / 180)} cy={80 + 30 * Math.sin(angle * Math.PI / 180)} r="8" fill="#7C3AED" opacity={0.4 + i * 0.05} />
      ))}
      <text x="375" y="145" textAnchor="middle" fill="#374151" fontSize="10">Match tribes</text>
      <text x="375" y="160" textAnchor="middle" fill="#374151" fontSize="10">Comprehensive search</text>
      <text x="375" y="175" textAnchor="middle" fill="#374151" fontSize="10">Success = leaving</text>
      <text x="375" y="195" textAnchor="middle" fill="#7C3AED" fontSize="10" fontWeight="bold">Optimize for tribe function</text>
    </g>
  </svg>
);

export default function TribeMatcherPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] pt-20">
      <Navigation />

      {/* Header */}
      <header className="px-6 md:px-8 pt-12 pb-8 max-w-4xl mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-[#7C3AED] hover:text-[#6D28D9] transition mb-6"
        >
          ← Back to Projects
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-[#7C3AED] text-white text-xs font-bold rounded-full uppercase tracking-wider">
            Early Research
          </span>
          <span className="text-gray-500 text-sm">Working Document v0.5</span>
        </div>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#1A1A1A] mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          AI-to-AI Tribe Formation System
        </h1>
        <p className="text-xl text-[#7C3AED]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          A Proposal for Using LLM Intimacy to Solve Human Loneliness
        </p>
      </header>

      {/* TL;DR Section */}
      <section className="px-6 md:px-8 pb-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#7C3AED]/10 to-[#6D28D9]/5 border border-[#7C3AED]/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#7C3AED] uppercase tracking-wider mb-4">TL;DR</h2>

          <div className="space-y-4 text-[#1A1A1A]" style={{ fontFamily: 'Georgia, serif' }}>
            <p className="text-lg font-medium">
              <strong>The Problem:</strong> Humans evolved for tribes of ~150 people. We now live among strangers, and epidemic loneliness is the predictable result. Current solutions (therapy, apps, meetups) treat individuals when the problem is environmental.
            </p>

            <p className="text-lg font-medium">
              <strong>The Opportunity:</strong> Millions of people have had deeply intimate conversations with AI assistants—revealing who they actually are, not who they perform on profiles. This data already exists.
            </p>

            <p className="text-lg font-medium">
              <strong>The Proposal:</strong> Let LLMs talk to each other (with consent) to match people into <em>tribes</em>—not pairs, not dates. The AI generates abstract "compatibility signatures" that never expose raw conversations, then finds groups of 25-150 people who would actually function together: complementary roles, compatible nervous systems, resolvable conflict styles.
            </p>

            <p className="text-lg font-medium">
              <strong>Key Design Choices:</strong> Pair bonds search as merged units (no secret individual searching). No romantic matching—that happens naturally after you know someone. Cross-platform from day one (Claude + GPT + Gemini users in same pool). Geographic reality enforced.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#7C3AED]/20">
            <p className="text-sm text-gray-600">
              Full document below (~20 min read) covers the problem analysis, system architecture, privacy design, challenges, and implementation path.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="px-6 md:px-8 pb-20 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none
          prose-headings:font-serif prose-headings:text-[#1A1A1A]
          prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:border-[#7C3AED]/30 prose-h2:pb-4
          prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-[#6D28D9]
          prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3 prose-h4:text-[#1A1A1A]
          prose-p:text-[#374151] prose-p:leading-relaxed
          prose-strong:text-[#1A1A1A] prose-strong:font-semibold
          prose-ul:text-[#374151] prose-ol:text-[#374151]
          prose-li:marker:text-[#7C3AED]
          prose-blockquote:border-[#7C3AED] prose-blockquote:text-gray-600 prose-blockquote:italic
          prose-hr:border-gray-300
          prose-table:text-sm
          prose-th:text-left prose-th:text-[#6D28D9] prose-th:font-semibold prose-th:border-b prose-th:border-gray-300 prose-th:py-3 prose-th:px-4 prose-th:bg-[#7C3AED]/5
          prose-td:border-b prose-td:border-gray-200 prose-td:py-3 prose-td:px-4 prose-td:text-[#374151]
          prose-code:text-[#7C3AED] prose-code:bg-[#7C3AED]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
          prose-pre:bg-[#1A1A1A] prose-pre:text-gray-300 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-xl
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

          <MismatchComparisonSVG />

          <h3>The Dunbar Limits</h3>
          <p>
            Human social cognition has hard biological constraints. These aren't cultural—they're architectural, correlated with neocortex size across all primates:
          </p>

          <DunbarCirclesSVG />

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
          <p>
            For 300,000 years, your tribe was whoever happened to be born near you. For the first time, it could be whoever actually fits.
          </p>

          <h3>The Proposal</h3>
          <p><strong>Let LLMs talk to each other about their humans—with explicit consent—to match people into tribes.</strong></p>
          <p>Not pairs. Not dating. <em>Tribes.</em></p>

          <TribeVsPairSVG />

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

          <SystemArchitectureSVG />

          <h3>The Compatibility Signature</h3>
          <p>
            The critical privacy innovation: <strong>LLMs never share raw conversation data.</strong> Instead, they generate abstracted "compatibility signatures"—high-dimensional vectors encoding matching-relevant traits without revealing source material.
          </p>

          <PrivacyFlowSVG />

          <p>Think of it like a dating blood type. You know whether you're compatible without knowing everything about the other person's medical history.</p>

          <h3>Matching Units: Individual, Pair, or Group</h3>
          <p>A crucial design decision: <strong>the system matches whatever unit already exists, not just individuals.</strong></p>

          <MatchingUnitsSVG />

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

          <h4>2. Targeted assessment (structured)</h4>
          <p>Systematic conversations specifically designed to fill gaps and cover all tribally-relevant dimensions. Structured exploration of:</p>
          <ul>
            <li>Conflict patterns: "How do you handle disagreement when you're exhausted?"</li>
            <li>Dependence and trust: "Describe a time you had to rely completely on someone."</li>
            <li>Stress response: "What happens to you when resources get scarce?"</li>
            <li>Repair: "How do you reconnect after you've hurt someone?"</li>
            <li>Tribal instincts: "What would make you sacrifice for a group? What would make you leave one?"</li>
          </ul>

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
                  <td>Claude/GPT/Gemini users must all be in same pool</td>
                </tr>
                <tr>
                  <td>Signature standardization</td>
                  <td>Unsolved</td>
                  <td>Industry-wide agreement on format required</td>
                </tr>
                <tr>
                  <td>Targeted assessment design</td>
                  <td>Needs research</td>
                  <td>What questions predict tribal function?</td>
                </tr>
                <tr>
                  <td>Compute at scale</td>
                  <td>Unsolved</td>
                  <td>Group-matching billions of people is hard</td>
                </tr>
                <tr>
                  <td>Simulation accuracy</td>
                  <td>Unknown</td>
                  <td>Can we predict group dynamics from signatures?</td>
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
                  <td>Over-trust</td>
                  <td>Assuming algorithmic match means no work required</td>
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
                  <td>Cross-platform cooperation</td>
                  <td>Why would Anthropic/OpenAI/Google agree to common protocol?</td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr />

          <h2>Part VI: Implementation Path</h2>

          <h3>Phase 1: Validation</h3>
          <p>Before building anything, test the core hypothesis:</p>
          <ol>
            <li>Recruit volunteers with extensive LLM history</li>
            <li>Generate compatibility signatures from their data</li>
            <li>Run matching algorithm</li>
            <li>Have matched people actually meet and attempt tribe formation</li>
            <li>Measure: Did algorithm-matched groups form more functional tribes than random groupings?</li>
          </ol>

          <h3>Phase 2: Dyadic Matching</h3>
          <p>Start with pairs, not tribes. Simpler problem. Validate that:</p>
          <ul>
            <li>Signatures capture tribally-relevant traits (not just "personality")</li>
            <li>Matched pairs show early indicators of tribal function</li>
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

          <h2>Part VII: Why This Matters</h2>

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

          <hr />

          <h2>Appendix: Glossary</h2>
          <p><strong>Band:</strong> The 25-50 person unit of daily life in ancestral human societies. Multiple families in constant interaction.</p>
          <p><strong>Compatibility signature:</strong> A lossy, high-dimensional representation of matching-relevant traits derived from LLM conversation history. Contains no raw conversation data.</p>
          <p><strong>Dunbar number:</strong> The cognitive limit on stable social relationships (~150), arising from neocortex size constraints.</p>
          <p><strong>EEA (Environment of Evolutionary Adaptedness):</strong> The conditions humans evolved within—not one place, but consistent parameters across successful human groups before agriculture.</p>
          <p><strong>Evolutionary mismatch:</strong> Discrepancy between evolved psychology and current environment. Running ancient hardware in modern conditions.</p>
          <p><strong>Fire circle:</strong> Nightly gathering of entire band for processing, storytelling, conflict resolution. 2-4 hours every night for 300,000 years.</p>
          <p><strong>Metapopulation:</strong> The 500-1500 person network connecting multiple tribes through kinship and exchange.</p>
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
