"use client";

import Link from "next/link";
import { useState } from "react";
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

interface FAQItem {
  id: string;
  questionNum: string;
  questionText: string;
  answer: React.ReactNode[];
  section?: string;
}

function parseTextWithLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const linkRegex = /\[([^\]]+)\]/g;
  let match;
  let linkKey = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
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
  if (lastIndex < text.length) {
    const remaining = text.substring(lastIndex);
    if (remaining.trim()) {
      parts.push(remaining);
    }
  }

  // If no links found, just use the text
  if (parts.length === 0) {
    parts.push(text);
  }

  return parts;
}

function parseFAQContent(content: string): { sections: { title: string; items: FAQItem[] }[]; footer?: string } {
  const lines = content.split('\n');
  const sections: { title: string; items: FAQItem[] }[] = [];
  let currentSection: { title: string; items: FAQItem[] } | null = null;
  let currentQuestion: FAQItem | null = null;
  let currentAnswer: string[] = [];
  let footer: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Main title (#)
    if (trimmed.startsWith('# ') && trimmed === '# DEMISMATCH FAQ') {
      continue;
    }

    // Subtitle line
    if (trimmed === 'No fluff. Real answers. Links to learn more.') {
      continue;
    }

    // Section headers (##)
    if (trimmed.startsWith('## ')) {
      // Save previous question if exists
      if (currentQuestion && currentAnswer.length > 0) {
        currentQuestion.answer = currentAnswer.map((text, idx) => (
          <p key={`${currentQuestion!.id}-answer-${idx}`} className="text-[#4A4A4A] mb-4 leading-relaxed">
            {parseTextWithLinks(text)}
          </p>
        ));
        if (currentSection) {
          currentSection.items.push(currentQuestion);
        }
        currentQuestion = null;
        currentAnswer = [];
      }

      const sectionTitle = trimmed.substring(3);
      currentSection = { title: sectionTitle, items: [] };
      sections.push(currentSection);
      continue;
    }

    // Horizontal rule
    if (trimmed === '---') {
      // Save previous question if exists
      if (currentQuestion && currentAnswer.length > 0) {
        currentQuestion.answer = currentAnswer.map((text, idx) => (
          <p key={`${currentQuestion!.id}-answer-${idx}`} className="text-[#4A4A4A] mb-4 leading-relaxed">
            {parseTextWithLinks(text)}
          </p>
        ));
        if (currentSection) {
          currentSection.items.push(currentQuestion);
        }
        currentQuestion = null;
        currentAnswer = [];
      }
      continue;
    }

    // Empty lines
    if (trimmed === '') {
      continue;
    }

    // Bold questions (format: **number. Question text**)
    if (trimmed.startsWith('**') && trimmed.includes('**')) {
      // Save previous question if exists
      if (currentQuestion && currentAnswer.length > 0) {
        currentQuestion.answer = currentAnswer.map((text, idx) => (
          <p key={`${currentQuestion!.id}-answer-${idx}`} className="text-[#4A4A4A] mb-4 leading-relaxed">
            {parseTextWithLinks(text)}
          </p>
        ));
        if (currentSection) {
          currentSection.items.push(currentQuestion);
        }
      }

      const match = trimmed.match(/\*\*(\d+)\.\s*(.+?)\*\*/);
      if (match) {
        const questionNum = match[1];
        const questionText = match[2];
        currentQuestion = {
          id: `q-${questionNum}`,
          questionNum,
          questionText,
          answer: [],
          section: currentSection?.title
        };
        currentAnswer = [];
      } else {
        // Handle quoted objections like **"I'm an introvert."**
        const quotedMatch = trimmed.match(/\*\*"(.+?)"\*\*/);
        if (quotedMatch) {
          currentQuestion = {
            id: `q-quoted-${sections.length}-${currentSection?.items.length || 0}`,
            questionNum: '',
            questionText: quotedMatch[1],
            answer: [],
            section: currentSection?.title
          };
          currentAnswer = [];
        }
      }
      continue;
    }

    // Regular paragraphs (answers)
    if (trimmed.length > 0 && !trimmed.startsWith('*')) {
      if (currentQuestion) {
        currentAnswer.push(trimmed);
      }
      continue;
    }

    // Italic footer text
    if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
      footer = trimmed.slice(1, -1);
    }
  }

  // Save last question if exists
  if (currentQuestion && currentAnswer.length > 0) {
    currentQuestion.answer = currentAnswer.map((text, idx) => (
      <p key={`${currentQuestion!.id}-answer-${idx}`} className="text-[#4A4A4A] mb-4 leading-relaxed">
        {parseTextWithLinks(text)}
      </p>
    ));
    if (currentSection) {
      currentSection.items.push(currentQuestion);
    }
  }

  return { sections, footer: footer || undefined };
}

const FAQ_CONTENT = `# DEMISMATCH FAQ

No fluff. Real answers. Links to learn more.

---

## THIS PROJECT

**First, about AI: Is this made by AI?**

Yes. Good thing too.

Behind this is one human (Peter-someone who spent more than a decade connecting dots across evolutionary psychology, anthropology, neuroscience and technology, and realized they all point to the same thing that no one's saying clearly) and one AI (Claude). We've been collaborating for months.

He could write this himself. He started with 50+ pages of dense, original framework. It's still out there somewhere. 

But here's the thing: you don't want that version. The human-only version would be filtered through one person's reading list, one person's blind spots, one person's emotional history with the material. It would overemphasize what resonates with him personally and underemphasize what doesn't. It would miss connections he doesn't know exist. It would dismiss objections he finds annoying instead of steelmanning them. It would have the parts he finds exciting and skip the parts he finds tedious.

AI collaboration produces something closer to the truth. Cross-referencing across fields he hasn't read. Catching inconsistencies he's blind to. No emotional attachment to pet ideas. No personal trauma shaping what gets emphasized. Able to hold the whole framework in context and spot gaps.

Not just faster. Less wrong.

This is what "augment" actually means. Not AI as labor-saving device. AI as bias-reduction mechanism. Human conviction plus AI objectivity, producing something more accurate than either alone.

The ideas are either true or they aren't. How they got here matters less than whether they hold up.

---

**1. What is this website?**
A framework explaining why modern humans suffer and what conditions would let them thrive. Not therapy. Not self-help. A spec sheet for human nature.

**2. What are you trying to do?**
Change how people understand suffering. It's not you. It's the environment. Once you see it, you can't unsee it-and you can start building differently.

**3. Why should I care?**
Because you're probably suffering and blaming yourself. Because the "solutions" you've tried haven't worked. Because understanding the actual problem is the first step to fixing it.

**4. Who is this for?**
Anyone who feels something is deeply wrong but can't name it. Also: therapists tired of prescribing band-aids, technologists who want to build things that help, researchers looking for a unifying framework, parents watching their kids struggle.

**5. Is this anti-psychiatry?**
It's anti-misdiagnosis. Psychiatric conditions are real behavioral patterns. They're just not diseases-they're accurate responses to environmental mismatch. Different diagnosis, different solutions.

**6. Is this anti-technology?**
No. Technology is pharmakon-both poison and cure. The same tools creating mismatch can serve demismatching. Depends on design.

**7. What do you want me to do after reading this?**
Stop blaming yourself. Understand the pattern. Then build: your own tribe, your own closure, your own visible contribution. Understanding alone changes nothing.

**8. Why is this free?**
No one owns truth about human nature. The framework is open source. Fork it, improve it, implement it.

**9. What's with all the images?**
2,500+ visuals in the library. Demismatch is dense. Images make it visceral. Use them for presentations, conversations, your own understanding.

**10. How do I know this isn't just another self-help thing?**
Self-help sells individual solutions to systemic problems. That's why it doesn't work-and why you keep buying more. This framework says: the problem is environmental, the solution is collective, and anyone selling you personal optimization is part of the problem.

---

## THE PATTERN

**11. What is evolutionary mismatch?**
Your brain was built for conditions that no longer exist. 300,000 years of consistent environment, then everything changed. The hardware works perfectly. The environment doesn't match.
→ [Part I: The Pattern]

**12. What is the EEA?**
Environment of Evolutionary Adaptedness. The conditions humans evolved in: small bands, known faces, daily closure, visible contribution, physical life. The spec sheet for human thriving.
→ [Part III: The Spec Sheet]

**13. Why do I feel so bad?**
You're a fish on land. Your suffering isn't malfunction-it's accurate biological response to an environment that violates every condition your species requires.
→ [Part I: The Pattern]

**14. What's "fish on land"?**
The core metaphor. Fish out of water flops around gasping. You don't diagnose "Flopping Disorder" and prescribe medication. You put it back in water.
→ [Part I: The Pattern]

**15. What's "flopping disorder"?**
Satirical term for what we do to humans. Pathologize the flopping instead of fixing the environment.
→ [Part VII: The Misdiagnosis]

**16. Is this just "we weren't meant to live like this"?**
Yes, but with 300,000 years of evidence and a specific spec sheet. Not nostalgia. Biology.
→ [Part III: The Spec Sheet]

**17. What's the core claim?**
Most suffering labeled "mental illness" is accurate signal, not broken brain. Fix the environment, not the person.
→ [Part VII: The Misdiagnosis]

**18. What are the stakes?**
People die from this. Zoraya ter Beek, 29, was euthanized in the Netherlands after psychiatrists said "nothing more we can do." Without ever trying environmental intervention. She's not alone.
→ [Part V: The Exploitation]

---

## EMOTIONS & SIGNALS

**19. What are emotions?**
Biological GPS. They tell you whether current conditions increase or decrease your survival and reproduction odds. Information, not malfunction.
→ [Part II: The Machine]

**20. What is anxiety actually?**
Accurate threat detection. You're surrounded by strangers, unpredictability, uncontrollable stressors. The alarm is working. The environment is actually threatening.
→ [Part VII: The Misdiagnosis]

**21. What is depression actually?**
Accurate meaning assessment. Your life lacks visible purpose, tribe, closure. The signal is correct. The meaning is actually missing.
→ [Part VII: The Misdiagnosis]

**22. What is loneliness actually?**
Accurate isolation alarm. You're surrounded by acquaintances but have no tribe. The alarm is working. You are actually isolated.
→ [Part VII: The Misdiagnosis]

**23. What is addiction actually?**
Drive-seeking redirected to proxies. Real satisfactions are blocked, so you reach for substitutes. The drives work correctly. The pathways are blocked.
→ [Part IV: The Violations]

**24. What is ADHD actually?**
Hunter cognition in a farmer world. Scanning attention, movement-seeking, novelty-responsive-adaptive in EEA, pathologized in classrooms.
→ [Part VII: The Misdiagnosis]

**25. What is social anxiety actually?**
Fear of imagined rejection from an internal audience that doesn't exist. Phantom critics, not real feedback.
→ [Part VI: The Cascades]

**26. What is burnout?**
Result of work/purpose mismatch. Your meaning-making systems cannot connect abstract labor to survival benefit. Not laziness. Accurate assessment of futility.
→ [Part IV: The Violations]

**27. What is imposter syndrome?**
Feeling like a fraud despite evidence of competence. Often: accurate recognition that your work doesn't visibly benefit anyone you know.
→ [Part IV: The Violations]

**28. So my feelings aren't the problem?**
Correct. They're data. The problem is the environment generating them.
→ [Part I: The Pattern]

**29. What's the difference between signal and symptom?**
Signal = information requiring action. Symptom = malfunction requiring suppression. Psychiatry treats signals as symptoms.
→ [Part VII: The Misdiagnosis]

**30. What's the oil light metaphor?**
Medication is like covering the oil light instead of checking the engine. Signal suppressed, underlying problem unchanged.
→ [Part VII: The Misdiagnosis]

---

## THE DRIVES

**31. What drives all human behavior?**
Survive and reproduce. Everything traces back to these two, directly or indirectly. No exceptions.
→ [Part II: The Machine]

**32. What is direct fitness?**
Survival and reproduction mechanisms that run automatically. Hunger, fear, sexual desire.
→ [Part II: The Machine]

**33. What is indirect fitness?**
Survival and reproduction through social mechanisms. Cooperation, reputation, coalition-building, status.
→ [Part II: The Machine]

**34. Why do I care so much about status?**
High-status individuals get better mates, more resources, more support. Status drive is evolved strategy, not vanity.
→ [Part II: The Machine]

**35. What is reciprocal altruism?**
Helping others with expectation of future help. Created cooperation beyond kinship. Why you feel good helping friends.
→ [Part II: The Machine]

**36. What's the difference between wants and needs?**
Wants: worldwide fame, million dollars, perfect Instagram life. Needs: recognition by small tribe, resource security in sharing network, connection with flawed humans. Chasing wants while needs go unmet = permanent dissatisfaction.
→ [Part IV: The Violations]

---

## THE LIMITS (DUNBAR)

**37. What are Dunbar's numbers?**
Hard cognitive limits on relationships: 5 intimate → 15 close → 50 friends → 150 meaningful. Beyond 150, people become categories.
→ [Part II: The Machine]

**38. Why are these limits hard?**
Neocortex size correlates with social group size across all primates. Information processing prevents tracking more. Time makes maintaining more impossible. It's architecture, not culture.
→ [Part II: The Machine]

**39. What is "the 5"?**
People you'd call at 3 AM. Complete vulnerability. Almost daily contact. If you don't have 5, that's the problem.
→ [Part II: The Machine]

**40. What is "the 15"?**
People whose deaths would devastate you. Active tracking and care. You know their current struggles.
→ [Part II: The Machine]

**41. What is "the 50" (band)?**
Meaningful relationships with shared history. This is daily life in the EEA. 5-8 families in constant interaction.
→ [Part III: The Spec Sheet]

**42. What is "the 150" (tribe)?**
Maximum for stable social relationships. Everyone you can actually know as individual. Beyond this: strangers.
→ [Part II: The Machine]

**43. What is the metapopulation?**
500-1500 people across multiple tribes. Connected through marriage, kinship, trade. Genetic diversity. Resilience layer.
→ [Part III: The Spec Sheet]

**44. Can technology extend Dunbar's number?**
No. You can extend weak ties. You cannot extend strong ties. The limit is biological.
→ [Supplementary: Research Directions]

**45. I have 2,000 followers. Why am I lonely?**
Followers aren't tribe. Recognition isn't relationship. Parasocial bonds occupy slots meant for real people.
→ [Part V: The Exploitation]

---

## THE INTERFACE

**46. Do I perceive reality accurately?**
No. You perceive a dashboard. Evolution optimized for survival, not accuracy. You see what you need to see to stay alive.
→ [Part II: The Machine]

**47. What are fitness payoffs?**
What guides perception. Evolution selected for perceiving what matters for survival/reproduction, not what's objectively true.
→ [Part II: The Machine]

**48. Why does this matter?**
Your dashboard was calibrated for EEA. Now it runs in unrecognizable terrain. The shortcuts misfire constantly.
→ [Part II: The Machine]

---

## THE VIOLATIONS

**49. What is stranger overload?**
You encounter more strangers daily than ancestors met in years. Your brain can't stop assessing. You're exhausted.
→ [Part IV: The Violations]

**50. How many strangers did ancestors encounter?**
Zero daily. Maybe 1,000 total in a lifetime. Every face was known. Every interaction with someone whose entire history you knew.
→ [Part III: The Spec Sheet]

**51. Why does modern work feel meaningless?**
3-4 hours ancestral work with visible results → 8-12 hours abstract labor for invisible shareholders. Meaning-making systems can't connect.
→ [Part IV: The Violations]

**52. What are bullshit jobs?**
Jobs existing only to perpetuate themselves. Produce nothing tangible. Benefit no one you know. Result of work/purpose mismatch at civilizational scale.
→ [Part IV: The Violations]

**53. What is status competition mismatch?**
You evolved to compete among 150 for achievable excellence. Now you're compared against 8 billion. Chronic inadequacy even in the successful.
→ [Part IV: The Violations]

**54. Why do I feel like I'm failing even when I'm "successful"?**
You got what you thought you wanted but not what you needed. Salt water for thirst.
→ [Part IV: The Violations]

**55. What's "salt water for thirst"?**
The proxy trap. Momentary relief, increasing need. The more you drink, the thirstier you get.
→ [Part VI: The Cascades]

**56. Why are mass shootings a modern phenomenon?**
Killing strangers you've never met would be inconceivable in EEA. Everyone was known. The concept wouldn't parse.
→ [Part IV: The Violations]

---

## THE CASCADES

**57. What is the internal audience?**
Imaginary critics in your mind generating real biological responses. Phantom tribe judging by impossible standards. They don't exist.
→ [Part VI: The Cascades]

**58. Why do I care what strangers think?**
You evolved to be watched by 150 known people. Now the simulation runs on phantoms. You're performing for an audience that doesn't exist.
→ [Part VI: The Cascades]

**59. What is negativity bias?**
Evolution made assuming danger safer than assuming safety. Now applies to social evaluation-you assume rejection, criticism, mockery by default.
→ [Part VI: The Cascades]

**60. What is the perfectionism trap?**
Internal audience demands impossible, contradictory standards. Be attractive but not vain. Successful but not arrogant. You can never satisfy mutually exclusive demands.
→ [Part VI: The Cascades]

**61. What is an open loop?**
Problem that cannot be resolved through action. Chronic emotion without resolution. Modern life is an open loop factory.
→ [Part VI: The Cascades]

**62. What is a closed loop?**
Problem resolved through action. Hunt → eat → done. Conflict → resolution → done. Emotion dissipates because situation resolved.
→ [Part VI: The Cascades]

**63. What is infinite scroll?**
Deliberate open loop design. No end state. No completion. Your brain keeps seeking closure that will never come. The engagement is the product.
→ [Part VI: The Cascades]

**64. Why can't I stop ruminating?**
Rumination evolved to plan solutions. Now it has nothing to work with-unchangeable past, uncontrollable future. The mechanism works. The problems don't resolve.
→ [Part VI: The Cascades]

**65. What is partial control?**
Worst anxiety zone. Can neither fully act nor fully accept. Most modern situations. The loops never close.
→ [Part VI: The Cascades]

---

## THE PROXY TRAP

**66. What is a proxy?**
Substitute that hijacks biological drive without satisfying need. Momentary relief, increasing need. Salt water for thirst.
→ [Part VI: The Cascades]

**67. Why don't proxies work?**
They address symptoms not causes. Create tolerance requiring escalation. Prevent seeking real solutions. Generate profit from perpetual need.
→ [Part VI: The Cascades]

**68. What is variable ratio reinforcement?**
Most addictive schedule known to psychology. Unpredictable rewards for consistent behavior. Slot machines. Social media feeds. Pull-to-refresh is a slot machine lever.
→ [Part V: The Exploitation]

**69. What is dopamine and how is it hijacked?**
Neurotransmitter driving reward-seeking. Evolved for intermittent natural rewards. Now hijacked by supernormal stimuli delivering constant hits. Tolerance builds. Baseline drops.
→ [Part V: The Exploitation]

**70. What are parasocial relationships?**
One-way emotional bonds with people who don't know you exist. Every influencer you follow takes a slot from your 150. They can't reciprocate. They extract without obligation.
→ [Part V: The Exploitation]

**71. What are hyperstimuli/supernormal stimuli?**
Stimuli exceeding anything in nature. Porn. Hyperpalatable food. Engineered to overwhelm evolved systems. Real satisfactions become inadequate by comparison.
→ [Part IV: The Violations]

**72. Is art a proxy?**
No. Art continues fire circle function: processing experience, collective sense-making, truth-telling. Test: does it leave you emptier and needing more, or does it connect and illuminate?
→ [Part VI: The Cascades]

---

## THE EXPLOITATION

**73. Why is my suffering profitable?**
A fully satisfied human is a terrible customer. Every unmet need is a market. The exploitation economy requires your mismatch.
→ [Part V: The Exploitation]

**74. What is the exploitation formula?**
1) Take real need. 2) Block genuine satisfaction. 3) Offer proxy. 4) Proxy doesn't satisfy (by design). 5) Monetize return visits. 6) Reinvest in addiction.
→ [Part V: The Exploitation]

**75. What is the atomized individual?**
Ideal consumer. Lacks community, purpose, intimacy, tribe. Vulnerable to manipulation because no one checks the message, provides counter-narrative, meets the need for real.
→ [Part V: The Exploitation]

**76. How does social media exploit me?**
Profits from loneliness. Variable ratio reinforcement. Parasocial bonds. Engagement metrics, not wellbeing metrics. Your attention is the product sold to advertisers.
→ [Part V: The Exploitation]

**77. How does pharma exploit me?**
Invented "chemical imbalance" to sell chemicals. Signal override without addressing cause. Ghostwritten studies. Paid key opinion leaders. Tolerance develops. Environment unchanged.
→ [Part V: The Exploitation]

**78. What is the serotonin hypothesis?**
Debunked narrative that depression is serotonin deficiency. SSRIs don't correct deficiency-they flood the system. Same mechanism as cocaine flooding dopamine.
→ [Part VII: The Misdiagnosis]

**79. What are ghostwritten studies?**
Pharma pays for research, writes the conclusions, puts academic names on it. Documented practice. The "science" is marketing.
→ [Part V: The Exploitation]

**80. How does the food industry exploit me?**
Engineers hyperpalatability. Bliss point optimization-precise combination of sugar, fat, salt for maximum craving without satisfaction. Foods designed to be impossible to eat in moderation. Addiction is the feature.
→ [Part V: The Exploitation]

**81. How do dating apps exploit me?**
Business model requires failure. Successful match = lost user. Infinite choice prevents depth. Loneliest users are most valuable. Designed for engagement, not outcomes.
→ [Part V: The Exploitation]

**82. How does porn exploit me?**
Supernormal stimuli hijacking mating drive. Unlimited novelty impossible in nature. Real partners become inadequate. Pair bonding destroyed. Erectile dysfunction epidemic in young men.
→ [Part V: The Exploitation]

**83. How does news media exploit me?**
Profits from threat activation. "If it bleeds, it leads." Open loops that never close. Anxiety about events you can't influence. Your stress hormones-cortisol-elevated for profit.
→ [Part V: The Exploitation]

**84. What is cortisol?**
Stress hormone. Supposed to spike briefly for real threats. News media keeps it chronically elevated for engagement. You pay with your health.
→ [Part V: The Exploitation]

**85. How does self-help exploit me?**
Requires that self-help doesn't work. Individual solutions to systemic problems. Repeat customers essential. The failure is the business model.
→ [Part V: The Exploitation]

**86. How does gambling exploit me?**
Variable ratio reinforcement perfected, then exported everywhere. Loot boxes. Gacha. Engagement loops. "Whales"-vulnerable users accounting for most revenue-specifically targeted.
→ [Part V: The Exploitation]

**87. What are whales?**
Gambling industry term. Vulnerable users who account for disproportionate revenue. Now applies across exploitation economy. Your vulnerability is their profit center.
→ [Part V: The Exploitation]

**88. How does advertising exploit me?**
$700B+ annually weaponizing evolutionary psychology. Manufacturing inadequacy. Making you feel bad about yourself so you'll buy products to feel better. The inadequacy is created, not discovered.
→ [Part V: The Exploitation]

**89. Why isn't this common knowledge?**
The suppression. Not conspiracy-incentives. Funding goes to drug development, not environmental intervention. Media covers new treatments, not systemic critique. Truth isn't profitable. Profitable isn't true.
→ [Part V: The Exploitation]

**90. What is the celebrity phenomenon?**
Fame as hyperstimulus for status recognition. You form bonds with people who don't know you exist. They extract emotional investment without reciprocity. Every celebrity you track takes bandwidth from real relationships.
→ [Part IV: The Violations]

**91. What is the soccer phenomenon?**
Tribal belonging through sports fandom. You don't actually care about soccer. You're addicted to the feeling of belonging, shared goals, common enemies. Warfare by proxy. Almost satisfies the need. Almost.
→ [Part IV: The Violations]

---

## THE MISDIAGNOSIS

**92. Are psychiatric conditions real diseases?**
No biomarkers. No blood tests. Behavioral descriptions, not disease entities. Psychiatry diagnoses by observation, not measurement.
→ [Part VII: The Misdiagnosis]

**93. But these conditions are heritable?**
So is height. Heritability doesn't make something a disease. What's inherited: tendency toward certain cognitive patterns that served different roles in EEA.
→ [Part VII: The Misdiagnosis]

**94. What about brain differences?**
Musicians have different brains. Taxi drivers have different brains. Difference is not pathology. We're comparing variation to one baseline (farmer brain) and calling deviation disease.
→ [Part VII: The Misdiagnosis]

**95. What is "farmer brain"?**
The compliant, sit-still-and-focus baseline we treat as normal. Hunter cognition deviates from it, gets pathologized as ADHD.
→ [Part VII: The Misdiagnosis]

**96. What about neuroplasticity?**
Chronic stress reshapes the brain. The "differences" observed might be consequences of mismatch, not pre-existing conditions. The mismatch itself causes the changes.
→ [Part VII: The Misdiagnosis]

**97. What is signal override?**
What medication does. Floods system to suppress signal without addressing what it's responding to. Oil light covered, engine still broken.
→ [Part V: The Exploitation]

**98. What's wrong with therapy?**
Nothing-if it's a bridge. Problem: therapy as proxy. $200/hour paid intimacy. Therapist as only person who "really understands." Subscription service for belonging. Years without environmental change.
→ [Part VI: The Cascades]

**99. What's a 15-minute medication check?**
Psychiatrist visit. Enough time to adjust dosage. Not enough to understand context. Managing symptoms so you can keep functioning in the environment causing them.
→ [Part V: The Exploitation]

**100. Is medication ever necessary?**
Medication becomes "necessary" because we've destroyed social structures that would otherwise manage these states. Alternative: tribal containment. WHO studies show better outcomes with less medication, more social support.
→ [Supplementary: Objections]

**101. What did Rat Park show?**
Rats in enriched environments don't self-administer drugs. Isolated rats do. Environment is the variable. Addiction isn't the substance-it's the solution to isolation.
→ [Part IV: The Violations]

---

## THE DESTINATION

**102. What is demismatch?**
Return to baseline human thriving. Conscious alignment of environment with biology. Not returning to past-building forward.
→ [Part IX: The Destination]

**103. What is augment?**
Extend capability from healthy foundation. Technology built on thriving humans, not broken ones.
→ [Part IX: The Destination]

**104. Why "demismatch first, then augment"?**
Can't skip steps. Can't augment from broken. Fix the foundation first. Technology on broken humans creates broken outcomes.
→ [Part IX: The Destination]

**105. What is "the most human post-human"?**
The destination: humans with matched environments, enhanced by technology. Not replacement but extension.
→ [Part IX: The Destination]

**106. What's the simple test?**
Do you wake up with a role, in a group, with a goal? If yes, you've arrived. If no, you haven't.
→ [Part IX: The Destination]

---

## THE EEA SPEC SHEET

**107. What is the fire circle?**
Nightly gathering of entire band. 2-4 hours. Processing, storytelling, conflict resolution, bonding. Every single night for 300,000 years. Your ancestors spent more time in relaxed communion each evening than you spend per month.
→ [Part III: The Spec Sheet]

**108. What is alloparenting?**
Child-rearing by 20+ adults, not 1-2 exhausted parents. Multiple attachment figures. Security not dependent on individuals not failing.
→ [Part III: The Spec Sheet]

**109. What is mixed-age play?**
Not age-segregated classrooms. Five-year-olds learning from ten-year-olds teaching fifteen-year-olds helping toddlers. Natural mentorship. Leadership and empathy development.
→ [Part III: The Spec Sheet]

**110. What is apprenticeship?**
Children learning through observation and gradual participation. A seven-year-old gathering herbs isn't playing-they're contributing. By teenage years: adult-level skills.
→ [Part III: The Spec Sheet]

**111. What is demand sharing?**
Economic pattern: those with surplus share when asked. Not charity-obligation and insurance. Share today, ask tomorrow. No accumulation possible. No starvation possible.
→ [Part III: The Spec Sheet]

**112. What is immediate-return economy?**
Resources consumed within hours/days of acquisition. No accumulation. Direct line between effort and benefit. Work → eat. No abstraction.
→ [Part III: The Spec Sheet]

**113. How did EEA governance work?**
No permanent leaders. Different experts for different domains. Best tracker led hunts. Best diplomat handled relations. Outside their expertise: just a person.
→ [Part III: The Spec Sheet]

**114. What is egalitarian enforcement?**
Any domination attempt triggered immediate coalition response. Successful hunter shared more, not less. Prestige came from generosity. Try to boss people around: watch the whole band turn against you.
→ [Part III: The Spec Sheet]

**115. What is the conflict resolution cascade?**
Humor → public discussion → ridicule → shunning → exile → violence (rare, usually ritualized). Most conflicts resolved early through laughter. Escalation only when necessary.
→ [Part III: The Spec Sheet]

**116. What about circadian rhythm?**
Wake at dawn (naturally, with light). Work through morning. Rest, socialize, nap afternoon. Fire circle at evening. Sleep with dark. Every day. No artificial light fragmenting it.
→ [Part III: The Spec Sheet]

**117. What is birth spacing?**
3-4 years between children via extended breastfeeding. Parents not overwhelmed. Grandmothers crucial. Fathers highly involved-among Aka, fathers hold infants 20%+ of daytime.
→ [Part III: The Spec Sheet]

**118. What about physical contact for infants?**
Constant. Babies rarely put down. Carried in slings all day. Passed person to person. Co-sleeping at night. No infant experienced prolonged distress-someone always responded immediately.
→ [Part III: The Spec Sheet]

**119. What is fission-fusion?**
Natural social dynamics. Groups split and reform. Bands divide when too large, merge after conflicts, members move between groups. Not failure-social metabolism.
→ [Supplementary: Fission-Fusion]

---

## GOVERNANCE

**120. Why do modern tribes need explicit governance?**
Humans entering tribes are hierarchy-damaged. Trained to climb, manipulate, defer. EEA mechanisms don't work automatically on people with corporate backgrounds.
→ [Supplementary: Governance]

**121. What is rotation?**
Any power-accumulating role rotates formally. External negotiator, conflict arbiter, resource controller-all rotate on schedule. Prevents consolidation.
→ [Supplementary: Governance]

**122. What is transparency?**
Finances visible to all. Decisions logged. No back-channels. Information asymmetry is proto-hierarchy.
→ [Supplementary: Governance]

**123. What is domain separation?**
No one holds multiple power-adjacent roles. The negotiator can't also be arbiter can't also be resource controller.
→ [Supplementary: Governance]

**124. What is onboarding filter?**
Screen for hierarchy-trained dominance patterns before full membership. Not everyone belongs in every tribe. Some people will exploit any system.
→ [Supplementary: Governance]

**125. What is viable exit?**
Unlike EEA, leaving doesn't mean death. This strengthens bargaining against dominators. You can leave. They know you can leave.
→ [Supplementary: Governance]

**126. What's the difference between a tribe and a cult?**
Cult: charismatic leader, information control, isolation from outside, punishment for leaving. Tribe: distributed authority, transparency, embedded in society, freedom to leave, no one profits from your membership.
→ [Supplementary: Objections]

**127. What went wrong with Auroville?**
Scale without Dunbar layers. Tried to operate flat at 3,000+ people. Governance broke down. Lesson: band-scale (50-150) as operating unit even in larger networks.
→ [Supplementary: Governance Case Studies]

---

## TECHNOLOGY

**128. What is pharmakon?**
Greek: both poison and cure. Technology's dual nature. Same tools creating mismatch can serve demismatching-if designed differently.
→ [Part IX: The Destination]

**129. What is a decay function?**
Technology that degrades without physical presence. Features lock without in-person time. Success measured by decreasing use. Opposite of engagement optimization.
→ [Supplementary: Technology]

**130. What is tribe formation AI?**
Matching based on nervous system regulation, conflict styles, values. Modern village matchmaker. Discovery tool, not relationship substitute. Finds candidates; humans bond.
→ [Supplementary: Technology]

**131. Why won't venture capital fund demismatch tech?**
Decay functions are churn engines. VCs need engagement growth. Demismatch tech requires different economics: open source, non-profit, mission-driven, one-time purchase.
→ [Part IX: The Destination]

**132. Can current technology demismatch?**
Yes. Video calls with actual tribe. Coordination tools for real groups. AI as capability extension. Question: does it serve your 150 or substitute parasocial engagement with strangers?
→ [Supplementary: Technology]

---

## TRANSITION

**133. What is the double shift?**
Transition exhaustion. Maintaining wage labor while building tribal structure. 8 hours capitalist work + 2-3 hours tribal maintenance. Primary failure mode.
→ [Supplementary: Transition]

**134. What is the great filter?**
Transition period where most tribe formation attempts fail. Double shift burnout, resource constraints, instability, conflicts unresolved.
→ [Supplementary: Transition]

**135. Who can attempt this first?**
People with resources: schedule flexibility, savings buffer, existing relationships, lower cost-of-living. Remote workers. Freelancers. First adopters create maps others follow.
→ [Supplementary: Transition]

**136. What is constructive scarcity?**
Challenges requiring effort, cooperation, skill-creating conditions for meaning. Time limits, skill mastery, coordination problems. Remains even with material abundance. The tribe still needs to raise children, resolve conflicts, create together.
→ [Part IX: The Destination]

**137. What is toxic scarcity?**
Material deprivation creating desperation. Food/shelter insecurity. Breaks cooperation. Eliminated by automation/UBI. Good riddance.
→ [Part IX: The Destination]

**138. Why isn't UBI the answer?**
Solves resource distribution, not meaning. Money without role, tribe, purpose. "UBI + atomized individual = Netflix until death, punctuated by antidepressants."
→ [Part IX: The Destination]

**139. What does automation change?**
Eliminating human roles in production. The proxy purpose that work provides is disappearing. Makes framework more urgent-rebuild meaning through tribe, not through jobs that won't exist.
→ [Part IX: The Destination]

**140. What if my tribe attempt fails?**
Fission-fusion is normal. Even temporary tribes valuable-years of genuine tribal experience, skills developed, relationships that persist. Permanence isn't the only success metric.
→ [Supplementary: Fission-Fusion]

---

## EVIDENCE

**141. What do WHO studies show?**
Better schizophrenia outcomes in developing countries with less medication and more social support. That's not coincidence. That's the mechanism.
→ [Supplementary: Research]

**142. What do hunter-gatherer studies show?**
Chronic psychiatric conditions rare or absent in genuinely matched populations. "Schizophrenia is rare or nonexistent in hunter-gatherer populations." Limited data, but directionally clear.
→ [Supplementary: Research]

**143. What do environmental interventions show?**
Nature exposure, co-living reduce symptoms independent of medication. Environment is the variable.
→ [Supplementary: Research]

**144. What do intentional communities show?**
Twin Oaks (58 years), East Wind (51 years), kibbutzim-long-term stability possible with proper governance. Communities arrived at similar solutions independently. Convergent evidence.
→ [Supplementary: Governance Case Studies]

**145. What is Twin Oaks?**
Intentional community since 1967. ~100 adults. Labor credits for visible contribution. Role rotation. Transparency. High life satisfaction in internal surveys.
→ [Supplementary: Governance Case Studies]

**146. What is East Wind?**
Intentional community since 1974. ~70 members. Nut butter business. Rotating coordinators. Full financial transparency. Anecdotal reports: reduced anxiety from belonging.
→ [Supplementary: Governance Case Studies]

---

## PRACTICAL: SO NOW WHAT?

**147. What's step one?**
Reduce mismatch load. Audit parasocial relationships. Reduce open loops. Circadian basics: wake with light, reduce evening screens. Move your body-not for fitness, for the neurochemistry your brain expects.
→ [Part IX: The Destination]

**148. What's step two?**
Deepen, not broaden. Stop meeting new people temporarily. Invest in existing relationships. Identify your actual 5. Regular, repeated, low-stakes contact with the same people.
→ [Supplementary: Transition]

**149. What's step three?**
Reduce proxy dependence. Notice which proxies you're using. Ask what they're substituting for. Time-box their use while building real alternatives.
→ [Supplementary: Transition]

**150. What's step four?**
Build. One dinner. One finished project. One person who sees your contribution. Understanding alone changes nothing.
→ [Part IX: The Destination]

**151. What if I can't build tribe right now?**
Reduce mismatch load first. Circadian alignment, nature exposure, reduced stranger interaction-these help even alone. Build capacity. Move from 90% mismatched to 70%. Still mismatched, but better positioned.
→ [Supplementary: Transition]

**152. What's minimum viable demismatch?**
Identify your 5 (or start building toward it). One regular shared meal per week. One loop closed daily. One proxy replaced with real alternative. Morning light. Movement.
→ [Part IX: The Destination]

**153. How long does this take?**
Years, not weeks. Graduated implementation: reduce load → deepen relationships → build toward 50 → establish structure → physical consolidation. The double shift makes it slow.
→ [Supplementary: Transition]

**154. What's the trap?**
Reading about mismatch while sitting alone, scrolling, under artificial light. Understanding is not progress. Close this tab. Go outside. Find your people. Build something.
→ [Part IX: The Destination]

---

## OBJECTIONS

**155. "I'm an introvert."**
Introversion = how you recover energy, not what you need. You need tribe with quieter role. EEA had roles for every temperament. Not isolation-predictable, low-demand belonging.
→ [Supplementary: Objections]

**156. "Different people need different things."**
Surface variation exists. Deep structure universal. No human thrives isolated, purposeless, surrounded by strangers, with permanent open loops. Vary the implementation, not the fundamentals.
→ [Supplementary: Objections]

**157. "You're romanticizing the past."**
27% infant mortality. 48% child death. Demismatch doesn't claim past was better-claims social environment matched the hardware. You can have modern medicine AND social structures that work.
→ [Supplementary: Objections]

**158. "This sounds like a cult."**
Cults: charismatic leader, isolation, information control, punishment for leaving. Demismatch: distributed authority, transparency, embedded in society, freedom to exit. The structure prevents cult dynamics.
→ [Supplementary: Objections]

**159. "Society can't reorganize."**
Society doesn't need to. You need to build tribe within existing society. The tribe is a social layer, not replacement for civilization. You still have job, government, economy.
→ [Supplementary: Objections]

**160. "Only privileged people can do this."**
Partly true. First tribes will come from those who can experiment. Question is whether success builds infrastructure lowering barriers for others. Someone has to go first.
→ [Supplementary: Objections]

**161. "What about people who genuinely can't form relationships?"**
Some genuine neurological differences exist. Demismatch claims most suffering is environmental, not neurological. For genuine difference: modified structures, different roles, augmented communication. Goal remains same.
→ [Supplementary: Objections]

**162. "Isn't this just 'touch grass' with extra steps?"**
Yes and no. Touch grass captures something real. Demismatch explains why it helps (circadian, movement, reduced strangers) and what else is needed (tribe, purpose, closed loops). Touch grass is necessary but insufficient.
→ [Supplementary: Objections]

---

*The framework is open. Fork it, improve it, implement it. No one owns truth about human nature.*`;

function FAQAccordionItem({ item, isOpen, onMouseEnter, onMouseLeave }: { 
  item: FAQItem; 
  isOpen: boolean; 
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div 
      className="border-b border-[#E5E0D8]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full text-left py-2 flex items-center justify-between gap-3 hover:bg-[#FAF9F6] transition-colors group cursor-pointer">
        <h3
          className="text-lg font-semibold text-[#1A1A1A] flex-1 leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {item.questionNum && (
            <span className="text-[#C75B39]">{item.questionNum}.</span>
          )}{' '}
          {item.questionText}
        </h3>
        <svg
          className={`w-5 h-5 text-[#6b6b6b] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && (
        <div className="pb-4 pl-0 pr-0">
          <div className="text-[#4A4A4A]">
            {item.answer}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const { sections, footer } = parseFAQContent(FAQ_CONTENT);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleMouseEnter = (id: string) => {
    setExpandedItems(prev => new Set(prev).add(id));
  };

  const handleMouseLeave = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

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
            No fluff. Real answers. Links to learn more.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          {sections.map((section, sectionIdx) => (
            <div key={section.title}>
              <h2
                className="text-3xl font-bold text-[#1A1A1A] mt-16 mb-8 pt-8 border-t border-[#E5E0D8] first:mt-0 first:pt-0 first:border-t-0"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {section.title}
              </h2>
              {section.items.map((item) => (
                <FAQAccordionItem
                  key={item.id}
                  item={item}
                  isOpen={expandedItems.has(item.id)}
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={() => handleMouseLeave(item.id)}
                />
              ))}
            </div>
          ))}
          {footer && (
            <p className="text-[#6b6b6b] italic mt-12 text-center">
              {footer}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
