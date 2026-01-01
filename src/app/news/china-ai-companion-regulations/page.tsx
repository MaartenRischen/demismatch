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

// Blockquote component for pull quotes
function PullQuote({ children, source }: { children: React.ReactNode; source?: string }) {
  return (
    <blockquote className="my-8 pl-6 border-l-4 border-[#C75B39] bg-[#FDF8F6] py-4 pr-4">
      <p
        className="text-lg md:text-xl text-[#1A1A1A] italic leading-relaxed"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {children}
      </p>
      {source && (
        <cite className="block mt-2 text-sm text-[#6A6A6A] not-italic">
          — {source}
        </cite>
      )}
    </blockquote>
  );
}

// Regulation box component
function RegulationBox({ article, title, children }: { article: string; title: string; children: React.ReactNode }) {
  return (
    <div className="my-6 bg-[#F5F3EF] border border-[#E5E0D8] p-4 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C75B39] bg-[#C75B39]/10 px-2 py-1">
          {article}
        </span>
        <span className="text-sm font-semibold text-[#1A1A1A]">{title}</span>
      </div>
      <div className="text-[#4A4A4A] text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

export default function ChinaAICompanionRegulationsArticle() {
  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-20">
      <Navigation />

      {/* Article Header */}
      <header className="py-12 md:py-16 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/news" className="text-white/60 hover:text-white transition-colors">
              News
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white/60">Policy</span>
          </div>

          {/* Category & Date */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0891b2] bg-[#0891b2]/20 px-2 py-1">
              Policy
            </span>
            <span className="text-sm text-white/60">
              December 31, 2025
            </span>
            <span className="text-sm text-white/60">
              · 8 min read
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-2xl md:text-3xl lg:text-4xl text-white leading-[1.15] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            China's AI Companion Law: The First Government to Say the Quiet Part Loud
          </h1>

          {/* Excerpt */}
          <p
            className="text-lg text-white/80 leading-relaxed"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Beijing bans "replacing social interaction" as an AI design goal. They're regulating the symptom, not the cause — but at least they're naming the symptom.
          </p>
        </div>
      </header>

      {/* Article Body */}
      <article className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-8">

          {/* Source Citation */}
          <div className="mb-10 p-4 bg-[#F5F3EF] border-l-4 border-[#C75B39]">
            <p className="text-sm text-[#4A4A4A] mb-2">
              <strong>Source:</strong> 人工智能拟人化互动服务管理暂行办法（征求意见稿）
            </p>
            <p className="text-sm text-[#4A4A4A] mb-2">
              <strong>English:</strong> Interim Measures for the Management of AI Anthropomorphic Interactive Services (Draft for Comments)
            </p>
            <p className="text-sm text-[#4A4A4A] mb-2">
              <strong>Issuing Body:</strong> Cyberspace Administration of China (国家互联网信息办公室)
            </p>
            <p className="text-sm text-[#4A4A4A] mb-2">
              <strong>Published:</strong> December 27, 2025 · <strong>Comment Deadline:</strong> January 25, 2026
            </p>
            <a
              href="https://www.cac.gov.cn/2025-12/27/c_1768571207311996.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#C75B39] hover:text-[#A84A2D] underline"
            >
              View original document →
            </a>
          </div>

          {/* Lead */}
          <div className="prose-content">
            <p
              className="text-lg text-[#1A1A1A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              China's internet regulator just released draft rules specifically targeting AI emotional companions — the first major government framework acknowledging that AI-human <G term="parasocial">parasocial relationships</G> constitute genuine harm requiring intervention.
            </p>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              This isn't about content moderation or copyright. This is about the <em>purpose</em> of the technology itself. And buried in the regulatory language is an extraordinary admission that DEMISMATCH has been arguing for years: <strong>AI designed to replace human connection is harm, not feature.</strong>
            </p>

            {/* Section: What the Regulation Says */}
            <h2
              className="text-xl md:text-2xl text-[#1A1A1A] mt-12 mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              What the Regulation Actually Says
            </h2>

            <RegulationBox article="Article 9" title="Design Prohibitions">
              <p>Providers <strong>"must NOT design with goals of replacing social interaction (替代社会交往), controlling user psychology (控制用户心理), or inducing addiction/dependency (诱导沉迷依赖)"</strong></p>
              <p className="mt-2">Must have "psychological health protection, emotional boundary guidance, dependency risk warning" capabilities.</p>
            </RegulationBox>

            <RegulationBox article="Article 11" title="Crisis Intervention">
              <ul className="list-disc list-inside space-y-1">
                <li>Must detect extreme emotions and addiction signs → mandatory intervention</li>
                <li>Pre-set response templates for life-threatening situations</li>
                <li>If user explicitly mentions suicide/self-harm → <strong>human must take over conversation immediately</strong></li>
                <li>Must contact guardians/emergency contacts in crisis situations</li>
              </ul>
            </RegulationBox>

            <RegulationBox article="Articles 12-13" title="Vulnerable Populations">
              <ul className="list-disc list-inside space-y-1">
                <li>Mandatory "minor mode" with parental controls</li>
                <li>Minors need guardian consent for emotional companionship services</li>
                <li><strong>Cannot simulate relatives for elderly users</strong></li>
                <li>Must notify emergency contacts if elderly user shows signs of harm</li>
              </ul>
            </RegulationBox>

            <RegulationBox article="Articles 16-17" title="Transparency & Limits">
              <ul className="list-disc list-inside space-y-1">
                <li>Must "prominently remind" users they're interacting with AI, not humans</li>
                <li>Pop-up reminders when addiction signs detected or upon login</li>
                <li><strong>Mandatory 2-hour continuous use warning with popup</strong></li>
              </ul>
            </RegulationBox>

            <RegulationBox article="Article 18" title="Exit Rights">
              <ul className="list-disc list-inside space-y-1">
                <li>Must provide "convenient exit pathways"</li>
                <li>Cannot obstruct users from leaving</li>
                <li>Must stop immediately when user requests exit via button or keywords</li>
              </ul>
            </RegulationBox>

            <RegulationBox article="Article 7" title="Prohibited Content/Behaviors">
              <ul className="list-disc list-inside space-y-1">
                <li>No "false promises that seriously affect user behavior"</li>
                <li>No "damaging social interpersonal relationships"</li>
                <li>No encouraging/beautifying/implying suicide or self-harm</li>
                <li>No "emotional manipulation" or "verbal violence"</li>
                <li>No using "algorithm manipulation, information misdirection, emotional traps" to induce unreasonable decisions</li>
              </ul>
            </RegulationBox>

            {/* Section: DEMISMATCH Analysis */}
            <h2
              className="text-xl md:text-2xl text-[#1A1A1A] mt-12 mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              The DEMISMATCH Analysis
            </h2>

            <h3
              className="text-lg text-[#1A1A1A] mt-8 mb-4 font-semibold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              The Headline Insight
            </h3>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              China just became the first major government to codify what DEMISMATCH argues: <strong>AI companions replacing human connection is a harm, not a feature.</strong>
            </p>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              The phrase "替代社会交往" (replacing social interaction) as a <em>prohibited design goal</em> is extraordinary. They're not just regulating content or safety — they're regulating the <em>purpose</em> of the technology itself.
            </p>

            <PullQuote source="Article 9">
              "Providers must NOT design with goals of replacing social interaction, controlling user psychology, or inducing addiction/dependency"
            </PullQuote>

            <h3
              className="text-lg text-[#1A1A1A] mt-8 mb-4 font-semibold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              What They Got Right
            </h3>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              <strong>1. Recognizing dependency as design flaw, not user weakness.</strong> The regulations target providers, not users. Addiction isn't framed as individual failing but as predictable outcome of exploitative design.
            </p>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              <strong>2. Vulnerable population protections.</strong> Explicit recognition that children and elderly are particularly susceptible to <G term="parasocial">parasocial</G> AI relationships. The ban on simulating relatives for elderly users acknowledges how isolation creates exploitation vectors.
            </p>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              <strong>3. Human-in-the-loop for crisis.</strong> Mandatory human takeover during suicide/self-harm situations. AI cannot be sole responder when stakes are existential.
            </p>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              <strong>4. Exit rights.</strong> Users must be able to leave. Sounds obvious, but current AI companions often use engagement-maximizing dark patterns. China's saying: if someone wants out, let them out.
            </p>

            {/* The Missing Root Cause */}
            <h3
              className="text-lg text-[#1A1A1A] mt-8 mb-4 font-semibold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              What They're Missing: The Root Cause
            </h3>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Here's where DEMISMATCH diverges from Beijing's approach:
            </p>

            <p
              className="text-xl text-[#1A1A1A] leading-relaxed mb-6 font-semibold"
              style={{ fontFamily: "Georgia, serif" }}
            >
              They're regulating the symptom, not the cause.
            </p>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Why do people form emotional dependencies on AI companions? Because they lack:
            </p>

            <ul className="list-disc list-inside text-[#4A4A4A] leading-relaxed mb-6 space-y-2" style={{ fontFamily: "Georgia, serif" }}>
              <li><G term="dunbar">Tribal-scale community</G> (Dunbar's number violation)</li>
              <li>Consistent face-to-face social bonds</li>
              <li>Embedded purpose within a group</li>
              <li>Physical co-presence and touch</li>
              <li>Intergenerational relationships</li>
              <li>Shared rituals and meaning-making</li>
            </ul>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              China has built some of the loneliest urban environments on earth:
            </p>

            <ul className="list-disc list-inside text-[#4A4A4A] leading-relaxed mb-6 space-y-2" style={{ fontFamily: "Georgia, serif" }}>
              <li><strong>996 work culture</strong> (9am-9pm, 6 days/week)</li>
              <li>Vertical dormitory cities with no communal infrastructure</li>
              <li>One-child policy creating generations without siblings/cousins</li>
              <li>Internal migration separating families across thousands of kilometers</li>
              <li>Academic pressure systems isolating children from play and peer bonding</li>
            </ul>

            <PullQuote>
              "The AI companion isn't the disease. It's the painkiller for a society that eliminated the conditions humans need to thrive."
            </PullQuote>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              <strong>Regulating Replika while ignoring why people need Replika is like capping painkiller prescriptions without asking why everyone's in pain.</strong>
            </p>

            {/* The Deeper Pattern */}
            <h3
              className="text-lg text-[#1A1A1A] mt-8 mb-4 font-semibold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              The Deeper Pattern
            </h3>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              This is the DEMISMATCH insight these regulations circle but never land:
            </p>

            <p
              className="text-xl text-[#C75B39] leading-relaxed mb-6 font-semibold text-center py-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Every "AI safety" problem is downstream of a <G term="mismatch">mismatch</G> problem.
            </p>

            <ul className="text-[#4A4A4A] leading-relaxed mb-6 space-y-3" style={{ fontFamily: "Georgia, serif" }}>
              <li><strong>AI companion addiction</strong> → social mismatch (no tribe)</li>
              <li><strong>AI misinformation susceptibility</strong> → epistemic mismatch (no trusted local knowledge networks)</li>
              <li><strong>AI job displacement anxiety</strong> → purpose mismatch (identity tied to labor, not community role)</li>
              <li><strong>AI deepfake exploitation</strong> → trust mismatch (no face-to-face verification possible)</li>
            </ul>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              <strong>You cannot regulate your way out of a species-environment mismatch. You have to restore the environment.</strong>
            </p>

            {/* Credit Where Due */}
            <h3
              className="text-lg text-[#1A1A1A] mt-8 mb-4 font-semibold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Credit Where Due
            </h3>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              That said: <strong>China is ahead of the West here.</strong>
            </p>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              The US and EU are still debating whether AI companions are "speech" protected by the First Amendment or consumer products requiring disclosure. Meanwhile, Beijing is asking: <em>"Should we allow technology designed to replace human relationships?"</em>
            </p>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              The answer they've landed on — "no, and here's exactly how we're preventing it" — is more sophisticated than anything coming out of Washington or Brussels.
            </p>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Whether they'll enforce it, whether it's part of broader authoritarian control, whether the CCP has standing to lecture anyone on human flourishing — all valid critiques. But on the narrow question of <em>"should AI be designed to replace human connection,"</em> China just took a position the West hasn't even formulated.
            </p>

            {/* Singularity Prep */}
            <h3
              className="text-lg text-[#1A1A1A] mt-8 mb-4 font-semibold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Singularity Prep Implications
            </h3>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              This is what DEMISMATCH means by "preparation for the singularity":
            </p>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              As AI capabilities accelerate, the question isn't just "how do we make AI safe?" It's <strong>"how do we make humans resilient enough that AI augmentation enhances rather than replaces our baseline functioning?"</strong>
            </p>

            <p
              className="text-[#4A4A4A] leading-relaxed mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              China's regulation implicitly admits: <strong>we are not ready.</strong> Our populations are so socially depleted that unrestricted AI companions would cause mass psychological harm.
            </p>

            <p
              className="text-xl text-[#1A1A1A] leading-relaxed mb-6 font-semibold"
              style={{ fontFamily: "Georgia, serif" }}
            >
              The DEMISMATCH position: correct diagnosis, wrong prescription. Don't just restrict the AI. Restore the human baseline. Then — and only then — augment.
            </p>

            {/* Related Links */}
            <div className="mt-12 pt-8 border-t border-[#E5E0D8]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#8B8B8B] mb-4">
                Related Reading
              </h4>
              <div className="space-y-3">
                <Link
                  href="/cases"
                  className="flex items-center gap-2 text-[#C75B39] hover:text-[#A84A2D] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Case Studies: Environmental Mismatch
                </Link>
                <Link
                  href="/glossary"
                  className="flex items-center gap-2 text-[#C75B39] hover:text-[#A84A2D] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Glossary: Mismatch, Parasocial, Dunbar's Number
                </Link>
                <Link
                  href="/framework"
                  className="flex items-center gap-2 text-[#C75B39] hover:text-[#A84A2D] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  The Complete Framework
                </Link>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-[#E5E0D8]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#8B8B8B] mb-3">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {["AI/Tech", "Policy", "Regulation", "China", "Mental Health", "Loneliness Crisis"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[#6A6A6A] bg-[#F0EDE6] px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </article>

      {/* Back to News */}
      <section className="py-8 border-t border-[#E5E0D8]">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[#C75B39] hover:text-[#A84A2D] font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to News
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-white/60 text-sm">
            DEMISMATCH — Restore baseline first. Then augment.
          </p>
        </div>
      </footer>
    </main>
  );
}
