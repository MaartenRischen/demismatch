// Shared FAQ content and utilities
// Used by both the FAQ page and homepage expandable tiles

// Map FAQ references to framework anchors
export function getFrameworkLink(text: string): string {
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

    // Supplementary materials
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

// Raw FAQ content - question number to answer mapping
// This allows direct lookup without parsing the full content each time
export interface FAQAnswer {
  questionNum: string;
  questionText: string;
  answerParagraphs: string[];
}

// Pre-parsed FAQ answers for efficient lookup
export const FAQ_ANSWERS: Record<string, FAQAnswer> = {
  "intro": {
    questionNum: "",
    questionText: "First, about AI: Is this made by AI?",
    answerParagraphs: [
      "Yes. Good thing too.",
      "Behind this is one human (Peter-someone who spent more than a decade connecting dots across evolutionary psychology, anthropology, neuroscience and technology, and realized they all point to the same thing that no one's saying clearly) and one AI (Claude). We've been collaborating for months.",
      "He could write this himself. He started with 50+ pages of dense, original framework. It's still out there somewhere.",
      "But here's the thing: you don't want that version. The human-only version would be filtered through one person's reading list, one person's blind spots, one person's emotional history with the material. It would overemphasize what resonates with him personally and underemphasize what doesn't. It would miss connections he doesn't know exist. It would dismiss objections he finds annoying instead of steelmanning them. It would have the parts he finds exciting and skip the parts he finds tedious.",
      "AI collaboration produces something closer to the truth. Cross-referencing across fields he hasn't read. Catching inconsistencies he's blind to. No emotional attachment to pet ideas. No personal trauma shaping what gets emphasized. Able to hold the whole framework in context and spot gaps.",
      "Not just faster. Less wrong.",
      "This is what \"augment\" actually means. Not AI as labor-saving device. AI as bias-reduction mechanism. Human conviction plus AI objectivity, producing something more accurate than either alone.",
      "The ideas are either true or they aren't. How they got here matters less than whether they hold up."
    ]
  },
  "1": {
    questionNum: "1",
    questionText: "What is this website?",
    answerParagraphs: ["A framework explaining why modern humans suffer and what conditions would let them thrive. Not therapy. Not self-help. A spec sheet for human nature."]
  },
  "2": {
    questionNum: "2",
    questionText: "What are you trying to do?",
    answerParagraphs: ["Change how people understand suffering. It's not you. It's the environment. Once you see it, you can't unsee it-and you can start building differently."]
  },
  "3": {
    questionNum: "3",
    questionText: "Why should I care?",
    answerParagraphs: ["Because you're probably suffering and blaming yourself. Because the \"solutions\" you've tried haven't worked. Because understanding the actual problem is the first step to fixing it."]
  },
  "4": {
    questionNum: "4",
    questionText: "Who is this for?",
    answerParagraphs: ["Anyone who feels something is deeply wrong but can't name it. Also: therapists tired of prescribing band-aids, technologists who want to build things that help, researchers looking for a unifying framework, parents watching their kids struggle."]
  },
  "5": {
    questionNum: "5",
    questionText: "Is this anti-psychiatry?",
    answerParagraphs: ["It's anti-misdiagnosis. Psychiatric conditions are real behavioral patterns. They're just not diseases-they're accurate responses to environmental mismatch. Different diagnosis, different solutions."]
  },
  "6": {
    questionNum: "6",
    questionText: "Is this anti-technology?",
    answerParagraphs: ["No. Technology is pharmakon-both poison and cure. The same tools creating mismatch can serve demismatching. Depends on design."]
  },
  "7": {
    questionNum: "7",
    questionText: "What do you want me to do after reading this?",
    answerParagraphs: ["Stop blaming yourself. Understand the pattern. Then build: your own tribe, your own closure, your own visible contribution. Understanding alone changes nothing."]
  },
  "8": {
    questionNum: "8",
    questionText: "Why is this free?",
    answerParagraphs: ["No one owns truth about human nature. The framework is open source. Fork it, improve it, implement it."]
  },
  "9": {
    questionNum: "9",
    questionText: "What's with all the images?",
    answerParagraphs: ["2,500+ visuals in the library. Demismatch is dense. Images make it visceral. Use them for presentations, conversations, your own understanding."]
  },
  "10": {
    questionNum: "10",
    questionText: "How do I know this isn't just another self-help thing?",
    answerParagraphs: ["Self-help sells individual solutions to systemic problems. That's why it doesn't work-and why you keep buying more. This framework says: the problem is environmental, the solution is collective, and anyone selling you personal optimization is part of the problem."]
  },
  "11": {
    questionNum: "11",
    questionText: "What is evolutionary mismatch?",
    answerParagraphs: ["Your brain was built for conditions that no longer exist. 300,000 years of consistent environment, then everything changed. The hardware works perfectly. The environment doesn't match.", "→ [Part I: The Pattern]"]
  },
  "12": {
    questionNum: "12",
    questionText: "What is the EEA?",
    answerParagraphs: ["Environment of Evolutionary Adaptedness. The conditions humans evolved in: small bands, known faces, daily closure, visible contribution, physical life. The spec sheet for human thriving.", "→ [Part III: The Spec Sheet]"]
  },
  "13": {
    questionNum: "13",
    questionText: "Why do I feel so bad?",
    answerParagraphs: ["You're a fish on land. Your suffering isn't malfunction-it's accurate biological response to an environment that violates every condition your species requires.", "→ [Part I: The Pattern]"]
  },
  "14": {
    questionNum: "14",
    questionText: "What's \"fish on land\"?",
    answerParagraphs: ["The core metaphor. Fish out of water flops around gasping. You don't diagnose \"Flopping Disorder\" and prescribe medication. You put it back in water.", "→ [Part I: The Pattern]"]
  },
  "15": {
    questionNum: "15",
    questionText: "What's \"flopping disorder\"?",
    answerParagraphs: ["Satirical term for what we do to humans. Pathologize the flopping instead of fixing the environment.", "→ [Part VII: The Misdiagnosis]"]
  },
  "16": {
    questionNum: "16",
    questionText: "Is this just \"we weren't meant to live like this\"?",
    answerParagraphs: ["Yes, but with 300,000 years of evidence and a specific spec sheet. Not nostalgia. Biology.", "→ [Part III: The Spec Sheet]"]
  },
  "17": {
    questionNum: "17",
    questionText: "What's the core claim?",
    answerParagraphs: ["Most suffering labeled \"mental illness\" is accurate signal, not broken brain. Fix the environment, not the person.", "→ [Part VII: The Misdiagnosis]"]
  },
  "18": {
    questionNum: "18",
    questionText: "What are the stakes?",
    answerParagraphs: ["People die from this. Zoraya ter Beek, 29, was euthanized in the Netherlands after psychiatrists said \"nothing more we can do.\" Without ever trying environmental intervention. She's not alone.", "→ [Part V: The Exploitation]"]
  },
  "19": {
    questionNum: "19",
    questionText: "What are emotions?",
    answerParagraphs: ["Biological GPS. They tell you whether current conditions increase or decrease your survival and reproduction odds. Information, not malfunction.", "→ [Part II: The Machine]"]
  },
  "20": {
    questionNum: "20",
    questionText: "What is anxiety actually?",
    answerParagraphs: ["Accurate threat detection. You're surrounded by strangers, unpredictability, uncontrollable stressors. The alarm is working. The environment is actually threatening.", "→ [Part VII: The Misdiagnosis]"]
  },
  "21": {
    questionNum: "21",
    questionText: "What is depression actually?",
    answerParagraphs: ["Accurate meaning assessment. Your life lacks visible purpose, tribe, closure. The signal is correct. The meaning is actually missing.", "→ [Part VII: The Misdiagnosis]"]
  },
  "22": {
    questionNum: "22",
    questionText: "What is loneliness actually?",
    answerParagraphs: ["Accurate isolation alarm. You're surrounded by acquaintances but have no tribe. The alarm is working. You are actually isolated.", "→ [Part VII: The Misdiagnosis]"]
  },
  "23": {
    questionNum: "23",
    questionText: "What is addiction actually?",
    answerParagraphs: ["Drive-seeking redirected to proxies. Real satisfactions are blocked, so you reach for substitutes. The drives work correctly. The pathways are blocked.", "→ [Part IV: The Violations]"]
  },
  "24": {
    questionNum: "24",
    questionText: "What is ADHD actually?",
    answerParagraphs: ["Hunter cognition in a farmer world. Scanning attention, movement-seeking, novelty-responsive-adaptive in EEA, pathologized in classrooms.", "→ [Part VII: The Misdiagnosis]"]
  },
  "25": {
    questionNum: "25",
    questionText: "What is social anxiety actually?",
    answerParagraphs: ["Fear of imagined rejection from an internal audience that doesn't exist. Phantom critics, not real feedback.", "→ [Part VI: The Cascades]"]
  },
  "26": {
    questionNum: "26",
    questionText: "What is burnout?",
    answerParagraphs: ["Result of work/purpose mismatch. Your meaning-making systems cannot connect abstract labor to survival benefit. Not laziness. Accurate assessment of futility.", "→ [Part IV: The Violations]"]
  },
  "27": {
    questionNum: "27",
    questionText: "What is imposter syndrome?",
    answerParagraphs: ["Feeling like a fraud despite evidence of competence. Often: accurate recognition that your work doesn't visibly benefit anyone you know.", "→ [Part IV: The Violations]"]
  },
  "28": {
    questionNum: "28",
    questionText: "So my feelings aren't the problem?",
    answerParagraphs: ["Correct. They're data. The problem is the environment generating them.", "→ [Part I: The Pattern]"]
  },
  "29": {
    questionNum: "29",
    questionText: "What's the difference between signal and symptom?",
    answerParagraphs: ["Signal = information requiring action. Symptom = malfunction requiring suppression. Psychiatry treats signals as symptoms.", "→ [Part VII: The Misdiagnosis]"]
  },
  "30": {
    questionNum: "30",
    questionText: "What's the oil light metaphor?",
    answerParagraphs: ["Medication is like covering the oil light instead of checking the engine. Signal suppressed, underlying problem unchanged.", "→ [Part VII: The Misdiagnosis]"]
  },
  "31": {
    questionNum: "31",
    questionText: "What drives all human behavior?",
    answerParagraphs: ["Survive and reproduce. Everything traces back to these two, directly or indirectly. No exceptions.", "→ [Part II: The Machine]"]
  },
  "32": {
    questionNum: "32",
    questionText: "What is direct fitness?",
    answerParagraphs: ["Survival and reproduction mechanisms that run automatically. Hunger, fear, sexual desire.", "→ [Part II: The Machine]"]
  },
  "33": {
    questionNum: "33",
    questionText: "What is indirect fitness?",
    answerParagraphs: ["Survival and reproduction through social mechanisms. Cooperation, reputation, coalition-building, status.", "→ [Part II: The Machine]"]
  },
  "34": {
    questionNum: "34",
    questionText: "Why do I care so much about status?",
    answerParagraphs: ["High-status individuals get better mates, more resources, more support. Status drive is evolved strategy, not vanity.", "→ [Part II: The Machine]"]
  },
  "35": {
    questionNum: "35",
    questionText: "What is reciprocal altruism?",
    answerParagraphs: ["Helping others with expectation of future help. Created cooperation beyond kinship. Why you feel good helping friends.", "→ [Part II: The Machine]"]
  },
  "36": {
    questionNum: "36",
    questionText: "What's the difference between wants and needs?",
    answerParagraphs: ["Wants: worldwide fame, million dollars, perfect Instagram life. Needs: recognition by small tribe, resource security in sharing network, connection with flawed humans. Chasing wants while needs go unmet = permanent dissatisfaction.", "→ [Part IV: The Violations]"]
  },
  "37": {
    questionNum: "37",
    questionText: "What are Dunbar's numbers?",
    answerParagraphs: ["Hard cognitive limits on relationships: 5 intimate → 15 close → 50 friends → 150 meaningful. Beyond 150, people become categories.", "→ [Part II: The Machine]"]
  },
  "38": {
    questionNum: "38",
    questionText: "Why are these limits hard?",
    answerParagraphs: ["Neocortex size correlates with social group size across all primates. Information processing prevents tracking more. Time makes maintaining more impossible. It's architecture, not culture.", "→ [Part II: The Machine]"]
  },
  "39": {
    questionNum: "39",
    questionText: "What is \"the 5\"?",
    answerParagraphs: ["People you'd call at 3 AM. Complete vulnerability. Almost daily contact. If you don't have 5, that's the problem.", "→ [Part II: The Machine]"]
  },
  "40": {
    questionNum: "40",
    questionText: "What is \"the 15\"?",
    answerParagraphs: ["People whose deaths would devastate you. Active tracking and care. You know their current struggles.", "→ [Part II: The Machine]"]
  },
  "41": {
    questionNum: "41",
    questionText: "What is \"the 50\" (band)?",
    answerParagraphs: ["Meaningful relationships with shared history. This is daily life in the EEA. 5-8 families in constant interaction.", "→ [Part III: The Spec Sheet]"]
  },
  "42": {
    questionNum: "42",
    questionText: "What is \"the 150\" (tribe)?",
    answerParagraphs: ["Maximum for stable social relationships. Everyone you can actually know as individual. Beyond this: strangers.", "→ [Part II: The Machine]"]
  },
  "43": {
    questionNum: "43",
    questionText: "What is the metapopulation?",
    answerParagraphs: ["500-1500 people across multiple tribes. Connected through marriage, kinship, trade. Genetic diversity. Resilience layer.", "→ [Part III: The Spec Sheet]"]
  },
  "44": {
    questionNum: "44",
    questionText: "Can technology extend Dunbar's number?",
    answerParagraphs: ["No. You can extend weak ties. You cannot extend strong ties. The limit is biological.", "→ [Supplementary: Research Directions]"]
  },
  "45": {
    questionNum: "45",
    questionText: "I have 2,000 followers. Why am I lonely?",
    answerParagraphs: ["Followers aren't tribe. Recognition isn't relationship. Parasocial bonds occupy slots meant for real people.", "→ [Part V: The Exploitation]"]
  },
  "46": {
    questionNum: "46",
    questionText: "Do I perceive reality accurately?",
    answerParagraphs: ["No. You perceive a dashboard. Evolution optimized for survival, not accuracy. You see what you need to see to stay alive.", "→ [Part II: The Machine]"]
  },
  "47": {
    questionNum: "47",
    questionText: "What are fitness payoffs?",
    answerParagraphs: ["What guides perception. Evolution selected for perceiving what matters for survival/reproduction, not what's objectively true.", "→ [Part II: The Machine]"]
  },
  "48": {
    questionNum: "48",
    questionText: "Why does this matter?",
    answerParagraphs: ["Your dashboard was calibrated for EEA. Now it runs in unrecognizable terrain. The shortcuts misfire constantly.", "→ [Part II: The Machine]"]
  },
  "49": {
    questionNum: "49",
    questionText: "What is stranger overload?",
    answerParagraphs: ["You encounter more strangers daily than ancestors met in years. Your brain can't stop assessing. You're exhausted.", "→ [Part IV: The Violations]"]
  },
  "50": {
    questionNum: "50",
    questionText: "How many strangers did ancestors encounter?",
    answerParagraphs: ["Zero daily. Maybe 1,000 total in a lifetime. Every face was known. Every interaction with someone whose entire history you knew.", "→ [Part III: The Spec Sheet]"]
  },
  "51": {
    questionNum: "51",
    questionText: "Why does modern work feel meaningless?",
    answerParagraphs: ["3-4 hours ancestral work with visible results → 8-12 hours abstract labor for invisible shareholders. Meaning-making systems can't connect.", "→ [Part IV: The Violations]"]
  },
  "52": {
    questionNum: "52",
    questionText: "What are bullshit jobs?",
    answerParagraphs: ["Jobs existing only to perpetuate themselves. Produce nothing tangible. Benefit no one you know. Result of work/purpose mismatch at civilizational scale.", "→ [Part IV: The Violations]"]
  },
  "53": {
    questionNum: "53",
    questionText: "What is status competition mismatch?",
    answerParagraphs: ["You evolved to compete among 150 for achievable excellence. Now you're compared against 8 billion. Chronic inadequacy even in the successful.", "→ [Part IV: The Violations]"]
  },
  "54": {
    questionNum: "54",
    questionText: "Why do I feel like I'm failing even when I'm \"successful\"?",
    answerParagraphs: ["You got what you thought you wanted but not what you needed. Salt water for thirst.", "→ [Part IV: The Violations]"]
  },
  "55": {
    questionNum: "55",
    questionText: "What's \"salt water for thirst\"?",
    answerParagraphs: ["The proxy trap. Momentary relief, increasing need. The more you drink, the thirstier you get.", "→ [Part VI: The Cascades]"]
  },
  "56": {
    questionNum: "56",
    questionText: "Why are mass shootings a modern phenomenon?",
    answerParagraphs: ["Killing strangers you've never met would be inconceivable in EEA. Everyone was known. The concept wouldn't parse.", "→ [Part IV: The Violations]"]
  },
  "57": {
    questionNum: "57",
    questionText: "What is the internal audience?",
    answerParagraphs: ["Imaginary critics in your mind generating real biological responses. Phantom tribe judging by impossible standards. They don't exist.", "→ [Part VI: The Cascades]"]
  },
  "58": {
    questionNum: "58",
    questionText: "Why do I care what strangers think?",
    answerParagraphs: ["You evolved to be watched by 150 known people. Now the simulation runs on phantoms. You're performing for an audience that doesn't exist.", "→ [Part VI: The Cascades]"]
  },
  "59": {
    questionNum: "59",
    questionText: "What is negativity bias?",
    answerParagraphs: ["Evolution made assuming danger safer than assuming safety. Now applies to social evaluation-you assume rejection, criticism, mockery by default.", "→ [Part VI: The Cascades]"]
  },
  "60": {
    questionNum: "60",
    questionText: "What is the perfectionism trap?",
    answerParagraphs: ["Internal audience demands impossible, contradictory standards. Be attractive but not vain. Successful but not arrogant. You can never satisfy mutually exclusive demands.", "→ [Part VI: The Cascades]"]
  },
  "61": {
    questionNum: "61",
    questionText: "What is an open loop?",
    answerParagraphs: ["Problem that cannot be resolved through action. Chronic emotion without resolution. Modern life is an open loop factory.", "→ [Part VI: The Cascades]"]
  },
  "62": {
    questionNum: "62",
    questionText: "What is a closed loop?",
    answerParagraphs: ["Problem resolved through action. Hunt → eat → done. Conflict → resolution → done. Emotion dissipates because situation resolved.", "→ [Part VI: The Cascades]"]
  },
  "63": {
    questionNum: "63",
    questionText: "What is infinite scroll?",
    answerParagraphs: ["Deliberate open loop design. No end state. No completion. Your brain keeps seeking closure that will never come. The engagement is the product.", "→ [Part VI: The Cascades]"]
  },
  "64": {
    questionNum: "64",
    questionText: "Why can't I stop ruminating?",
    answerParagraphs: ["Rumination evolved to plan solutions. Now it has nothing to work with-unchangeable past, uncontrollable future. The mechanism works. The problems don't resolve.", "→ [Part VI: The Cascades]"]
  },
  "65": {
    questionNum: "65",
    questionText: "What is partial control?",
    answerParagraphs: ["Worst anxiety zone. Can neither fully act nor fully accept. Most modern situations. The loops never close.", "→ [Part VI: The Cascades]"]
  },
  "66": {
    questionNum: "66",
    questionText: "What is a proxy?",
    answerParagraphs: ["Substitute that hijacks biological drive without satisfying need. Momentary relief, increasing need. Salt water for thirst.", "→ [Part VI: The Cascades]"]
  },
  "67": {
    questionNum: "67",
    questionText: "Why don't proxies work?",
    answerParagraphs: ["They address symptoms not causes. Create tolerance requiring escalation. Prevent seeking real solutions. Generate profit from perpetual need.", "→ [Part VI: The Cascades]"]
  },
  "68": {
    questionNum: "68",
    questionText: "What is variable ratio reinforcement?",
    answerParagraphs: ["Most addictive schedule known to psychology. Unpredictable rewards for consistent behavior. Slot machines. Social media feeds. Pull-to-refresh is a slot machine lever.", "→ [Part V: The Exploitation]"]
  },
  "69": {
    questionNum: "69",
    questionText: "What is dopamine and how is it hijacked?",
    answerParagraphs: ["Neurotransmitter driving reward-seeking. Evolved for intermittent natural rewards. Now hijacked by supernormal stimuli delivering constant hits. Tolerance builds. Baseline drops.", "→ [Part V: The Exploitation]"]
  },
  "70": {
    questionNum: "70",
    questionText: "What are parasocial relationships?",
    answerParagraphs: ["One-way emotional bonds with people who don't know you exist. Every influencer you follow takes a slot from your 150. They can't reciprocate. They extract without obligation.", "→ [Part V: The Exploitation]"]
  },
  "71": {
    questionNum: "71",
    questionText: "What are hyperstimuli/supernormal stimuli?",
    answerParagraphs: ["Stimuli exceeding anything in nature. Porn. Hyperpalatable food. Engineered to overwhelm evolved systems. Real satisfactions become inadequate by comparison.", "→ [Part IV: The Violations]"]
  },
  "72": {
    questionNum: "72",
    questionText: "Is art a proxy?",
    answerParagraphs: ["No. Art continues fire circle function: processing experience, collective sense-making, truth-telling. Test: does it leave you emptier and needing more, or does it connect and illuminate?", "→ [Part VI: The Cascades]"]
  },
  "73": {
    questionNum: "73",
    questionText: "Why is my suffering profitable?",
    answerParagraphs: ["A fully satisfied human is a terrible customer. Every unmet need is a market. The exploitation economy requires your mismatch.", "→ [Part V: The Exploitation]"]
  },
  "74": {
    questionNum: "74",
    questionText: "What is the exploitation formula?",
    answerParagraphs: ["1) Take real need. 2) Block genuine satisfaction. 3) Offer proxy. 4) Proxy doesn't satisfy (by design). 5) Monetize return visits. 6) Reinvest in addiction.", "→ [Part V: The Exploitation]"]
  },
  "75": {
    questionNum: "75",
    questionText: "What is the atomized individual?",
    answerParagraphs: ["Ideal consumer. Lacks community, purpose, intimacy, tribe. Vulnerable to manipulation because no one checks the message, provides counter-narrative, meets the need for real.", "→ [Part V: The Exploitation]"]
  },
  "76": {
    questionNum: "76",
    questionText: "How does social media exploit me?",
    answerParagraphs: ["Profits from loneliness. Variable ratio reinforcement. Parasocial bonds. Engagement metrics, not wellbeing metrics. Your attention is the product sold to advertisers.", "→ [Part V: The Exploitation]"]
  },
  "77": {
    questionNum: "77",
    questionText: "How does pharma exploit me?",
    answerParagraphs: ["Invented \"chemical imbalance\" to sell chemicals. Signal override without addressing cause. Ghostwritten studies. Paid key opinion leaders. Tolerance develops. Environment unchanged.", "→ [Part V: The Exploitation]"]
  },
  "78": {
    questionNum: "78",
    questionText: "What is the serotonin hypothesis?",
    answerParagraphs: ["Debunked narrative that depression is serotonin deficiency. SSRIs don't correct deficiency-they flood the system. Same mechanism as cocaine flooding dopamine.", "→ [Part VII: The Misdiagnosis]"]
  },
  "79": {
    questionNum: "79",
    questionText: "What are ghostwritten studies?",
    answerParagraphs: ["Pharma pays for research, writes the conclusions, puts academic names on it. Documented practice. The \"science\" is marketing.", "→ [Part V: The Exploitation]"]
  },
  "80": {
    questionNum: "80",
    questionText: "How does the food industry exploit me?",
    answerParagraphs: ["Engineers hyperpalatability. Bliss point optimization-precise combination of sugar, fat, salt for maximum craving without satisfaction. Foods designed to be impossible to eat in moderation. Addiction is the feature.", "→ [Part V: The Exploitation]"]
  },
  "81": {
    questionNum: "81",
    questionText: "How do dating apps exploit me?",
    answerParagraphs: ["Business model requires failure. Successful match = lost user. Infinite choice prevents depth. Loneliest users are most valuable. Designed for engagement, not outcomes.", "→ [Part V: The Exploitation]"]
  },
  "82": {
    questionNum: "82",
    questionText: "How does porn exploit me?",
    answerParagraphs: ["Supernormal stimuli hijacking mating drive. Unlimited novelty impossible in nature. Real partners become inadequate. Pair bonding destroyed. Erectile dysfunction epidemic in young men.", "→ [Part V: The Exploitation]"]
  },
  "83": {
    questionNum: "83",
    questionText: "How does news media exploit me?",
    answerParagraphs: ["Profits from threat activation. \"If it bleeds, it leads.\" Open loops that never close. Anxiety about events you can't influence. Your stress hormones-cortisol-elevated for profit.", "→ [Part V: The Exploitation]"]
  },
  "84": {
    questionNum: "84",
    questionText: "What is cortisol?",
    answerParagraphs: ["Stress hormone. Supposed to spike briefly for real threats. News media keeps it chronically elevated for engagement. You pay with your health.", "→ [Part V: The Exploitation]"]
  },
  "85": {
    questionNum: "85",
    questionText: "How does self-help exploit me?",
    answerParagraphs: ["Requires that self-help doesn't work. Individual solutions to systemic problems. Repeat customers essential. The failure is the business model.", "→ [Part V: The Exploitation]"]
  },
  "86": {
    questionNum: "86",
    questionText: "How does gambling exploit me?",
    answerParagraphs: ["Variable ratio reinforcement perfected, then exported everywhere. Loot boxes. Gacha. Engagement loops. \"Whales\"-vulnerable users accounting for most revenue-specifically targeted.", "→ [Part V: The Exploitation]"]
  },
  "87": {
    questionNum: "87",
    questionText: "What are whales?",
    answerParagraphs: ["Gambling industry term. Vulnerable users who account for disproportionate revenue. Now applies across exploitation economy. Your vulnerability is their profit center.", "→ [Part V: The Exploitation]"]
  },
  "88": {
    questionNum: "88",
    questionText: "How does advertising exploit me?",
    answerParagraphs: ["$700B+ annually weaponizing evolutionary psychology. Manufacturing inadequacy. Making you feel bad about yourself so you'll buy products to feel better. The inadequacy is created, not discovered.", "→ [Part V: The Exploitation]"]
  },
  "89": {
    questionNum: "89",
    questionText: "Why isn't this common knowledge?",
    answerParagraphs: ["The suppression. Not conspiracy-incentives. Funding goes to drug development, not environmental intervention. Media covers new treatments, not systemic critique. Truth isn't profitable. Profitable isn't true.", "→ [Part V: The Exploitation]"]
  },
  "90": {
    questionNum: "90",
    questionText: "What is the celebrity phenomenon?",
    answerParagraphs: ["Fame as hyperstimulus for status recognition. You form bonds with people who don't know you exist. They extract emotional investment without reciprocity. Every celebrity you track takes bandwidth from real relationships.", "→ [Part IV: The Violations]"]
  },
  "91": {
    questionNum: "91",
    questionText: "What is the soccer phenomenon?",
    answerParagraphs: ["Tribal belonging through sports fandom. You don't actually care about soccer. You're addicted to the feeling of belonging, shared goals, common enemies. Warfare by proxy. Almost satisfies the need. Almost.", "→ [Part IV: The Violations]"]
  },
  "92": {
    questionNum: "92",
    questionText: "Are psychiatric conditions real diseases?",
    answerParagraphs: ["No biomarkers. No blood tests. Behavioral descriptions, not disease entities. Psychiatry diagnoses by observation, not measurement.", "→ [Part VII: The Misdiagnosis]"]
  },
  "93": {
    questionNum: "93",
    questionText: "But these conditions are heritable?",
    answerParagraphs: ["So is height. Heritability doesn't make something a disease. What's inherited: tendency toward certain cognitive patterns that served different roles in EEA.", "→ [Part VII: The Misdiagnosis]"]
  },
  "94": {
    questionNum: "94",
    questionText: "What about brain differences?",
    answerParagraphs: ["Musicians have different brains. Taxi drivers have different brains. Difference is not pathology. We're comparing variation to one baseline (farmer brain) and calling deviation disease.", "→ [Part VII: The Misdiagnosis]"]
  },
  "95": {
    questionNum: "95",
    questionText: "What is \"farmer brain\"?",
    answerParagraphs: ["The compliant, sit-still-and-focus baseline we treat as normal. Hunter cognition deviates from it, gets pathologized as ADHD.", "→ [Part VII: The Misdiagnosis]"]
  },
  "96": {
    questionNum: "96",
    questionText: "What about neuroplasticity?",
    answerParagraphs: ["Chronic stress reshapes the brain. The \"differences\" observed might be consequences of mismatch, not pre-existing conditions. The mismatch itself causes the changes.", "→ [Part VII: The Misdiagnosis]"]
  },
  "97": {
    questionNum: "97",
    questionText: "What is signal override?",
    answerParagraphs: ["What medication does. Floods system to suppress signal without addressing what it's responding to. Oil light covered, engine still broken.", "→ [Part V: The Exploitation]"]
  },
  "98": {
    questionNum: "98",
    questionText: "What's wrong with therapy?",
    answerParagraphs: ["Nothing-if it's a bridge. Problem: therapy as proxy. $200/hour paid intimacy. Therapist as only person who \"really understands.\" Subscription service for belonging. Years without environmental change.", "→ [Part VI: The Cascades]"]
  },
  "99": {
    questionNum: "99",
    questionText: "What's a 15-minute medication check?",
    answerParagraphs: ["Psychiatrist visit. Enough time to adjust dosage. Not enough to understand context. Managing symptoms so you can keep functioning in the environment causing them.", "→ [Part V: The Exploitation]"]
  },
  "100": {
    questionNum: "100",
    questionText: "Is medication ever necessary?",
    answerParagraphs: ["Medication becomes \"necessary\" because we've destroyed social structures that would otherwise manage these states. Alternative: tribal containment. WHO studies show better outcomes with less medication, more social support.", "→ [Supplementary: Objections]"]
  },
  "101": {
    questionNum: "101",
    questionText: "What did Rat Park show?",
    answerParagraphs: ["Rats in enriched environments don't self-administer drugs. Isolated rats do. Environment is the variable. Addiction isn't the substance-it's the solution to isolation.", "→ [Part IV: The Violations]"]
  },
  "102": {
    questionNum: "102",
    questionText: "What is demismatch?",
    answerParagraphs: ["Return to baseline human thriving. Conscious alignment of environment with biology. Not returning to past-building forward.", "→ [Part IX: The Destination]"]
  },
  "103": {
    questionNum: "103",
    questionText: "What is augment?",
    answerParagraphs: ["Extend capability from healthy foundation. Technology built on thriving humans, not broken ones.", "→ [Part IX: The Destination]"]
  },
  "104": {
    questionNum: "104",
    questionText: "Why \"demismatch first, then augment\"?",
    answerParagraphs: ["Can't skip steps. Can't augment from broken. Fix the foundation first. Technology on broken humans creates broken outcomes.", "→ [Part IX: The Destination]"]
  },
  "105": {
    questionNum: "105",
    questionText: "What is \"the most human post-human\"?",
    answerParagraphs: ["The destination: humans with matched environments, enhanced by technology. Not replacement but extension.", "→ [Part IX: The Destination]"]
  },
  "106": {
    questionNum: "106",
    questionText: "What's the simple test?",
    answerParagraphs: ["Do you wake up with a role, in a group, with a goal? If yes, you've arrived. If no, you haven't.", "→ [Part IX: The Destination]"]
  },
  "107": {
    questionNum: "107",
    questionText: "What is the fire circle?",
    answerParagraphs: ["Nightly gathering of entire band. 2-4 hours. Processing, storytelling, conflict resolution, bonding. Every single night for 300,000 years. Your ancestors spent more time in relaxed communion each evening than you spend per month.", "→ [Part III: The Spec Sheet]"]
  },
  "108": {
    questionNum: "108",
    questionText: "What is alloparenting?",
    answerParagraphs: ["Child-rearing by 20+ adults, not 1-2 exhausted parents. Multiple attachment figures. Security not dependent on individuals not failing.", "→ [Part III: The Spec Sheet]"]
  },
  "109": {
    questionNum: "109",
    questionText: "What is mixed-age play?",
    answerParagraphs: ["Not age-segregated classrooms. Five-year-olds learning from ten-year-olds teaching fifteen-year-olds helping toddlers. Natural mentorship. Leadership and empathy development.", "→ [Part III: The Spec Sheet]"]
  },
  "110": {
    questionNum: "110",
    questionText: "What is apprenticeship?",
    answerParagraphs: ["Children learning through observation and gradual participation. A seven-year-old gathering herbs isn't playing-they're contributing. By teenage years: adult-level skills.", "→ [Part III: The Spec Sheet]"]
  },
  "111": {
    questionNum: "111",
    questionText: "What is demand sharing?",
    answerParagraphs: ["Economic pattern: those with surplus share when asked. Not charity-obligation and insurance. Share today, ask tomorrow. No accumulation possible. No starvation possible.", "→ [Part III: The Spec Sheet]"]
  },
  "112": {
    questionNum: "112",
    questionText: "What is immediate-return economy?",
    answerParagraphs: ["Resources consumed within hours/days of acquisition. No accumulation. Direct line between effort and benefit. Work → eat. No abstraction.", "→ [Part III: The Spec Sheet]"]
  },
  "113": {
    questionNum: "113",
    questionText: "How did EEA governance work?",
    answerParagraphs: ["No permanent leaders. Different experts for different domains. Best tracker led hunts. Best diplomat handled relations. Outside their expertise: just a person.", "→ [Part III: The Spec Sheet]"]
  },
  "114": {
    questionNum: "114",
    questionText: "What is egalitarian enforcement?",
    answerParagraphs: ["Any domination attempt triggered immediate coalition response. Successful hunter shared more, not less. Prestige came from generosity. Try to boss people around: watch the whole band turn against you.", "→ [Part III: The Spec Sheet]"]
  },
  "115": {
    questionNum: "115",
    questionText: "What is the conflict resolution cascade?",
    answerParagraphs: ["Humor → public discussion → ridicule → shunning → exile → violence (rare, usually ritualized). Most conflicts resolved early through laughter. Escalation only when necessary.", "→ [Part III: The Spec Sheet]"]
  },
  "116": {
    questionNum: "116",
    questionText: "What about circadian rhythm?",
    answerParagraphs: ["Wake at dawn (naturally, with light). Work through morning. Rest, socialize, nap afternoon. Fire circle at evening. Sleep with dark. Every day. No artificial light fragmenting it.", "→ [Part III: The Spec Sheet]"]
  },
  "117": {
    questionNum: "117",
    questionText: "What is birth spacing?",
    answerParagraphs: ["3-4 years between children via extended breastfeeding. Parents not overwhelmed. Grandmothers crucial. Fathers highly involved-among Aka, fathers hold infants 20%+ of daytime.", "→ [Part III: The Spec Sheet]"]
  },
  "118": {
    questionNum: "118",
    questionText: "What about physical contact for infants?",
    answerParagraphs: ["Constant. Babies rarely put down. Carried in slings all day. Passed person to person. Co-sleeping at night. No infant experienced prolonged distress-someone always responded immediately.", "→ [Part III: The Spec Sheet]"]
  },
  "119": {
    questionNum: "119",
    questionText: "What is fission-fusion?",
    answerParagraphs: ["Natural social dynamics. Groups split and reform. Bands divide when too large, merge after conflicts, members move between groups. Not failure-social metabolism.", "→ [Supplementary: Fission-Fusion]"]
  },
  "120": {
    questionNum: "120",
    questionText: "Why do modern tribes need explicit governance?",
    answerParagraphs: ["Humans entering tribes are hierarchy-damaged. Trained to climb, manipulate, defer. EEA mechanisms don't work automatically on people with corporate backgrounds.", "→ [Supplementary: Governance]"]
  },
  "121": {
    questionNum: "121",
    questionText: "What is rotation?",
    answerParagraphs: ["Any power-accumulating role rotates formally. External negotiator, conflict arbiter, resource controller-all rotate on schedule. Prevents consolidation.", "→ [Supplementary: Governance]"]
  },
  "122": {
    questionNum: "122",
    questionText: "What is transparency?",
    answerParagraphs: ["Finances visible to all. Decisions logged. No back-channels. Information asymmetry is proto-hierarchy.", "→ [Supplementary: Governance]"]
  },
  "123": {
    questionNum: "123",
    questionText: "What is domain separation?",
    answerParagraphs: ["No one holds multiple power-adjacent roles. The negotiator can't also be arbiter can't also be resource controller.", "→ [Supplementary: Governance]"]
  },
  "124": {
    questionNum: "124",
    questionText: "What is onboarding filter?",
    answerParagraphs: ["Screen for hierarchy-trained dominance patterns before full membership. Not everyone belongs in every tribe. Some people will exploit any system.", "→ [Supplementary: Governance]"]
  },
  "125": {
    questionNum: "125",
    questionText: "What is viable exit?",
    answerParagraphs: ["Unlike EEA, leaving doesn't mean death. This strengthens bargaining against dominators. You can leave. They know you can leave.", "→ [Supplementary: Governance]"]
  },
  "126": {
    questionNum: "126",
    questionText: "What's the difference between a tribe and a cult?",
    answerParagraphs: ["Cult: charismatic leader, information control, isolation from outside, punishment for leaving. Tribe: distributed authority, transparency, embedded in society, freedom to leave, no one profits from your membership.", "→ [Supplementary: Objections]"]
  },
  "127": {
    questionNum: "127",
    questionText: "What went wrong with Auroville?",
    answerParagraphs: ["Scale without Dunbar layers. Tried to operate flat at 3,000+ people. Governance broke down. Lesson: band-scale (50-150) as operating unit even in larger networks.", "→ [Supplementary: Governance Case Studies]"]
  },
  "128": {
    questionNum: "128",
    questionText: "What is pharmakon?",
    answerParagraphs: ["Greek: both poison and cure. Technology's dual nature. Same tools creating mismatch can serve demismatching-if designed differently.", "→ [Part IX: The Destination]"]
  },
  "129": {
    questionNum: "129",
    questionText: "What is a decay function?",
    answerParagraphs: ["Technology that degrades without physical presence. Features lock without in-person time. Success measured by decreasing use. Opposite of engagement optimization.", "→ [Supplementary: Technology]"]
  },
  "130": {
    questionNum: "130",
    questionText: "What is tribe formation AI?",
    answerParagraphs: ["Matching based on nervous system regulation, conflict styles, values. Modern village matchmaker. Discovery tool, not relationship substitute. Finds candidates; humans bond.", "→ [Supplementary: Technology]"]
  },
  "131": {
    questionNum: "131",
    questionText: "Why won't venture capital fund demismatch tech?",
    answerParagraphs: ["Decay functions are churn engines. VCs need engagement growth. Demismatch tech requires different economics: open source, non-profit, mission-driven, one-time purchase.", "→ [Part IX: The Destination]"]
  },
  "132": {
    questionNum: "132",
    questionText: "Can current technology demismatch?",
    answerParagraphs: ["Yes. Video calls with actual tribe. Coordination tools for real groups. AI as capability extension. Question: does it serve your 150 or substitute parasocial engagement with strangers?", "→ [Supplementary: Technology]"]
  },
  "133": {
    questionNum: "133",
    questionText: "What is the double shift?",
    answerParagraphs: ["Transition exhaustion. Maintaining wage labor while building tribal structure. 8 hours capitalist work + 2-3 hours tribal maintenance. Primary failure mode.", "→ [Supplementary: Transition]"]
  },
  "134": {
    questionNum: "134",
    questionText: "What is the great filter?",
    answerParagraphs: ["Transition period where most tribe formation attempts fail. Double shift burnout, resource constraints, instability, conflicts unresolved.", "→ [Supplementary: Transition]"]
  },
  "135": {
    questionNum: "135",
    questionText: "Who can attempt this first?",
    answerParagraphs: ["People with resources: schedule flexibility, savings buffer, existing relationships, lower cost-of-living. Remote workers. Freelancers. First adopters create maps others follow.", "→ [Supplementary: Transition]"]
  },
  "136": {
    questionNum: "136",
    questionText: "What is constructive scarcity?",
    answerParagraphs: ["Challenges requiring effort, cooperation, skill-creating conditions for meaning. Time limits, skill mastery, coordination problems. Remains even with material abundance. The tribe still needs to raise children, resolve conflicts, create together.", "→ [Part IX: The Destination]"]
  },
  "137": {
    questionNum: "137",
    questionText: "What is toxic scarcity?",
    answerParagraphs: ["Material deprivation creating desperation. Food/shelter insecurity. Breaks cooperation. Eliminated by automation/UBI. Good riddance.", "→ [Part IX: The Destination]"]
  },
  "138": {
    questionNum: "138",
    questionText: "Why isn't UBI the answer?",
    answerParagraphs: ["Solves resource distribution, not meaning. Money without role, tribe, purpose. \"UBI + atomized individual = Netflix until death, punctuated by antidepressants.\"", "→ [Part IX: The Destination]"]
  },
  "139": {
    questionNum: "139",
    questionText: "What does automation change?",
    answerParagraphs: ["Eliminating human roles in production. The proxy purpose that work provides is disappearing. Makes framework more urgent-rebuild meaning through tribe, not through jobs that won't exist.", "→ [Part IX: The Destination]"]
  },
  "140": {
    questionNum: "140",
    questionText: "What if my tribe attempt fails?",
    answerParagraphs: ["Fission-fusion is normal. Even temporary tribes valuable-years of genuine tribal experience, skills developed, relationships that persist. Permanence isn't the only success metric.", "→ [Supplementary: Fission-Fusion]"]
  },
  "141": {
    questionNum: "141",
    questionText: "What do WHO studies show?",
    answerParagraphs: ["Better schizophrenia outcomes in developing countries with less medication and more social support. That's not coincidence. That's the mechanism.", "→ [Supplementary: Research]"]
  },
  "142": {
    questionNum: "142",
    questionText: "What do hunter-gatherer studies show?",
    answerParagraphs: ["Chronic psychiatric conditions rare or absent in genuinely matched populations. \"Schizophrenia is rare or nonexistent in hunter-gatherer populations.\" Limited data, but directionally clear.", "→ [Supplementary: Research]"]
  },
  "143": {
    questionNum: "143",
    questionText: "What do environmental interventions show?",
    answerParagraphs: ["Nature exposure, co-living reduce symptoms independent of medication. Environment is the variable.", "→ [Supplementary: Research]"]
  },
  "144": {
    questionNum: "144",
    questionText: "What do intentional communities show?",
    answerParagraphs: ["Twin Oaks (58 years), East Wind (51 years), kibbutzim-long-term stability possible with proper governance. Communities arrived at similar solutions independently. Convergent evidence.", "→ [Supplementary: Governance Case Studies]"]
  },
  "145": {
    questionNum: "145",
    questionText: "What is Twin Oaks?",
    answerParagraphs: ["Intentional community since 1967. ~100 adults. Labor credits for visible contribution. Role rotation. Transparency. High life satisfaction in internal surveys.", "→ [Supplementary: Governance Case Studies]"]
  },
  "146": {
    questionNum: "146",
    questionText: "What is East Wind?",
    answerParagraphs: ["Intentional community since 1974. ~70 members. Nut butter business. Rotating coordinators. Full financial transparency. Anecdotal reports: reduced anxiety from belonging.", "→ [Supplementary: Governance Case Studies]"]
  },
  "147": {
    questionNum: "147",
    questionText: "What's step one?",
    answerParagraphs: ["Reduce mismatch load. Audit parasocial relationships. Reduce open loops. Circadian basics: wake with light, reduce evening screens. Move your body-not for fitness, for the neurochemistry your brain expects.", "→ [Part IX: The Destination]"]
  },
  "148": {
    questionNum: "148",
    questionText: "What's step two?",
    answerParagraphs: ["Deepen, not broaden. Stop meeting new people temporarily. Invest in existing relationships. Identify your actual 5. Regular, repeated, low-stakes contact with the same people.", "→ [Supplementary: Transition]"]
  },
  "149": {
    questionNum: "149",
    questionText: "What's step three?",
    answerParagraphs: ["Reduce proxy dependence. Notice which proxies you're using. Ask what they're substituting for. Time-box their use while building real alternatives.", "→ [Supplementary: Transition]"]
  },
  "150": {
    questionNum: "150",
    questionText: "What's step four?",
    answerParagraphs: ["Build. One dinner. One finished project. One person who sees your contribution. Understanding alone changes nothing.", "→ [Part IX: The Destination]"]
  },
  "151": {
    questionNum: "151",
    questionText: "What if I can't build tribe right now?",
    answerParagraphs: ["Reduce mismatch load first. Circadian alignment, nature exposure, reduced stranger interaction-these help even alone. Build capacity. Move from 90% mismatched to 70%. Still mismatched, but better positioned.", "→ [Supplementary: Transition]"]
  },
  "152": {
    questionNum: "152",
    questionText: "What's minimum viable demismatch?",
    answerParagraphs: ["Identify your 5 (or start building toward it). One regular shared meal per week. One loop closed daily. One proxy replaced with real alternative. Morning light. Movement.", "→ [Part IX: The Destination]"]
  },
  "153": {
    questionNum: "153",
    questionText: "How long does this take?",
    answerParagraphs: ["Years, not weeks. Graduated implementation: reduce load → deepen relationships → build toward 50 → establish structure → physical consolidation. The double shift makes it slow.", "→ [Supplementary: Transition]"]
  },
  "154": {
    questionNum: "154",
    questionText: "What's the trap?",
    answerParagraphs: ["Reading about mismatch while sitting alone, scrolling, under artificial light. Understanding is not progress. Close this tab. Go outside. Find your people. Build something.", "→ [Part IX: The Destination]"]
  },
  "155": {
    questionNum: "155",
    questionText: "\"I'm an introvert.\"",
    answerParagraphs: ["Introversion = how you recover energy, not what you need. You need tribe with quieter role. EEA had roles for every temperament. Not isolation-predictable, low-demand belonging.", "→ [Supplementary: Objections]"]
  },
  "156": {
    questionNum: "156",
    questionText: "\"Different people need different things.\"",
    answerParagraphs: ["Surface variation exists. Deep structure universal. No human thrives isolated, purposeless, surrounded by strangers, with permanent open loops. Vary the implementation, not the fundamentals.", "→ [Supplementary: Objections]"]
  },
  "157": {
    questionNum: "157",
    questionText: "\"You're romanticizing the past.\"",
    answerParagraphs: ["27% infant mortality. 48% child death. Demismatch doesn't claim past was better-claims social environment matched the hardware. You can have modern medicine AND social structures that work.", "→ [Supplementary: Objections]"]
  },
  "158": {
    questionNum: "158",
    questionText: "\"This sounds like a cult.\"",
    answerParagraphs: ["Cults: charismatic leader, isolation, information control, punishment for leaving. Demismatch: distributed authority, transparency, embedded in society, freedom to exit. The structure prevents cult dynamics.", "→ [Supplementary: Objections]"]
  },
  "159": {
    questionNum: "159",
    questionText: "\"Society can't reorganize.\"",
    answerParagraphs: ["Society doesn't need to. You need to build tribe within existing society. The tribe is a social layer, not replacement for civilization. You still have job, government, economy.", "→ [Supplementary: Objections]"]
  },
  "160": {
    questionNum: "160",
    questionText: "\"Only privileged people can do this.\"",
    answerParagraphs: ["Partly true. First tribes will come from those who can experiment. Question is whether success builds infrastructure lowering barriers for others. Someone has to go first.", "→ [Supplementary: Objections]"]
  },
  "161": {
    questionNum: "161",
    questionText: "\"What about people who genuinely can't form relationships?\"",
    answerParagraphs: ["Some genuine neurological differences exist. Demismatch claims most suffering is environmental, not neurological. For genuine difference: modified structures, different roles, augmented communication. Goal remains same.", "→ [Supplementary: Objections]"]
  },
  "162": {
    questionNum: "162",
    questionText: "\"Isn't this just 'touch grass' with extra steps?\"",
    answerParagraphs: ["Yes and no. Touch grass captures something real. Demismatch explains why it helps (circadian, movement, reduced strangers) and what else is needed (tribe, purpose, closed loops). Touch grass is necessary but insufficient.", "→ [Supplementary: Objections]"]
  }
};

// Get an FAQ answer by question number
export function getAnswer(questionNum: string): FAQAnswer | null {
  return FAQ_ANSWERS[questionNum] || null;
}

// Tile configuration for homepage - DO NOT MODIFY ORDER
export interface TileQuestion {
  num: string;
  text: string;
}

export interface BasicsTile {
  id: number;
  leadQuestion: string;
  subtitle: string;
  questions: TileQuestion[];
}

export const BASICS_TILES: BasicsTile[] = [
  {
    id: 1,
    leadQuestion: "Why do I feel so bad?",
    subtitle: "The feeling is correct. Your environment is wrong.",
    questions: [
      { num: "13", text: "Why do I feel so bad?" },
      { num: "28", text: "So my feelings aren't the problem?" },
      { num: "17", text: "What's the core claim?" },
      { num: "18", text: "What are the stakes?" },
      { num: "20", text: "What is anxiety actually?" },
      { num: "21", text: "What is depression actually?" },
      { num: "22", text: "What is loneliness actually?" },
      { num: "23", text: "What is addiction actually?" },
      { num: "24", text: "What is ADHD actually?" },
      { num: "26", text: "What is burnout?" },
      { num: "27", text: "What is imposter syndrome?" },
      { num: "29", text: "What's the difference between signal and symptom?" },
      { num: "30", text: "What's the oil light metaphor?" },
      { num: "19", text: "What are emotions?" },
      { num: "11", text: "What is evolutionary mismatch?" },
      { num: "14", text: "What's \"fish on land\"?" },
      { num: "15", text: "What's \"flopping disorder\"?" },
      { num: "16", text: "Is this just \"we weren't meant to live like this\"?" },
      { num: "92", text: "Are psychiatric conditions real diseases?" },
      { num: "93", text: "But these conditions are heritable?" },
      { num: "94", text: "What about brain differences?" },
      { num: "95", text: "What is \"farmer brain\"?" },
      { num: "96", text: "What about neuroplasticity?" },
      { num: "97", text: "What is signal override?" },
      { num: "98", text: "What's wrong with therapy?" },
      { num: "99", text: "What's a 15-minute medication check?" },
      { num: "100", text: "Is medication ever necessary?" },
      { num: "46", text: "Do I perceive reality accurately?" },
      { num: "47", text: "What are fitness payoffs?" },
      { num: "48", text: "Why does this matter?" }
    ]
  },
  {
    id: 2,
    leadQuestion: "I have 2,000 followers. Why am I lonely?",
    subtitle: "Salt water for thirst.",
    questions: [
      { num: "45", text: "I have 2,000 followers. Why am I lonely?" },
      { num: "54", text: "Why do I feel like I'm failing even when I'm \"successful\"?" },
      { num: "55", text: "What's \"salt water for thirst\"?" },
      { num: "70", text: "What are parasocial relationships?" },
      { num: "90", text: "What is the celebrity phenomenon?" },
      { num: "91", text: "What is the soccer phenomenon?" },
      { num: "66", text: "What is a proxy?" },
      { num: "67", text: "Why don't proxies work?" },
      { num: "71", text: "What are hyperstimuli/supernormal stimuli?" },
      { num: "72", text: "Is art a proxy?" },
      { num: "68", text: "What is variable ratio reinforcement?" },
      { num: "69", text: "What is dopamine and how is it hijacked?" },
      { num: "76", text: "How does social media exploit me?" },
      { num: "81", text: "How do dating apps exploit me?" },
      { num: "82", text: "How does porn exploit me?" }
    ]
  },
  {
    id: 3,
    leadQuestion: "Why is my suffering profitable?",
    subtitle: "You're not the customer. You're the product.",
    questions: [
      { num: "73", text: "Why is my suffering profitable?" },
      { num: "74", text: "What is the exploitation formula?" },
      { num: "75", text: "What is the atomized individual?" },
      { num: "77", text: "How does pharma exploit me?" },
      { num: "78", text: "What is the serotonin hypothesis?" },
      { num: "79", text: "What are ghostwritten studies?" },
      { num: "80", text: "How does the food industry exploit me?" },
      { num: "83", text: "How does news media exploit me?" },
      { num: "84", text: "What is cortisol?" },
      { num: "85", text: "How does self-help exploit me?" },
      { num: "86", text: "How does gambling exploit me?" },
      { num: "87", text: "What are whales?" },
      { num: "88", text: "How does advertising exploit me?" },
      { num: "89", text: "Why isn't this common knowledge?" },
      { num: "101", text: "What did Rat Park show?" }
    ]
  },
  {
    id: 4,
    leadQuestion: "Why do I care what strangers think?",
    subtitle: "Your brain expects problems it can solve.",
    questions: [
      { num: "58", text: "Why do I care what strangers think?" },
      { num: "64", text: "Why can't I stop ruminating?" },
      { num: "57", text: "What is the internal audience?" },
      { num: "60", text: "What is the perfectionism trap?" },
      { num: "59", text: "What is negativity bias?" },
      { num: "61", text: "What is an open loop?" },
      { num: "62", text: "What is a closed loop?" },
      { num: "63", text: "What is infinite scroll?" },
      { num: "65", text: "What is partial control?" },
      { num: "49", text: "What is stranger overload?" },
      { num: "50", text: "How many strangers did ancestors encounter?" },
      { num: "51", text: "Why does modern work feel meaningless?" },
      { num: "52", text: "What are bullshit jobs?" },
      { num: "53", text: "What is status competition mismatch?" },
      { num: "56", text: "Why are mass shootings a modern phenomenon?" },
      { num: "25", text: "What is social anxiety actually?" }
    ]
  },
  {
    id: 5,
    leadQuestion: "Do you have your 5?",
    subtitle: "The spec sheet for human thriving.",
    questions: [
      { num: "39", text: "What is \"the 5\"?" },
      { num: "40", text: "What is \"the 15\"?" },
      { num: "41", text: "What is \"the 50\" (band)?" },
      { num: "42", text: "What is \"the 150\" (tribe)?" },
      { num: "43", text: "What is the metapopulation?" },
      { num: "37", text: "What are Dunbar's numbers?" },
      { num: "38", text: "Why are these limits hard?" },
      { num: "44", text: "Can technology extend Dunbar's number?" },
      { num: "36", text: "What's the difference between wants and needs?" },
      { num: "34", text: "Why do I care so much about status?" },
      { num: "31", text: "What drives all human behavior?" },
      { num: "32", text: "What is direct fitness?" },
      { num: "33", text: "What is indirect fitness?" },
      { num: "35", text: "What is reciprocal altruism?" },
      { num: "12", text: "What is the EEA?" },
      { num: "107", text: "What is the fire circle?" },
      { num: "108", text: "What is alloparenting?" },
      { num: "109", text: "What is mixed-age play?" },
      { num: "110", text: "What is apprenticeship?" },
      { num: "111", text: "What is demand sharing?" },
      { num: "112", text: "What is immediate-return economy?" },
      { num: "113", text: "How did EEA governance work?" },
      { num: "114", text: "What is egalitarian enforcement?" },
      { num: "115", text: "What is the conflict resolution cascade?" },
      { num: "116", text: "What about circadian rhythm?" },
      { num: "117", text: "What is birth spacing?" },
      { num: "118", text: "What about physical contact for infants?" },
      { num: "119", text: "What is fission-fusion?" }
    ]
  },
  {
    id: 6,
    leadQuestion: "What's step one?",
    subtitle: "Understanding alone changes nothing.",
    questions: [
      { num: "147", text: "What's step one?" },
      { num: "148", text: "What's step two?" },
      { num: "149", text: "What's step three?" },
      { num: "150", text: "What's step four?" },
      { num: "152", text: "What's minimum viable demismatch?" },
      { num: "154", text: "What's the trap?" },
      { num: "106", text: "What's the simple test?" },
      { num: "151", text: "What if I can't build tribe right now?" },
      { num: "153", text: "How long does this take?" },
      { num: "140", text: "What if my tribe attempt fails?" },
      { num: "102", text: "What is demismatch?" },
      { num: "103", text: "What is augment?" },
      { num: "104", text: "Why \"demismatch first, then augment\"?" },
      { num: "105", text: "What is \"the most human post-human\"?" },
      { num: "133", text: "What is the double shift?" },
      { num: "134", text: "What is the great filter?" },
      { num: "135", text: "Who can attempt this first?" },
      { num: "136", text: "What is constructive scarcity?" },
      { num: "137", text: "What is toxic scarcity?" },
      { num: "138", text: "Why isn't UBI the answer?" },
      { num: "139", text: "What does automation change?" }
    ]
  },
  {
    id: 7,
    leadQuestion: "This sounds like a cult.",
    subtitle: "Here's why it's the opposite.",
    questions: [
      { num: "158", text: "\"This sounds like a cult.\"" },
      { num: "126", text: "What's the difference between a tribe and a cult?" },
      { num: "120", text: "Why do modern tribes need explicit governance?" },
      { num: "121", text: "What is rotation?" },
      { num: "122", text: "What is transparency?" },
      { num: "123", text: "What is domain separation?" },
      { num: "124", text: "What is onboarding filter?" },
      { num: "125", text: "What is viable exit?" },
      { num: "127", text: "What went wrong with Auroville?" },
      { num: "128", text: "What is pharmakon?" },
      { num: "129", text: "What is a decay function?" },
      { num: "130", text: "What is tribe formation AI?" },
      { num: "131", text: "Why won't venture capital fund demismatch tech?" },
      { num: "132", text: "Can current technology demismatch?" }
    ]
  },
  {
    id: 8,
    leadQuestion: "Isn't this just 'touch grass' with extra steps?",
    subtitle: "Yes. Here's why that matters.",
    questions: [
      { num: "162", text: "\"Isn't this just 'touch grass' with extra steps?\"" },
      { num: "155", text: "\"I'm an introvert.\"" },
      { num: "156", text: "\"Different people need different things.\"" },
      { num: "157", text: "\"You're romanticizing the past.\"" },
      { num: "159", text: "\"Society can't reorganize.\"" },
      { num: "160", text: "\"Only privileged people can do this.\"" },
      { num: "161", text: "\"What about people who genuinely can't form relationships?\"" },
      { num: "141", text: "What do WHO studies show?" },
      { num: "142", text: "What do hunter-gatherer studies show?" },
      { num: "143", text: "What do environmental interventions show?" },
      { num: "144", text: "What do intentional communities show?" },
      { num: "145", text: "What is Twin Oaks?" },
      { num: "146", text: "What is East Wind?" },
      { num: "1", text: "What is this website?" },
      { num: "2", text: "What are you trying to do?" },
      { num: "3", text: "Why should I care?" },
      { num: "4", text: "Who is this for?" },
      { num: "5", text: "Is this anti-psychiatry?" },
      { num: "6", text: "Is this anti-technology?" },
      { num: "7", text: "What do you want me to do after reading this?" },
      { num: "8", text: "Why is this free?" },
      { num: "9", text: "What's with all the images?" },
      { num: "10", text: "How do I know this isn't just another self-help thing?" },
      { num: "intro", text: "First, about AI: Is this made by AI?" }
    ]
  }
];
