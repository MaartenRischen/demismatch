"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface TileData {
  id: number;
  question: string;
  answer: string;
  imageUrl: string;
}

// Glossary definitions for inline popups (first paragraph of each term)
const glossaryData: Record<string, { title: string; definition: string }> = {
  "mismatch": { title: "Mismatch", definition: "The gap between the environment your biology expects and the environment you actually inhabit. Your brain was built for a world that no longer exists." },
  "eea": { title: "EEA (Environment of Evolutionary Adaptedness)", definition: "The conditions humans evolved in. The spec sheet for human thriving. For roughly 300,000 years, certain environmental conditions were constant: small bands of 30-50 people, extended tribe of 150, known faces, daily closure." },
  "open-loop": { title: "Open Loop", definition: "A problem that cannot be resolved through action. Chronic emotion without resolution. Your brain evolved solving problems, but modern life generates problems immune to action." },
  "closed-loop": { title: "Closed Loop", definition: "A problem resolved through action. The emotional state dissipates because the situation is handled. Hunt → eat → done. This is what your brain evolved for." },
  "status": { title: "Status", definition: "Relative social position within a group. A fundamental human drive because, in ancestral conditions, status determined survival and reproduction." },
  "indirect-fitness": { title: "Indirect Fitness", definition: "Survival and reproduction through social mechanisms. The drives that make you care about reputation, status, reciprocity, and belonging." },
  "dunbars-numbers": { title: "Dunbar's Numbers", definition: "Hard cognitive limits on relationships: 5 intimate, 15 close friends, 50 good friends (the band), 150 meaningful acquaintances (the tribe). Beyond 150, people become categories." },
  "the-5": { title: "The 5", definition: "The innermost Dunbar layer. People you'd call at 3am. Complete vulnerability. Almost daily contact. If you don't have 5—that's the problem." },
  "the-15": { title: "The 15", definition: "The close friend layer. People whose deaths would devastate you. People whose current struggles you know without having to ask." },
  "the-50-band": { title: "The 50 (Band)", definition: "5-8 families (approximately 50 individuals) in daily interaction. Your immediate community in ancestral conditions. Who you'd share meals with, work alongside, sit with at the fire circle." },
  "the-150-tribe": { title: "The 150 (Tribe)", definition: "The maximum number of people you can maintain stable social relationships with. Beyond this, people become categories. Your brain cannot actually know your 5,000 followers." },
  "parasocial-relationships": { title: "Parasocial Relationships", definition: "One-way emotional bonds with people who don't know you exist. You know their face, voice, struggles—they've never heard your name. The counterfeit intimacy of media." },
  "proxy": { title: "Proxy", definition: "A substitute that hijacks a biological drive without satisfying the underlying need. Social media for tribe. Porn for intimacy. Momentary relief, increasing hunger. Salt water for thirst." },
  "signal-vs-symptom": { title: "Signal vs Symptom", definition: "Signal: Information requiring environmental response. Symptom: Malfunction requiring suppression. Psychiatry treats signals as symptoms, medicating accurate feedback instead of addressing the environment." },
  "oil-light-metaphor": { title: "Oil Light Metaphor", definition: "Medication is like covering the oil light instead of checking the engine. Signal suppressed, underlying problem unchanged." },
  "visible-contribution": { title: "Visible Contribution", definition: "Work whose results you can see, whose benefits accrue to people you know. Ancestral work was visible: hunt → meat → everyone eats. Modern work is often invisible abstraction." },
  "fish-on-land": { title: "Fish on Land", definition: "The core metaphor. A fish out of water flops around—its gills work perfectly, designed for water. The problem isn't broken fish. The problem is wrong environment. You wouldn't medicate the flopping." },
  "flopping-disorder": { title: "Flopping Disorder", definition: "Satirical term for pathologizing adaptive responses to environmental mismatch. We name the flopping, categorize it, medicate it—while ignoring the environment." },
  "fire-circle": { title: "Fire Circle", definition: "The nightly gathering of the entire band. 2-4 hours every single night for 300,000 years. Processing the day, storytelling, bonding. We've replaced it with screens." },
  "alloparenting": { title: "Alloparenting", definition: "Child-rearing by multiple adults—not just biological parents. In ancestral conditions, children were raised by 20+ caregivers. The nuclear family—two exhausted parents alone—is a historical aberration." },
  "rumination": { title: "Rumination", definition: "The brain's planning mechanism running without anything to plan. It evolved to analyze problems and generate solutions, but now runs on problems that don't admit solutions." },
  "internal-audience": { title: "Internal Audience", definition: "Imaginary critics in your mind generating real biological responses. Your brain evolved being watched by 150. Now it simulates an audience—harsher than any real one." },
  "negativity-bias": { title: "Negativity Bias", definition: "The brain's tendency to weight negative information more heavily. Missing a threat was fatal; missing an opportunity was recoverable. Now it runs on phantoms." },
  "perfectionism-trap": { title: "Perfectionism Trap", definition: "The internal audience demanding impossible, mutually contradictory standards. Be confident but not arrogant. Be successful but not obsessed. Any position violates something." },
  "partial-control": { title: "Partial Control", definition: "The worst anxiety zone. Enough influence to feel responsible but not enough to determine outcomes. You can't let go, but you can't resolve it." },
  "hyperstimuli": { title: "Hyperstimuli", definition: "Stimuli exceeding anything in nature. Porn, junk food, social media—they hijack drives by exaggerating what drives respond to. Real satisfactions become inadequate." },
  "atomized-individual": { title: "Atomized Individual", definition: "A person severed from tribe, purpose, and genuine intimacy. The ideal consumer unit. A satisfied human is a terrible customer." },
  "exploitation-formula": { title: "Exploitation Formula", definition: "Identify need → block satisfaction → offer proxy → proxy doesn't satisfy → monetize return visits. Social media, porn, junk food, news all follow this pattern." },
  "variable-ratio-reinforcement": { title: "Variable Ratio Reinforcement", definition: "The most addictive reward schedule. Unpredictable rewards for consistent behavior. Pull-to-refresh is literally a slot machine lever." },
  "dopamine": { title: "Dopamine", definition: "Neurotransmitter driving reward-seeking. It spikes on anticipation, not receipt. Modern tech delivers triggers without effort or satisfaction—chronic activation, tolerance, baseline depression." },
  "serotonin-hypothesis": { title: "Serotonin Hypothesis", definition: "The debunked narrative that depression is caused by serotonin deficiency. A 2022 review found no consistent evidence. The chemical imbalance theory was marketing, not science." },
  "signal-override": { title: "Signal Override", definition: "What psychiatric medication actually does: flooding systems to suppress signals without addressing what the signals are responding to. Sometimes necessary—but often the whole intervention." },
  "ghostwritten-studies": { title: "Ghostwritten Studies", definition: "Research papers written by pharmaceutical companies and published under academic names. The 'scientific literature' is substantially marketing material." },
  "cortisol": { title: "Cortisol", definition: "Stress hormone designed to spike briefly, then dissipate. Tiger appears → cortisol mobilizes. Tiger leaves → cortisol drops. Modern life: the tiger never leaves." },
  "bliss-point": { title: "Bliss Point", definition: "The precise combination of sugar, fat, and salt engineered to maximize craving without satisfaction. Designed to be impossible to eat in moderation." },
  "rat-park": { title: "Rat Park", definition: "Experiment showing addiction is environmental. Isolated rats self-medicate. Rats in enriched environments largely ignore drugs. The variable is environment, not substance." },
  "farmer-brain": { title: "Farmer Brain", definition: "The compliant, sit-still cognitive style institutions treat as normal. ADHD isn't broken attention—it's hunter cognition in a farmer world." },
  "bullshit-jobs": { title: "Bullshit Jobs", definition: "Jobs whose existence the workers themselves cannot justify. Work that produces nothing tangible, benefits no one you know, exists to perpetuate itself." },
  "stranger-overload": { title: "Stranger Overload", definition: "Encountering more unknown humans daily than ancestors met in years. Your brain can't stop assessing them—threat or not? The drain of cities." },
  "immediate-return-economy": { title: "Immediate-Return Economy", definition: "Hunt → eat. Gather → consume. Work → benefit. The line between effort and reward is direct, visible, immediate. Not layers of abstraction." },
  "demand-sharing": { title: "Demand Sharing", definition: "Those with surplus share when asked. Not charity—obligation and insurance. Tomorrow you might be asking. Poverty impossible within the group." },
  "egalitarian-enforcement": { title: "Egalitarian Enforcement", definition: "How hunter-gatherers prevented dominance. Boasting, hoarding, bossing triggered immediate coalition response. Christopher Boehm calls it 'reverse dominance hierarchy.'" },
  "conflict-resolution-cascade": { title: "Conflict Resolution Cascade", definition: "Humor → public discussion → ridicule → shunning → exile → violence (rare). Most conflicts resolved early through joking. Reputation was inescapable." },
  "circadian-rhythm": { title: "Circadian Rhythm", definition: "Your body's internal clock. Wake with light. Active morning. Rest afternoon. Fire circle evening. Sleep with darkness. No alarm clocks. No artificial light." },
  "fission-fusion": { title: "Fission-Fusion", definition: "Natural social dynamics where groups split and reform fluidly. Not failure—social metabolism. When the band grew too large, it split. Fluidity meant you were never permanently trapped." },
  "metapopulation": { title: "Metapopulation", definition: "The 500-1500 people connected across multiple tribes through marriage, kinship, and trade. The broader network ensuring genetic diversity and resilience." },
  "rotation": { title: "Rotation", definition: "Power-adjacent roles cycle between members on a fixed schedule. No one occupies influence-generating positions permanently. Trades efficiency for equality." },
  "transparency": { title: "Transparency", definition: "Information visible to all tribe members. No back-channels. No private deals. Information asymmetry is proto-hierarchy." },
  "domain-separation": { title: "Domain Separation", definition: "No single person holds multiple power-adjacent roles. Separating domains prevents power consolidation despite formal rules." },
  "onboarding-filter": { title: "Onboarding Filter", definition: "Screening process for new members to identify hierarchy-trained dominance patterns. Trial period to surface problems before full inclusion." },
  "viable-exit": { title: "Viable Exit", definition: "The ability to leave without catastrophic consequences. What distinguishes tribe from cult. You're held by value, not by bars." },
  "demismatch": { title: "Demismatch", definition: "Consciously aligning your environment with your biology. Not going back to caves—building forward with the spec sheet. The intervention is changing conditions, not fixing yourself." },
  "augment": { title: "Augment", definition: "Extending capability through technology—but only from a foundation of thriving. You can't augment broken. Demismatch first, then augment." },
  "pharmakon": { title: "Pharmakon", definition: "Greek for both poison and cure. Technology's dual nature. Same tools creating mismatch can serve demismatching—if designed differently." },
  "decay-function": { title: "Decay Function", definition: "Technology designed to degrade without in-person presence. Features lock unless you've met recently. Success measured by decreasing use. Opposite of engagement optimization." },
  "tribe-formation-ai": { title: "Tribe Formation AI", definition: "AI designed to match people for tribal formation. Analyzing compatibility—nervous system styles, conflict approaches, values. A discovery tool, not relationship substitute." },
  "the-most-human-post-human": { title: "Most Human Post-Human", definition: "Humans with matched environments, enhanced by technology. Meeting needs fully, then augmenting. Baseline thriving plus capability enhancement." },
  "double-shift": { title: "Double Shift", definition: "Maintaining wage labor while building tribal structure. 8 hours capitalist work + 2-3 hours tribal maintenance. Unsustainable. The primary reason tribe formation attempts fail." },
  "great-filter": { title: "Great Filter", definition: "The transition period where most tribe formation attempts fail. Double shift exhausts. Hierarchies emerge despite intentions. Not character failure—predictable difficulty." },
  "transition": { title: "Transition", definition: "Moving from atomized existence to tribal belonging. Inherently difficult. Keep the old running while constructing the new. Expect setbacks. Treat fission as part of fusion." },
  "whales": { title: "Whales", definition: "Vulnerable users who account for disproportionate revenue. Problem gamblers, people with addictive tendencies. Your vulnerability is their profit center." },
  "infinite-scroll": { title: "Infinite Scroll", definition: "Deliberate open loop design. No end state. No completion signal. Your brain keeps seeking closure that will never come." },
  "reciprocal-altruism": { title: "Reciprocal Altruism", definition: "Helping others with expectation of future help. The foundation of cooperation beyond kinship. Only works with memory, reputation, and repeated interaction." },
  "direct-fitness": { title: "Direct Fitness", definition: "Survival and reproduction mechanisms that run automatically. Hunger, thirst, fear, lust. You can override them temporarily but can't eliminate them." },
  "social-anxiety": { title: "Social Anxiety", definition: "Fear of the internal audience projected onto real people. You assume strangers scrutinize you intensely. They're not—they're barely aware you exist." },
  "mismatched": { title: "Mismatch", definition: "The gap between the environment your biology expects and the environment you actually inhabit. Your brain was built for a world that no longer exists." }
};

// Image mappings for each question - SINGLE PANEL IMAGES ONLY (no two-panel/comparison images)
// Carefully selected to match each tile's topic from the 2850+ image library
const imageMap: Record<number, string> = {
  // CATEGORY 1: EVER WONDER WHY? (1-6)
  1: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/38_THE_STRESS_RESPONSE_MODULATION.png', // Why feel bad - stress/mismatch
  2: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/96_THE_TIME_PERCEPTION.png', // Modern life wrong - time/ancestral
  3: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/22_THE_NEWS_ADDICTION.png', // Can't stop thinking - open loops/news
  4: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/4_THE_FISH_YOU_CAUGHT.png', // Finish something - closed loop/fish
  5: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/72_THE_STATUS_RECOGNITION.png', // Care what strangers think - status
  6: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/51_THE_NETWORK_EXPANSION.png', // Dunbar limit - network
  // CATEGORY 2: FEEL FAMILIAR? (7-27)
  7: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/15_THE_SHALLOW.png', // 2000 followers lonely - shallow
  8: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/1_THE_PROXY.png', // Substitutes never satisfy - proxy
  9: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/43_THE_GAMING_ADDICTION.png', // Quick fixes worse - gaming addiction
  10: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/32_THE_MOVING_GOALPOST.png', // Want more - hedonic treadmill
  11: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/4_THE_EMOTION_REGULATION_CHIP.png', // Emotions telling - emotion signal
  12: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/31__MENTAL_HEALTH_IS_HEALTH_.png', // Feelings not problem - environment
  13: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/1_THE_CHEMICAL_IMBALANCE.png', // Symptoms telling something - psychiatry
  14: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/32_THE_SIDE_EFFECT.png', // Treating symptoms - medication
  15: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/70_THE_INHERITED_FEAR.png', // Anxiety actually - threat detection
  16: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/90_THE_PURPOSE_CLARIFICATION.png', // Depression actually - meaning
  17: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/19_THE_FISHING_REPORT.png', // Fish on land - fish metaphor
  18: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/4_THE_DSM.png', // Diagnose flopping - DSM
  19: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/84_THE_EMOTIONAL_RANGE.png', // Wrong environment - emotional range
  20: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/100_THE_HOME.png', // EEA evolved for - ancestral home
  21: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/2_THE_MEMORY_ENHANCEMENT.png', // Can't stop ruminating - rumination
  22: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/22_THE_REPUTATION.png', // Imagine people judging - internal audience
  23: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/83_THE_PATTERN_RECOGNITION.png', // Assume the worst - negativity bias
  24: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/34_THE_IMPOSTER_LOOP.png', // Never good enough - perfectionism
  25: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/68_THE_COLLEGE_APPLICATION.png', // Partial control - open loop anxiety
  26: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/93_THE_LOVE_CAPACITY.png', // Close friends needed - 5
  27: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/90_THE_KNOWING.png', // People genuinely care - 15
  // CATEGORY 3: CERTAIN IT'S YOUR FAULT? (28-46)
  28: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/44_THE_ACHIEVEMENT_HOLLOW.png', // Failing when successful - hollow achievement
  29: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/25_THE_COG.png', // Modern work meaningless - bullshit jobs
  30: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/3_THE_PRODUCTIVITY_IMPLANT.png', // What are bullshit jobs - productivity
  31: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/27_THE_SENSORY_UPGRADE.png', // Exhausted by crowds - sensory overload
  32: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/82_THE_FANDOM.png', // Connected to strangers - parasocial
  33: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/83_THE_CELEBRITY.png', // Obsessed with celebrities - celebrity
  34: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/17_THE_US_AND_THEM.png', // Sports fans - tribalism
  35: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/48_THE_FICTION.png', // Fake better than real - fiction/escapism
  36: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/74_THE_BELONGING_SIGNALS.png', // Tribe size - belonging
  37: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/1_THE_MIDNIGHT_SCROLL.png', // Technology extend Dunbar - phone addiction
  38: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/hoffman_interface_theory_series/29_THE_MEMORY_ENGINE.png', // Brain lies about needs - perception
  39: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/5_THE_ATTENTION_ENHANCEMENT.png', // Perceive reality - attention
  40: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/5_THE_MISFIRING.png', // Wants vs needs - misfiring
  41: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/59_THE_SUBSTANCE_USE.png', // Rat park - addiction/isolation
  42: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/42_THE_ALCOHOL_DEPENDENCY.png', // Addiction actually - substance
  43: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/17_THE_IMPOSTER_SYNDROME.png', // ADHD actually - imposter
  44: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/64_THE_CELEBRATION_COORDINATION.png', // Social anxiety - celebration
  45: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/78_THE_MILLENNIAL_BURNOUT.png', // Burnout - millennial burnout
  46: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_imposter_syndrome.jpeg', // Imposter syndrome - imposter
  // CATEGORY 4: THE COMPLETE PICTURE (47-64)
  47: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/38_THE_STRESS_RESPONSE_MODULATION.png', // What is mismatch - stress
  48: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/3_THE_FIRE.png', // EEA - fire circle
  49: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/7_THE_LIFESPAN_EXTENSION.png', // Wrong environment - isolation
  50: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/4_THE_FUNCTION.png', // Drives behavior - function
  // Continued: THE COMPLETE PICTURE (51-64) - urges, approval, reciprocity, Dunbar
  51: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/94_THE_CONTENTMENT_BASELINE.png', // Urges can't control - contentment
  52: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/9_THE_TALL_POPPY.png', // Need approval - status/tall poppy
  53: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/34_THE_FREE_RIDER.png', // Reciprocity - free rider
  54: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/83_THE_LAUGHTER.png', // Close friends needed - laughter/bonding
  55: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/69_THE_INTERGENERATIONAL.png', // How many care about - intergenerational
  56: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_scale_matters/10_THE_WORSHIP.png', // Community size - scale matters
  57: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/43_THE_NEURAL_PLASTICITY_BOOST.png', // Train more relationships - plasticity
  58: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/9_THE_LANGUAGE_TRANSLATOR.png', // Stranger in own city - isolation
  59: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/24_THE_PHONE_SEPARATION.png', // Tech extend Dunbar - phone dependence
  60: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/hoffman_interface_theory_series/33_THE_MATE_FLOOD.png', // Brain lies - interface theory
  61: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/34_THE_VISION_ENHANCEMENT.png', // Perceive reality - vision
  62: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/3_THE_CRAVING.png', // Wants vs needs - craving
  63: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/59_THE_SUBSTANCE_USE.png', // Rat park - addiction
  64: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/43_THE_NEURAL_PLASTICITY_BOOST.png', // Addiction actually - neural
  // CATEGORY 5: THE EXPLOITATION (65-79)
  65: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/81_THE_ARRIVAL.png', // Suffering profitable - unfulfillment
  66: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/96_THE_GAMIFICATION.png', // Companies make money - gamification
  67: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/1_THE_AI_COMPANION.png', // Alone easier to manipulate - AI companion
  68: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/18_THE_SHOPPING_HIGH.png', // Most exploited - shopping
  69: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dating_mating_100_prompts_final2/95_THE_SLOT_MACHINE.png', // Slot machines/social media - slot machine
  70: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/31_THE_BLISS_POINT.png', // Dopamine hijacked - bliss point
  71: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/1_THE_MIDNIGHT_SCROLL.png', // Social media exploits - midnight scroll
  72: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/67_THE_DIRECT-TO-CONSUMER.png', // Advertising exploits - direct to consumer
  73: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_lottery.jpeg', // Gambling exploits - lottery
  74: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/22_THE_NEWS_ADDICTION.png', // News media exploits - news addiction
  75: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/34_THE_HYPERPALATABLE.png', // Food industry exploits - hyperpalatable
  76: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/4_THE_DATING_APP.png', // Dating apps exploit - dating app
  77: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/19_THE_PORN_ADDICTION.png', // Porn exploits - porn addiction
  78: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/88_THE_THERAPY.png', // Self-help exploits - therapy
  79: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/83_THE_PATTERN_RECOGNITION.png', // Why not common knowledge - pattern recognition
  // CATEGORY 6: THE MISDIAGNOSIS (80-92)
  80: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/1_THE_CHEMICAL_IMBALANCE.png', // Chemical imbalance - psychiatry
  81: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/32_THE_SIDE_EFFECT.png', // Medication does - side effects
  82: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/55_THE_PHARMACEUTICAL_REP.png', // Pharma exploits - pharma rep
  83: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/62_THE_PUBLICATION_BIAS.png', // Ghostwritten studies - publication bias
  84: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/38_THE_STRESS_RESPONSE_MODULATION.png', // Chronic stress - stress response
  85: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/71_THE_FIVE_MINUTE_MED_CHECK.png', // 15-min med check
  86: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/68_THE_ANXIETY_MEDICATION.png', // Medication necessary - anxiety med
  87: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/4_THE_DSM.png', // Real diseases - DSM
  88: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/20_THE_GENETIC_OPTIMIZATION.png', // Heritable - genetics
  89: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/43_THE_NEURAL_PLASTICITY_BOOST.png', // Brain differences - neural
  90: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/43_THE_NEURAL_PLASTICITY_BOOST.png', // Neuroplasticity - plasticity
  91: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/88_THE_THERAPY.png', // Wrong with therapy - therapy
  92: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/91_THE_DEATH_AWARENESS.png', // People die from this - death awareness
  // CATEGORY 7: THE EVIDENCE (93-99)
  93: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/98_THE_PEAK_EXPERIENCE.png', // WHO studies - global perspective
  94: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/3_THE_FIRE.png', // Hunter-gatherer studies - fire circle
  95: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/85_THE_PRESENCE_ENHANCEMENT.png', // Environmental interventions - presence
  96: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/70_THE_COLLECTIVE_PROJECTS.png', // Intentional communities - collective
  97: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/69_THE_RESOURCE_SHARING.png', // Twin Oaks - resource sharing
  98: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/59_THE_COMMUNITY_CURRENCY.png', // East Wind - community
  99: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/100_THE_INTEGRATION.png', // Auroville - integration/failure
  // CATEGORY 8: THE SPEC SHEET (100-114)
  100: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/65_THE_FIRE_WATCHED.png', // Fire circle every night
  101: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/61_THE_PARENTING_SUPPORT_NETWORK.png', // Parents alone - alloparenting
  102: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/62_THE_FREE_RANGE.png', // Separate by age - free range
  103: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/95_THE_REAL_ELDER.png', // Apprenticeship - mentorship
  104: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/69_THE_RESOURCE_SHARING.png', // Prevent poverty - resource sharing
  105: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/22_THE_CONTRIBUTION.png', // Work before money - contribution
  106: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/28_THE_INSULT.png', // Leaders - egalitarianism
  107: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/68_THE_COLLECTIVE_GOVERNANCE.png', // Prevent takeover - collective governance
  108: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/54_THE_CONFLICT_RESOLUTION_AI.png', // Handle conflict - conflict resolution
  109: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/40_THE_CIRCADIAN_OPTIMIZATION.png', // Circadian rhythm
  110: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/67_THE_MATERNAL.png', // Infant contact - maternal
  111: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/36_THE_FERTILITY_CONTROL.png', // Birth spacing - fertility
  112: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/11_THE_STRANGER_DANGER.png', // Strangers encountered - stranger danger
  113: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/55_THE_MATCHMAKING_ALGORITHM.png', // Avoid inbreeding - matchmaking
  114: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/51_THE_NETWORK_EXPANSION.png', // Groups reform - fission-fusion
  // CATEGORY 9: THE DESTINATION (115-138)
  115: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/100_THE_HOME.png', // Actually fix this - home
  116: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/16_THE_VIRTUAL_REALITY_IMMERSION.png', // Tech can't fix - VR
  117: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/76_THE_MEDITATION_ENHANCEMENT.png', // Tech enhance - meditation
  118: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/10_THE_PATREON_CRAFT.png', // Tech help or hurt - bridge
  119: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/93_THE_REAL_RITUAL.png', // Meet in person - ritual
  120: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/55_THE_MATCHMAKING_ALGORITHM.png', // AI find people - matchmaking
  121: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/39_THE_MENTOR_MATCHED.png', // Existing tech - mentor matched
  122: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/20_THE_ZERO_SUM.png', // VC not fund - zero sum
  123: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/90_THE_PURPOSE_CLARIFICATION.png', // End goal - purpose
  124: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/94_THE_CONTENTMENT_BASELINE.png', // Know if arrived - contentment
  125: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/68_THE_COLLECTIVE_GOVERNANCE.png', // Explicit governance - governance
  126: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/73_THE_TRUST_NETWORK.png', // Tribe vs cult - trust
  127: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/28_THE_INSULT.png', // Prevent permanent leader - insult/leveling
  128: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/56_THE_GROUP_DECISION_SUPPORT.png', // Everyone see everything - transparency
  129: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/66_THE_SKILL_SHARING_PLATFORM.png', // Multiple roles - skill sharing
  130: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/8_THE_SYCOPHANT.png', // Keep manipulators out - sycophant
  131: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/60_THE_SAFETY_NETWORK.png', // Want to leave - safety network
  132: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/37_THE_ORDEAL.png', // Meaningful without struggle - ordeal
  133: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/107_THE_FAILURE_SURVIVED.png', // Suffering necessary - failure survived
  134: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/18_THE_AUTOMATED_INCOME.png', // UBI not answer - automated income
  135: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/3_THE_PRODUCTIVITY_IMPLANT.png', // Automation change - productivity
  136: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/1_THE_AI_COMPANION.png', // Mass shootings - isolation
  137: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/79_THE_FLOW_STATE_ACCESS.png', // Entertainment bad - flow state
  138: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/3_THE_FIRE.png', // Not meant to live like this - fire circle
  // CATEGORY 10: OBJECTIONS (139-146)
  139: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/97_THE_SELF_TRANSCENDENCE.png', // I'm an introvert - self transcendence
  140: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/84_THE_EMOTIONAL_RANGE.png', // Different needs - emotional range
  141: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/41_THE_MYTH.png', // Romanticizing past - myth
  142: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/39_THE_SIMULATED.png', // Sounds like cult - simulated bonding
  143: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/70_THE_COLLECTIVE_PROJECTS.png', // Society can't reorganize - collective
  144: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/87_THE_CHILDREN.png', // Only privileged - wealth
  145: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/77_THE_ELDERLY_ISOLATION.png', // Can't form relationships - isolation
  146: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/86_THE_GYM_AS_CHURCH.png', // Touch grass - gym as church
  // CATEGORY 11: PRACTICAL FIRST STEPS (147-161)
  147: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/85_THE_PRESENCE_ENHANCEMENT.png', // Step one - presence
  148: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/32_THE_WEEKLY.png', // Step two - weekly gathering
  149: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/66_THE_SKILL_SHARING_PLATFORM.png', // Step three - skill sharing
  150: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/75_THE_COLLECTIVE_MEMORY.png', // Step four - collective memory
  151: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/10_THE_COMMUTE.png', // Smallest change - commute
  152: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/63_THE_GRIEF_SUPPORT.png', // Can't build tribe now - grief support
  153: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/96_THE_TIME_PERCEPTION.png', // How long - time perception
  154: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/29_THE_ENDURANCE_BOOST.png', // Why exhausting - endurance
  155: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/96_THE_SUCCESS_DEFINITION.png', // Why most fail - success definition
  156: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/60_THE_SAFETY_NETWORK.png', // Who can attempt - safety network
  157: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/107_THE_FAILURE_SURVIVED.png', // If attempt fails - failure survived
  158: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/22_THE_EMOTIONAL_INTELLIGENCE_UPGRADE.png', // Common mistake - emotional intelligence
  159: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/90_THE_KNOWING.png', // One thing to remember - knowing
  160: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/100_THE_INTEGRATION.png', // What now - integration
  161: 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/100_THE_HOME.png', // Final - home/belonging
};

const tileData: TileData[] = [
  {
    id: 1,
    question: "Why do you feel so bad?",
    answer: `You're not broken. Your environment is.

This is [mismatch](/glossary#mismatch)—the gap between what your biology expects and what it gets. Your brain was built for a world that no longer exists.`,
    imageUrl: imageMap[1]
  },
  {
    id: 2,
    question: "Why does modern life feel so wrong?",
    answer: `You evolved for completely different conditions.

For 300,000 years, humans lived in the [EEA](/glossary#eea)—small bands, known faces, daily closure. Then everything changed faster than evolution could track.`,
    imageUrl: imageMap[2]
  },
  {
    id: 3,
    question: "Why can't you stop thinking about things you can't control?",
    answer: `You're caught in an [open loop](/glossary#open-loop).

Your brain evolved to solve problems and move on. Climate change? The economy? No action resolves them. The loop won't close.`,
    imageUrl: imageMap[3]
  },
  {
    id: 4,
    question: "What would it feel like to actually finish something?",
    answer: `That's a [closed loop](/glossary#closed-loop). Problem resolved. Emotion dissipates.

Hunt → eat → done. This is what your brain was designed for. Not infinite unresolvable anxiety.`,
    imageUrl: imageMap[4]
  },
  {
    id: 5,
    question: "Why do you care what strangers think?",
    answer: `Because social rejection used to be death.

High [status](/glossary#status) meant survival. The drive isn't vanity—it's [indirect fitness](/glossary#indirect-fitness). Still running.`,
    imageUrl: imageMap[5]
  },
  {
    id: 6,
    question: "Is there a limit to how many people you can actually know?",
    answer: `Yes. Hard limit. [Dunbar's numbers](/glossary#dunbars-numbers):

[5](/glossary#the-5) intimate, [15](/glossary#the-15) close, [50](/glossary#the-50-band) friends, [150](/glossary#the-150-tribe) meaningful. Beyond that, people become categories.`,
    imageUrl: imageMap[6]
  },
  {
    id: 7,
    question: "You have 2,000 followers. Why are you lonely?",
    answer: `Followers aren't tribe.

Those 2,000 create [parasocial relationships](/glossary#parasocial-relationships)—one-way bonds with people who don't know you exist. Your [Dunbar layers](/glossary#dunbars-numbers) are full of strangers.`,
    imageUrl: imageMap[7]
  },
  {
    id: 8,
    question: "Why do substitutes never satisfy you?",
    answer: `They're designed not to.

A [proxy](/glossary#proxy) hijacks a drive without meeting the need. Social media for belonging. Porn for intimacy. Momentary relief, increasing hunger.`,
    imageUrl: imageMap[8]
  },
  {
    id: 9,
    question: "Why do quick fixes make things worse?",
    answer: `[Proxies](/glossary#proxy) address signals, not needs. They create tolerance. They prevent real solutions.

The business model requires they don't work.`,
    imageUrl: imageMap[9]
  },
  {
    id: 10,
    question: "Why does getting what you want leave you wanting more?",
    answer: `You got what you *thought* you wanted.

Wants: fame, money, perfect life. Needs: small [tribe](/glossary#the-150-tribe), real connection. Chasing [proxies](/glossary#proxy) while needs go unmet.`,
    imageUrl: imageMap[10]
  },
  {
    id: 11,
    question: "What are your emotions actually telling you?",
    answer: `They're data. [Signal or symptom](/glossary#signal-vs-symptom)?

Signal: something needs addressing. Symptom: broken machinery. Most suffering is signal. The environment is wrong.`,
    imageUrl: imageMap[11]
  },
  {
    id: 12,
    question: "So your feelings aren't the problem?",
    answer: `Correct. The environment generating them is.

Your anxiety isn't broken. Your environment is actually threatening. The [signal](/glossary#signal-vs-symptom) is accurate.`,
    imageUrl: imageMap[12]
  },
  {
    id: 13,
    question: "Are your symptoms trying to tell you something?",
    answer: `[Signal vs. symptom](/glossary#signal-vs-symptom) is the core distinction.

Psychiatry treats signals as symptoms. Suppresses accurate feedback. Different diagnosis, different treatment.`,
    imageUrl: imageMap[13]
  },
  {
    id: 14,
    question: "What's wrong with just treating symptoms?",
    answer: `Covering the oil light instead of checking the engine.

The [oil light metaphor](/glossary#oil-light-metaphor): medication suppresses the [signal](/glossary#signal-vs-symptom). The engine keeps degrading.`,
    imageUrl: imageMap[14]
  },
  {
    id: 15,
    question: "What is anxiety actually?",
    answer: `Accurate threat detection.

[Open loops](/glossary#open-loop) everywhere. Strangers everywhere. The alarm is working. The environment is actually dangerous.`,
    imageUrl: imageMap[15]
  },
  {
    id: 16,
    question: "What is depression actually?",
    answer: `Accurate meaning assessment.

No [tribe](/glossary#the-150-tribe). No [visible purpose](/glossary#visible-contribution). [Loops](/glossary#open-loop) that never close. The [signal](/glossary#signal-vs-symptom) is correct.`,
    imageUrl: imageMap[16]
  },
  {
    id: 17,
    question: "Is something wrong with you, or with your environment?",
    answer: `The environment.

A [fish on land](/glossary#fish-on-land) flops. Its gills work perfectly—designed for water. You wouldn't medicate the flopping. You'd put it back.`,
    imageUrl: imageMap[17]
  },
  {
    id: 18,
    question: "Why do doctors diagnose the flopping?",
    answer: `They've normalized the land.

[Flopping disorder](/glossary#flopping-disorder): pathologizing adaptive responses to [mismatch](/glossary#mismatch). No billing code for "wrong environment."`,
    imageUrl: imageMap[18]
  },
  {
    id: 19,
    question: "What does being in the wrong environment do to you?",
    answer: `Everything breaks.

Sleep without light cycles. Belonging without [tribe](/glossary#the-150-tribe). Meaning without [visible contribution](/glossary#visible-contribution). The [fish](/glossary#fish-on-land) isn't uncomfortable—it's dying.`,
    imageUrl: imageMap[19]
  },
  {
    id: 20,
    question: "What environment did humans actually evolve for?",
    answer: `The [EEA](/glossary#eea). Small bands of 30-50. [Tribe](/glossary#the-150-tribe) of 150. Known faces. [Fire circles](/glossary#fire-circle) every night. [Shared parenting](/glossary#alloparenting).

This is the spec sheet. We're running on something else.`,
    imageUrl: imageMap[20]
  },
  {
    id: 21,
    question: "Why can't you stop ruminating?",
    answer: `[Rumination](/glossary#rumination) is planning without anything to plan.

It evolved to solve problems. Now it runs on unsolvable ones. The machinery churns without producing output.`,
    imageUrl: imageMap[21]
  },
  {
    id: 22,
    question: "Why do you imagine people judging you?",
    answer: `The [internal audience](/glossary#internal-audience). Imaginary critics generating real anxiety.

Your brain evolved being watched by 150. Now it simulates an audience. Harsher than any real one.`,
    imageUrl: imageMap[22]
  },
  {
    id: 23,
    question: "Why do you always assume the worst?",
    answer: `[Negativity bias](/glossary#negativity-bias). Missing a threat was fatal. Missing an opportunity was recoverable.

Now it runs on phantoms. Calibrated for real dangers that aren't there.`,
    imageUrl: imageMap[23]
  },
  {
    id: 24,
    question: "Why can you never be good enough?",
    answer: `The [perfectionism trap](/glossary#perfectionism-trap). Your [internal audience](/glossary#internal-audience) holds contradictory standards.

Be confident but not arrogant. Successful but not obsessed. Any position violates something.`,
    imageUrl: imageMap[24]
  },
  {
    id: 25,
    question: "Why is almost-having-control worse than no control?",
    answer: `[Partial control](/glossary#partial-control)—the worst anxiety zone.

You can affect outcomes, so you can't let go. You can't determine them, so you can't resolve it. [Loop](/glossary#open-loop) stays open.`,
    imageUrl: imageMap[25]
  },
  {
    id: 26,
    question: "How many close friends do you actually need?",
    answer: `[Five](/glossary#the-5). People you'd call at 3am. Complete vulnerability.

If that circle has fewer than 5, that's the problem. Most modern people have 0-2.`,
    imageUrl: imageMap[26]
  },
  {
    id: 27,
    question: "How many people can you genuinely care about?",
    answer: `About [15](/glossary#the-15). People whose deaths would devastate you.

Active care, not passive connection. Count people you've had meaningful contact with this month.`,
    imageUrl: imageMap[27]
  },
  {
    id: 28,
    question: "Why do you feel like you're failing even when you're \"successful\"?",
    answer: `You got cultural success, not biological success.

Money and credentials, but no [tribe](/glossary#the-150-tribe), no [visible contribution](/glossary#visible-contribution), no [closed loops](/glossary#closed-loop). The [signal](/glossary#signal-vs-symptom) is accurate.`,
    imageUrl: imageMap[28]
  },
  {
    id: 29,
    question: "Why does modern work feel meaningless?",
    answer: `[Immediate-return](/glossary#immediate-return-economy) vs. delayed-return.

Ancestral work: hunt → eat. Modern work: 8 hours of abstraction for invisible shareholders. Your meaning-making systems can't connect effort to survival.`,
    imageUrl: imageMap[29]
  },
  {
    id: 30,
    question: "What are bullshit jobs?",
    answer: `Work that produces nothing tangible, benefits no one you know, exists to perpetuate itself.

[Visible contribution](/glossary#visible-contribution) is a human need. [Bullshit jobs](/glossary#bullshit-jobs) structurally deny it.`,
    imageUrl: imageMap[30]
  },
  {
    id: 31,
    question: "Why are you exhausted by crowds and cities?",
    answer: `[Stranger overload](/glossary#stranger-overload).

You encounter more unknown humans daily than ancestors met in years. Your brain can't stop assessing them.`,
    imageUrl: imageMap[31]
  },
  {
    id: 32,
    question: "How many strangers did ancestors encounter?",
    answer: `Maybe 1,000 in a lifetime.

Daily life was exclusively known faces. Now you encounter thousands daily. The [mismatch](/glossary#mismatch) is total.`,
    imageUrl: imageMap[32]
  },
  {
    id: 33,
    question: "Why are you comparing yourself to millions of people?",
    answer: `[Status](/glossary#status) competition [mismatch](/glossary#mismatch).

You evolved to compete among 150. Now you're compared against 8 billion. Excellence that was exceptional locally is ordinary globally.`,
    imageUrl: imageMap[33]
  },
  {
    id: 34,
    question: "Why do you care so much about status?",
    answer: `High [status](/glossary#status) meant survival. More resources, allies, mates, protection.

The drive is [indirect fitness](/glossary#indirect-fitness). The problem is the comparison pool exploded.`,
    imageUrl: imageMap[34]
  },
  {
    id: 35,
    question: "Why do fake things feel better than real things?",
    answer: `[Hyperstimuli](/glossary#hyperstimuli)—stimuli exceeding anything in nature.

Porn, junk food, social media. They hijack drives by exaggerating what drives respond to. Real satisfactions become inadequate.`,
    imageUrl: imageMap[35]
  },
  {
    id: 36,
    question: "Why do you feel connected to people who don't know you exist?",
    answer: `[Parasocial relationships](/glossary#parasocial-relationships). One-way bonds.

You know their face, voice, struggles. They've never heard your name. Every celebrity you track takes bandwidth from real relationships.`,
    imageUrl: imageMap[36]
  },
  {
    id: 37,
    question: "Why is your suffering profitable?",
    answer: `A satisfied human is a terrible customer.

The [atomized individual](/glossary#atomized-individual)—severed from [tribe](/glossary#the-150-tribe), purpose, intimacy—is the ideal consumer. Your [mismatch](/glossary#mismatch) is the business model.`,
    imageUrl: imageMap[37]
  },
  {
    id: 38,
    question: "How do companies make money from your unhappiness?",
    answer: `The [exploitation formula](/glossary#exploitation-formula):

Identify need → block satisfaction → offer [proxy](/glossary#proxy) → proxy doesn't satisfy → monetize return visits.`,
    imageUrl: imageMap[38]
  },
  {
    id: 39,
    question: "Why does being alone make you easier to manipulate?",
    answer: `The [atomized individual](/glossary#atomized-individual) has no counter-narrative.

No community to say "you don't need that." No [tribe](/glossary#the-150-tribe) meeting needs for real. You're vulnerable because no one's watching out.`,
    imageUrl: imageMap[39]
  },
  {
    id: 40,
    question: "Why are slot machines and social media so addictive?",
    answer: `[Variable ratio reinforcement](/glossary#variable-ratio-reinforcement)—the most addictive reward schedule.

Unpredictable rewards for consistent behavior. Pull-to-refresh is literally a slot machine lever.`,
    imageUrl: imageMap[40]
  },
  {
    id: 41,
    question: "What is dopamine and how is it hijacked?",
    answer: `[Dopamine](/glossary#dopamine) drives reward-seeking. It spikes on anticipation, not receipt.

Modern tech delivers triggers without effort or satisfaction. Chronic activation. Tolerance. Real satisfactions become inadequate.`,
    imageUrl: imageMap[41]
  },
  {
    id: 42,
    question: "How does social media exploit you?",
    answer: `Profits from loneliness.

[Variable ratio reinforcement](/glossary#variable-ratio-reinforcement) keeps you scrolling. [Parasocial bonds](/glossary#parasocial-relationships) fill your [Dunbar layers](/glossary#dunbars-numbers) with strangers. You're the product.`,
    imageUrl: imageMap[42]
  },
  {
    id: 43,
    question: "Is depression really a chemical imbalance?",
    answer: `The [serotonin hypothesis](/glossary#serotonin-hypothesis) has been debunked.

2022 review: no consistent evidence. The narrative was marketing, not science. SSRIs are [signal override](/glossary#signal-override), not repair.`,
    imageUrl: imageMap[43]
  },
  {
    id: 44,
    question: "What does psychiatric medication actually do?",
    answer: `[Signal override](/glossary#signal-override). Floods systems to suppress [signals](/glossary#signal-vs-symptom) without addressing what they're responding to.

Sometimes necessary. As the whole intervention? [Oil light](/glossary#oil-light-metaphor) covered, engine degrading.`,
    imageUrl: imageMap[44]
  },
  {
    id: 45,
    question: "How does pharma exploit you?",
    answer: `Invented "chemical imbalance" to sell chemicals.

[Ghostwritten studies](/glossary#ghostwritten-studies). Paid experts. 15-minute checks. Environment never discussed.`,
    imageUrl: imageMap[45]
  },
  {
    id: 46,
    question: "What are ghostwritten studies?",
    answer: `Research papers written by pharma, published under academic names.

Documented in litigation. The "scientific literature" is substantially marketing material.`,
    imageUrl: imageMap[46]
  },
  {
    id: 47,
    question: "Why is chronic stress destroying your body?",
    answer: `[Cortisol](/glossary#cortisol)—designed to spike briefly, then dissipate.

Tiger appears, cortisol mobilizes. Tiger leaves, cortisol drops. Modern life: the tiger never leaves.`,
    imageUrl: imageMap[47]
  },
  {
    id: 48,
    question: "How does news media exploit you?",
    answer: `Profits from threat activation.

[Open loops](/glossary#open-loop) that never close. [Cortisol](/glossary#cortisol) elevated for engagement. The business model keeps you worried about things you can't fix.`,
    imageUrl: imageMap[48]
  },
  {
    id: 49,
    question: "How does the food industry exploit you?",
    answer: `Engineers the [bliss point](/glossary#bliss-point)—sugar, fat, salt for maximum craving without satisfaction.

Designed to be impossible to eat in moderation. Addiction is the feature.`,
    imageUrl: imageMap[49]
  },
  {
    id: 50,
    question: "How do dating apps exploit you?",
    answer: `Business model requires failure.

Successful match = lost user. [Variable ratio reinforcement](/glossary#variable-ratio-reinforcement) keeps you swiping. Designed for engagement, not outcomes.`,
    imageUrl: imageMap[50]
  },
  {
    id: 51,
    question: "How does porn exploit you?",
    answer: `[Hyperstimuli](/glossary#hyperstimuli) hijacking mating drive.

Unlimited novelty. [Dopamine](/glossary#dopamine) overwhelmed. Real partners become inadequate. The [proxy](/glossary#proxy) destroys capacity for the real thing.`,
    imageUrl: imageMap[51]
  },
  {
    id: 52,
    question: "How does self-help exploit you?",
    answer: `Requires that self-help doesn't work.

Individual solutions to systemic problems. If you were actually helped, you wouldn't buy the next book.`,
    imageUrl: imageMap[52]
  },
  {
    id: 53,
    question: "Why are you obsessed with celebrities?",
    answer: `Fame is [hyperstimulus](/glossary#hyperstimuli) for status recognition.

You form [parasocial bonds](/glossary#parasocial-relationships). They extract investment without reciprocity. Feels like connection. Actually displacement.`,
    imageUrl: imageMap[53]
  },
  {
    id: 54,
    question: "Why do sports fans act like it actually matters?",
    answer: `Tribal belonging through [proxy](/glossary#proxy).

Your team vs. their team. Shared goals, common enemies. Almost meets the need for [tribe](/glossary#the-150-tribe). Almost.`,
    imageUrl: imageMap[54]
  },
  {
    id: 55,
    question: "Why isn't this common knowledge?",
    answer: `Incentives. Not conspiracy—just money.

Funding goes to drugs, not environmental intervention. [Ghostwritten studies](/glossary#ghostwritten-studies) shape literature. Truth isn't profitable.`,
    imageUrl: imageMap[55]
  },
  {
    id: 56,
    question: "Who are the most exploited customers?",
    answer: `[Whales](/glossary#whales). Gambling term for vulnerable users who account for disproportionate revenue.

Problem gamblers. Addictive tendencies. Your vulnerability is their profit center.`,
    imageUrl: imageMap[56]
  },
  {
    id: 57,
    question: "How does advertising exploit you?",
    answer: `$700B+ annually weaponizing evolutionary psychology.

Manufacturing inadequacy. Making you feel bad so you'll buy products to feel better. The inadequacy is created, not discovered.`,
    imageUrl: imageMap[57]
  },
  {
    id: 58,
    question: "How does gambling exploit you?",
    answer: `[Variable ratio reinforcement](/glossary#variable-ratio-reinforcement) perfected, then exported everywhere.

Loot boxes. Gacha games. Engagement loops. [Whales](/glossary#whales) specifically targeted.`,
    imageUrl: imageMap[58]
  },
  {
    id: 59,
    question: "Do rats get addicted because of drugs, or because of loneliness?",
    answer: `Loneliness. [Rat Park](/glossary#rat-park).

Isolated rats self-administer to death. Rats in enriched environments largely ignore drugs. The variable is environment, not substance.`,
    imageUrl: imageMap[59]
  },
  {
    id: 60,
    question: "What is addiction actually?",
    answer: `Drive-seeking redirected to [proxies](/glossary#proxy).

Real satisfactions blocked, so you reach for substitutes. [Rat Park](/glossary#rat-park) showed this: matched environments don't self-medicate.`,
    imageUrl: imageMap[60]
  },
  {
    id: 61,
    question: "What is ADHD actually?",
    answer: `Hunter cognition in a farmer world.

Scanning attention. Movement-seeking. Novelty-responsive. Adaptive in the [EEA](/glossary#eea). Then we built classrooms requiring stillness and called deviation disorder.`,
    imageUrl: imageMap[61]
  },
  {
    id: 62,
    question: "Why is \"normal\" defined so narrowly?",
    answer: `[Farmer brain](/glossary#farmer-brain) became the standard.

One cognitive style—suited for agriculture and factories—became "well-adjusted." Everything else became pathology.`,
    imageUrl: imageMap[62]
  },
  {
    id: 63,
    question: "What is social anxiety actually?",
    answer: `Fear of the [internal audience](/glossary#internal-audience) projected onto real people.

You assume strangers scrutinize with the intensity of your internal critics. They don't. They barely know you exist.`,
    imageUrl: imageMap[63]
  },
  {
    id: 64,
    question: "What is burnout?",
    answer: `Work/purpose [mismatch](/glossary#mismatch).

8-12 hours of effort with no [visible contribution](/glossary#visible-contribution). No [closed loops](/glossary#closed-loop). Your brain knows the work is actually meaningless.`,
    imageUrl: imageMap[64]
  },
  {
    id: 65,
    question: "What is imposter syndrome?",
    answer: `Often: accurate recognition that your work doesn't visibly benefit anyone you know.

Credentials without [visible contribution](/glossary#visible-contribution). The "syndrome" might be [signal](/glossary#signal-vs-symptom).`,
    imageUrl: imageMap[65]
  },
  {
    id: 66,
    question: "Are psychiatric conditions real diseases?",
    answer: `No biomarkers. No blood tests. Behavioral descriptions, not disease entities.

The conditions are real. The suffering is real. Calling them diseases like cancer or diabetes? Category error.`,
    imageUrl: imageMap[66]
  },
  {
    id: 67,
    question: "But these conditions are heritable?",
    answer: `So is height. Heritability doesn't make something disease.

What's inherited: cognitive patterns that served different roles in the [EEA](/glossary#eea). Variations pathologized when the environment doesn't accommodate them.`,
    imageUrl: imageMap[67]
  },
  {
    id: 68,
    question: "What about brain differences?",
    answer: `Musicians have different brains. Taxi drivers have different brains. Difference is not pathology.

The "differences" might be consequences of [mismatch](/glossary#mismatch), not pre-existing conditions.`,
    imageUrl: imageMap[68]
  },
  {
    id: 69,
    question: "What about neuroplasticity?",
    answer: `The brain changes based on experience.

"Brain differences" in psychiatric conditions might be effects, not causes. Chronic [mismatch](/glossary#mismatch) reshapes neural architecture.`,
    imageUrl: imageMap[69]
  },
  {
    id: 70,
    question: "What's wrong with therapy?",
    answer: `Nothing—if it's a bridge to environmental change.

Problem: therapy as [proxy](/glossary#proxy). $200/hour paid intimacy substituting for [tribe](/glossary#the-150-tribe). Years of sessions, no environmental change.`,
    imageUrl: imageMap[70]
  },
  {
    id: 71,
    question: "What's a 15-minute medication check?",
    answer: `Standard psychiatry visit. Enough time to adjust dosage. Not enough to understand context.

Environment never discussed. There isn't time.`,
    imageUrl: imageMap[71]
  },
  {
    id: 72,
    question: "Is medication ever necessary?",
    answer: `Medication becomes "necessary" because we've destroyed social structures that would otherwise manage these states.

WHO studies: better outcomes in developing countries with less medication, more social support.`,
    imageUrl: imageMap[72]
  },
  {
    id: 73,
    question: "Do people actually die from this?",
    answer: `Yes.

Zoraya ter Beek, 29, euthanized after psychiatrists said "nothing more we can do." Without ever trying environmental intervention.`,
    imageUrl: imageMap[73]
  },
  {
    id: 74,
    question: "What did humans do together every night for 300,000 years?",
    answer: `The [fire circle](/glossary#fire-circle). 2-4 hours. Every single night.

Processing the day. Storytelling. Bonding. We replaced it with screens.`,
    imageUrl: imageMap[74]
  },
  {
    id: 75,
    question: "Were parents ever meant to raise kids alone?",
    answer: `No. [Alloparenting](/glossary#alloparenting)—child-rearing by 20+ adults.

The nuclear family is a historical aberration. Parental burnout isn't failure. It's asking two people to do what twenty did.`,
    imageUrl: imageMap[75]
  },
  {
    id: 76,
    question: "Why do we separate children by age?",
    answer: `Institutional convenience, not developmental necessity.

Mixed-age play was the norm. Five-year-olds learning from ten-year-olds. Natural mentorship.`,
    imageUrl: imageMap[76]
  },
  {
    id: 77,
    question: "What is apprenticeship?",
    answer: `Learning through observation and gradual participation. How humans learned everything for 300,000 years.

[Visible contribution](/glossary#visible-contribution) from early age. Purpose built in.`,
    imageUrl: imageMap[77]
  },
  {
    id: 78,
    question: "How did hunter-gatherers prevent poverty?",
    answer: `[Demand sharing](/glossary#demand-sharing). Those with surplus share when asked.

If someone asks when you have extra, you give. Tomorrow you might be asking. Poverty impossible within the group.`,
    imageUrl: imageMap[78]
  },
  {
    id: 79,
    question: "What was work like before money existed?",
    answer: `[Immediate-return](/glossary#immediate-return-economy). Resources consumed within hours.

Hunt → eat. Gather → consume. 3-4 hours of effort. Tangible results. [Closed loops](/glossary#closed-loop).`,
    imageUrl: imageMap[79]
  },
  {
    id: 80,
    question: "Did hunter-gatherers have leaders?",
    answer: `No permanent leaders. Different experts for different domains.

Best tracker led hunts. Best diplomat handled relations. Outside expertise: just a person.`,
    imageUrl: imageMap[80]
  },
  {
    id: 81,
    question: "How did tribes prevent anyone from taking over?",
    answer: `[Egalitarian enforcement](/glossary#egalitarian-enforcement). Active suppression of dominance.

Boasting, hoarding, bossing triggered immediate coalition response. Christopher Boehm: "reverse dominance hierarchy."`,
    imageUrl: imageMap[81]
  },
  {
    id: 82,
    question: "How did tribes handle conflict without police or courts?",
    answer: `The [conflict resolution cascade](/glossary#conflict-resolution-cascade): humor → public discussion → ridicule → shunning → exile → violence (rare).

Most resolved early through joking. Reputation was inescapable.`,
    imageUrl: imageMap[82]
  },
  {
    id: 83,
    question: "What about circadian rhythm?",
    answer: `Wake with light. Active through morning. Rest, nap in afternoon. [Fire circle](/glossary#fire-circle) at evening. Sleep with darkness.

No alarm clocks. No artificial light. [Circadian](/glossary#circadian-rhythm) regularity was automatic.`,
    imageUrl: imageMap[83]
  },
  {
    id: 84,
    question: "What is birth spacing?",
    answer: `3-4 years between children via extended breastfeeding.

Parents not overwhelmed. Grandmothers crucial. Aka fathers hold infants 20%+ of daytime.`,
    imageUrl: imageMap[84]
  },
  {
    id: 85,
    question: "What about physical contact for infants?",
    answer: `Constant. Babies rarely put down.

Carried all day. Co-sleeping at night. No prolonged distress. The [mismatch](/glossary#mismatch) begins at birth.`,
    imageUrl: imageMap[85]
  },
  {
    id: 86,
    question: "Is it normal for groups to break apart and reform?",
    answer: `Yes. [Fission-fusion](/glossary#fission-fusion)—natural social metabolism.

When conflict became unresolvable, one faction left. This wasn't dysfunction. It was how healthy groups breathed.`,
    imageUrl: imageMap[86]
  },
  {
    id: 87,
    question: "How did small tribes avoid becoming inbred?",
    answer: `The [metapopulation](/glossary#metapopulation). 500-1500 people across multiple tribes.

Seasonal gatherings. Marriage exchanges. You knew your [tribe](/glossary#the-150-tribe) intimately; you knew *of* the broader network.`,
    imageUrl: imageMap[87]
  },
  {
    id: 88,
    question: "Why do modern tribes need explicit governance?",
    answer: `Because we're hierarchy-damaged.

[EEA](/glossary#eea) mechanisms don't work automatically on people with corporate backgrounds. Explicit structures prevent recreating what we know.`,
    imageUrl: imageMap[88]
  },
  {
    id: 89,
    question: "What's the difference between a tribe and a cult?",
    answer: `Cult: charismatic leader, information control, isolation, punishment for leaving.

Tribe: distributed authority, [transparency](/glossary#transparency), embedded in society, [viable exit](/glossary#viable-exit).`,
    imageUrl: imageMap[89]
  },
  {
    id: 90,
    question: "How do you prevent someone from becoming the permanent leader?",
    answer: `[Rotation](/glossary#rotation). Power-accumulating roles rotate on schedule.

No one occupies influence positions permanently. Trades efficiency for equality.`,
    imageUrl: imageMap[90]
  },
  {
    id: 91,
    question: "Why does everyone need to see everything?",
    answer: `[Transparency](/glossary#transparency). Information asymmetry is proto-hierarchy.

When some know things others don't, those members have power. No back-channels. No faction building.`,
    imageUrl: imageMap[91]
  },
  {
    id: 92,
    question: "Why shouldn't one person hold multiple roles?",
    answer: `[Domain separation](/glossary#domain-separation). Power concentration through role accumulation.

Negotiator AND arbiter AND resource controller = dominance despite formal rules.`,
    imageUrl: imageMap[92]
  },
  {
    id: 93,
    question: "How do you keep manipulators out?",
    answer: `[Onboarding filter](/glossary#onboarding-filter). Trial period to surface dominance patterns before full inclusion.

People shaped by corporations may unconsciously attempt hierarchy. Better to discover early.`,
    imageUrl: imageMap[93]
  },
  {
    id: 94,
    question: "What if you want to leave?",
    answer: `[Viable exit](/glossary#viable-exit). You can. That's the point.

Unlike the [EEA](/glossary#eea), leaving doesn't mean death. You're held by value, not by bars. This distinguishes tribe from cult.`,
    imageUrl: imageMap[94]
  },
  {
    id: 95,
    question: "What went wrong with Auroville?",
    answer: `Scale without [Dunbar layers](/glossary#dunbars-numbers).

Tried flat governance at 3,000+ people. Lesson: [band-scale](/glossary#the-50-band) (50-150) as operating unit.`,
    imageUrl: imageMap[95]
  },
  {
    id: 96,
    question: "What would it mean to actually fix this?",
    answer: `[Demismatch](/glossary#demismatch). Conscious alignment of environment with biology.

Not returning to caves. Building forward with the spec sheet. The intervention isn't fixing yourself—it's changing conditions.`,
    imageUrl: imageMap[96]
  },
  {
    id: 97,
    question: "Why can't technology just fix you directly?",
    answer: `You can't [augment](/glossary#augment) broken.

If already [mismatched](/glossary#mismatch)—isolated, purposeless, stressed—technology amplifies dysfunction. [Demismatch](/glossary#demismatch) first, then augment.`,
    imageUrl: imageMap[97]
  },
  {
    id: 98,
    question: "Can technology enhance you once you're not broken?",
    answer: `Yes. That's [augment](/glossary#augment).

Communication coordinating actual [tribe](/glossary#the-150-tribe). AI extending capability, not replacing relationship. Foundation matters.`,
    imageUrl: imageMap[98]
  },
  {
    id: 99,
    question: "Can technology help, or does it only make things worse?",
    answer: `Both. [Pharmakon](/glossary#pharmakon)—Greek for both poison and cure.

Same tools creating [mismatch](/glossary#mismatch) can serve [demismatching](/glossary#demismatch). Implementation determines whether it heals or harms.`,
    imageUrl: imageMap[99]
  },
  {
    id: 100,
    question: "What if technology required you to meet in person?",
    answer: `[Decay function](/glossary#decay-function). Technology designed to degrade without physical presence.

Features that lock unless you've met recently. Success measured by *decreasing* use. Opposite of engagement optimization.`,
    imageUrl: imageMap[100]
  },
  {
    id: 101,
    question: "Can AI help you find your people?",
    answer: `Potentially. [Tribe formation AI](/glossary#tribe-formation-ai).

Matching based on nervous system regulation, conflict styles, values. Discovery tool, not relationship substitute.`,
    imageUrl: imageMap[101]
  },
  {
    id: 102,
    question: "Can you use existing technology to build real connection?",
    answer: `Yes. Does it serve your [150](/glossary#the-150-tribe) or substitute [parasocial](/glossary#parasocial-relationships) engagement?

Video calls with actual tribe? Yes. Infinite scroll among strangers? [Proxy](/glossary#proxy). Know the difference.`,
    imageUrl: imageMap[102]
  },
  {
    id: 103,
    question: "Why won't venture capital fund demismatch tech?",
    answer: `[Decay functions](/glossary#decay-function) are churn engines. VCs need engagement growth.

Technology succeeding by reducing usage can't grow metrics. Misalignment is structural.`,
    imageUrl: imageMap[103]
  },
  {
    id: 104,
    question: "What's the end goal of all this?",
    answer: `[The most human post-human](/glossary#the-most-human-post-human).

Matched environments, enhanced by technology. Baseline thriving plus capability enhancement. Meeting needs fully, then [augmenting](/glossary#augment).`,
    imageUrl: imageMap[104]
  },
  {
    id: 105,
    question: "How do you know if you've arrived?",
    answer: `Do you wake up with a role, in a group, with a goal?

If yes, you've arrived. If no, you haven't. No credentials required.`,
    imageUrl: imageMap[105]
  },
  {
    id: 106,
    question: "What do WHO studies show?",
    answer: `Better schizophrenia outcomes in developing countries with less medication, more social support.

Environment matters more than pharmaceuticals.`,
    imageUrl: imageMap[106]
  },
  {
    id: 107,
    question: "What do hunter-gatherer studies show?",
    answer: `Chronic psychiatric conditions rare or absent in genuinely matched populations.

Limited data, but directionally clear. [Mismatch](/glossary#mismatch) correlates with pathology.`,
    imageUrl: imageMap[107]
  },
  {
    id: 108,
    question: "What do environmental interventions show?",
    answer: `Nature exposure, co-living reduce symptoms independent of medication.

Change the environment, symptoms decrease—even without changing brain chemistry.`,
    imageUrl: imageMap[108]
  },
  {
    id: 109,
    question: "What do intentional communities show?",
    answer: `Long-term stability is possible with proper governance.

Twin Oaks (58 years). East Wind (51 years). Convergent solutions arrived at independently.`,
    imageUrl: imageMap[109]
  },
  {
    id: 110,
    question: "What is Twin Oaks?",
    answer: `Intentional community since 1967. ~100 adults.

Labor credits for [visible contribution](/glossary#visible-contribution). [Rotation](/glossary#rotation). [Transparency](/glossary#transparency). High life satisfaction.`,
    imageUrl: imageMap[110]
  },
  {
    id: 111,
    question: "What is East Wind?",
    answer: `Intentional community since 1974. ~70 members.

Nut butter business. Rotating coordinators. Full [transparency](/glossary#transparency). Reduced anxiety from belonging.`,
    imageUrl: imageMap[111]
  },
  {
    id: 112,
    question: "What's step one?",
    answer: `Reduce [mismatch](/glossary#mismatch) load.

Audit [parasocial relationships](/glossary#parasocial-relationships). Reduce [open loops](/glossary#open-loop). [Circadian](/glossary#circadian-rhythm) basics. Move your body. Don't build [tribe](/glossary#the-150-tribe) while maximally mismatched.`,
    imageUrl: imageMap[112]
  },
  {
    id: 113,
    question: "What's step two?",
    answer: `Deepen, not broaden.

Stop meeting new people temporarily. Invest in existing relationships. Identify your actual [5](/glossary#the-5). Depth over breadth.`,
    imageUrl: imageMap[113]
  },
  {
    id: 114,
    question: "What's step three?",
    answer: `Reduce [proxy](/glossary#proxy) dependence.

Notice which [proxies](/glossary#proxy) you're using. Time-box their use while building real alternatives. Can't quit cold turkey without something real.`,
    imageUrl: imageMap[114]
  },
  {
    id: 115,
    question: "What's step four?",
    answer: `Build.

One dinner. One finished project. One person who sees your contribution. One [closed loop](/glossary#closed-loop). Understanding changes nothing.`,
    imageUrl: imageMap[115]
  },
  {
    id: 116,
    question: "What's the smallest change you can make right now?",
    answer: `Identify your [5](/glossary#the-5). One shared meal per week. One [loop](/glossary#closed-loop) closed daily. Morning light. Movement.

Minimum viable [demismatch](/glossary#demismatch).`,
    imageUrl: imageMap[116]
  },
  {
    id: 117,
    question: "What if you can't build tribe right now?",
    answer: `Reduce [mismatch](/glossary#mismatch) load first.

[Circadian](/glossary#circadian-rhythm) alignment, nature exposure, reduced strangers. Move from 90% mismatched to 70%. Better positioned for later.`,
    imageUrl: imageMap[117]
  },
  {
    id: 118,
    question: "How long does this take?",
    answer: `Years, not weeks.

The [double shift](/glossary#double-shift) makes it slow. Anyone promising quick fixes is selling another [proxy](/glossary#proxy).`,
    imageUrl: imageMap[118]
  },
  {
    id: 119,
    question: "Why is building a new life so exhausting?",
    answer: `The [double shift](/glossary#double-shift).

8 hours capitalist work + 2-3 hours tribal maintenance. Unsustainable long-term. Something has to give.`,
    imageUrl: imageMap[119]
  },
  {
    id: 120,
    question: "Why do most attempts at this fail?",
    answer: `The [great filter](/glossary#great-filter). [Double shift](/glossary#double-shift) burnout, resource constraints, emerging hierarchies.

Not character failure. Predictable difficulty. [Fission-fusion](/glossary#fission-fusion) means "failure" might be one stage in a longer process.`,
    imageUrl: imageMap[120]
  },
  {
    id: 121,
    question: "Who can attempt this first?",
    answer: `People with resources: flexibility, savings, existing relationships.

Not fair, but realistic. First adopters create maps others follow.`,
    imageUrl: imageMap[121]
  },
  {
    id: 122,
    question: "What if your tribe attempt fails?",
    answer: `[Fission-fusion](/glossary#fission-fusion) is normal.

Even temporary tribes are valuable. Skills developed. Relationships persist. First attempt teaches. Second builds on it.`,
    imageUrl: imageMap[122]
  },
  {
    id: 123,
    question: "What's the most common mistake people make?",
    answer: `Reading about [mismatch](/glossary#mismatch) while sitting alone, scrolling, under artificial light.

Understanding is not progress. Close this tab. Find your people. Build something.`,
    imageUrl: imageMap[123]
  },
  {
    id: 124,
    question: "Will life be meaningful without struggle?",
    answer: `Yes. Constructive scarcity remains.

Challenges requiring effort, cooperation, skill. The [tribe](/glossary#the-150-tribe) still needs to raise children, resolve conflicts, create together. Meaning requires challenge, not suffering.`,
    imageUrl: imageMap[124]
  },
  {
    id: 125,
    question: "Isn't some suffering necessary?",
    answer: `Material deprivation? No—toxic scarcity. Challenge and effort? Yes—constructive scarcity.

Toxic is imposed and traumatizing. Constructive is chosen and growth-producing.`,
    imageUrl: imageMap[125]
  },
  {
    id: 126,
    question: "Why isn't UBI the answer?",
    answer: `Solves resource distribution, not meaning.

Money without role, [tribe](/glossary#the-150-tribe), purpose. UBI + [atomized individual](/glossary#atomized-individual) = comfortable meaninglessness.`,
    imageUrl: imageMap[126]
  },
  {
    id: 127,
    question: "What does automation change?",
    answer: `Eliminates human roles in production.

The [proxy](/glossary#proxy) purpose work provides is disappearing. Rebuild meaning through [tribe](/glossary#the-150-tribe), not jobs that won't exist.`,
    imageUrl: imageMap[127]
  },
  {
    id: 128,
    question: "What drives all human behavior?",
    answer: `Survive and reproduce.

[Direct fitness](/glossary#direct-fitness): hunger, fear, lust. [Indirect fitness](/glossary#indirect-fitness): status, reputation, coalition. No exceptions.`,
    imageUrl: imageMap[128]
  },
  {
    id: 129,
    question: "Why do you have urges you can't control?",
    answer: `[Direct fitness](/glossary#direct-fitness). Survival and reproduction mechanisms running automatically.

The system isn't malfunctioning. It's doing exactly what it evolved to do.`,
    imageUrl: imageMap[129]
  },
  {
    id: 130,
    question: "Why do you need other people's approval so badly?",
    answer: `[Indirect fitness](/glossary#indirect-fitness). Survival through social mechanisms.

What people thought determined whether you ate, found mates, got protected. The drive isn't weakness—it's machinery.`,
    imageUrl: imageMap[130]
  },
  {
    id: 131,
    question: "Why do you feel obligated to return favors?",
    answer: `[Reciprocal altruism](/glossary#reciprocal-altruism). Foundation of cooperation beyond kinship.

You help today, they help tomorrow. The feeling of obligation is evolved infrastructure.`,
    imageUrl: imageMap[131]
  },
  {
    id: 132,
    question: "What's the difference between wants and needs?",
    answer: `Wants: fame, money, perfect life. Needs: small [tribe](/glossary#the-150-tribe), real connection, security.

Wants are shaped by [mismatch](/glossary#mismatch). Chasing wants while needs go unmet = permanent dissatisfaction.`,
    imageUrl: imageMap[132]
  },
  {
    id: 133,
    question: "Can you train yourself to maintain more relationships?",
    answer: `No. The limit is biological.

Finite neocortex. Finite time. You can have more followers. You can't have more friends. [Dunbar's numbers](/glossary#dunbars-numbers) aren't failure—they're architecture.`,
    imageUrl: imageMap[133]
  },
  {
    id: 134,
    question: "What's the right size for a real community?",
    answer: `The [band](/glossary#the-50-band): ~50 people. 5-8 families in daily interaction.

Share meals. Work alongside. [Fire circle](/glossary#fire-circle) every night. This is what your hardware expects.`,
    imageUrl: imageMap[134]
  },
  {
    id: 135,
    question: "Why do you feel like a stranger in your own city?",
    answer: `Because you are. Beyond [150](/glossary#the-150-tribe), everyone is a stranger.

Millions of people, no one you know. [Dunbar's limit](/glossary#dunbars-numbers) in action.`,
    imageUrl: imageMap[135]
  },
  {
    id: 136,
    question: "Can technology extend Dunbar's number?",
    answer: `Weak ties, yes. Strong ties, no.

Technology lets you stay loosely connected to more people. Cannot make you capable of intimate relationship with more than [5](/glossary#the-5).`,
    imageUrl: imageMap[136]
  },
  {
    id: 137,
    question: "Why does your brain lie to you about what you need?",
    answer: `It's not lying—it's running outdated software.

Calibrated for survival in the [EEA](/glossary#eea), not for truth. The dashboard was designed for different terrain.`,
    imageUrl: imageMap[137]
  },
  {
    id: 138,
    question: "Do you perceive reality accurately?",
    answer: `No. You perceive a dashboard.

Evolution optimized for survival, not accuracy. Truth was never the goal. Fitness was.`,
    imageUrl: imageMap[138]
  },
  {
    id: 139,
    question: "Why are mass shootings a modern phenomenon?",
    answer: `Killing strangers would be inconceivable in the [EEA](/glossary#eea).

Everyone was known. [Stranger overload](/glossary#stranger-overload) makes strangers into categories. Categories are easier to kill.`,
    imageUrl: imageMap[139]
  },
  {
    id: 140,
    question: "Is this just \"we weren't meant to live like this\"?",
    answer: `Yes, but with 300,000 years of evidence and a specific spec sheet.

Not nostalgia. Biology. The [EEA](/glossary#eea) is documented. The [mismatch](/glossary#mismatch) is measurable.`,
    imageUrl: imageMap[140]
  },
  {
    id: 141,
    question: "Is all entertainment bad for you?",
    answer: `No. Art isn't [proxy](/glossary#proxy).

Art continues [fire circle](/glossary#fire-circle) function: processing, sense-making, truth-telling. [Proxies](/glossary#proxy) deplete. Art nourishes.`,
    imageUrl: imageMap[141]
  },
  {
    id: 142,
    question: "Is this anti-psychiatry?",
    answer: `Anti-misdiagnosis.

Psychiatric conditions are real patterns. They're just not diseases—they're responses to [mismatch](/glossary#mismatch). Different diagnosis, different solutions.`,
    imageUrl: imageMap[142]
  },
  {
    id: 143,
    question: "Is this anti-technology?",
    answer: `No. Technology is [pharmakon](/glossary#pharmakon)—both poison and cure.

Same tools creating [mismatch](/glossary#mismatch) can serve [demismatching](/glossary#demismatch). Depends on design.`,
    imageUrl: imageMap[143]
  },
  {
    id: 144,
    question: "What is this website?",
    answer: `A framework explaining why modern humans suffer and what conditions would let them thrive.

Not therapy. Not self-help. A spec sheet for human nature.`,
    imageUrl: imageMap[144]
  },
  {
    id: 145,
    question: "What are you trying to do?",
    answer: `Change how people understand suffering.

It's not you. It's the environment. Once you see it, you can't unsee it.`,
    imageUrl: imageMap[145]
  },
  {
    id: 146,
    question: "Why should you care?",
    answer: `Because you're probably suffering and blaming yourself.

Because "solutions" haven't worked. Because understanding the problem is step one.`,
    imageUrl: imageMap[146]
  },
  {
    id: 147,
    question: "Who is this for?",
    answer: `Anyone who feels something is deeply wrong but can't name it.

Therapists tired of band-aids. Technologists who want to build things that help. Parents watching kids struggle.`,
    imageUrl: imageMap[147]
  },
  {
    id: 148,
    question: "What should you do after reading this?",
    answer: `Stop blaming yourself. Understand the pattern. Then build.

Your own [tribe](/glossary#the-150-tribe). Your own closure. Your own [visible contribution](/glossary#visible-contribution). Understanding alone changes nothing.`,
    imageUrl: imageMap[148]
  },
  {
    id: 149,
    question: "Why is this free?",
    answer: `No one owns truth about human nature.

Fork it, improve it, implement it. The point is not to profit—the point is for you to stop suffering.`,
    imageUrl: imageMap[149]
  },
  {
    id: 150,
    question: "What's with all the images?",
    answer: `2,500+ visuals in the library. Framework is dense. Images make it visceral.

Use them. They're free too.`,
    imageUrl: imageMap[150]
  },
  {
    id: 151,
    question: "How do you know this isn't just another self-help thing?",
    answer: `Self-help sells individual solutions to systemic problems.

This framework says: problem is environmental, solution is collective, personal optimization is part of the problem.`,
    imageUrl: imageMap[151]
  },
  {
    id: 152,
    question: "\"You're an introvert.\"",
    answer: `Introversion = how you recover, not what you need.

You need [tribe](/glossary#the-150-tribe) with a quieter role. The [EEA](/glossary#eea) had roles for every temperament. Introverts still need their [5](/glossary#the-5).`,
    imageUrl: imageMap[152]
  },
  {
    id: 153,
    question: "\"Different people need different things.\"",
    answer: `Surface variation exists. Deep structure is universal.

No human thrives isolated, purposeless, surrounded by strangers, with permanent [open loops](/glossary#open-loop).`,
    imageUrl: imageMap[153]
  },
  {
    id: 154,
    question: "\"You're romanticizing the past.\"",
    answer: `27% infant mortality. 48% child death before 15. Violence, scarcity, disease.

The framework claims the *social* environment matched hardware. You can have modern medicine AND social structures that work.`,
    imageUrl: imageMap[154]
  },
  {
    id: 155,
    question: "\"This sounds like a cult.\"",
    answer: `Cults: charismatic leader, isolation, information control, punishment for leaving.

Framework: no leader, [transparency](/glossary#transparency), embedded in society, [viable exit](/glossary#viable-exit). This is a document.`,
    imageUrl: imageMap[155]
  },
  {
    id: 156,
    question: "\"Society can't reorganize.\"",
    answer: `Society doesn't need to. *You* need to build [tribe](/glossary#the-150-tribe) within existing society.

Social layer, not replacement for civilization. You still have job, government. You also have your [50](/glossary#the-50-band).`,
    imageUrl: imageMap[156]
  },
  {
    id: 157,
    question: "\"Only privileged people can do this.\"",
    answer: `Partly true. First tribes from those who can experiment.

Also: many "underprivileged" communities already have more tribal structure. Wealth often correlates with isolation.`,
    imageUrl: imageMap[157]
  },
  {
    id: 158,
    question: "\"What about people who genuinely can't form relationships?\"",
    answer: `Some neurological differences exist.

Framework claims *most* suffering is environmental. For genuine difference: modified structures, different roles. Everyone needs their version of [tribe](/glossary#the-150-tribe).`,
    imageUrl: imageMap[158]
  },
  {
    id: 159,
    question: "\"Isn't this just 'touch grass' with extra steps?\"",
    answer: `Yes and no.

"Touch grass" captures something real. Framework explains *why* and what else is needed. Touch grass is necessary but insufficient.`,
    imageUrl: imageMap[159]
  },
  {
    id: 160,
    question: "What's the one thing you should remember?",
    answer: `You're not broken. Your environment is [mismatched](/glossary#mismatch).

Stop fixing yourself. Start building conditions that would let you thrive. The [fish](/glossary#fish-on-land) needs water.`,
    imageUrl: imageMap[160]
  },
  {
    id: 161,
    question: "What now?",
    answer: `Close this tab.

You've understood enough. Only building helps. Go find one person. Make one meal. Close one [loop](/glossary#closed-loop). Start.`,
    imageUrl: imageMap[161]
  }
];

// Parse markdown-style links and text formatting
function parseAnswer(text: string, onGlossaryClick: (termId: string) => void): React.ReactNode[] {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let lineKey = 0;

  const processLine = (line: string, key: number): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let partKey = 0;

    let processedLine = line;
    processedLine = processedLine.replace(/\*\*([^*]+)\*\*/g, '###BOLD_START###$1###BOLD_END###');
    processedLine = processedLine.replace(/\*([^*]+)\*/g, '###ITALIC_START###$1###ITALIC_END###');

    while ((match = linkRegex.exec(processedLine)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = processedLine.substring(lastIndex, match.index);
        parts.push(...renderFormattedText(beforeText, `before-${key}-${partKey++}`));
      }

      const linkText = match[1];
      const href = match[2];

      // Check if it's a glossary link
      if (href.startsWith('/glossary#')) {
        const termId = href.replace('/glossary#', '');
        parts.push(
          <button
            key={`link-${key}-${partKey++}`}
            onClick={(e) => {
              e.stopPropagation();
              onGlossaryClick(termId);
            }}
            className="text-[#C75B39] hover:underline font-medium cursor-pointer"
          >
            {linkText}
          </button>
        );
      } else {
        parts.push(
          <Link
            key={`link-${key}-${partKey++}`}
            href={href}
            className="text-[#C75B39] hover:underline font-medium"
          >
            {linkText}
          </Link>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < processedLine.length) {
      const remaining = processedLine.substring(lastIndex);
      parts.push(...renderFormattedText(remaining, `after-${key}-${partKey}`));
    }

    return parts.length > 0 ? parts : processedLine;
  };

  const renderFormattedText = (text: string, keyPrefix: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    const parts = text.split(/(###BOLD_START###|###BOLD_END###|###ITALIC_START###|###ITALIC_END###)/);
    let inBold = false;
    let inItalic = false;
    let partIdx = 0;

    for (const part of parts) {
      if (part === '###BOLD_START###') {
        inBold = true;
      } else if (part === '###BOLD_END###') {
        inBold = false;
      } else if (part === '###ITALIC_START###') {
        inItalic = true;
      } else if (part === '###ITALIC_END###') {
        inItalic = false;
      } else if (part) {
        if (inBold) {
          result.push(<strong key={`${keyPrefix}-${partIdx++}`}>{part}</strong>);
        } else if (inItalic) {
          result.push(<em key={`${keyPrefix}-${partIdx++}`}>{part}</em>);
        } else {
          result.push(part);
        }
      }
    }

    return result;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed === '') return;

    elements.push(
      <p key={`p-${lineKey++}`} className="text-gray-700 mb-3 leading-relaxed last:mb-0">
        {processLine(trimmed, idx)}
      </p>
    );
  });

  return elements;
}

export default function HomepageFAQTile() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagePopup, setImagePopup] = useState(false);
  const [glossaryPopup, setGlossaryPopup] = useState<string | null>(null);

  // Persist progress in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tile-index');
    if (saved) {
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx >= 0 && idx < tileData.length) {
        setCurrentIndex(idx);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tile-index', currentIndex.toString());
  }, [currentIndex]);

  // Close popups on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setImagePopup(false);
        setGlossaryPopup(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const currentQ = tileData[currentIndex];
  const nextQ = tileData[(currentIndex + 1) % tileData.length];

  const handleGlossaryClick = (termId: string) => {
    setGlossaryPopup(termId);
  };

  const glossaryTerm = glossaryPopup ? glossaryData[glossaryPopup] : null;

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsRevealed(false);
      setCurrentIndex((prev) => (prev + 1) % tileData.length);
      setIsTransitioning(false);
      // Auto-reveal after transition
      setTimeout(() => setIsRevealed(true), 50);
    }, 200);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsRevealed(false);
      setCurrentIndex((prev) => (prev - 1 + tileData.length) % tileData.length);
      setIsTransitioning(false);
      setTimeout(() => setIsRevealed(true), 50);
    }, 200);
  };

  const handleRewind = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsRevealed(false);
      setCurrentIndex(0);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <section className="px-8 py-16 max-w-3xl mx-auto">
      <div
        className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${
          isTransitioning ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {/* Question */}
        <div
          className={`p-8 ${!isRevealed ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
          onClick={!isRevealed ? handleReveal : undefined}
        >
          <h3
            className="text-2xl md:text-3xl text-gray-900 leading-snug"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {currentQ.question}
          </h3>

          {!isRevealed && (
            <p className="text-gray-400 text-sm mt-4">Click to reveal answer</p>
          )}
        </div>

        {/* Answer (when revealed) */}
        {isRevealed && (
          <div className="animate-fadeIn">
            {/* Answer content with thumbnail */}
            <div className="px-8 pt-6 pb-6 relative">
              <div className="pr-20">
                {parseAnswer(currentQ.answer, handleGlossaryClick)}
              </div>

              {/* Small thumbnail in lower right */}
              <button
                onClick={() => setImagePopup(true)}
                className="absolute bottom-4 right-6 w-16 h-16 rounded-lg overflow-hidden opacity-30 hover:opacity-80 transition-opacity cursor-pointer border border-gray-200 shadow-sm"
                title="Click to view image"
              >
                <Image
                  src={currentQ.imageUrl}
                  alt={currentQ.question}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mx-8" />

            {/* Next Question Teaser */}
            <div
              className="p-8 cursor-pointer hover:bg-gray-50 transition-colors group"
              onClick={handleNext}
            >
              <p className="text-sm text-gray-400 mb-2">Next question:</p>
              <p
                className="text-lg text-gray-600 group-hover:text-gray-900 italic transition-colors"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {nextQ.question}
              </p>
            </div>
          </div>
        )}

        {/* Navigation and framework link - always visible */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={handleRewind}
                className="px-2 py-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors text-sm font-mono"
                title="Back to first question"
              >
                &lt;&lt;
              </button>
              <button
                onClick={handlePrev}
                className="px-2 py-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors text-sm font-mono"
                title="Previous question"
              >
                &lt;
              </button>
              <button
                onClick={handleNext}
                className="px-2 py-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors text-sm font-mono"
                title="Next question"
              >
                &gt;
              </button>
            </div>
            <Link
              href="/framework"
              className="text-sm text-gray-500 hover:text-[#C75B39] transition-colors flex items-center gap-1"
            >
              Explore the framework
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Image Popup Modal */}
      {imagePopup && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setImagePopup(false)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setImagePopup(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full aspect-square">
              <Image
                src={currentQ.imageUrl}
                alt={currentQ.question}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Glossary Popup Modal */}
      {glossaryPopup && glossaryTerm && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setGlossaryPopup(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setGlossaryPopup(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 pr-8" style={{ fontFamily: 'Georgia, serif' }}>
                {glossaryTerm.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {glossaryTerm.definition}
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <Link
                  href={`/glossary#${glossaryPopup}`}
                  className="text-sm text-[#C75B39] hover:underline"
                  onClick={() => setGlossaryPopup(null)}
                >
                  Read full definition →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
