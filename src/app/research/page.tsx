"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { useEffect } from "react";

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

// Callout box component
function Callout({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "formula" | "warning" }) {
  const styles = {
    default: "bg-[#FDF8F6] border-[#C75B39]/30 text-[#3A3A3A]",
    formula: "bg-[#F8F6F2] border-[#8B8B8B]/30 text-[#3A3A3A]",
    warning: "bg-[#292524] border-[#C75B39]/50 text-[#D6D3D1]"
  };

  return (
    <div className={`border rounded-xl p-6 my-8 ${styles[variant]}`}>
      {children}
    </div>
  );
}

// Data table component
function DataTable({
  headers,
  rows,
  caption
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  caption?: string;
}) {
  return (
    <div className="overflow-x-auto my-8">
      <table className="w-full border-collapse bg-white rounded-xl overflow-hidden border border-gray-200">
        <thead>
          <tr className="bg-[#F8F6F2]">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="text-left p-4 text-sm font-semibold text-[#3A3A3A] border-b border-gray-200"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className={rowIdx % 2 === 1 ? "bg-[#FDFCFA]" : "bg-white"}>
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="p-4 text-sm text-[#4A4A4A] border-b border-gray-100"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <p className="text-center text-xs text-[#8B8B8B] mt-2 italic">{caption}</p>
      )}
    </div>
  );
}

// Math formula component - renders LaTeX-style formulas
function Formula({ children, block = false }: { children: string; block?: boolean }) {
  if (block) {
    return (
      <div className="my-6 py-6 px-4 bg-[#F8F6F2] rounded-xl text-center overflow-x-auto">
        <code className="text-lg md:text-xl font-mono text-[#3A3A3A] whitespace-nowrap">
          {children}
        </code>
      </div>
    );
  }
  return <code className="font-mono text-[#C75B39] bg-[#FDF8F6] px-1 rounded">{children}</code>;
}

// Variable definition component
function VarDef({ variable, definition }: { variable: string; definition: string }) {
  return (
    <div className="flex gap-4 items-start py-2">
      <code className="font-mono text-[#C75B39] bg-[#FDF8F6] px-2 py-1 rounded text-sm whitespace-nowrap">{variable}</code>
      <span className="text-[#4A4A4A] text-sm">{definition}</span>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-20">
      <Navigation />

      {/* Hero Section */}
      <header className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] font-medium mb-4 tracking-wide uppercase text-sm text-center">
            The Methodology
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] leading-[1.2] mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Measuring Match
          </h1>
          <p
            className="text-lg md:text-xl text-[#6A6A6A] leading-relaxed max-w-3xl mx-auto mb-8 text-center"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The framework claims that environmental alignment predicts human thriving. Here's how we measure it — domain by domain, with documented ancestral ranges, pre-registered weights, and a formula designed to catch cults.
          </p>

          <Callout variant="warning">
            <p
              className="text-lg md:text-xl text-center italic"
              style={{ fontFamily: "Georgia, serif" }}
            >
              If Match doesn't predict outcomes, the theory fails. That's what makes it science.
            </p>
          </Callout>
        </div>
      </header>

      {/* Section 01: The Problem of Tautology */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">01</p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#C75B39] mb-8 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Problem of Tautology
          </h2>

          <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              A framework risks circularity if "Match" is defined by its results. "A matched community is one where people are happy" tells you nothing. To be useful, we must:
            </p>
            <ol className="list-decimal list-inside space-y-3 pl-4">
              <li>Define Match strictly by environmental inputs (independent variables)</li>
              <li>Measure outcomes (pathology/thriving) separately</li>
              <li>Test whether the inputs predict the outcomes</li>
            </ol>
            <p className="font-medium pt-4">
              This is what the Match Score system does.
            </p>
          </div>
        </div>
      </section>

      {/* Section 02: Plausible Ancestral Ranges */}
      <section className="bg-[#F8F6F2] py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">02</p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#C75B39] mb-8 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Plausible Ancestral Ranges
          </h2>

          <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8] mb-10" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              We reject invented benchmarks. Scoring is grounded in documented ranges from extant forager populations — Hadza, !Kung, Ache, Tsimane, Agta.
            </p>
          </div>

          <DataTable
            headers={["Domain", "Metric", "Documented Range (PAR)", "Primary Sources"]}
            rows={[
              ["Social", "Face-to-face hours/day", "4–9 hours", "Marlowe (2010), Konner (2005)"],
              ["Movement", "Active hours/day", "4–6 hours", "Pontzer et al. (2012)"],
              ["Light", "Daylight exposure (>1000 lux)", "6–10 hours", "de la Iglesia et al. (2015)"],
              ["Group Size", "Daily contact group", "20–50 people", "Hill & Dunbar (2003)"],
              ["Care", "Alloparents per child", "4–20 adults", "Hrdy (2009)"],
            ]}
          />

          <Callout>
            <p className="text-[#4A4A4A]" style={{ fontFamily: "Georgia, serif" }}>
              <strong>Scoring principle:</strong> Values within PAR = 100 points. Values diverging from PAR suffer proportional reduction.
            </p>
          </Callout>
        </div>
      </section>

      {/* Section 03: The Seven Domains */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">03</p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#C75B39] mb-8 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Seven Domains
          </h2>

          <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8] mb-12" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              Seven positive domains are measured and combined using a geometric mean. This enforces <strong>Liebig's Law of the Minimum</strong> — a deficiency in one essential domain limits overall thriving, regardless of abundance in others.
            </p>
          </div>

          {/* Domain 1 */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h3 className="text-xl md:text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Domain 1: Social Density & Depth <span className="text-[#8B8B8B] text-base font-normal">(Weight: 0.25)</span>
            </h3>
            <p className="text-[#4A4A4A] mb-6" style={{ fontFamily: "Georgia, serif" }}>
              Measurement is strictly behavioral/structural, not self-reported feelings.
            </p>
            <ul className="space-y-4 text-[#3A3A3A]" style={{ fontFamily: "Georgia, serif" }}>
              <li className="flex gap-3">
                <span className="text-[#C75B39] font-semibold shrink-0">Band Layer Co-presence (0-40):</span>
                <span>Hours/day in physical proximity with stable core group (n=5–50). Verified via Bluetooth/audio. Target: 4+ hours.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#C75B39] font-semibold shrink-0">Bond Infrastructure (0-30):</span>
                <span>Count of individuals meeting criteria: tenure &gt;5 years OR kinship OR weekly resource exchange. Target: 5+ individuals.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#C75B39] font-semibold shrink-0">Stranger Ratio (0-30):</span>
                <span>Percentage of daily interactions involving unknown individuals. Target: &lt;10%.</span>
              </li>
            </ul>
          </div>

          {/* Domain 2 */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h3 className="text-xl md:text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Domain 2: Agency & Closed Loops <span className="text-[#8B8B8B] text-base font-normal">(Weight: 0.20)</span>
            </h3>
            <p className="text-[#4A4A4A] mb-6" style={{ fontFamily: "Georgia, serif" }}>
              Replaces subjective "sense of purpose" with the <strong>Jurisdiction Test</strong>.
            </p>
            <p className="text-[#3A3A3A] mb-4" style={{ fontFamily: "Georgia, serif" }}>
              For the subject's top 5 active life concerns, we audit:
            </p>
            <ul className="space-y-2 text-[#3A3A3A] mb-6 pl-4" style={{ fontFamily: "Georgia, serif" }}>
              <li><strong>Means:</strong> Do they possess the resources to act now?</li>
              <li><strong>Authority:</strong> Do they require permission to act?</li>
              <li><strong>Physics:</strong> Is the outcome determined by their action or external probability?</li>
            </ul>
            <Callout>
              <p className="text-[#4A4A4A]" style={{ fontFamily: "Georgia, serif" }}>
                <strong>Metric:</strong> Control-to-Responsibility Ratio (CRR). High responsibility matched by high jurisdiction = high score. High responsibility with low jurisdiction (middle management, poverty) = near zero.
              </p>
            </Callout>
          </div>

          {/* Domain 3 */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h3 className="text-xl md:text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Domain 3: Circadian & Environmental Alignment <span className="text-[#8B8B8B] text-base font-normal">(Weight: 0.15)</span>
            </h3>
            <ul className="space-y-3 text-[#3A3A3A]" style={{ fontFamily: "Georgia, serif" }}>
              <li><strong>Solar Synchrony:</strong> Mid-sleep point deviation from solar midnight</li>
              <li><strong>Lux Contrast:</strong> Ratio of daytime to post-sunset light exposure. Target: &gt;10:1</li>
              <li><strong>Sleep Integrity:</strong> Duration and fragmentation index via actigraphy</li>
            </ul>
          </div>

          {/* Domain 4 */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h3 className="text-xl md:text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Domain 4: Movement Patterns <span className="text-[#8B8B8B] text-base font-normal">(Weight: 0.10)</span>
            </h3>
            <ul className="space-y-3 text-[#3A3A3A]" style={{ fontFamily: "Georgia, serif" }}>
              <li><strong>Active Volume:</strong> Hours above resting metabolic rate. Target: 4–6 hours</li>
              <li><strong>Diversity Index:</strong> Count of distinct movement types daily (walk, carry, squat, climb, sprint)</li>
              <li><strong>Terrain Complexity:</strong> Gait variability measuring surface irregularity</li>
            </ul>
          </div>

          {/* Domain 5 */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h3 className="text-xl md:text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Domain 5: Nature Contact <span className="text-[#8B8B8B] text-base font-normal">(Weight: 0.10)</span>
            </h3>
            <ul className="space-y-3 text-[#3A3A3A]" style={{ fontFamily: "Georgia, serif" }}>
              <li><strong>Immersion Hours:</strong> Time outdoors in &gt;1 hour blocks</li>
              <li><strong>Acoustic Ecology:</strong> % of day with anthropogenic noise &lt;40dB</li>
              <li><strong>Fractal Exposure:</strong> Visual analysis of environment (natural vs. rectilinear geometry)</li>
            </ul>
          </div>

          {/* Domain 6 */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h3 className="text-xl md:text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Domain 6: Resource Interdependence <span className="text-[#8B8B8B] text-base font-normal">(Weight: 0.10)</span>
            </h3>
            <ul className="space-y-3 text-[#3A3A3A]" style={{ fontFamily: "Georgia, serif" }}>
              <li><strong>Convenience Tier (0-30):</strong> Can borrow daily necessities without debt/ledger?</li>
              <li><strong>Safety Net Tier (0-30):</strong> Can access 1 month of resources within 24 hours via informal request?</li>
              <li><strong>Existential Tier (0-40):</strong> Does the system need you AND do you need the system?</li>
            </ul>
          </div>

          {/* Domain 7 */}
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Domain 7: Governance & Exit <span className="text-[#8B8B8B] text-base font-normal">(Weight: 0.10)</span>
            </h3>
            <ul className="space-y-3 text-[#3A3A3A]" style={{ fontFamily: "Georgia, serif" }}>
              <li><strong>Voice-to-Decision Ratio:</strong> Probability that a stated objection modifies a group decision</li>
              <li><strong>Exit Cost Index:</strong> Inverse of financial/social penalty for leaving. High penalty = Low score.</li>
              <li><strong>Information Symmetry:</strong> Audit of transparency available to average member</li>
            </ul>
            <Callout variant="warning">
              <p className="text-lg text-center" style={{ fontFamily: "Georgia, serif" }}>
                The Exit Cost Index is what differentiates tribes from cults.
              </p>
            </Callout>
          </div>
        </div>
      </section>

      {/* Section 04: The Interference Domain */}
      <section className="bg-[#292524] py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C75B39] to-transparent" />

        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">04</p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#C75B39] mb-8 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Interference Domain
          </h2>

          <div className="space-y-5 text-lg text-[#D6D3D1] leading-[1.8] mb-10" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              This domain measures active harms — supernormal stimuli that hijack evolved cognition. These are <strong className="text-white">subtracted</strong> from the final score. There is no cap. A thoroughly hijacked individual can score negative.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-[#1C1917] rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-[#3A3533]">
                  <th className="text-left p-4 text-sm font-semibold text-[#D6D3D1] border-b border-[#4A4543]">Interference Type</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#D6D3D1] border-b border-[#4A4543]">Metric</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#C75B39] border-b border-[#4A4543]">Penalty</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#3A3533]">
                  <td className="p-4 text-sm text-[#A8A29E]">Parasocial Load</td>
                  <td className="p-4 text-sm text-[#A8A29E]">Hours/day in unidirectional social bonding (consume without interact)</td>
                  <td className="p-4 text-sm text-[#C75B39] font-medium">2 points per hour</td>
                </tr>
                <tr className="border-b border-[#3A3533] bg-[#252220]">
                  <td className="p-4 text-sm text-[#A8A29E]">Scope Mismatch Index</td>
                  <td className="p-4 text-sm text-[#A8A29E]">Ratio of global news to local/actionable news</td>
                  <td className="p-4 text-sm text-[#C75B39] font-medium">5 pts (&gt;2:1), 10 pts (&gt;5:1), 20 pts (&gt;100:1)</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-[#A8A29E]">Algorithm Exposure</td>
                  <td className="p-4 text-sm text-[#A8A29E]">Hours/day with variable-ratio reinforcement (infinite scroll, gacha)</td>
                  <td className="p-4 text-sm text-[#C75B39] font-medium">3 points per hour</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 05: The Formula */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">05</p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#C75B39] mb-8 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Formula
          </h2>

          <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8] mb-10" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              We use a <strong>geometric mean</strong> to enforce the "limiting factor" principle. A high-scoring social environment with zero agency must fail the test. A cult with great community but no exit rights must fail the test.
            </p>
          </div>

          <div className="bg-[#F8F6F2] rounded-xl p-8 mb-8">
            <h4 className="text-sm font-semibold text-[#8B8B8B] uppercase tracking-wider mb-4">Base Match Score</h4>
            <div className="text-center py-4 overflow-x-auto">
              <span className="text-xl md:text-2xl font-mono text-[#3A3A3A] whitespace-nowrap">
                M<sub>Base</sub> = <span className="text-[#C75B39]">∏</span><sup>7</sup><sub>i=1</sub> (S<sub>i</sub> + ε)<sup>w<sub>i</sub></sup>
              </span>
            </div>
            <div className="mt-6 space-y-2 border-t border-gray-300 pt-4">
              <VarDef variable="Sᵢ" definition="Score of Domain i (0-100)" />
              <VarDef variable="wᵢ" definition="Weight of Domain i (sum = 1.0)" />
              <VarDef variable="ε" definition="1.0 (prevents mathematical errors at zero while keeping score functionally zero)" />
            </div>
          </div>

          <div className="bg-[#F8F6F2] rounded-xl p-8 mb-10">
            <h4 className="text-sm font-semibold text-[#8B8B8B] uppercase tracking-wider mb-4">Final Match Score</h4>
            <div className="text-center py-4">
              <span className="text-xl md:text-2xl font-mono text-[#3A3A3A]">
                M<sub>Total</sub> = M<sub>Base</sub> − I<sub>Interference</sub>
              </span>
            </div>
          </div>

          <Callout>
            <h4 className="text-[#C75B39] font-bold uppercase tracking-wider text-sm mb-4">
              Why Geometric, Not Additive
            </h4>
            <p className="text-[#4A4A4A] mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Consider a "Golden Cage" cult:
            </p>
            <DataTable
              headers={["Domain", "Score"]}
              rows={[
                ["Social", "95"],
                ["Governance/Exit", "5"],
                ["Agency", "5"],
                ["Other domains", "~50"],
              ]}
            />
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-[#8B8B8B] mb-1">Additive Model</p>
                <p className="text-xl font-bold text-[#3A3A3A]">Score ≈ 50/100</p>
                <p className="text-sm text-[#6A6A6A]">"Moderately Matched"</p>
              </div>
              <div className="bg-[#292524] p-4 rounded-lg">
                <p className="text-sm font-semibold text-[#C75B39] mb-1">Geometric Model</p>
                <p className="text-xl font-bold text-white">Score ≈ 18/100</p>
                <p className="text-sm text-[#A8A29E]">"Severely Mismatched"</p>
              </div>
            </div>
            <p className="text-[#4A4A4A] mt-6" style={{ fontFamily: "Georgia, serif" }}>
              The geometric mean correctly identifies that a high-control environment is not matched, no matter how good the social density looks.
            </p>
          </Callout>
        </div>
      </section>

      {/* Section 06: Pre-Registered Weights */}
      <section className="bg-[#F8F6F2] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">06</p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#C75B39] mb-8 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Pre-Registered Weights
          </h2>

          <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8] mb-10" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              To prevent adjusting weights until they fit the data, we fix the theoretical weights <strong>before any empirical testing</strong>.
            </p>
          </div>

          <DataTable
            headers={["Domain", "Weight"]}
            rows={[
              ["Social Density & Depth", "0.25"],
              ["Agency & Closed Loops", "0.20"],
              ["Circadian Alignment", "0.15"],
              ["Movement Patterns", "0.10"],
              ["Nature Contact", "0.10"],
              ["Resource Interdependence", "0.10"],
              ["Governance & Exit", "0.10"],
            ]}
          />

          <div className="mt-8 text-[#4A4A4A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              These weights are fixed based on evolutionary priors. The primary hypothesis test uses only these weights.
            </p>
            <p className="mt-4">
              As secondary analysis, we run Lasso regression to determine empirically observed weights. If empirical weights diverge significantly from theoretical weights — for instance, if Nature explains 40% of variance instead of 10% — this constitutes <strong>a finding about human biology</strong>, not a license to retrofit the theory.
            </p>
          </div>
        </div>
      </section>

      {/* Section 07: Accounting for Dropout */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">07</p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#C75B39] mb-8 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Accounting for Dropout
          </h2>

          <div className="space-y-5 text-lg text-[#3A3A3A] leading-[1.8] mb-10" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              Measuring depression prevalence in a community is flawed if depressed people leave. A toxic environment might show 0% depression simply because everyone who struggles gets pushed out.
            </p>
          </div>

          <div className="bg-[#F8F6F2] rounded-xl p-8 mb-8">
            <h4 className="text-sm font-semibold text-[#C75B39] uppercase tracking-wider mb-4">Solution: Total Prevalence Load (TPL)</h4>
            <div className="text-center py-4 overflow-x-auto">
              <span className="text-lg md:text-xl font-mono text-[#3A3A3A] whitespace-nowrap">
                TPL = (N<sub>current</sub> × P<sub>current</sub>) + (N<sub>exited</sub> × P<sub>exited</sub>) / N<sub>total</sub>
              </span>
            </div>
            <div className="mt-6 space-y-2 border-t border-gray-300 pt-4">
              <VarDef variable="P_current" definition="Prevalence of High Pathology (PHQ-9 >10) among current members" />
              <VarDef variable="P_exited" definition="Prevalence among those who left in last 12 months, measured 3 months post-exit" />
            </div>
          </div>

          <Callout>
            <h4 className="text-[#C75B39] font-bold uppercase tracking-wider text-sm mb-4">
              Protocol
            </h4>
            <p className="text-[#4A4A4A]" style={{ fontFamily: "Georgia, serif" }}>
              All participants agree to 6-month post-exit follow-up as condition of study entry. If &gt;20% of exiters are lost to follow-up, <strong>Maximum Bias Assumption</strong> is applied — we assume lost exiters are high-pathology, which penalizes communities that can't retain contact with former members.
            </p>
          </Callout>
        </div>
      </section>

      {/* Section 08: Study Design */}
      <section className="bg-[#F8F6F2] py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">08</p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#C75B39] mb-8 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Study Design
          </h2>

          <h3 className="text-xl text-[#1A1A1A] mb-6 mt-10" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            The Subjects
          </h3>

          <DataTable
            headers={["Group", "Examples", "Purpose"]}
            rows={[
              ["High Match", "Twin Oaks, Ache, Hadza (where ethics permit)", "Test upper bound of environmental alignment"],
              ["Transitional", "Cohousing, \"pod\" living arrangements", "Test intermediate conditions"],
              ["Standard Control", "Urban apartment dwellers", "Baseline modern mismatch"],
              ["Negative Control", "High-control/Low-agency groups (prisons, strict sects)", "Validate geometric mean identifies low agency"],
            ]}
          />

          <h3 className="text-xl text-[#1A1A1A] mb-6 mt-12" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Addressing Selection Bias
          </h3>

          <div className="text-[#3A3A3A] leading-[1.8]" style={{ fontFamily: "Georgia, serif" }}>
            <p className="mb-4">We cannot randomly assign people to tribes. We use:</p>
            <ul className="space-y-3 pl-4">
              <li><strong>Waitlist Controls:</strong> Individuals accepted to communities but waiting for openings. They share the "seeking" trait but lack the environment.</li>
              <li><strong>Inverse Propensity Weighting:</strong> Controlling for baseline mental health, childhood trauma (ACE scores), and socioeconomic status.</li>
            </ul>
          </div>

          <h3 className="text-xl text-[#1A1A1A] mb-6 mt-12" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Timeline
          </h3>

          <DataTable
            headers={["Phase", "Description", "Sample"]}
            rows={[
              ["Phase 1", "Validate \"Jurisdiction Test\" and \"Bond Infrastructure\" metrics against cortisol/HRV markers", "N=50"],
              ["Phase 2", "Assess 3 distinct communities using Match Score v7.0. Check for mathematical anomalies", "3 sites"],
              ["Phase 3", "24-month longitudinal tracking across all groups", "N=500"],
            ]}
          />
        </div>
      </section>

      {/* Section 09: Falsification Criteria */}
      <section className="bg-[#292524] py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C75B39] to-transparent" />

        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">09</p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#C75B39] mb-8 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Falsification Criteria
          </h2>

          <div className="space-y-5 text-lg text-[#D6D3D1] leading-[1.8] mb-10" style={{ fontFamily: "Georgia, serif" }}>
            <p>
              The framework makes specific predictions. Here are the conditions under which we would conclude it's wrong.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-[#1C1917] rounded-xl p-6 border border-[#C75B39]/30">
              <h4 className="text-[#C75B39] font-bold mb-3">Condition 1: High-Match / High-Pathology</h4>
              <p className="text-[#A8A29E]" style={{ fontFamily: "Georgia, serif" }}>
                If communities scoring ≥80 on the Match Score show retention-adjusted depression/anxiety prevalence ≥15% (Western baseline), with dropout properly accounted for, <strong className="text-white">the theory fails</strong>.
              </p>
            </div>

            <div className="bg-[#1C1917] rounded-xl p-6 border border-[#C75B39]/30">
              <h4 className="text-[#C75B39] font-bold mb-3">Condition 2: The Prison/Cult Paradox</h4>
              <p className="text-[#A8A29E]" style={{ fontFamily: "Georgia, serif" }}>
                If environments with high Social Density (&gt;90) but near-zero Agency/Governance (&lt;10) produce high wellbeing, <strong className="text-white">the theory fails</strong>. The framework predicts agency is a biological necessity, not a preference.
              </p>
            </div>

            <div className="bg-[#1C1917] rounded-xl p-6 border border-[#C75B39]/30">
              <h4 className="text-[#C75B39] font-bold mb-3">Condition 3: Null Dose-Response</h4>
              <p className="text-[#A8A29E]" style={{ fontFamily: "Georgia, serif" }}>
                If an increase in Match Score from 30→70 shows no correlation (r &lt; 0.15) with outcome improvements across N &gt; 1000, <strong className="text-white">the theory fails</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Applications */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <p className="text-[#C75B39] text-xs font-semibold uppercase tracking-[0.2em] mb-4">10</p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#C75B39] mb-12 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Applications
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#F8F6F2] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                For Researchers
              </h3>
              <p className="text-[#4A4A4A]" style={{ fontFamily: "Georgia, serif" }}>
                The weights are pre-registered. The falsification criteria are defined. The study design is specified. Run the study. Replicate, extend, or refute.
              </p>
            </div>

            <div className="bg-[#F8F6F2] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                For Practitioners
              </h3>
              <p className="text-[#4A4A4A]" style={{ fontFamily: "Georgia, serif" }}>
                The Match Score gives you a diagnostic tool. Instead of asking "what's wrong with this person," ask "which domains are bottlenecked?" The geometric mean tells you where the limiting factor is.
              </p>
            </div>

            <div className="bg-[#F8F6F2] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                For System Builders
              </h3>
              <p className="text-[#4A4A4A]" style={{ fontFamily: "Georgia, serif" }}>
                Before you build, you can score your design. Does your community structure meet the Agency threshold? Does your platform create or reduce Interference? The spec sheet has numbers.
              </p>
            </div>

            <div className="bg-[#F8F6F2] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                For Communities
              </h3>
              <p className="text-[#4A4A4A]" style={{ fontFamily: "Georgia, serif" }}>
                Self-assess. Which domain is dragging your score down? The geometric mean makes it visible. Fix the bottleneck before optimizing what's already working.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#F8F6F2] py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl text-[#1A1A1A] mb-6 leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Participate
          </h2>
          <p
            className="text-lg text-[#6A6A6A] leading-relaxed mb-10"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The Demismatch framework is open. If you're a researcher interested in running these protocols, a community willing to be assessed, or a funder interested in supporting empirically grounded mental health research — we want to hear from you.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/framework"
              className="inline-flex items-center gap-2 bg-[#C75B39] text-white px-6 py-3 text-sm font-medium hover:bg-[#A84A2D] transition-colors"
            >
              Read the Full Framework
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/stats"
              className="inline-flex items-center gap-2 bg-white text-[#3A3A3A] px-6 py-3 text-sm font-medium border border-gray-300 hover:border-[#C75B39] hover:text-[#C75B39] transition-colors"
            >
              See the Evidence Base
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-white text-[#3A3A3A] px-6 py-3 text-sm font-medium border border-gray-300 hover:border-[#C75B39] hover:text-[#C75B39] transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Callout */}
      <section className="bg-[#292524] py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <p
            className="text-xl md:text-2xl text-white leading-relaxed"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Match is measurable. Outcomes are measurable. The prediction is clear: <span className="text-[#C75B39]">alignment predicts thriving</span>. Test it.
          </p>
        </div>
      </section>
    </main>
  );
}
