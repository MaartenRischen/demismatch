"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";

// Glossary data structure
interface GlossaryTerm {
  id: string;
  title: string;
  definition: string[];
  crossReferences: string[];
  sources: string[];
}

// Parse the glossary terms
const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "alloparenting",
    title: "Alloparenting",
    definition: [
      "Child-rearing by multiple adults—not just biological parents. In ancestral conditions, children were raised by 20+ caregivers: grandparents, aunts, uncles, older siblings, and unrelated band members. A mother was never alone with her infant for hours. Someone was always there.",
      "This isn't \"it takes a village\" sentimentality. It's how human child-rearing worked for 300,000 years. The nuclear family—two exhausted parents doing it alone—is a historical aberration. Parental burnout, postpartum depression, and attachment anxiety aren't personal failures. They're predictable outcomes of asking two people to do what twenty used to do.",
      "Among the Aka people of Central Africa, fathers hold their infants more than 20% of daytime hours—the highest paternal involvement recorded in any human society. Among the Efe, infants are held by an average of 14 different people in the first days of life. This is the baseline. We've deviated catastrophically."
    ],
    crossReferences: ["the-5", "the-50-band", "fire-circle"],
    sources: [
      "Hrdy, S. B. (2009). *Mothers and Others: The Evolutionary Origins of Mutual Understanding*",
      "Hewlett, B. S. (1991). *Intimate Fathers: The Nature and Context of Aka Pygmy Paternal Infant Care*"
    ]
  },
  {
    id: "atomized-individual",
    title: "Atomized Individual",
    definition: [
      "A person severed from tribe, purpose, and genuine intimacy. The ideal consumer unit.",
      "The atomized individual has no community to provide counter-narratives to advertising. No elders to say \"you don't need that.\" No tribe to meet their belonging needs, so they seek substitutes in products and parasocial relationships. No purpose beyond consumption, so they're perpetually searching for meaning in the next purchase, the next experience, the next self-help book.",
      "This isn't conspiracy—it's incentive alignment. A fully satisfied human embedded in a functioning tribe is a terrible customer. They don't need retail therapy. They don't need dating apps. They don't need antidepressants to cope with isolation. Every industry that profits from human misery has an interest in maintaining atomization.",
      "The atomized individual is also easier to govern. No unions, no community organizations, no collective bargaining power. Just isolated units interfacing directly with corporations and the state."
    ],
    crossReferences: ["exploitation-formula", "proxy", "parasocial-relationships"],
    sources: [
      "Putnam, R. D. (2000). *Bowling Alone: The Collapse and Revival of American Community*",
      "Zuboff, S. (2019). *The Age of Surveillance Capitalism*"
    ]
  },
  {
    id: "augment",
    title: "Augment",
    definition: [
      "Extending human capability through technology—but only from a foundation of thriving.",
      "The premise: you can't augment broken. If a human is already mismatched—isolated, purposeless, chronically stressed—then adding technology just amplifies dysfunction. AI assistants become substitutes for human connection. Productivity tools accelerate burnout. Social media deepens loneliness.",
      "But technology applied to a thriving human is different. Communication tools that coordinate an actual tribe. AI that extends capability rather than replacing relationship. Health monitoring that supports an already-healthy baseline.",
      "The sequence matters: demismatch first, then augment. Get the human thriving in a matched environment, then enhance from there. We're talking about augmenting humans with technology, but we haven't established what a thriving human baseline even looks like. What exactly are we augmenting?"
    ],
    crossReferences: ["demismatch", "pharmakon", "the-most-human-post-human"],
    sources: []
  },
  {
    id: "bliss-point",
    title: "Bliss Point",
    definition: [
      "The precise combination of sugar, fat, and salt engineered to maximize craving without satisfaction.",
      "Food scientists at major corporations systematically test thousands of variations to find the exact formulation that triggers maximum consumption. Not maximum enjoyment—maximum consumption. The goal is a product you can't eat in moderation. One that creates craving without satiation.",
      "This isn't about making food taste good. Traditional cuisines developed over millennia also taste good—but they satisfy. You eat, you're full, you stop. Engineered hyperpalatable foods bypass satiation signals. The bliss point is calibrated to keep you eating past fullness, to create craving shortly after consumption, to make the food literally addictive.",
      "Howard Moskowitz, the researcher who pioneered bliss point optimization for the food industry, helped Dr Pepper find the exact level of sweetness (not too much, not too little) that maximized consumption. The same methodology applies across the industry: Doritos, Oreos, Pringles (\"once you pop, you can't stop\" is not a joke—it's the design spec)."
    ],
    crossReferences: ["hyperstimuli", "proxy", "variable-ratio-reinforcement"],
    sources: [
      "Moss, M. (2013). *Salt Sugar Fat: How the Food Giants Hooked Us*",
      "Kessler, D. A. (2009). *The End of Overeating*"
    ]
  },
  {
    id: "bullshit-jobs",
    title: "Bullshit Jobs",
    definition: [
      "Jobs whose existence the workers themselves cannot justify. Work that produces nothing tangible, benefits no one you know, and exists primarily to perpetuate itself.",
      "David Graeber's research found that a significant percentage of workers in developed economies privately believe their jobs are meaningless—that if their position disappeared tomorrow, the world would be no worse off or might even improve. This includes many corporate lawyers, PR consultants, administrative coordinators, middle managers, and entire categories of work that didn't exist 50 years ago.",
      "This is work/purpose mismatch at civilizational scale. Humans evolved doing work with visible results: hunt → eat, build shelter → have shelter, gather food → have food. The feedback loop was immediate and tangible. Modern abstracted labor severs the connection between effort and outcome. You move information around a screen, attend meetings about meetings, produce reports no one reads, and at the end of the day you cannot point to a single thing that exists because of your work.",
      "The psychological toll is severe. Meaning-making systems can't connect abstract labor to survival benefit. The result is burnout, depression, and a nagging sense of pointlessness that no salary can resolve."
    ],
    crossReferences: ["open-loop", "visible-contribution"],
    sources: [
      "Graeber, D. (2018). *Bullshit Jobs: A Theory*"
    ]
  },
  {
    id: "circadian-rhythm",
    title: "Circadian Rhythm",
    definition: [
      "Your body's internal clock, calibrated by light exposure over hundreds of thousands of years.",
      "The pattern: wake at dawn with natural light. Active through morning. Rest, socialize, nap in afternoon heat. Fire circle in evening. Sleep with darkness. Every day. No variation. No alarm clocks.",
      "Artificial light broke this. We stay up past dark, flood our eyes with blue light from screens, wake to alarms instead of sunrise, and then wonder why we can't sleep, can't focus, feel perpetually exhausted. The mismatch isn't subtle—we've fundamentally altered one of the most basic biological cycles.",
      "Circadian disruption affects nearly every system: metabolism (shift workers have higher obesity rates), immune function, mental health (light therapy is as effective as medication for some depression), cognitive performance, and hormone regulation. This isn't about being a morning person or night owl—it's about a biological system that expects certain inputs and malfunctions without them.",
      "Basic circadian hygiene—morning light exposure, reduced evening screens, consistent sleep timing—is one of the lowest-cost, highest-impact interventions available."
    ],
    crossReferences: ["eea", "fire-circle"],
    sources: [
      "Walker, M. (2017). *Why We Sleep*",
      "Roenneberg, T. (2012). *Internal Time: Chronotypes, Social Jet Lag, and Why You're So Tired*"
    ]
  },
  {
    id: "closed-loop",
    title: "Closed Loop",
    definition: [
      "A problem resolved through action. The emotional state dissipates because the situation is handled.",
      "Hunt → eat → done. The anxiety about food dissolves because there's food. Conflict with band member → resolution through discussion → done. The tension dissolves because it's actually resolved. Threat from predator → flee or fight → done. The fear dissolves because you're safe.",
      "This is what your brain evolved for. Emotional states are supposed to be instrumental—they motivate action, action resolves the situation, emotion dissipates. The loop closes.",
      "Modern life is an open loop factory. You worry about climate change—no action you take resolves it. The worry persists. You're anxious about the economy—nothing you do affects it. The anxiety persists. You ruminate about an embarrassing moment from 2015—no action available. The rumination continues.",
      "Closing loops where possible is therapeutic not because distraction helps, but because resolution is the designed function of emotional states. Your brain isn't built for permanent, unresolvable emotional activation."
    ],
    crossReferences: ["open-loop", "partial-control", "rumination"],
    sources: []
  },
  {
    id: "conflict-resolution-cascade",
    title: "Conflict Resolution Cascade",
    definition: [
      "The escalating sequence hunter-gatherers used to handle conflict without police, courts, or formal authority.",
      "The cascade typically progressed: humor → public discussion → ridicule → shunning → exile → violence (rare, usually ritualized). Most conflicts resolved early—often through joking that simultaneously named the problem and defused tension. Conflicts that couldn't be laughed off were discussed publicly, with the whole band witnessing and weighing in.",
      "Ridicule was powerful because reputation mattered in a group of 50 where everyone knew everything. Persistent antisocial behavior led to shunning—being ignored, excluded from sharing, treated as invisible. This was devastating in a world where social bonds meant survival.",
      "Exile was rare but available. And unlike modern society, this wasn't just inconvenient—it was potentially fatal. The threat of exile aligned individual incentives with group cooperation.",
      "Actual violence was the last resort and typically ritualized: structured contests that resolved disputes without killing members the group couldn't afford to lose.",
      "The whole system worked because it was embedded in a community where relationships were permanent and reputation was inescapable. We've lost the infrastructure for this kind of organic justice."
    ],
    crossReferences: ["egalitarian-enforcement", "the-50-band", "transparency"],
    sources: [
      "Boehm, C. (1999). *Hierarchy in the Forest: The Evolution of Egalitarian Behavior*",
      "Lee, R. B. (1979). *The !Kung San: Men, Women, and Work in a Foraging Society*"
    ]
  },
  {
    id: "cortisol",
    title: "Cortisol",
    definition: [
      "Stress hormone designed to spike briefly for real threats, then dissipate.",
      "Sabertooth tiger appears: cortisol floods your system, sharpening focus, mobilizing energy, preparing for fight or flight. Tiger leaves (or you escape, or you fight): cortisol drops, body returns to baseline, you rest and recover.",
      "This system was calibrated for intermittent, acute stressors with clear resolution. Modern life provides chronic, unresolvable stressors with no resolution. News media keeps threat detection permanently activated. Work stress doesn't resolve at the end of the day. Financial anxiety is perpetual. The tiger never leaves.",
      "Chronic cortisol elevation damages nearly every system: suppresses immune function, impairs memory, promotes fat storage (especially abdominal), accelerates aging, disrupts sleep, and literally shrinks the hippocampus. This isn't stress making you feel bad—it's stress physically degrading your body.",
      "The news industry profits from this. Keeping you anxious keeps you watching. \"If it bleeds, it leads\" isn't just editorial philosophy—it's exploitation of a biological response that, when chronically triggered, harms you measurably."
    ],
    crossReferences: ["open-loop", "exploitation-formula"],
    sources: [
      "Sapolsky, R. M. (2004). *Why Zebras Don't Get Ulcers*"
    ]
  },
  {
    id: "decay-function",
    title: "Decay Function",
    definition: [
      "Technology designed to degrade without in-person presence. The opposite of engagement optimization.",
      "Current social technology maximizes time-on-app. Success is measured by engagement, retention, daily active users. The better the product works, the more you use it—which means the more it substitutes for real connection.",
      "A decay function inverts this. Features lock unless you've met in person recently. The app becomes less functional the more you use it without corresponding real-world contact. Success is measured by decreasing use as real relationships develop.",
      "This requires different economics. Engagement-based models can't fund decay functions—your decreasing usage means decreasing ad revenue. Decay function tech requires subscription models, non-profit structures, or open source development.",
      "The concept exposes a fundamental misalignment: technology companies profit from your engagement, and engagement often substitutes for the real thing. Any technology genuinely optimizing for your wellbeing would try to make itself less necessary."
    ],
    crossReferences: ["pharmakon", "tribe-formation-ai"],
    sources: []
  },
  {
    id: "demand-sharing",
    title: "Demand Sharing",
    definition: [
      "The economic pattern of immediate-return societies: those with surplus share when asked.",
      "This isn't charity or generosity—it's obligation and insurance. If someone asks you for food when you have extra, you give it. Not because you're nice, but because tomorrow you might be the one asking. The system creates automatic wealth redistribution, prevents accumulation, and makes poverty functionally impossible within the group.",
      "You can't hoard when anyone can ask for what you have. You can't starve when you can ask from anyone with surplus. The result is profound economic security without any formal welfare system.",
      "Importantly, it's demand sharing—initiated by the person in need, not the person with surplus. This preserves dignity. You're not receiving charity; you're activating a standing social contract. And the obligation to share prevents anyone from getting too far ahead.",
      "This system is incompatible with capitalism, private property, and accumulation. It only works in a community where relationships are permanent, reputation is tracked, and free-riding is visible. We can't simply import it. But understanding it reveals that our assumption—economics must be based on scarcity and competition—is not a law of nature. Other configurations existed and functioned for most of human history."
    ],
    crossReferences: ["immediate-return-economy", "egalitarian-enforcement", "the-50-band"],
    sources: [
      "Woodburn, J. (1982). \"Egalitarian Societies.\" *Man*, 17(3), 431-451."
    ]
  },
  {
    id: "demismatch",
    title: "Demismatch",
    definition: [
      "Consciously aligning your environment with your biology. The return to baseline human thriving—not by going back to caves, but by building forward with the spec sheet in hand.",
      "The thesis: you're not broken, your environment is mismatched. Therefore the intervention isn't fixing yourself—it's changing your environmental conditions to match what your biology expects.",
      "This means: reducing stranger overload. Closing open loops where possible. Building or joining a tribe. Finding work with visible contribution. Establishing circadian regularity. Replacing proxies with real satisfactions. Moving from 90% mismatched to 70% to 50% to sustainable.",
      "Demismatch isn't a destination you arrive at once. It's a direction—reducing mismatch load step by step, building toward the conditions your hardware requires. Some mismatches are more tractable than others. Start with the ones you can actually change.",
      "The framework claims this must come before technological augmentation. You can't enhance a dysregulated system and expect good outcomes. Get the human thriving first, then amplify."
    ],
    crossReferences: ["augment", "mismatch", "eea"],
    sources: []
  },
  {
    id: "direct-fitness",
    title: "Direct Fitness",
    definition: [
      "Survival and reproduction mechanisms that run automatically. The drives you can't argue with.",
      "Hunger, thirst, fear, lust, pain avoidance, temperature regulation. These systems don't consult your values or ask permission. They activate based on biological conditions and motivate behavior whether you like it or not.",
      "You can override them temporarily—fasting, celibacy, walking on hot coals—but you can't eliminate them. They're running in the background, always, shaping your experience and pushing you toward behaviors that historically promoted survival and reproduction.",
      "Understanding direct fitness explains why willpower approaches fail. You're not fighting bad habits—you're fighting drives that kept your ancestors alive. The system isn't malfunctioning when you crave sugar, feel fear, or want sex. It's doing exactly what it evolved to do. The problem is that the modern environment has divorced these drives from the outcomes they were calibrated for."
    ],
    crossReferences: ["indirect-fitness", "hyperstimuli", "proxy"],
    sources: []
  },
  {
    id: "domain-separation",
    title: "Domain Separation",
    definition: [
      "The principle that no single person should hold multiple power-adjacent roles within a tribe.",
      "If one person is both the external negotiator and the internal conflict arbiter and the resource controller, they accumulate enough influence to dominate despite any formal rules. Separating these domains—ensuring the person who handles outside relationships isn't the same person who resolves internal disputes isn't the same person who controls resources—prevents power consolidation.",
      "This requires explicit design. In small groups, it's natural to let the most competent person handle everything. That's efficient but dangerous. Domain separation trades some efficiency for hierarchy prevention."
    ],
    crossReferences: ["rotation", "transparency", "egalitarian-enforcement"],
    sources: []
  },
  {
    id: "dopamine",
    title: "Dopamine",
    definition: [
      "Neurotransmitter driving reward-seeking and motivation. Evolved for intermittent natural rewards. Now systematically hijacked.",
      "Dopamine doesn't signal pleasure—it signals anticipated reward. It spikes not when you eat, but when you see food. Not when you have sex, but when you anticipate it. It motivates action toward reward.",
      "The system was calibrated for an environment where rewards were intermittent and required effort. Food wasn't always available. Sex required courtship. Achievement required work. Dopamine spikes were followed by genuine reward.",
      "Modern technology delivers dopamine triggers without the effort or the genuine satisfaction. Social media provides intermittent social validation hits. Porn provides unlimited sexual novelty. Video games provide achievement cues. The dopamine system is constantly activated without corresponding real reward.",
      "The result is tolerance and baseline depression. Chronic stimulation downregulates receptors. You need more to feel the same. Real satisfactions—which deliver smaller, less frequent dopamine signals—become inadequate by comparison. A real relationship can't compete with infinite pornographic novelty. A real achievement can't compete with video game leveling designed by PhDs in behavioral psychology."
    ],
    crossReferences: ["variable-ratio-reinforcement", "hyperstimuli", "proxy"],
    sources: [
      "Lembke, A. (2021). *Dopamine Nation: Finding Balance in the Age of Indulgence*",
      "Sapolsky, R. M. (2017). *Behave: The Biology of Humans at Our Best and Worst*"
    ]
  },
  {
    id: "double-shift",
    title: "Double Shift",
    definition: [
      "The exhaustion of maintaining wage labor while simultaneously building tribal structure.",
      "Most people can't quit their jobs to build tribe. They have to maintain existing work—the 8-hour day, the commute, the stress—while also investing in relationships, organizing community, and creating new structures. This is 8 hours of capitalist work plus 2-3 hours of tribal maintenance. It's unsustainable.",
      "The double shift is the primary reason tribe formation attempts fail. People burn out. They can't sustain the energy required for both. They give up on the tribal project and retreat to the familiar misery of atomization.",
      "Solutions involve either reducing the wage labor component (remote work, part-time, savings buffer) or making tribal maintenance less effortful (co-location, pooled resources, efficient coordination). First adopters tend to be people who have already solved one side of this equation—they have schedule flexibility, financial buffer, or existing relationships to build on."
    ],
    crossReferences: ["great-filter", "transition"],
    sources: []
  },
  {
    id: "dunbars-numbers",
    title: "Dunbar's Numbers",
    definition: [
      "Hard cognitive limits on the number of relationships you can maintain. Discovered by anthropologist Robin Dunbar through correlation between primate neocortex size and social group size.",
      "The layers: 5 (intimate support group—people you'd call at 3am, complete vulnerability), 15 (close friends—people whose deaths would devastate you), 50 (good friends—the band, daily interaction in ancestral conditions), 150 (meaningful acquaintances—everyone you can know as an individual).",
      "Beyond 150, people become categories. You can't actually know your 5,000 Instagram followers. You can't maintain reciprocal relationships with 2,000 LinkedIn connections. The architecture doesn't support it.",
      "This isn't a failure of effort or technology. It's a constraint of neural hardware. The neocortex that processes social information is finite. The time required to maintain relationships is finite. You physically cannot have 500 close friends. Pretending otherwise—or letting social media create the illusion otherwise—leads to spreading yourself thin across parasocial and weak-tie connections while your actual intimate circle withers."
    ],
    crossReferences: ["the-5", "the-15", "the-50-band", "the-150-tribe", "parasocial-relationships"],
    sources: [
      "Dunbar, R. I. M. (2010). *How Many Friends Does One Person Need?*",
      "Dunbar, R. I. M. (2020). *Friends: Understanding the Power of Our Most Important Relationships*"
    ]
  },
  {
    id: "eea",
    title: "EEA (Environment of Evolutionary Adaptedness)",
    definition: [
      "The conditions humans evolved in. The spec sheet for human thriving.",
      "For roughly 300,000 years of Homo sapiens existence—and millions of years of hominid evolution before that—certain environmental conditions were constant. Small bands of 30-50 people. Extended tribe of 150. Known faces—you might encounter 1,000 strangers in your entire lifetime. Daily closure—work had visible results. Visible contribution—everyone saw what you provided. Physical life—constant movement, exposure to elements, manual labor. Circadian alignment—wake with sun, sleep with dark.",
      "Your brain was calibrated for these conditions. Every adaptation, every drive, every emotional response evolved to function in this context. Then, in evolutionary terms, everything changed instantly. Agriculture, cities, writing, industrialization, digital technology—each transformation faster than the last. The hardware remains paleolithic while the environment has become unrecognizable.",
      "The EEA isn't a place or time to romanticize. 27% infant mortality. 48% child death before age 15. Violence, scarcity, disease. We don't want to go back. But the social environment—the tribe, the belonging, the purpose, the rhythm—matched the hardware. We can have modern medicine AND social structures that work."
    ],
    crossReferences: ["mismatch", "the-50-band", "fire-circle", "demismatch"],
    sources: [
      "Bowlby, J. (1969). *Attachment and Loss*",
      "Tooby, J. & Cosmides, L. (1990). \"The Past Explains the Present: Emotional Adaptations and the Structure of Ancestral Environments.\""
    ]
  },
  {
    id: "egalitarian-enforcement",
    title: "Egalitarian Enforcement",
    definition: [
      "How hunter-gatherer bands prevented anyone from dominating despite the constant human temptation toward hierarchy.",
      "The mechanisms were active, not passive. Any sign of dominance behavior—boasting, hoarding, bossing—triggered immediate coalition response. Successful hunters were obligated to share more, not less. Attempting to claim special status based on skill was met with ridicule and leveling humor. Persistent attempts led to shunning or exile.",
      "Christopher Boehm calls this \"reverse dominance hierarchy\"—the group collectively dominated would-be dominators. It required constant vigilance. The egalitarianism of hunter-gatherers wasn't the absence of hierarchy drives; it was the active suppression of those drives through social mechanisms.",
      "Modern tribes can't rely on these mechanisms emerging organically. We've been trained by hierarchical institutions—schools, corporations, governments—to accept and perpetuate dominance. Explicit governance structures are needed to prevent the hierarchy-trained from recreating what they know."
    ],
    crossReferences: ["conflict-resolution-cascade", "rotation", "transparency"],
    sources: [
      "Boehm, C. (1999). *Hierarchy in the Forest: The Evolution of Egalitarian Behavior*"
    ]
  },
  {
    id: "exploitation-formula",
    title: "Exploitation Formula",
    definition: [
      "The business model underlying most of the modern economy:",
      "1. Identify a real human need. 2. Block or degrade genuine satisfaction. 3. Offer a proxy that mimics the satisfaction signal without meeting the need. 4. Proxy doesn't satisfy (by design), generating repeat usage. 5. Monetize the return visits. 6. Reinvest profits in making the proxy more addictive.",
      "Social media exploits loneliness. Porn exploits sexual needs. Junk food exploits hunger. News exploits threat-detection. Dating apps exploit the desire for partnership. Self-help exploits the search for meaning. All follow the same pattern.",
      "This isn't conspiracy. It's incentive alignment. A fully satisfied human is a terrible customer. If social media actually met your belonging needs, you'd stop using it. If dating apps actually helped you find a partner, you'd leave. If self-help actually improved you, you wouldn't buy the next book. The business model requires that the product doesn't work."
    ],
    crossReferences: ["atomized-individual", "proxy", "variable-ratio-reinforcement"],
    sources: []
  },
  {
    id: "farmer-brain",
    title: "Farmer Brain",
    definition: [
      "The compliant, sit-still-and-focus cognitive style that modern institutions treat as normal—with deviation pathologized as disorder.",
      "Agricultural societies required different behaviors than foraging societies. Farmers needed to stay put, defer gratification (plant now, harvest later), submit to landowners and authority, perform repetitive tasks for hours. Schools were designed to produce factory workers and obedient citizens. Sitting still, following instructions, suppressing impulses—these became the definition of \"well-adjusted.\"",
      "Cognitive styles that served well in foraging contexts—scanning attention, movement-seeking, novelty responsiveness, immediate action orientation—became pathological in the classroom. ADHD isn't a disorder of broken attention. It's hunter cognition in a farmer world.",
      "We've taken one narrow cognitive style—farmer brain—made it the standard, and declared everyone who doesn't fit \"disordered.\" Then we medicate them until they comply."
    ],
    crossReferences: ["signal-vs-symptom"],
    sources: []
  },
  {
    id: "fire-circle",
    title: "Fire Circle",
    definition: [
      "The nightly gathering of the entire band. 2-4 hours every single night for 300,000 years.",
      "This wasn't optional social time. It was the primary venue for everything: processing the day's events, storytelling, conflict resolution, planning, bonding, courtship, teaching, entertainment. The fire provided warmth and protection; the circle provided communion.",
      "Studies of contemporary hunter-gatherers show fire-circle conversation is qualitatively different from daytime talk. Daytime is logistics, work, complaints. Firelight conversation is stories, meaning-making, emotional processing. The flickering light, the darkness beyond, the physical proximity—something shifts.",
      "Your ancestors spent more time in relaxed communion each evening than most modern people spend per month. The fire circle was where culture was transmitted, where belonging was maintained, where meaning was made. We've replaced it with screens."
    ],
    crossReferences: ["eea", "the-50-band"],
    sources: [
      "Wiessner, P. W. (2014). \"Embers of society: Firelight talk among the Ju/'hoansi Bushmen.\" *PNAS*, 111(39), 14027-14035."
    ]
  },
  {
    id: "fish-on-land",
    title: "Fish on Land",
    definition: [
      "The core metaphor of the DEMISMATCH framework.",
      "A fish out of water flops around, gasping. Its gills work perfectly—designed to extract oxygen from water. Its fins work perfectly—designed for locomotion through water. The problem isn't broken fish. The problem is wrong environment.",
      "You wouldn't diagnose \"Flopping Disorder\" and prescribe medication to suppress the flopping. You'd put the fish back in water.",
      "Modern humans are fish on land. Our brains evolved for small tribes, known faces, daily closure, physical life. We're flopping around in cities of strangers, abstract jobs, infinite open loops, sedentary existence—and we diagnose the flopping. Anxiety Disorder. Depression. ADHD. Social Anxiety. We treat the symptoms because we've normalized the environment.",
      "The fish doesn't need therapy to accept life on land. The fish needs water."
    ],
    crossReferences: ["flopping-disorder", "mismatch", "signal-vs-symptom"],
    sources: []
  },
  {
    id: "fission-fusion",
    title: "Fission-Fusion",
    definition: [
      "Natural social dynamics where groups split and reform fluidly. Not failure—social metabolism.",
      "Hunter-gatherer bands weren't static. When the band grew too large, it split. When conflict became unresolvable, one faction left. When resources shifted, groups reformed. People moved between bands through marriage, conflict, or preference. The system was dynamic.",
      "This wasn't dysfunction. It was how healthy human groups breathed. Fission released pressure. Fusion provided genetic diversity and resilience. The fluidity meant you were never permanently trapped in a bad situation.",
      "Modern tribes can learn from this. Permanence isn't the only success metric. A tribe that splits after five years, with members going on to seed other tribes, might be more successful than one that grimly persists through dysfunction. Building in viable exit makes staying a genuine choice."
    ],
    crossReferences: ["viable-exit", "the-150-tribe"],
    sources: []
  },
  {
    id: "flopping-disorder",
    title: "Flopping Disorder",
    definition: [
      "Satirical term for what we do to humans. Pathologizing adaptive responses to environmental mismatch.",
      "If you found a fish flopping on land and diagnosed it with \"Flopping Disorder,\" then prescribed medication to suppress the flopping, you'd be laughed out of veterinary medicine. Yet this is precisely what we do with humans.",
      "Anxiety in response to genuine environmental threat becomes \"Generalized Anxiety Disorder.\" Depression in response to meaningless isolation becomes \"Major Depressive Disorder.\" Inability to sit still in an environment that requires unnatural stillness becomes \"ADHD.\" We name the flopping, categorize the flopping, medicate the flopping—while ignoring the environment.",
      "The fish isn't broken. The environment doesn't match. But there's no billing code for \"wrong environment\" and no prescription for \"build a tribe.\""
    ],
    crossReferences: ["fish-on-land", "signal-vs-symptom", "oil-light-metaphor"],
    sources: []
  },
  {
    id: "ghostwritten-studies",
    title: "Ghostwritten Studies",
    definition: [
      "Research papers written by pharmaceutical companies and published under the names of academic researchers. A documented industry practice.",
      "The process: drug company conducts study, company's medical writers draft the paper framing results favorably, respected academic is offered authorship (for prestige, payment, or both), paper is published in peer-reviewed journal under academic's name, paper is cited as independent evidence for drug efficacy.",
      "This isn't conspiracy theory. It's documented in internal industry documents revealed through litigation, Congressional investigations, and academic exposés. Major journals have acknowledged the problem exists. Estimates suggest a significant portion of pharma-related publications involve ghostwriting.",
      "The result: the \"scientific literature\" on psychiatric medications is substantially marketing material with academic window dressing. Systematic reviews that aggregate these studies are aggregating industry-produced content. Evidence-based medicine becomes industry-based medicine."
    ],
    crossReferences: ["serotonin-hypothesis", "exploitation-formula"],
    sources: [
      "Healy, D. (2012). *Pharmageddon*",
      "Sismondo, S. (2007). \"Ghost Management: How Much of the Medical Literature Is Shaped Behind the Scenes by the Pharmaceutical Industry?\" *PLoS Medicine*, 4(9), e286."
    ]
  },
  {
    id: "great-filter",
    title: "Great Filter",
    definition: [
      "The transition period where most tribe formation attempts fail.",
      "Building tribe while maintaining survival in the existing system is hard. The double shift exhausts. Resources are constrained. Skills for tribal living haven't been developed. Conflicts arise that no one knows how to resolve. Hierarchies emerge despite intentions. The attempt collapses.",
      "This isn't character failure. It's predictable difficulty. The transition from atomized individual to tribal member requires simultaneous maintenance of the old system and construction of the new. Most people burn out. Most groups fail.",
      "Understanding the Great Filter helps. Expect it. Plan for it. Reduce mismatch load before attempting tribe. Build skills gradually. Start with minimal viable structures. Accept that fission-fusion dynamics mean \"failure\" might just be one stage in a longer process."
    ],
    crossReferences: ["double-shift", "fission-fusion", "transition"],
    sources: []
  },
  {
    id: "hyperstimuli",
    title: "Hyperstimuli",
    definition: [
      "Stimuli exceeding anything in nature. Also called supernormal stimuli.",
      "Evolutionary biologist Nikolaas Tinbergen discovered that birds would abandon their own eggs to sit on larger, more colorful artificial eggs. The fake eggs hijacked the nesting instinct by exaggerating the features the instinct responded to. Bigger and more colorful = more compelling to the bird brain, even though the eggs were fake.",
      "Humans are surrounded by hyperstimuli. Porn presents more sexual novelty than any human could encounter naturally—bodies more exaggerated than real bodies, variety impossible in real life. Junk food combines sugar, fat, and salt in concentrations that don't exist in nature. Social media delivers more social feedback than a tribe of 150 could provide. Video games offer more achievement cues than a lifetime of real accomplishment.",
      "The result: real satisfactions become inadequate by comparison. A real partner can't compete with infinite pornographic novelty. Real food seems bland after hyperpalatable engineering. Real achievement feels slow compared to game leveling. The hyperstimuli raise the threshold, and reality falls below it."
    ],
    crossReferences: ["bliss-point", "dopamine", "proxy"],
    sources: [
      "Barrett, D. (2010). *Supernormal Stimuli: How Primal Urges Overran Their Evolutionary Purpose*"
    ]
  },
  {
    id: "immediate-return-economy",
    title: "Immediate-Return Economy",
    definition: [
      "Economic pattern where resources are consumed within hours or days of acquisition. No accumulation. No storage. No investment in future return.",
      "Hunt → eat. Gather → consume. Work → benefit. The line between effort and reward is direct, visible, immediate. You don't work today for a paycheck in two weeks that will pay rent next month for a landlord you've never met who owns property through a REIT managed by algorithms.",
      "Immediate-return economies make meaning-making automatic. Your brain can draw a direct line between your effort and your benefit. Modern delayed-return economies sever this connection through layers of abstraction. The result is that work feels meaningless not because you're weak or ungrateful but because your meaning-making systems literally cannot connect your labor to your survival."
    ],
    crossReferences: ["bullshit-jobs", "visible-contribution", "demand-sharing"],
    sources: [
      "Woodburn, J. (1982). \"Egalitarian Societies.\" *Man*, 17(3), 431-451."
    ]
  },
  {
    id: "indirect-fitness",
    title: "Indirect Fitness",
    definition: [
      "Survival and reproduction through social mechanisms. The drives that make you care about reputation, status, reciprocity, and belonging.",
      "Direct fitness handles immediate survival: hunger, fear, lust. Indirect fitness handles social survival: coalition-building, reputation management, reciprocal relationships, status competition. Both are ultimately about surviving and reproducing, but indirect fitness works through the medium of social relationships.",
      "You care what people think because, in ancestral conditions, what people thought determined whether you ate, whether you found mates, whether the group protected you or abandoned you. Social rejection was existential threat. The drive to belong, to be seen as valuable, to maintain good reputation—this isn't vanity. It's survival machinery.",
      "Modern anonymity and scale have broken the feedback loops, but the drives remain. You perform for an audience that doesn't exist. You worry about the opinions of strangers who don't know you exist. The machinery runs even when the environment no longer makes it functional."
    ],
    crossReferences: ["direct-fitness", "status", "internal-audience"],
    sources: []
  },
  {
    id: "infinite-scroll",
    title: "Infinite Scroll",
    definition: [
      "Deliberate open loop design. No end state. No completion signal. Your brain keeps seeking closure that will never come.",
      "Before infinite scroll, websites had pagination. You'd reach the bottom of the page—a natural stopping point. The loop closed. Infinite scroll removes all stopping points. The content regenerates forever. There is no bottom.",
      "Your brain evolved seeking closure. Finish the task. Reach the destination. Complete the scan of the environment. Infinite scroll exploits this by providing a completion-seeking activity with no possible completion. You scroll toward a bottom that doesn't exist.",
      "This is not a bug. It's the core design pattern. Engagement metrics reward time-on-site. Infinite scroll maximizes time-on-site by eliminating natural exit points. The longer you scroll, the more ads you see. Your inability to stop is the product working as intended."
    ],
    crossReferences: ["open-loop", "variable-ratio-reinforcement", "dopamine"],
    sources: []
  },
  {
    id: "internal-audience",
    title: "Internal Audience",
    definition: [
      "Imaginary critics in your mind generating real biological responses. The phantom tribe judging you by impossible standards.",
      "Your brain evolved being watched by 150 known people whose opinions actually mattered for your survival. Now that external audience is gone, but the watching-being-watched system still runs. It simulates an audience—compiling critics from your past, media, social comparison—and generates real anxiety, real shame, real stress in response to this imagined scrutiny.",
      "The internal audience is typically harsher than any real audience. It holds contradictory standards—be successful but not arrogant, attractive but not vain, confident but not cocky. It notices every flaw. It never sleeps. It judges you for things no real person would care about.",
      "Social anxiety is often fear of the internal audience projected onto real people. You assume strangers are scrutinizing you with the intensity of your internal critics. They're not. They're barely aware you exist. But the internal audience is always watching."
    ],
    crossReferences: ["negativity-bias", "perfectionism-trap", "social-anxiety"],
    sources: []
  },
  {
    id: "metapopulation",
    title: "Metapopulation",
    definition: [
      "The 500-1500 people connected across multiple tribes through marriage, kinship, and trade. The broader network ensuring genetic diversity and resilience.",
      "A single band of 50 or tribe of 150 would become inbred within generations. The metapopulation solved this through regular contact at seasonal gatherings, marriage exchanges, and trade relationships. You knew your own tribe intimately; you knew of the broader metapopulation.",
      "This structure also provided resilience. If one band faced disaster—disease, famine, conflict—members could be absorbed by other bands in the metapopulation. The redundancy prevented catastrophic loss."
    ],
    crossReferences: ["the-50-band", "the-150-tribe", "fission-fusion"],
    sources: []
  },
  {
    id: "mismatch",
    title: "Mismatch",
    definition: [
      "The gap between the environment your biology expects and the environment you actually inhabit.",
      "Your brain was built for a world that no longer exists. 300,000 years of evolution shaped hardware for small bands, known faces, physical work, circadian regularity, immediate-return effort. Then everything changed—agriculture, cities, industry, digital technology—each shift faster than evolution could track.",
      "The hardware works perfectly. It's executing the programs that kept your ancestors alive. The environment doesn't match. Anxiety systems calibrated for real predators are triggered by emails. Belonging systems calibrated for 150 people are overwhelmed by millions of strangers. Meaning-making systems calibrated for visible contribution are starved by abstract labor.",
      "The mismatch is the gap. The suffering is the signal. Your distress isn't malfunction—it's accurate feedback that your environmental conditions violate your species' requirements."
    ],
    crossReferences: ["eea", "fish-on-land", "demismatch"],
    sources: []
  },
  {
    id: "the-most-human-post-human",
    title: "Most Human Post-Human",
    definition: [
      "The destination: humans with matched environments, enhanced by technology. Not replacement but extension.",
      "The transhumanist vision typically starts from broken humans and asks how technology can fix them. Better focus drugs for attention problems. VR for loneliness. AI companions for isolation. The assumption is that humans are the problem to be engineered around.",
      "The DEMISMATCH vision starts from thriving humans and asks how technology can extend them. AI that amplifies your capability while you're embedded in real community. Communication tools that coordinate an actual tribe. Health tech that supports an already-healthy baseline. Technology as extension of a fully human life, not substitute for one.",
      "The most human post-human isn't someone who has transcended human needs through technology. It's someone who has met those needs fully and then augmented from that foundation. Baseline plus enhancement, not bypass."
    ],
    crossReferences: ["augment", "demismatch", "pharmakon"],
    sources: []
  },
  {
    id: "negativity-bias",
    title: "Negativity Bias",
    definition: [
      "The brain's tendency to weight negative information more heavily than positive. An adaptation that kept ancestors alive but now drives chronic misery.",
      "In ancestral conditions, missing a threat could be fatal. Missing an opportunity was usually recoverable. Evolution thus made threat detection hypersensitive. Better to assume the rustle in the grass is a snake than to assume it isn't. The cost of false positives (unnecessary fear) was lower than the cost of false negatives (being eaten).",
      "Now negativity bias runs on phantoms. You assume rejection when acceptance is more likely. You remember the one criticism among ten compliments. You anticipate disaster when evidence suggests otherwise. The machinery is working correctly—it's just calibrated for an environment where threats were real and immediate, not imagined and chronic."
    ],
    crossReferences: ["internal-audience", "cortisol"],
    sources: [
      "Baumeister, R. F. et al. (2001). \"Bad is Stronger than Good.\" *Review of General Psychology*, 5(4), 323-370."
    ]
  },
  {
    id: "oil-light-metaphor",
    title: "Oil Light Metaphor",
    definition: [
      "Medication is like covering the oil light instead of checking the engine. Signal suppressed, underlying problem unchanged.",
      "When your car's oil light comes on, you don't put tape over it and declare the problem solved. The light is information—it's telling you something needs attention. Covering it doesn't fix the engine; it just removes your awareness of the problem while the engine continues degrading.",
      "Psychiatric medication often functions this way. Anxiety is a signal that your threat-detection systems perceive danger. Medicating the anxiety doesn't remove the danger—it removes your awareness of the danger while the underlying situation persists. Depression signals meaning deficit. Medicating the depression doesn't create meaning—it suppresses the signal telling you meaning is absent.",
      "This isn't always wrong. Sometimes you need to suppress the signal to function while you work on the underlying cause. But often the signal suppression becomes the whole intervention. Years of medication, no environmental change, and puzzlement that the person isn't getting better."
    ],
    crossReferences: ["signal-vs-symptom", "signal-override", "flopping-disorder"],
    sources: []
  },
  {
    id: "onboarding-filter",
    title: "Onboarding Filter",
    definition: [
      "Screening process for new tribal members to identify hierarchy-trained dominance patterns before full inclusion.",
      "People shaped by hierarchical institutions—corporations, schools, competitive environments—have often internalized dominance-seeking as normal behavior. They may unconsciously attempt to establish hierarchy, manipulate information, build coalitions for personal advantage, or subtly control decision-making. These behaviors feel natural to them.",
      "An onboarding filter is a trial period or screening process designed to surface these patterns before someone is fully integrated. It might involve extended probation, graduated responsibility, explicit discussion of governance principles, or structured observation. The goal isn't to exclude everyone with corporate experience—it's to identify those who can't or won't unlearn hierarchy-trained behaviors.",
      "Not everyone belongs in every tribe. Some people will exploit any system. Better to discover this during onboarding than after someone has established themselves and begun consolidating influence."
    ],
    crossReferences: ["egalitarian-enforcement", "transparency", "viable-exit"],
    sources: []
  },
  {
    id: "open-loop",
    title: "Open Loop",
    definition: [
      "A problem that cannot be resolved through action. Chronic emotion without resolution.",
      "Your brain evolved solving problems. Threat appears → take action → threat resolved → emotion dissipates. The loop closes. But modern life generates problems immune to action. Climate change. The economy. Political dysfunction. That embarrassing thing you said in 2015. You can't hunt them. You can't fight them. You can't flee them. The loop won't close.",
      "The emotional machinery keeps running anyway. Anxiety about problems you can't solve. Grief about losses you can't reverse. Anger at injustices you can't fix. The rumination is your brain trying to plan solutions for situations that don't admit solutions. It's working correctly—there just isn't anything for it to work with.",
      "Modern life is an open loop factory. News media profits from it. Social media amplifies it. The result is chronic emotional activation without resolution—which is exactly how you break a human."
    ],
    crossReferences: ["closed-loop", "rumination", "partial-control"],
    sources: []
  },
  {
    id: "parasocial-relationships",
    title: "Parasocial Relationships",
    definition: [
      "One-way emotional bonds with people who don't know you exist. The counterfeit intimacy of media.",
      "You know their face, their voice, their struggles, their humor. You feel connection. You care about their wellbeing. They have never heard your name. They will never know you. The relationship is entirely one-directional.",
      "This isn't new—parasocial bonds have existed since mass media began. But the scale has exploded. Social media creates the illusion of reciprocity (they post, you comment, they might reply) while maintaining the fundamental asymmetry. Influencers cultivate parasocial bonds deliberately because those bonds monetize.",
      "The problem: parasocial bonds occupy slots in your Dunbar layers. Every influencer you emotionally invest in is a slot not occupied by someone who could actually reciprocate. You have finite capacity for social investment. Parasocial relationships expend that capacity on connections that can never meet your belonging needs."
    ],
    crossReferences: ["dunbars-numbers", "proxy", "the-150-tribe"],
    sources: []
  },
  {
    id: "partial-control",
    title: "Partial Control",
    definition: [
      "The worst anxiety zone. Enough influence to feel responsible but not enough to determine outcomes.",
      "Pure helplessness allows acceptance. Pure control allows action. Partial control traps you between. You can affect the outcome somewhat—so you can't let go. You can't determine the outcome—so you can't resolve it. The loop stays open. The anxiety continues.",
      "Modern life is dominated by partial control situations. Your work affects your job security but doesn't guarantee it. Your parenting influences your kids but doesn't determine who they become. Your health habits matter but don't prevent all disease. You're perpetually in the zone of incomplete agency.",
      "The brain wasn't calibrated for this. Ancestral challenges were typically either directly actionable (hunt, gather, flee, fight) or clearly uncontrollable (weather, death). The middle zone—where you matter but can't determine outcomes—was rarer. Now it's everywhere."
    ],
    crossReferences: ["open-loop", "closed-loop"],
    sources: []
  },
  {
    id: "perfectionism-trap",
    title: "Perfectionism Trap",
    definition: [
      "The internal audience demanding impossible, mutually contradictory standards. Failure is guaranteed because success requires satisfying mutually exclusive criteria.",
      "Be ambitious but not competitive. Be confident but not arrogant. Be attractive but not vain. Be successful but not obsessed with success. Be caring but not needy. Be independent but not distant. Any position you take violates some standard. You can never win.",
      "The perfectionism trap emerges from compiling critics across multiple sources—parents, peers, media, cultural expectations—without acknowledging their contradictions. The internal audience holds all standards simultaneously and judges you against all of them.",
      "The result is chronic inadequacy regardless of achievement. Whatever you accomplish, you failed some other standard. Whatever position you take, you should have taken a different one. The perfectionism isn't motivating excellence—it's generating paralysis and despair."
    ],
    crossReferences: ["internal-audience", "negativity-bias"],
    sources: []
  },
  {
    id: "pharmakon",
    title: "Pharmakon",
    definition: [
      "Greek term meaning both poison and cure. Technology's dual nature.",
      "The same tools creating mismatch can serve demismatching—if designed differently. Social media isolates, but group coordination tools could unite tribes. Screens disrupt circadian rhythm, but light therapy could restore it. AI creates parasocial bonds, but tribe formation AI could facilitate real ones. Smartphones fragment attention, but communication tools could coordinate real community.",
      "The technology itself is neutral. The implementation determines whether it heals or harms. Currently, most technology is designed for engagement, which typically means exploitation. But different design—different incentives, different metrics, different funding structures—could flip it.",
      "This is the challenge: venture capital won't fund decay functions. Engagement metrics are the default because they're monetizable. Building pharmakon that heals requires different economic structures: non-profits, cooperatives, open source, subscription models that don't require infinite growth."
    ],
    crossReferences: ["decay-function", "augment", "exploitation-formula"],
    sources: []
  },
  {
    id: "proxy",
    title: "Proxy",
    definition: [
      "A substitute that hijacks a biological drive without satisfying the underlying need. Momentary relief, increasing need. Salt water for thirst.",
      "Your drive for belonging is real. Social media provides belonging signals—likes, followers, comments—without actual belonging. The drive is temporarily appeased. But the need isn't met. So the drive reasserts. You seek more. The proxy can't satisfy. You escalate. The cycle continues.",
      "Social media for tribe. Porn for intimacy. Junk food for nourishment. News for relevance. Shopping for meaning. Achievement metrics for genuine contribution. Each provides the signal that the drive responds to while failing to provide the substance the drive evolved to secure.",
      "This is \"salt water for thirst.\" Drinking salt water provides the sensation of drinking while increasing dehydration. The more you drink, the thirstier you get. Proxies work the same way. The momentary relief enables continued mismatch while deepening dependency."
    ],
    crossReferences: ["exploitation-formula", "hyperstimuli", "dopamine"],
    sources: []
  },
  {
    id: "rat-park",
    title: "Rat Park",
    definition: [
      "Bruce Alexander's experiment showing that addiction is environmental, not chemical.",
      "Standard addiction research isolated rats in small cages and offered them drug-laced water. The rats self-administered to the point of death. Conclusion: drugs are irresistibly addictive.",
      "Alexander built \"Rat Park\"—a large enclosure with other rats, toys, space to explore, things to do. Rats in Rat Park could access the same drug-laced water. They largely ignored it. Even rats who had become addicted in isolation reduced their consumption dramatically when moved to Rat Park.",
      "The variable wasn't the drug. The variable was the environment. Isolated rats self-medicated. Rats with community, stimulation, and connection didn't need to. Addiction isn't the substance—it's the solution to isolation.",
      "The implications for human addiction are profound. We focus on the substance while ignoring the environment that makes the substance appealing. Prohibition, criminalization, even medical treatment—all targeting the symptom while the cause persists."
    ],
    crossReferences: ["proxy", "atomized-individual"],
    sources: [
      "Alexander, B. K. (2010). *The Globalization of Addiction: A Study in Poverty of the Spirit*"
    ]
  },
  {
    id: "reciprocal-altruism",
    title: "Reciprocal Altruism",
    definition: [
      "Helping others with expectation of future help. The foundation of cooperation beyond kinship.",
      "You help a non-relative today. They help you tomorrow. Neither transaction makes sense in isolation—you're expending resources with no immediate return. But over repeated interactions, both parties benefit. The relationship becomes an insurance network.",
      "This only works with memory (you remember who helped, who cheated), reputation (others know who's reliable), and repeated interaction (you'll encounter them again). Hunter-gatherer bands provided all three. Modern anonymity destroys all three.",
      "Reciprocal altruism explains the deep human concern with fairness, obligation, and cheater-detection. These aren't arbitrary morals—they're the cognitive machinery enabling cooperation. The feeling that you ought to return favors, the outrage at freeloaders, the tracking of who owes whom—this is evolved infrastructure for a system that built human sociality."
    ],
    crossReferences: ["demand-sharing", "indirect-fitness", "the-150-tribe"],
    sources: [
      "Trivers, R. L. (1971). \"The Evolution of Reciprocal Altruism.\" *Quarterly Review of Biology*, 46(1), 35-57."
    ]
  },
  {
    id: "rotation",
    title: "Rotation",
    definition: [
      "Formal requirement that power-adjacent roles cycle between members on a fixed schedule.",
      "If someone is good at external negotiation, they might naturally become the permanent negotiator. If someone handles conflict well, they might always be the arbiter. This efficiency has a cost: consolidation of influence. The permanent negotiator develops external relationships others don't have. The permanent arbiter gains power over internal decisions.",
      "Rotation prevents this by formalizing role transition. The negotiator role rotates every six months. The arbiter role rotates every year. Whatever schedule—the point is that no one occupies influence-generating positions permanently.",
      "This trades efficiency for equality. The new negotiator won't be as good as the experienced one. That's the price. The benefit is preventing the emergence of entrenched leadership through accumulated role-specific power."
    ],
    crossReferences: ["domain-separation", "transparency", "egalitarian-enforcement"],
    sources: []
  },
  {
    id: "rumination",
    title: "Rumination",
    definition: [
      "The brain's planning mechanism running without anything to plan.",
      "Rumination evolved to analyze problems and generate solutions. You encounter a threat, you think about it, you develop a response, you execute, the threat resolves, the thinking stops. The loop closes.",
      "Modern rumination is the mechanism running on problems that don't admit solutions. You replay the embarrassing moment but you can't unreplay the event. You analyze the relationship conflict but you can't unlive the past. You worry about climate change but no action you take resolves it. The machinery keeps churning without producing usable output.",
      "This isn't disorder. It's the designed function of the planning system operating in an environment that provides problems beyond its scope. The solution isn't to suppress rumination—it's to either close loops (where possible) or genuinely accept that closure isn't available (where it isn't). Both are hard. Endless running is easier but breaks you."
    ],
    crossReferences: ["open-loop", "closed-loop"],
    sources: []
  },
  {
    id: "serotonin-hypothesis",
    title: "Serotonin Hypothesis",
    definition: [
      "The debunked narrative that depression is caused by serotonin deficiency.",
      "For decades, pharmaceutical companies marketed antidepressants on the premise that depression results from a \"chemical imbalance\"—specifically, too little serotonin. SSRIs (Selective Serotonin Reuptake Inhibitors) were presented as correcting this deficiency.",
      "In 2022, a comprehensive umbrella review in Molecular Psychiatry concluded there is no consistent evidence that depression is associated with low serotonin levels or reduced serotonin activity. The chemical imbalance theory was never well-supported and is now definitively debunked.",
      "SSRIs do something—they have effects beyond placebo for some people. But they don't correct a deficiency. They flood the system with serotonin, which is a fundamentally different mechanism than replacing something missing. Cocaine floods dopamine; we don't say cocaine users have dopamine deficiency.",
      "The narrative was useful for pharma marketing: it's easier to sell a pill that \"corrects an imbalance\" than one that \"affects brain chemistry in ways we don't fully understand for reasons that remain unclear.\" The simplistic story stuck despite scientific inadequacy."
    ],
    crossReferences: ["ghostwritten-studies", "signal-override"],
    sources: [
      "Moncrieff, J. et al. (2022). \"The serotonin theory of depression: A systematic umbrella review of the evidence.\" *Molecular Psychiatry*."
    ]
  },
  {
    id: "signal-override",
    title: "Signal Override",
    definition: [
      "What psychiatric medication actually does: flooding neurotransmitter systems to suppress signals without addressing what the signals are responding to.",
      "Depression signals meaning deficit. SSRIs don't create meaning—they suppress the signal. Anxiety signals threat. Benzodiazepines don't remove threats—they suppress the alarm. ADHD represents hunter cognition; stimulants don't change the cognitive style—they force farmer-brain compliance.",
      "This isn't always wrong. Sometimes signal suppression is necessary to function while addressing root causes. An acutely suicidal person may need immediate intervention regardless of environment. Someone with debilitating anxiety may need relief to begin making changes.",
      "But signal override becomes pathological when it's the whole intervention. Years of medication without environmental change. The signal suppressed indefinitely while the condition generating the signal persists. The patient never gets better because nothing has actually changed—they're just no longer receiving the information that things are wrong."
    ],
    crossReferences: ["oil-light-metaphor", "signal-vs-symptom"],
    sources: []
  },
  {
    id: "signal-vs-symptom",
    title: "Signal vs Symptom",
    definition: [
      "The core distinction the framework rests on.",
      "Signal: Information requiring environmental response. The emotion tells you something about your situation that needs addressing.",
      "Symptom: Malfunction requiring suppression. The emotion is noise—broken machinery producing false output.",
      "Psychiatry treats signals as symptoms. Anxiety about a genuinely threatening environment is labeled disorder and medicated. Depression about a genuinely meaningless existence is labeled disorder and medicated. The signal is accurate. The label makes it a malfunction to be corrected in the patient rather than information to be acted on in the environment.",
      "The question is always: What is this emotion responding to? If the answer is \"genuine environmental mismatch,\" you're looking at a signal. Suppressing signals doesn't solve problems. It just removes awareness of them."
    ],
    crossReferences: ["fish-on-land", "flopping-disorder", "oil-light-metaphor"],
    sources: []
  },
  {
    id: "social-anxiety",
    title: "Social Anxiety",
    definition: [
      "Fear of judgment from an internal audience projected onto real people.",
      "The experience: You're in a social situation. You feel watched, evaluated, likely to be found wanting. You assume others notice your flaws, judge your performance, scrutinize your awkwardness. The fear is intense and interferes with functioning.",
      "The mechanism: Your brain evolved being watched by a tribe of 150 whose opinions mattered for survival. That tribe is gone. The watching-being-watched system now runs on phantoms—an internal audience compiled from various sources. In social situations, this phantom audience is projected onto actual people. You assume strangers are scrutinizing you with the intensity of the internal critics. They're not. They're barely aware you exist. But the projection is automatic.",
      "Social anxiety isn't fear of other people. It's fear of the internal audience, wearing other people's faces."
    ],
    crossReferences: ["internal-audience", "the-150-tribe"],
    sources: []
  },
  {
    id: "status",
    title: "Status",
    definition: [
      "Relative social position within a group. A fundamental human drive because, in ancestral conditions, status determined survival and reproduction.",
      "High-status individuals in hunter-gatherer bands received more resources, more allies, more mating opportunities, more protection during hardship. Low-status individuals received less of all these. The drive to achieve and maintain status is evolution's way of pushing you toward these benefits.",
      "Modern status competition is broken in two ways. First, the comparison pool has exploded from 150 to millions. You're no longer competing for status among people you know—you're comparing yourself to the most successful people on earth. Excellence that would have been top 1% of your tribe is ordinary globally. Second, the markers of status have been abstracted. Follower counts. Net worth numbers. Credentials. These proxies for status can be accumulated without the actual relationships and contributions status was supposed to track.",
      "The result is chronic status anxiety regardless of achievement. Always someone ahead. Always a larger comparison pool available. The drive that evolved to motivate excellence within a tribe now generates perpetual inadequacy in a global arena."
    ],
    crossReferences: ["indirect-fitness", "dunbars-numbers"],
    sources: []
  },
  {
    id: "stranger-overload",
    title: "Stranger Overload",
    definition: [
      "The daily encounter of more unknown humans than ancestors met in years. A massive environmental violation.",
      "In the EEA, every face was known. You might encounter 1,000 strangers in an entire lifetime—at seasonal gatherings, through trade, during rare travel. Daily life involved exclusively people whose entire history, personality, and relationship to you was known.",
      "Modern urban life reverses this completely. You encounter thousands of strangers daily. Every commute, every store, every public space is filled with unknown humans. Your brain can't stop assessing them—threat or not? ally or not? relevant or not? The social evaluation machinery runs constantly on inputs that were never supposed to exist.",
      "This is exhausting. Introverts feel it acutely; extroverts feel it too but often don't identify the cause. The drain of cities isn't just noise and crowds—it's the relentless computation of processing faces that your brain was never designed to encounter."
    ],
    crossReferences: ["eea", "dunbars-numbers"],
    sources: []
  },
  {
    id: "the-5",
    title: "The 5",
    definition: [
      "The innermost Dunbar layer. People you'd call at 3am. Complete vulnerability. Almost daily contact.",
      "These are your emergency contacts not by form but by reality. The people who would drop everything. The people who have seen you at your worst. The people you don't perform for because the performance layer has been exhausted through sheer duration of contact.",
      "If you don't have 5—if that inner circle is empty or occupied by fewer than 5 people—that's the problem. No amount of acquaintances, followers, or networking connections compensates for a missing 5. The intimacy layer serves functions the other layers cannot.",
      "Most modern people have 0-2, not 5. We have many weak ties, few strong ones. The infrastructure that used to build strong ties—daily proximity, shared labor, interdependence—has been dismantled. Building your 5 requires deliberate effort that wasn't necessary when the environment provided it automatically."
    ],
    crossReferences: ["dunbars-numbers", "the-15"],
    sources: []
  },
  {
    id: "the-15",
    title: "The 15",
    definition: [
      "The close friend layer. People whose deaths would devastate you. People whose current struggles you know without having to ask.",
      "This is active care, not passive connection. You track what's happening in their lives. You notice when something's wrong. You invest time and emotional energy regularly enough that the relationship maintains itself.",
      "Fifteen is not arbitrary. It emerges from time constraints. Maintaining a close relationship requires regular contact—hours per month minimum. There aren't enough hours for more than about 15 relationships at this intensity. You can have more acquaintances, but the close-friend layer has a ceiling.",
      "Most people overestimate their 15. They count people they used to be close to, people they're theoretically friends with, people they'd like to be closer to. Count only people you've had meaningful contact with in the last month. The real number is usually smaller than expected."
    ],
    crossReferences: ["dunbars-numbers", "the-5", "the-50-band"],
    sources: []
  },
  {
    id: "the-50-band",
    title: "The 50 (Band)",
    definition: [
      "The band layer. 5-8 families (approximately 50 individuals) in daily interaction. Your immediate community in ancestral conditions.",
      "This is who you'd see every day. Who you'd share meals with. Who you'd work alongside. Who you'd sit with at the fire circle every night. Not just your nuclear family—multiple families intertwined, children raised collectively, labor shared.",
      "The band was the unit of daily life for 300,000 years. The nuclear family—two parents, their children, isolated in a dwelling—is an aberration. The dissolution of band-level community into atomized nuclear units is one of the largest environmental mismatches modern humans face.",
      "Co-housing projects, intentional communities, and compound living arrangements are attempts to reconstruct band-level community in modern conditions. They face significant challenges—legal, financial, cultural—but they're reaching toward something the hardware requires."
    ],
    crossReferences: ["dunbars-numbers", "fire-circle", "alloparenting"],
    sources: []
  },
  {
    id: "the-150-tribe",
    title: "The 150 (Tribe)",
    definition: [
      "The maximum number of people you can maintain stable social relationships with. Beyond this, people become categories.",
      "150 is the ceiling for relationships where you know the person as an individual—their personality, history, relationships, current situation. You can track about 150 people with the combination of neocortex capacity and available time. Beyond that, you're working with abstractions.",
      "Your brain cannot actually know your 5,000 followers. It can track approximate categories, statistical tendencies, maybe some standout individuals. But the rich individual modeling that characterizes genuine relationship maxes out around 150.",
      "This has governance implications. Organizations over 150 require formal structure because informal relationship-based coordination breaks down. Hunter-gatherer tribes that exceeded 150 typically fissioned. Dunbar's number isn't just about friendship—it's about the maximum size for a human-scale social unit."
    ],
    crossReferences: ["dunbars-numbers", "fission-fusion"],
    sources: []
  },
  {
    id: "transition",
    title: "Transition",
    definition: [
      "The period of moving from atomized existence to tribal belonging. Inherently difficult. Most attempts fail here.",
      "The challenge is maintaining survival in the existing system while building alternatives. You can't usually quit your job, move to a commune, and start over. You have rent, obligations, dependencies. The transition requires parallel operation: keep the old running while constructing the new.",
      "This is the double shift. It's exhausting. It's why most tribe formation attempts fail. The solution isn't to pretend it's easy—it's to plan for the difficulty. Build savings buffer. Develop schedule flexibility. Start with small, sustainable steps. Expect setbacks. Treat fission as part of fusion, not as failure.",
      "The first people through will be those with resources: schedule flexibility, savings, existing relationships, lower cost of living. That's not fair, but it's realistic. First adopters create maps others can follow."
    ],
    crossReferences: ["double-shift", "great-filter", "fission-fusion"],
    sources: []
  },
  {
    id: "transparency",
    title: "Transparency",
    definition: [
      "The principle that information should be visible to all tribe members. No back-channels. No private deals. No information asymmetry.",
      "Information asymmetry is proto-hierarchy. When some members know things others don't, those members have power. The one who controls information flow controls the group. Modern organizations run on this—executives know things employees don't, and that asymmetry is part of the hierarchy.",
      "Tribal transparency means: finances visible to all. Decisions logged where anyone can see. Discussions held in public unless there's specific reason for privacy. No faction building through private coordination.",
      "This feels uncomfortable for people trained in hierarchical organizations, where information control is normal. Transparency requires unlearning the instinct to hold cards close. It also requires systems—shared documents, open meetings, logging practices—that make transparency practical."
    ],
    crossReferences: ["rotation", "domain-separation", "egalitarian-enforcement"],
    sources: []
  },
  {
    id: "tribe-formation-ai",
    title: "Tribe Formation AI",
    definition: [
      "Artificial intelligence designed to match people for tribal formation. A modern village matchmaker.",
      "The hypothesis: successful tribe formation depends on compatibility—nervous system regulation styles, conflict approaches, values, life circumstances, goals. Random group formation often fails because people who don't fit are trying to force connection.",
      "AI could potentially analyze these dimensions and suggest matches with higher probability of success. Not replacing human relationship—facilitating introduction of people who might actually work. A discovery tool, not a relationship substitute.",
      "The challenges are significant. What dimensions actually predict success? How do you measure them? How do you prevent the matching process from itself becoming a proxy—an engagement-optimized substitute for real community building?",
      "This technology doesn't exist yet in any meaningful form. It's a direction, not a product."
    ],
    crossReferences: ["decay-function", "pharmakon"],
    sources: []
  },
  {
    id: "variable-ratio-reinforcement",
    title: "Variable Ratio Reinforcement",
    definition: [
      "The most addictive reward schedule known to psychology. Unpredictable rewards for consistent behavior.",
      "If you pull a slot machine lever and win every time, it's not very compelling. If you pull and never win, you stop. If you pull and win on an unpredictable schedule—sometimes after 3 pulls, sometimes after 30, sometimes after 300—you become addicted.",
      "The unpredictability is key. Your dopamine system is most activated by anticipation of uncertain reward. The possibility that the next pull might be the one keeps you pulling. Casinos figured this out decades ago.",
      "Social media runs on the same principle. You scroll and sometimes see something rewarding (a notification, interesting content, social validation). Sometimes not. The variability keeps you scrolling, checking, refreshing. Pull-to-refresh is literally a slot machine lever.",
      "This isn't an accident. These systems are designed by people who know exactly what they're doing. Variable ratio reinforcement is a documented technique, and it's deployed against you deliberately."
    ],
    crossReferences: ["dopamine", "infinite-scroll", "exploitation-formula"],
    sources: [
      "Schüll, N. D. (2012). *Addiction by Design: Machine Gambling in Las Vegas*"
    ]
  },
  {
    id: "viable-exit",
    title: "Viable Exit",
    definition: [
      "The ability to leave a tribe without catastrophic consequences. A feature, not a bug.",
      "In the EEA, leaving your band was dangerous—potentially fatal. This gave the group coercive power. You couldn't leave even if you wanted to. Modern tribes are different: leaving isn't death. You can go back to atomized existence. It's not great, but it's survivable.",
      "This should be made explicit and protected. Members should know they can leave. There should be clear processes for departure. No one should be trapped. The ability to exit—and the group's knowledge that you can exit—changes the power dynamics. You're choosing to stay, not forced to. That makes the tribe less coercive, not more.",
      "Viable exit is what distinguishes tribe from cult. Cults make leaving difficult, dangerous, or costly. Tribes make leaving possible while making staying attractive. You're held by value, not by bars."
    ],
    crossReferences: ["fission-fusion", "onboarding-filter"],
    sources: []
  },
  {
    id: "visible-contribution",
    title: "Visible Contribution",
    definition: [
      "Work whose results you can see, whose benefits accrue to people you know.",
      "Ancestral work was visible: hunt → meat → everyone eats. Build shelter → shelter exists. Gather → food appears. The contribution was tangible, the beneficiaries were identifiable, and the connection between effort and outcome was immediate.",
      "Modern abstracted labor severs this connection. You move information, attend meetings, produce reports. At the end of the day, you cannot point to anything that exists because of your work. The contribution is invisible. The beneficiaries are shareholders you'll never meet. The meaning-making systems that connect effort to purpose have nothing to work with.",
      "This is why \"bullshit jobs\" feel like bullshit even when they pay well. It's why meaningful work is meaningful regardless of pay. The variable isn't compensation—it's visibility of contribution. Work that produces nothing tangible, benefits no one you know, and exists primarily to perpetuate itself cannot satisfy the drive that work was supposed to satisfy."
    ],
    crossReferences: ["bullshit-jobs", "immediate-return-economy", "open-loop"],
    sources: []
  },
  {
    id: "whales",
    title: "Whales",
    definition: [
      "Gambling industry term for vulnerable users who account for disproportionate revenue. Now applicable across the exploitation economy.",
      "In casinos, \"whales\" are high rollers who lose large amounts. The term has migrated to gaming (players who spend thousands on microtransactions), apps (users who can't stop paying), and any business model where a small percentage of highly vulnerable users generate most profit.",
      "The ethics are stark: these business models depend on exploiting people with the least ability to resist. Problem gamblers, people with addictive tendencies, those using consumption to fill emotional voids. \"Whale hunting\" explicitly targets those most vulnerable to manipulation.",
      "Your vulnerability is their profit center. The business model isn't to serve users well—it's to identify who can be exploited most, then optimize exploitation. Engagement metrics, personalization, A/B testing—all deployed to find and hook whales."
    ],
    crossReferences: ["exploitation-formula", "variable-ratio-reinforcement"],
    sources: []
  }
];

// Get unique first letters for alphabet nav
const ALPHABET = Array.from(new Set(GLOSSARY_TERMS.map(t => t.title[0].toUpperCase()))).sort();

// Format italic text
function formatText(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

// Get term title by ID
function getTermTitle(id: string): string {
  const term = GLOSSARY_TERMS.find(t => t.id === id);
  return term ? term.title : id;
}

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    let terms = GLOSSARY_TERMS;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      terms = terms.filter(term =>
        term.title.toLowerCase().includes(query) ||
        term.definition.some(p => p.toLowerCase().includes(query))
      );
    }

    if (activeLetter) {
      terms = terms.filter(term => term.title[0].toUpperCase() === activeLetter);
    }

    return terms;
  }, [searchQuery, activeLetter]);

  return (
    <main className="min-h-screen bg-[#faf9f6] pt-20">
      <Navigation />

      {/* Header */}
      <header className="px-8 py-12 max-w-4xl mx-auto">
        <h1 className="text-5xl text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Glossary
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A comprehensive reference for all concepts in the DEMISMATCH framework.
          Each term can be linked directly using <code className="bg-gray-100 px-2 py-1 rounded text-sm">/glossary#term-name</code> format.
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveLetter(null);
            }}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c75b3a]/50 focus:border-[#c75b3a]"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Alphabet navigation */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveLetter(null)}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              activeLetter === null ? 'bg-[#c75b3a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {ALPHABET.map(letter => (
            <button
              key={letter}
              onClick={() => {
                setActiveLetter(letter);
                setSearchQuery("");
              }}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                activeLetter === letter ? 'bg-[#c75b3a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </header>

      {/* Terms count */}
      <div className="px-8 max-w-4xl mx-auto mb-8">
        <p className="text-sm text-gray-500">
          Showing {filteredTerms.length} of {GLOSSARY_TERMS.length} terms
        </p>
      </div>

      {/* Terms list */}
      <article className="px-8 pb-20 max-w-4xl mx-auto">
        <div className="space-y-12">
          {filteredTerms.map((term) => (
            <div key={term.id} id={term.id} className="scroll-mt-24">
              <h2
                className="text-2xl text-gray-900 mb-4 pb-2 border-b border-gray-200"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <a href={`#${term.id}`} className="hover:text-[#c75b3a] transition">
                  {term.title}
                </a>
              </h2>

              <div className="space-y-4 mb-4">
                {term.definition.map((paragraph, idx) => (
                  <p key={idx} className="text-lg text-gray-700 leading-relaxed">
                    {formatText(paragraph)}
                  </p>
                ))}
              </div>

              {/* Cross-references */}
              {term.crossReferences.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">See also:</p>
                  <div className="flex flex-wrap gap-2">
                    {term.crossReferences.map(ref => (
                      <a
                        key={ref}
                        href={`#${ref}`}
                        className="text-sm px-3 py-1 bg-gray-100 text-[#c75b3a] rounded-full hover:bg-[#c75b3a] hover:text-white transition"
                      >
                        {getTermTitle(ref)}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources */}
              {term.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-2">Sources:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {term.sources.map((source, idx) => (
                      <li key={idx}>{formatText(source)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No terms found matching your search.</p>
          </div>
        )}
      </article>

      {/* Footer note */}
      <section className="px-8 py-12 max-w-4xl mx-auto border-t border-gray-200">
        <p className="text-sm text-gray-500 italic">
          This glossary is part of the DEMISMATCH framework. The framework is open source.
          Fork it, improve it, implement it. No one owns truth about human nature.
        </p>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-gray-200 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-8 text-sm text-gray-600 mb-6">
          <Link href="/framework" className="hover:text-gray-900">Framework</Link>
          <Link href="/library" className="hover:text-gray-900">Library</Link>
          <Link href="/projects" className="hover:text-gray-900">Projects</Link>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
          <Link href="/faq" className="hover:text-gray-900">FAQ</Link>
          <Link href="/glossary" className="hover:text-gray-900">Glossary</Link>
        </div>
        <p className="text-sm text-gray-500">This framework is open. Fork it, improve it, implement it.</p>
      </footer>
    </main>
  );
}
