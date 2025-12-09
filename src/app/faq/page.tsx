import Link from "next/link";
import Navigation from "@/components/Navigation";

// Map FAQ references to framework anchors
// The framework page uses IDs like part-i, part-ii, etc. based on Roman numerals
function getFrameworkLink(text: string): string {
  const mapping: Record<string, string> = {
    // Part I variations
    "Part I: The Pattern": "/framework#part-i",
    "Part I": "/framework#part-i",
    
    // Part II variations
    "Part II: The Machine": "/framework#part-ii",
    "Part II": "/framework#part-ii",
    
    // Part III variations
    "Part III: The Spec Sheet": "/framework#part-iii",
    "Part III: The Costs": "/framework#part-iii",
    "Part III": "/framework#part-iii",
    
    // Part IV variations
    "Part IV: The Violations": "/framework#part-iv",
    "Part IV": "/framework#part-iv",
    
    // Part V variations (Note: Part V in FAQ is Part VI in framework - The Exploitation)
    "Part V: The Exploitation": "/framework#part-vi",
    "Part V": "/framework#part-v",
    
    // Part VI variations (Note: Part VI in FAQ is Part V in framework - The Cascades)
    "Part VI: The Cascades": "/framework#part-v",
    "Part VI": "/framework#part-vi",
    
    // Part VII variations
    "Part VII: The Misdiagnosis": "/framework#part-vii",
    "Part VII": "/framework#part-vii",
    
    // Part VIII variations
    "Part VIII: The Constraints": "/framework#part-viii",
    "Part VIII": "/framework#part-viii",
    
    // Part IX variations
    "Part IX: The Destination": "/framework#part-ix",
    "Part IX": "/framework#part-ix",
    
    // Supplementary materials (all go to supplementary section if it exists, otherwise just framework)
    "Supplementary: Research Directions": "/framework#supplementary",
    "Supplementary: Objections": "/framework#supplementary",
    "Supplementary: Fission-Fusion": "/framework#supplementary",
    "Supplementary: Governance": "/framework#supplementary",
    "Supplementary: Technology": "/framework#supplementary",
    "Supplementary: Transition": "/framework#supplementary",
    "Supplementary: Research": "/framework#supplementary",
    "Supplementary: Governance Case Studies": "/framework#supplementary",
    "Supplementary": "/framework#supplementary",
  };

  // Check for exact match first
  if (mapping[text]) {
    return mapping[text];
  }

  // Check for partial matches - look for "Part X" pattern
  const partMatch = text.match(/Part\s+([IVX]+)/i);
  if (partMatch) {
    const romanNumeral = partMatch[1].toLowerCase();
    return `/framework#part-${romanNumeral}`;
  }

  // Check for "Supplementary" references
  if (text.toLowerCase().includes("supplementary")) {
    return "/framework#supplementary";
  }

  // Default to framework page
  return "/framework";
}

function parseFAQContent(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Main title (#)
    if (trimmed.startsWith('# ') && trimmed === '# DEMISMATCH FAQ') {
      continue; // Skip, we'll render it in the header
    }

    // Subtitle line (100 questions...)
    if (trimmed === '100 questions. No fluff. Links to learn more.') {
      continue; // Skip, we'll render it in the header
    }

    // Section headers (##)
    if (trimmed.startsWith('## ')) {
      const sectionTitle = trimmed.substring(3);
      elements.push(
        <h2
          key={key++}
          className="text-3xl font-bold text-[#1A1A1A] mt-16 mb-8 pt-8 border-t border-[#E5E0D8] first:mt-0 first:pt-0 first:border-t-0"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {sectionTitle}
        </h2>
      );
      continue;
    }

    // Horizontal rule
    if (trimmed === '---') {
      elements.push(<hr key={key++} className="my-12 border-[#E5E0D8]" />);
      continue;
    }

    // Empty lines
    if (trimmed === '') {
      continue;
    }

    // Bold questions (format: **number. Question text**)
    if (trimmed.startsWith('**') && trimmed.includes('**')) {
      const match = trimmed.match(/\*\*(\d+)\.\s*(.+?)\*\*/);
      if (match) {
        const questionNum = match[1];
        const questionText = match[2];
        elements.push(
          <h3
            key={key++}
            className="text-xl font-semibold text-[#1A1A1A] mt-8 mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span className="text-[#C75B39]">{questionNum}.</span> {questionText}
          </h3>
        );
      } else {
        // Handle quoted objections like **"I'm an introvert."**
        const quotedMatch = trimmed.match(/\*\*"(.+?)"\*\*/);
        if (quotedMatch) {
          elements.push(
            <h3
              key={key++}
              className="text-xl font-semibold text-[#1A1A1A] mt-8 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              "{quotedMatch[1]}"
            </h3>
          );
        }
      }
      continue;
    }

    // Regular paragraphs with link conversion
    if (trimmed.length > 0 && !trimmed.startsWith('*')) {
      // Convert [text] to links
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      const linkRegex = /\[([^\]]+)\]/g;
      let match;
      let linkKey = 0;

      while ((match = linkRegex.exec(trimmed)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          const beforeText = trimmed.substring(lastIndex, match.index);
          if (beforeText.trim() === '→') {
            parts.push(<span key={`arrow-${linkKey++}`} className="text-[#6b6b6b]">→ </span>);
          } else if (beforeText) {
            parts.push(beforeText);
          }
        }

        // Add the link
        const linkText = match[1];
        const href = getFrameworkLink(linkText);
        parts.push(
          <Link
            key={`link-${linkKey++}`}
            href={href}
            className="text-[#C75B39] hover:underline font-medium"
          >
            {linkText}
          </Link>
        );

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < trimmed.length) {
        const remaining = trimmed.substring(lastIndex);
        if (remaining.trim()) {
          parts.push(remaining);
        }
      }

      // If no links found, just use the text
      if (parts.length === 0) {
        parts.push(trimmed);
      }

      elements.push(
        <p key={key++} className="text-[#4A4A4A] mb-4 leading-relaxed">
          {parts}
        </p>
      );
    }

    // Italic footer text
    if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
      const italicText = trimmed.slice(1, -1);
      elements.push(
        <p key={key++} className="text-[#6b6b6b] italic mt-12 text-center">
          {italicText}
        </p>
      );
    }
  }

  return elements;
}

const FAQ_CONTENT = `# DEMISMATCH FAQ

100 questions. No fluff. Links to learn more.

---

## THE PATTERN

**1. What is evolutionary mismatch?**
Your brain was built for conditions that no longer exist. 300,000 years of consistent environment, then everything changed. The hardware works perfectly. The environment doesn't match.
→ [Part I: The Pattern]

**2. What is the EEA?**
Environment of Evolutionary Adaptedness. The conditions humans evolved in: small bands, known faces, daily closure, visible contribution, physical life. The spec sheet for human thriving.
→ [Part III: The Spec Sheet]

**3. Why do I feel so bad?**
You're a fish on land. Your suffering isn't malfunction—it's accurate biological response to an environment that violates every condition your species requires.
→ [Part I: The Pattern]

**4. Is this just "we weren't meant to live like this"?**
Yes, but with 300,000 years of evidence and a specific spec sheet. Not nostalgia. Biology.
→ [Part III: The Spec Sheet]

**5. What's the core claim?**
Most suffering labeled "mental illness" is accurate signal, not broken brain. Fix the environment, not the person.
→ [Part VII: The Misdiagnosis]

---

## EMOTIONS & SIGNALS

**6. What are emotions?**
Biological GPS. They tell you whether current conditions increase or decrease your survival and reproduction odds. Information, not malfunction.
→ [Part II: The Machine]

**7. What is anxiety actually?**
Accurate threat detection. You're surrounded by strangers, unpredictability, uncontrollable stressors. The alarm is working. The environment is actually threatening.
→ [Part VII: The Misdiagnosis]

**8. What is depression actually?**
Accurate meaning assessment. Your life lacks visible purpose, tribe, closure. The signal is correct. The meaning is actually missing.
→ [Part VII: The Misdiagnosis]

**9. What is loneliness actually?**
Accurate isolation alarm. You're surrounded by acquaintances but have no tribe. The alarm is working. You are actually isolated.
→ [Part VII: The Misdiagnosis]

**10. What is addiction actually?**
Drive-seeking redirected to proxies. Real satisfactions are blocked, so you reach for substitutes. The drives work correctly. The pathways are blocked.
→ [Part IV: The Violations]

**11. What is ADHD actually?**
Hunter cognition in a farmer world. Scanning attention, movement-seeking, novelty-responsive—adaptive in EEA, pathologized in classrooms.
→ [Part VII: The Misdiagnosis]

**12. What is social anxiety actually?**
Fear of imagined rejection from an internal audience that doesn't exist. Phantom critics, not real feedback.
→ [Part VI: The Cascades]

**13. So my feelings aren't the problem?**
Correct. They're data. The problem is the environment generating them.
→ [Part I: The Pattern]

**14. What's the difference between signal and symptom?**
Signal = information requiring action. Symptom = malfunction requiring suppression. Psychiatry treats signals as symptoms.
→ [Part VII: The Misdiagnosis]

---

## THE DRIVES

**15. What drives all human behavior?**
Survive and reproduce. Everything traces back to these two, directly or indirectly. No exceptions.
→ [Part II: The Machine]

**16. What is direct fitness?**
Survival and reproduction mechanisms that run automatically. Hunger, fear, sexual desire.
→ [Part II: The Machine]

**17. What is indirect fitness?**
Survival and reproduction through social mechanisms. Cooperation, reputation, coalition-building, status.
→ [Part II: The Machine]

**18. Why do I care so much about status?**
High-status individuals get better mates, more resources, more support. Status drive is evolved strategy, not vanity.
→ [Part II: The Machine]

**19. What is reciprocal altruism?**
Helping others with expectation of future help. Created cooperation beyond kinship. Why you feel good helping friends.
→ [Part II: The Machine]

---

## THE LIMITS (DUNBAR)

**20. What are Dunbar's numbers?**
Hard cognitive limits on relationships: 5 intimate → 15 close → 50 friends → 150 meaningful. Beyond 150, people become categories.
→ [Part II: The Machine]

**21. What is "the 5"?**
People you'd call at 3 AM. Complete vulnerability. Almost daily contact. If you don't have 5, that's the problem.
→ [Part II: The Machine]

**22. What is "the 15"?**
People whose deaths would devastate you. Active tracking and care. You know their current struggles.
→ [Part II: The Machine]

**23. What is "the 50" (band)?**
Meaningful relationships with shared history. This is daily life in the EEA. 5-8 families in constant interaction.
→ [Part III: The Spec Sheet]

**24. What is "the 150" (tribe)?**
Maximum for stable social relationships. Everyone you can actually know as individual. Beyond this: strangers.
→ [Part II: The Machine]

**25. What is the metapopulation?**
500-1500 people across multiple tribes. Connected through marriage, kinship, trade. Genetic diversity. Resilience layer.
→ [Part III: The Spec Sheet]

**26. Can technology extend Dunbar's number?**
No. You can extend weak ties. You cannot extend strong ties. The limit is biological.
→ [Supplementary: Research Directions]

**27. I have 2,000 followers. Why am I lonely?**
Followers aren't tribe. Recognition isn't relationship. Parasocial bonds occupy slots meant for real people.
→ [Part V: The Exploitation]

---

## THE INTERFACE

**28. Do I perceive reality accurately?**
No. You perceive a dashboard. Evolution optimized for survival, not accuracy. You see what you need to see to stay alive.
→ [Part II: The Machine]

**29. What are fitness payoffs?**
What guides perception. Evolution selected for perceiving what matters for survival/reproduction, not what's objectively true.
→ [Part II: The Machine]

**30. Why does this matter?**
Your dashboard was calibrated for EEA. Now it runs in unrecognizable terrain. The shortcuts misfire constantly.
→ [Part II: The Machine]

---

## THE VIOLATIONS

**31. What is stranger overload?**
You encounter more strangers daily than ancestors met in years. Your brain can't stop assessing. You're exhausted.
→ [Part IV: The Violations]

**32. Why does modern work feel meaningless?**
3-4 hours ancestral work with visible results → 8-12 hours abstract labor for invisible shareholders. Meaning-making systems can't connect.
→ [Part IV: The Violations]

**33. What is status competition mismatch?**
You evolved to compete among 150 for achievable excellence. Now you're compared against 8 billion. Chronic inadequacy even in the successful.
→ [Part IV: The Violations]

**34. Why do I feel like I'm failing even when I'm "successful"?**
You got what you thought you wanted but not what you needed. Salt water for thirst.
→ [Part IV: The Violations]

---

## THE CASCADES

**35. What is the internal audience?**
Imaginary critics in your mind generating real biological responses. Phantom tribe judging by impossible standards. They don't exist.
→ [Part VI: The Cascades]

**36. Why do I care what strangers think?**
You evolved to be watched by 150 known people. Now the simulation runs on phantoms. You're performing for an audience that doesn't exist.
→ [Part VI: The Cascades]

**37. What is negativity bias?**
Evolution made assuming danger safer than assuming safety. Now applies to social evaluation—you assume rejection, criticism, mockery.
→ [Part VI: The Cascades]

**38. What is the perfectionism trap?**
Internal audience demands impossible, contradictory standards. You can never satisfy mutually exclusive demands.
→ [Part VI: The Cascades]

**39. What is an open loop?**
Problem that cannot be resolved through action. Chronic emotion without resolution. Modern life is an open loop factory.
→ [Part VI: The Cascades]

**40. What is a closed loop?**
Problem resolved through action. Hunt → eat → done. Conflict → resolution → done. Emotion dissipates because situation resolved.
→ [Part VI: The Cascades]

**41. Why can't I stop ruminating?**
Rumination evolved to plan solutions. Now it has nothing to work with—unchangeable past, uncontrollable future. The mechanism works. The problems don't resolve.
→ [Part VI: The Cascades]

**42. What is partial control?**
Worst anxiety zone. Can neither fully act nor fully accept. Most modern situations. The loops never close.
→ [Part VI: The Cascades]

---

## THE PROXY TRAP

**43. What is a proxy?**
Substitute that hijacks biological drive without satisfying need. Momentary relief, increasing need. Salt water for thirst.
→ [Part VI: The Cascades]

**44. Why don't proxies work?**
They address symptoms not causes. Create tolerance requiring escalation. Prevent seeking real solutions. Generate profit from perpetual need.
→ [Part VI: The Cascades]

**45. What is variable ratio reinforcement?**
Most addictive schedule known to psychology. Unpredictable rewards for consistent behavior. Slot machines. Social media feeds.
→ [Part V: The Exploitation]

**46. What are parasocial relationships?**
One-way emotional bonds with people who don't know you exist. Every influencer you follow takes a slot from your 150.
→ [Part V: The Exploitation]

**47. What are hyperstimuli?**
Stimuli exceeding anything in nature. Porn. Hyperpalatable food. Supernormal triggers that override evolved systems.
→ [Part IV: The Violations]

**48. Is art a proxy?**
No. Art continues fire circle function: processing experience, collective sense-making, truth-telling. It connects rather than extracts.
→ [Part VI: The Cascades]

---

## THE EXPLOITATION

**49. Why is my suffering profitable?**
A fully satisfied human is a terrible customer. Every unmet need is a market. The exploitation economy requires your mismatch.
→ [Part V: The Exploitation]

**50. What is the exploitation formula?**
1) Take real need. 2) Block genuine satisfaction. 3) Offer proxy. 4) Proxy doesn't satisfy (by design). 5) Monetize return visits. 6) Reinvest in addiction.
→ [Part V: The Exploitation]

**51. How does social media exploit me?**
Profits from loneliness. Variable ratio reinforcement. Parasocial bonds. Engagement metrics, not wellbeing metrics. Your attention is the product.
→ [Part V: The Exploitation]

**52. How does pharma exploit me?**
Invented "chemical imbalance" to sell chemicals. Signal override without addressing cause. Tolerance develops. Environment unchanged.
→ [Part V: The Exploitation]

**53. How does the food industry exploit me?**
Engineers hyperpalatability. Bliss point optimization. Foods designed to be impossible to eat in moderation. Addiction is the feature.
→ [Part V: The Exploitation]

**54. How do dating apps exploit me?**
Business model requires failure. Successful match = lost user. Infinite choice prevents depth. Loneliest users are most valuable.
→ [Part V: The Exploitation]

**55. How does porn exploit me?**
Supernormal stimuli hijacking mating drive. Unlimited novelty. Real partners become inadequate. Pair bonding destroyed.
→ [Part V: The Exploitation]

**56. How does news media exploit me?**
Profits from threat activation. Open loops that never close. Anxiety about events you can't influence. Your stress hormones sold to advertisers.
→ [Part V: The Exploitation]

**57. How does self-help exploit me?**
Requires that self-help doesn't work. Individual solutions to systemic problems. Repeat customers essential. The failure is the business model.
→ [Part V: The Exploitation]

**58. How does gambling exploit me?**
Variable ratio reinforcement perfected, then exported everywhere. Loot boxes. Gacha. Engagement loops. Your vulnerability is their revenue.
→ [Part V: The Exploitation]

**59. How does advertising exploit me?**
$700B+ annually weaponizing evolutionary psychology. Manufacturing inadequacy. Making you want things to fill voids products can't fill.
→ [Part V: The Exploitation]

---

## THE MISDIAGNOSIS

**60. Are psychiatric conditions real diseases?**
No biomarkers. No blood tests. Behavioral descriptions, not disease entities. Psychiatry diagnoses by observation, not measurement.
→ [Part VII: The Misdiagnosis]

**61. But these conditions are heritable?**
So is height. Heritability doesn't make something a disease. What's inherited: tendency toward certain cognitive patterns that served different roles.
→ [Part VII: The Misdiagnosis]

**62. What about brain differences?**
Musicians have different brains. Taxi drivers have different brains. Difference is not pathology. We're comparing variation to one baseline (farmer brain) and calling deviation disease.
→ [Part VII: The Misdiagnosis]

**63. What is "farmer brain"?**
The compliant, sit-still-and-focus baseline we treat as normal. Hunter cognition deviates from it, gets pathologized.
→ [Part VII: The Misdiagnosis]

**64. What is signal override?**
What medication does. Floods system to suppress signal without addressing what it's responding to. Oil light covered, engine still broken.
→ [Part V: The Exploitation]

**65. Is medication ever necessary?**
Medication becomes "necessary" because we've destroyed social structures that would otherwise manage these states. Alternative: tribal containment.
→ [Supplementary: Objections]

---

## THE DESTINATION

**66. What is demismatch?**
Return to baseline human thriving. Conscious alignment of environment with biology. Not returning to past—building forward.
→ [Part IX: The Destination]

**67. What is augment?**
Extend capability from healthy foundation. Technology built on thriving humans, not broken ones.
→ [Part IX: The Destination]

**68. Why "demismatch first, then augment"?**
Can't skip steps. Can't augment from broken. Fix the foundation first.
→ [Part IX: The Destination]

**69. What is "the most human post-human"?**
The destination: humans with matched environments, enhanced by technology. Not replacement but extension.
→ [Part IX: The Destination]

**70. What's the simple test?**
Do you wake up with a role, in a group, with a goal? If yes, you've arrived. If no, you haven't.
→ [Part IX: The Destination]

---

## TRIBAL STRUCTURE

**71. What is the fire circle?**
Nightly gathering of entire band. 2-4 hours. Processing, storytelling, conflict resolution. Every single night for 300,000 years.
→ [Part III: The Spec Sheet]

**72. What is alloparenting?**
Child-rearing by 20+ adults, not 1-2 exhausted parents. Multiple attachment figures. Security not dependent on individuals not failing.
→ [Part III: The Spec Sheet]

**73. What is demand sharing?**
Economic pattern: those with surplus share when asked. Not charity—obligation and insurance. Share today, ask tomorrow.
→ [Part III: The Spec Sheet]

**74. What is immediate-return economy?**
Resources consumed within hours/days of acquisition. No accumulation. Direct line between effort and benefit.
→ [Part III: The Spec Sheet]

**75. How did EEA governance work?**
No permanent leaders. Different experts for different domains. Consensus decisions. Egalitarian enforcement through ridicule, coalition, exile.
→ [Part III: The Spec Sheet]

**76. What is fission-fusion?**
Natural social dynamics. Groups split and reform. Not all dissolution is failure. Social metabolism.
→ [Supplementary: Fission-Fusion]

---

## GOVERNANCE

**77. Why do modern tribes need explicit governance?**
Humans entering tribes are hierarchy-damaged. Trained to climb, manipulate, defer. EEA mechanisms don't work automatically.
→ [Supplementary: Governance]

**78. What is rotation?**
Any power-accumulating role rotates formally. External negotiator, conflict arbiter, resource controller—all rotate. Prevents consolidation.
→ [Supplementary: Governance]

**79. What is transparency?**
Finances visible to all. Decisions logged. No back-channels. Information asymmetry is proto-hierarchy.
→ [Supplementary: Governance]

**80. What is domain separation?**
No one holds multiple power-adjacent roles. The negotiator can't also be arbiter can't also be resource controller.
→ [Supplementary: Governance]

**81. What is onboarding filter?**
Screen for hierarchy-trained dominance patterns before full membership. Not everyone belongs in every tribe.
→ [Supplementary: Governance]

**82. What is viable exit?**
Unlike EEA, leaving doesn't mean death. This strengthens bargaining against dominators. You can leave. They know you can leave.
→ [Supplementary: Governance]

**83. What's the difference between a tribe and a cult?**
Cult: charismatic leader, information control, isolation, punishment for leaving. Tribe: distributed authority, transparency, embedded in society, freedom to leave.
→ [Supplementary: Objections]

---

## TECHNOLOGY

**84. What is pharmakon?**
Greek: both poison and cure. Technology's dual nature. Same tools creating mismatch can serve demismatching—if designed differently.
→ [Part IX: The Destination]

**85. What is a decay function?**
Technology that degrades without physical presence. Features lock without in-person time. Success measured by decreasing use.
→ [Supplementary: Technology]

**86. What is tribe formation AI?**
Matching based on nervous system regulation, conflict styles, values. Modern village matchmaker. Discovery tool, not relationship substitute.
→ [Supplementary: Technology]

**87. Why won't venture capital fund demismatch tech?**
Decay functions are churn engines. VCs need engagement growth. Demismatch tech requires different economics: open source, non-profit, mission-driven.
→ [Part IX: The Destination]

**88. Can current technology demismatch?**
Yes. Video calls with actual tribe. Coordination tools for real groups. AI as capability extension. Question: does it serve your 150 or substitute parasocial engagement?
→ [Supplementary: Technology]

---

## TRANSITION

**89. What is the double shift?**
Transition exhaustion. Maintaining wage labor while building tribal structure. Primary failure mode. Running two operating systems.
→ [Supplementary: Transition]

**90. What is the great filter?**
Transition period where most tribe formation attempts fail. Double shift burnout, resource constraints, instability.
→ [Supplementary: Transition]

**91. Who can attempt this first?**
People with resources: schedule flexibility, savings buffer, existing relationships, lower cost-of-living. First adopters create maps others follow.
→ [Supplementary: Transition]

**92. What is constructive scarcity?**
Challenges requiring effort, cooperation, skill—creating conditions for meaning. Time limits, skill mastery, coordination. Remains even with abundance.
→ [Part IX: The Destination]

**93. What is toxic scarcity?**
Material deprivation creating desperation. Food/shelter insecurity. Eliminated by automation/UBI. Good riddance.
→ [Part IX: The Destination]

**94. Why isn't UBI the answer?**
Solves resource distribution, not meaning. Money without role, tribe, purpose. "UBI + atomization = Netflix until death."
→ [Part IX: The Destination]

**95. What does automation change?**
Eliminating human roles in production. The proxy purpose that work provides is disappearing. Makes framework more urgent—rebuild meaning through tribe.
→ [Part IX: The Destination]

---

## EVIDENCE

**96. What do WHO studies show?**
Better schizophrenia outcomes in developing countries with less medication and more social support.
→ [Supplementary: Research]

**97. What do hunter-gatherer studies show?**
Chronic psychiatric conditions rare or absent in genuinely matched populations. Limited data, but directionally clear.
→ [Supplementary: Research]

**98. What do environmental interventions show?**
Nature exposure, co-living reduce symptoms independent of medication. Environment is the variable.
→ [Supplementary: Research]

**99. What do intentional communities show?**
Twin Oaks (58 years), East Wind (51 years), kibbutzim—long-term stability possible. Convergent governance solutions.
→ [Supplementary: Governance Case Studies]

---

## SO NOW WHAT?

**100. What do I actually do?**
1) Reduce mismatch load: audit parasocial relationships, reduce open loops, circadian basics, move your body.
2) Deepen not broaden: invest in existing relationships, identify your actual 5.
3) Reduce proxy dependence: notice substitutes, time-box them, build real alternatives.
4) Build: one dinner, one finished project, one person who sees your contribution.

Understanding changes nothing. Reading about mismatch while alone scrolling is not progress.

Close this tab. Go outside. Find your people. Build something.
→ [Part IX: The Destination]

---

## QUICK OBJECTIONS

**"I'm an introvert."**
Introversion = how you recover energy, not what you need. You need tribe with quieter role. Not isolation.
→ [Supplementary: Objections]

**"Different people need different things."**
Surface variation exists. Deep structure universal. No human thrives isolated, purposeless, surrounded by strangers, with permanent open loops.
→ [Supplementary: Objections]

**"You're romanticizing the past."**
27% infant mortality. 48% child death. Framework doesn't claim past was better—claims social environment matched the hardware.
→ [Supplementary: Objections]

**"This sounds like a cult."**
Cults: charismatic leader, isolation, information control, punishment for leaving. Framework: distributed authority, transparency, embedded in society, freedom to exit.
→ [Supplementary: Objections]

**"Society can't reorganize."**
Society doesn't need to. You need to build tribe within existing society. The tribe is a social layer, not replacement for civilization.
→ [Supplementary: Objections]

**"Only privileged people can do this."**
Partly true. First tribes will come from those who can experiment. Question is whether success builds infrastructure for others.
→ [Supplementary: Objections]

---

*The framework is open. Fork it, improve it, implement it.*`;

export default function FAQPage() {
  const elements = parseFAQContent(FAQ_CONTENT);

  return (
    <main className="min-h-screen bg-[#FAF9F6] pt-20">
      <Navigation />

      <div className="max-w-4xl mx-auto px-8 py-16">
        <header className="mb-12 text-center">
          <h1
            className="text-5xl md:text-6xl text-[#1A1A1A] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            DEMISMATCH FAQ
          </h1>
          <p className="text-xl text-[#6b6b6b]">
            100 questions. No fluff. Links to learn more.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          {elements}
        </div>
      </div>
    </main>
  );
}
