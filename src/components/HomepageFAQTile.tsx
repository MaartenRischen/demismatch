"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { glossaryById } from "@/data/glossaryData";

interface TileData {
  id: number;
  question: string;
  answer: string;
}

const tileData: TileData[] = [
  {
    id: 1,
    question: "Why do you feel so bad?",
    answer: `You're not broken. Your environment is.

This is [mismatch](/glossary#mismatch)—the gap between what your biology expects and what it gets. Your brain was built for a world that no longer exists.`
  },
  {
    id: 2,
    question: "Why does modern life feel so wrong?",
    answer: `You evolved for completely different conditions.

For 300,000 years, humans lived in the [EEA](/glossary#eea)—small bands, known faces, daily closure. Then everything changed faster than evolution could track.`
  },
  {
    id: 3,
    question: "Why can't you stop thinking about things you can't control?",
    answer: `You're caught in an [open loop](/glossary#open-loop).

Your brain evolved to solve problems and move on. Climate change? The economy? No action resolves them. The loop won't close.`
  },
  {
    id: 4,
    question: "What would it feel like to actually finish something?",
    answer: `That's a [closed loop](/glossary#closed-loop). Problem resolved. Emotion dissipates.

Hunt → eat → done. This is what your brain was designed for. Not infinite unresolvable anxiety.`
  },
  {
    id: 5,
    question: "Why do you care what strangers think?",
    answer: `Because social rejection used to be death.

High [status](/glossary#status) meant survival. The drive isn't vanity—it's [indirect fitness](/glossary#indirect-fitness). Still running.`
  },
  {
    id: 6,
    question: "Is there a limit to how many people you can actually know?",
    answer: `Yes. Hard limit. [Dunbar's numbers](/glossary#dunbars-numbers):

[5](/glossary#the-5) intimate, [15](/glossary#the-15) close, [50](/glossary#the-50-band) friends, [150](/glossary#the-150-tribe) meaningful. Beyond that, people become categories.`
  },
  {
    id: 7,
    question: "You have 2,000 followers. Why are you lonely?",
    answer: `Followers aren't tribe.

Those 2,000 create [parasocial relationships](/glossary#parasocial-relationships)—one-way bonds with people who don't know you exist. Your [Dunbar layers](/glossary#dunbars-numbers) are full of strangers.`
  },
  {
    id: 8,
    question: "Why do substitutes never satisfy you?",
    answer: `They're designed not to.

A [proxy](/glossary#proxy) hijacks a drive without meeting the need. Social media for belonging. Porn for intimacy. Momentary relief, increasing hunger.`
  },
  {
    id: 9,
    question: "Why do quick fixes make things worse?",
    answer: `[Proxies](/glossary#proxy) address signals, not needs. They create tolerance. They prevent real solutions.

The business model requires they don't work.`
  },
  {
    id: 10,
    question: "Why does getting what you want leave you wanting more?",
    answer: `You got what you *thought* you wanted.

Wants: fame, money, perfect life. Needs: small [tribe](/glossary#the-150-tribe), real connection. Chasing [proxies](/glossary#proxy) while needs go unmet.`
  },
  {
    id: 11,
    question: "What are your emotions actually telling you?",
    answer: `They're data. [Signal or symptom](/glossary#signal-vs-symptom)?

Signal: something needs addressing. Symptom: broken machinery. Most suffering is signal. The environment is wrong.`
  },
  {
    id: 12,
    question: "So your feelings aren't the problem?",
    answer: `Correct. The environment generating them is.

Your anxiety isn't broken. Your environment is actually threatening. The [signal](/glossary#signal-vs-symptom) is accurate.`
  },
  {
    id: 13,
    question: "Are your symptoms trying to tell you something?",
    answer: `[Signal vs. symptom](/glossary#signal-vs-symptom) is the core distinction.

Psychiatry treats signals as symptoms. Suppresses accurate feedback. Different diagnosis, different treatment.`
  },
  {
    id: 14,
    question: "What's wrong with just treating symptoms?",
    answer: `Covering the oil light instead of checking the engine.

The [oil light metaphor](/glossary#oil-light-metaphor): medication suppresses the [signal](/glossary#signal-vs-symptom). The engine keeps degrading.`
  },
  {
    id: 15,
    question: "What is anxiety actually?",
    answer: `Accurate threat detection.

[Open loops](/glossary#open-loop) everywhere. Strangers everywhere. The alarm is working. The environment is actually dangerous.`
  },
  {
    id: 16,
    question: "What is depression actually?",
    answer: `Accurate meaning assessment.

No [tribe](/glossary#the-150-tribe). No [visible purpose](/glossary#visible-contribution). [Loops](/glossary#open-loop) that never close. The [signal](/glossary#signal-vs-symptom) is correct.`
  },
  {
    id: 17,
    question: "So, is something wrong with you, or with your environment?",
    answer: `The environment.

A [fish on land](/glossary#fish-on-land) flops. Its gills work perfectly—designed for water. You wouldn't medicate the flopping. You'd put it back.`
  },
  {
    id: 18,
    question: "Why do doctors diagnose the flopping?",
    answer: `They've normalized the land.

[Flopping disorder](/glossary#flopping-disorder): pathologizing adaptive responses to [mismatch](/glossary#mismatch). No billing code for "wrong environment."`
  },
  {
    id: 19,
    question: "What does being in the wrong environment do to you?",
    answer: `Everything breaks.

Sleep without light cycles. Belonging without [tribe](/glossary#the-150-tribe). Meaning without [visible contribution](/glossary#visible-contribution). The [fish](/glossary#fish-on-land) isn't uncomfortable—it's dying.`
  },
  {
    id: 20,
    question: "What environment did humans actually evolve for?",
    answer: `The [EEA](/glossary#eea). Small bands of 30-50. [Tribe](/glossary#the-150-tribe) of 150. Known faces. [Fire circles](/glossary#fire-circle) every night. [Shared parenting](/glossary#alloparenting).

This is the spec sheet. We're running on something else.`
  },
  {
    id: 21,
    question: "Why can't you stop ruminating?",
    answer: `[Rumination](/glossary#rumination) is planning without anything to plan.

It evolved to solve problems. Now it runs on unsolvable ones. The machinery churns without producing output.`
  },
  {
    id: 22,
    question: "Why do you imagine people judging you?",
    answer: `The [internal audience](/glossary#internal-audience). Imaginary critics generating real anxiety.

Your brain evolved being watched by 150. Now it simulates an audience. Harsher than any real one.`
  },
  {
    id: 23,
    question: "Why do you always assume the worst?",
    answer: `[Negativity bias](/glossary#negativity-bias). Missing a threat was fatal. Missing an opportunity was recoverable.

Now it runs on phantoms. Calibrated for real dangers that aren't there.`
  },
  {
    id: 24,
    question: "Why can you never be good enough?",
    answer: `The [perfectionism trap](/glossary#perfectionism-trap). Your [internal audience](/glossary#internal-audience) holds contradictory standards.

Be confident but not arrogant. Successful but not obsessed. Any position violates something.`
  },
  {
    id: 25,
    question: "Why is almost-having-control worse than no control?",
    answer: `[Partial control](/glossary#partial-control)—the worst anxiety zone.

You can affect outcomes, so you can't let go. You can't determine them, so you can't resolve it. [Loop](/glossary#open-loop) stays open.`
  },
  {
    id: 26,
    question: "How many close friends do you actually need?",
    answer: `[Five](/glossary#the-5). People you'd call at 3am. Complete vulnerability.

If that circle has fewer than 5, that's the problem. Most modern people have 0-2.`
  },
  {
    id: 27,
    question: "How many people can you genuinely care about?",
    answer: `About [15](/glossary#the-15). People whose deaths would devastate you.

Active care, not passive connection. Count people you've had meaningful contact with this month.`
  },
  {
    id: 28,
    question: "Why do you feel like you're failing even when you're \"successful\"?",
    answer: `You got cultural success, not biological success.

Money and credentials, but no [tribe](/glossary#the-150-tribe), no [visible contribution](/glossary#visible-contribution), no [closed loops](/glossary#closed-loop). The [signal](/glossary#signal-vs-symptom) is accurate.`
  },
  {
    id: 29,
    question: "Why does modern work feel meaningless?",
    answer: `[Immediate-return](/glossary#immediate-return-economy) vs. delayed-return.

Ancestral work: hunt → eat. Modern work: 8 hours of abstraction for invisible shareholders. Your meaning-making systems can't connect effort to survival.`
  },
  {
    id: 30,
    question: "What are bullshit jobs?",
    answer: `Work that produces nothing tangible, benefits no one you know, exists to perpetuate itself.

[Visible contribution](/glossary#visible-contribution) is a human need. [Bullshit jobs](/glossary#bullshit-jobs) structurally deny it.`
  },
  {
    id: 31,
    question: "Why are you exhausted by crowds and cities?",
    answer: `[Stranger overload](/glossary#stranger-overload).

You encounter more unknown humans daily than ancestors met in years. Your brain can't stop assessing them.`
  },
  {
    id: 32,
    question: "How many strangers did ancestors encounter?",
    answer: `Maybe 1,000 in a lifetime.

Daily life was exclusively known faces. Now you encounter thousands daily. The [mismatch](/glossary#mismatch) is total.`
  },
  {
    id: 33,
    question: "Why are you comparing yourself to millions of people?",
    answer: `[Status](/glossary#status) competition [mismatch](/glossary#mismatch).

You evolved to compete among 150. Now you're compared against 8 billion. Excellence that was exceptional locally is ordinary globally.`
  },
  {
    id: 34,
    question: "Why do you care so much about status?",
    answer: `High [status](/glossary#status) meant survival. More resources, allies, mates, protection.

The drive is [indirect fitness](/glossary#indirect-fitness). The problem is the comparison pool exploded.`
  },
  {
    id: 35,
    question: "Why do fake things feel better than real things?",
    answer: `[Hyperstimuli](/glossary#hyperstimuli)—stimuli exceeding anything in nature.

Porn, junk food, social media. They hijack drives by exaggerating what drives respond to. Real satisfactions become inadequate.`
  },
  {
    id: 36,
    question: "Why do you feel connected to people who don't know you exist?",
    answer: `[Parasocial relationships](/glossary#parasocial-relationships). One-way bonds.

You know their face, voice, struggles. They've never heard your name. Every celebrity you track takes bandwidth from real relationships.`
  },
  {
    id: 37,
    question: "Why is your suffering profitable?",
    answer: `A satisfied human is a terrible customer.

The [atomized individual](/glossary#atomized-individual)—severed from [tribe](/glossary#the-150-tribe), purpose, intimacy—is the ideal consumer. Your [mismatch](/glossary#mismatch) is the business model.`
  },
  {
    id: 38,
    question: "How do companies make money from your unhappiness?",
    answer: `The [exploitation formula](/glossary#exploitation-formula):

Identify need → block satisfaction → offer [proxy](/glossary#proxy) → proxy doesn't satisfy → monetize return visits.`
  },
  {
    id: 39,
    question: "Why does being alone make you easier to manipulate?",
    answer: `The [atomized individual](/glossary#atomized-individual) has no counter-narrative.

No community to say "you don't need that." No [tribe](/glossary#the-150-tribe) meeting needs for real. You're vulnerable because no one's watching out.`
  },
  {
    id: 40,
    question: "Why are slot machines and social media so addictive?",
    answer: `[Variable ratio reinforcement](/glossary#variable-ratio-reinforcement)—the most addictive reward schedule.

Unpredictable rewards for consistent behavior. Pull-to-refresh is literally a slot machine lever.`
  },
  {
    id: 41,
    question: "What is dopamine and how is it hijacked?",
    answer: `[Dopamine](/glossary#dopamine) drives reward-seeking. It spikes on anticipation, not receipt.

Modern tech delivers triggers without effort or satisfaction. Chronic activation. Tolerance. Real satisfactions become inadequate.`
  },
  {
    id: 42,
    question: "How does social media exploit you?",
    answer: `Profits from loneliness.

[Variable ratio reinforcement](/glossary#variable-ratio-reinforcement) keeps you scrolling. [Parasocial bonds](/glossary#parasocial-relationships) fill your [Dunbar layers](/glossary#dunbars-numbers) with strangers. You're the product.`
  },
  {
    id: 43,
    question: "Is depression really a chemical imbalance?",
    answer: `The [serotonin hypothesis](/glossary#serotonin-hypothesis) has been debunked.

2022 review: no consistent evidence. The narrative was marketing, not science. SSRIs are [signal override](/glossary#signal-override), not repair.`
  },
  {
    id: 44,
    question: "What does psychiatric medication actually do?",
    answer: `[Signal override](/glossary#signal-override). Floods systems to suppress [signals](/glossary#signal-vs-symptom) without addressing what they're responding to.

Sometimes necessary. As the whole intervention? [Oil light](/glossary#oil-light-metaphor) covered, engine degrading.`
  },
  {
    id: 45,
    question: "How does pharma exploit you?",
    answer: `Invented "chemical imbalance" to sell chemicals.

[Ghostwritten studies](/glossary#ghostwritten-studies). Paid experts. 15-minute checks. Environment never discussed.`
  },
  {
    id: 46,
    question: "What are ghostwritten studies?",
    answer: `Research papers written by pharma, published under academic names.

Documented in litigation. The "scientific literature" is substantially marketing material.`
  },
  {
    id: 47,
    question: "Why is chronic stress destroying your body?",
    answer: `[Cortisol](/glossary#cortisol)—designed to spike briefly, then dissipate.

Tiger appears, cortisol mobilizes. Tiger leaves, cortisol drops. Modern life: the tiger never leaves.`
  },
  {
    id: 48,
    question: "How does news media exploit you?",
    answer: `Profits from threat activation.

[Open loops](/glossary#open-loop) that never close. [Cortisol](/glossary#cortisol) elevated for engagement. The business model keeps you worried about things you can't fix.`
  },
  {
    id: 49,
    question: "How does the food industry exploit you?",
    answer: `Engineers the [bliss point](/glossary#bliss-point)—sugar, fat, salt for maximum craving without satisfaction.

Designed to be impossible to eat in moderation. Addiction is the feature.`
  },
  {
    id: 50,
    question: "How do dating apps exploit you?",
    answer: `Business model requires failure.

Successful match = lost user. [Variable ratio reinforcement](/glossary#variable-ratio-reinforcement) keeps you swiping. Designed for engagement, not outcomes.`
  },
  {
    id: 51,
    question: "How does porn exploit you?",
    answer: `[Hyperstimuli](/glossary#hyperstimuli) hijacking mating drive.

Unlimited novelty. [Dopamine](/glossary#dopamine) overwhelmed. Real partners become inadequate. The [proxy](/glossary#proxy) destroys capacity for the real thing.`
  },
  {
    id: 52,
    question: "How does self-help exploit you?",
    answer: `Requires that self-help doesn't work.

Individual solutions to systemic problems. If you were actually helped, you wouldn't buy the next book.`
  },
  {
    id: 53,
    question: "Why are you obsessed with celebrities?",
    answer: `Fame is [hyperstimulus](/glossary#hyperstimuli) for status recognition.

You form [parasocial bonds](/glossary#parasocial-relationships). They extract investment without reciprocity. Feels like connection. Actually displacement.`
  },
  {
    id: 54,
    question: "Why do sports fans act like it actually matters?",
    answer: `Tribal belonging through [proxy](/glossary#proxy).

Your team vs. their team. Shared goals, common enemies. Almost meets the need for [tribe](/glossary#the-150-tribe). Almost.`
  },
  {
    id: 55,
    question: "Why isn't this common knowledge?",
    answer: `Incentives. Not conspiracy—just money.

Funding goes to drugs, not environmental intervention. [Ghostwritten studies](/glossary#ghostwritten-studies) shape literature. Truth isn't profitable.`
  },
  {
    id: 56,
    question: "Who are the most exploited customers?",
    answer: `[Whales](/glossary#whales). Gambling term for vulnerable users who account for disproportionate revenue.

Problem gamblers. Addictive tendencies. Your vulnerability is their profit center.`
  },
  {
    id: 57,
    question: "How does advertising exploit you?",
    answer: `$700B+ annually weaponizing evolutionary psychology.

Manufacturing inadequacy. Making you feel bad so you'll buy products to feel better. The inadequacy is created, not discovered.`
  },
  {
    id: 58,
    question: "How does gambling exploit you?",
    answer: `[Variable ratio reinforcement](/glossary#variable-ratio-reinforcement) perfected, then exported everywhere.

Loot boxes. Gacha games. Engagement loops. [Whales](/glossary#whales) specifically targeted.`
  },
  {
    id: 59,
    question: "Do rats get addicted because of drugs, or because of loneliness?",
    answer: `Loneliness. [Rat Park](/glossary#rat-park).

Isolated rats self-administer to death. Rats in enriched environments largely ignore drugs. The variable is environment, not substance.`
  },
  {
    id: 60,
    question: "What is addiction actually?",
    answer: `Drive-seeking redirected to [proxies](/glossary#proxy).

Real satisfactions blocked, so you reach for substitutes. [Rat Park](/glossary#rat-park) showed this: matched environments don't self-medicate.`
  },
  {
    id: 61,
    question: "What is ADHD actually?",
    answer: `Hunter cognition in a farmer world.

Scanning attention. Movement-seeking. Novelty-responsive. Adaptive in the [EEA](/glossary#eea). Then we built classrooms requiring stillness and called deviation disorder.`
  },
  {
    id: 62,
    question: "Why is \"normal\" defined so narrowly?",
    answer: `[Farmer brain](/glossary#farmer-brain) became the standard.

One cognitive style—suited for agriculture and factories—became "well-adjusted." Everything else became pathology.`
  },
  {
    id: 63,
    question: "What is social anxiety actually?",
    answer: `Fear of the [internal audience](/glossary#internal-audience) projected onto real people.

You assume strangers scrutinize with the intensity of your internal critics. They don't. They barely know you exist.`
  },
  {
    id: 64,
    question: "What is burnout?",
    answer: `Work/purpose [mismatch](/glossary#mismatch).

8-12 hours of effort with no [visible contribution](/glossary#visible-contribution). No [closed loops](/glossary#closed-loop). Your brain knows the work is actually meaningless.`
  },
  {
    id: 65,
    question: "What is imposter syndrome?",
    answer: `Often: accurate recognition that your work doesn't visibly benefit anyone you know.

Credentials without [visible contribution](/glossary#visible-contribution). The "syndrome" might be [signal](/glossary#signal-vs-symptom).`
  },
  {
    id: 66,
    question: "Are psychiatric conditions real diseases?",
    answer: `No biomarkers. No blood tests. Behavioral descriptions, not disease entities.

The conditions are real. The suffering is real. Calling them diseases like cancer or diabetes? Category error.`
  },
  {
    id: 67,
    question: "But these conditions are heritable?",
    answer: `So is height. Heritability doesn't make something disease.

What's inherited: cognitive patterns that served different roles in the [EEA](/glossary#eea). Variations pathologized when the environment doesn't accommodate them.`
  },
  {
    id: 68,
    question: "What about brain differences?",
    answer: `Musicians have different brains. Taxi drivers have different brains. Difference is not pathology.

The "differences" might be consequences of [mismatch](/glossary#mismatch), not pre-existing conditions.`
  },
  {
    id: 69,
    question: "What about neuroplasticity?",
    answer: `The brain changes based on experience.

"Brain differences" in psychiatric conditions might be effects, not causes. Chronic [mismatch](/glossary#mismatch) reshapes neural architecture.`
  },
  {
    id: 70,
    question: "What's wrong with therapy?",
    answer: `Nothing—if it's a bridge to environmental change.

Problem: therapy as [proxy](/glossary#proxy). $200/hour paid intimacy substituting for [tribe](/glossary#the-150-tribe). Years of sessions, no environmental change.`
  },
  {
    id: 71,
    question: "What's a 15-minute medication check?",
    answer: `Standard psychiatry visit. Enough time to adjust dosage. Not enough to understand context.

Environment never discussed. There isn't time.`
  },
  {
    id: 72,
    question: "Is medication ever necessary?",
    answer: `Medication becomes "necessary" because we've destroyed social structures that would otherwise manage these states.

WHO studies: better outcomes in developing countries with less medication, more social support.`
  },
  {
    id: 73,
    question: "Do people actually die from this?",
    answer: `Yes.

Zoraya ter Beek, 29, euthanized after psychiatrists said "nothing more we can do." Without ever trying environmental intervention.`
  },
  {
    id: 74,
    question: "What did humans do together every night for 300,000 years?",
    answer: `The [fire circle](/glossary#fire-circle). 2-4 hours. Every single night.

Processing the day. Storytelling. Bonding. We replaced it with screens.`
  },
  {
    id: 75,
    question: "Were parents ever meant to raise kids alone?",
    answer: `No. [Alloparenting](/glossary#alloparenting)—child-rearing by 20+ adults.

The nuclear family is a historical aberration. Parental burnout isn't failure. It's asking two people to do what twenty did.`
  },
  {
    id: 76,
    question: "Why do we separate children by age?",
    answer: `Institutional convenience, not developmental necessity.

Mixed-age play was the norm. Five-year-olds learning from ten-year-olds. Natural mentorship.`
  },
  {
    id: 77,
    question: "What is apprenticeship?",
    answer: `Learning through observation and gradual participation. How humans learned everything for 300,000 years.

[Visible contribution](/glossary#visible-contribution) from early age. Purpose built in.`
  },
  {
    id: 78,
    question: "How did hunter-gatherers prevent poverty?",
    answer: `[Demand sharing](/glossary#demand-sharing). Those with surplus share when asked.

If someone asks when you have extra, you give. Tomorrow you might be asking. Poverty impossible within the group.`
  },
  {
    id: 79,
    question: "What was work like before money existed?",
    answer: `[Immediate-return](/glossary#immediate-return-economy). Resources consumed within hours.

Hunt → eat. Gather → consume. 3-4 hours of effort. Tangible results. [Closed loops](/glossary#closed-loop).`
  },
  {
    id: 80,
    question: "Did hunter-gatherers have leaders?",
    answer: `No permanent leaders. Different experts for different domains.

Best tracker led hunts. Best diplomat handled relations. Outside expertise: just a person.`
  },
  {
    id: 81,
    question: "How did tribes prevent anyone from taking over?",
    answer: `[Egalitarian enforcement](/glossary#egalitarian-enforcement). Active suppression of dominance.

Boasting, hoarding, bossing triggered immediate coalition response. Christopher Boehm: "reverse dominance hierarchy."`
  },
  {
    id: 82,
    question: "How did tribes handle conflict without police or courts?",
    answer: `The [conflict resolution cascade](/glossary#conflict-resolution-cascade): humor → public discussion → ridicule → shunning → exile → violence (rare).

Most resolved early through joking. Reputation was inescapable.`
  },
  {
    id: 83,
    question: "What about circadian rhythm?",
    answer: `Wake with light. Active through morning. Rest, nap in afternoon. [Fire circle](/glossary#fire-circle) at evening. Sleep with darkness.

No alarm clocks. No artificial light. [Circadian](/glossary#circadian-rhythm) regularity was automatic.`
  },
  {
    id: 84,
    question: "What is birth spacing?",
    answer: `3-4 years between children via extended breastfeeding.

Parents not overwhelmed. Grandmothers crucial. Aka fathers hold infants 20%+ of daytime.`
  },
  {
    id: 85,
    question: "What about physical contact for infants?",
    answer: `Constant. Babies rarely put down.

Carried all day. Co-sleeping at night. No prolonged distress. The [mismatch](/glossary#mismatch) begins at birth.`
  },
  {
    id: 86,
    question: "Is it normal for groups to break apart and reform?",
    answer: `Yes. [Fission-fusion](/glossary#fission-fusion)—natural social metabolism.

When conflict became unresolvable, one faction left. This wasn't dysfunction. It was how healthy groups breathed.`
  },
  {
    id: 87,
    question: "How did small tribes avoid becoming inbred?",
    answer: `The [metapopulation](/glossary#metapopulation). 500-1500 people across multiple tribes.

Seasonal gatherings. Marriage exchanges. You knew your [tribe](/glossary#the-150-tribe) intimately; you knew *of* the broader network.`
  },
  {
    id: 88,
    question: "Why do modern tribes need explicit governance?",
    answer: `Because we're hierarchy-damaged.

[EEA](/glossary#eea) mechanisms don't work automatically on people with corporate backgrounds. Explicit structures prevent recreating what we know.`
  },
  {
    id: 89,
    question: "What's the difference between a tribe and a cult?",
    answer: `Cult: charismatic leader, information control, isolation, punishment for leaving.

Tribe: distributed authority, [transparency](/glossary#transparency), embedded in society, [viable exit](/glossary#viable-exit).`
  },
  {
    id: 90,
    question: "How do you prevent someone from becoming the permanent leader?",
    answer: `[Rotation](/glossary#rotation). Power-accumulating roles rotate on schedule.

No one occupies influence positions permanently. Trades efficiency for equality.`
  },
  {
    id: 91,
    question: "Why does everyone need to see everything?",
    answer: `[Transparency](/glossary#transparency). Information asymmetry is proto-hierarchy.

When some know things others don't, those members have power. No back-channels. No faction building.`
  },
  {
    id: 92,
    question: "Why shouldn't one person hold multiple roles?",
    answer: `[Domain separation](/glossary#domain-separation). Power concentration through role accumulation.

Negotiator AND arbiter AND resource controller = dominance despite formal rules.`
  },
  {
    id: 93,
    question: "How do you keep manipulators out?",
    answer: `[Onboarding filter](/glossary#onboarding-filter). Trial period to surface dominance patterns before full inclusion.

People shaped by corporations may unconsciously attempt hierarchy. Better to discover early.`
  },
  {
    id: 94,
    question: "What if you want to leave?",
    answer: `[Viable exit](/glossary#viable-exit). You can. That's the point.

Unlike the [EEA](/glossary#eea), leaving doesn't mean death. You're held by value, not by bars. This distinguishes tribe from cult.`
  },
  {
    id: 95,
    question: "What went wrong with Auroville?",
    answer: `Scale without [Dunbar layers](/glossary#dunbars-numbers).

Tried flat governance at 3,000+ people. Lesson: [band-scale](/glossary#the-50-band) (50-150) as operating unit.`
  },
  {
    id: 96,
    question: "What would it mean to actually fix this?",
    answer: `[Demismatch](/glossary#demismatch). Conscious alignment of environment with biology.

Not returning to caves. Building forward with the spec sheet. The intervention isn't fixing yourself—it's changing conditions.`
  },
  {
    id: 97,
    question: "Why can't technology just fix you directly?",
    answer: `You can't [augment](/glossary#augment) broken.

If already [mismatched](/glossary#mismatch)—isolated, purposeless, stressed—technology amplifies dysfunction. [Demismatch](/glossary#demismatch) first, then augment.`
  },
  {
    id: 98,
    question: "Can technology enhance you once you're not broken?",
    answer: `Yes. That's [augment](/glossary#augment).

Communication coordinating actual [tribe](/glossary#the-150-tribe). AI extending capability, not replacing relationship. Foundation matters.`
  },
  {
    id: 99,
    question: "Can technology help, or does it only make things worse?",
    answer: `Both. [Pharmakon](/glossary#pharmakon)—Greek for both poison and cure.

Same tools creating [mismatch](/glossary#mismatch) can serve [demismatching](/glossary#demismatch). Implementation determines whether it heals or harms.`
  },
  {
    id: 100,
    question: "What if technology required you to meet in person?",
    answer: `[Decay function](/glossary#decay-function). Technology designed to degrade without physical presence.

Features that lock unless you've met recently. Success measured by *decreasing* use. Opposite of engagement optimization.`
  },
  {
    id: 101,
    question: "Can AI help you find your people?",
    answer: `Potentially. [Tribe formation AI](/glossary#tribe-formation-ai).

Matching based on nervous system regulation, conflict styles, values. Discovery tool, not relationship substitute.`
  },
  {
    id: 102,
    question: "Can you use existing technology to build real connection?",
    answer: `Yes. Does it serve your [150](/glossary#the-150-tribe) or substitute [parasocial](/glossary#parasocial-relationships) engagement?

Video calls with actual tribe? Yes. Infinite scroll among strangers? [Proxy](/glossary#proxy). Know the difference.`
  },
  {
    id: 103,
    question: "Why won't venture capital fund demismatch tech?",
    answer: `[Decay functions](/glossary#decay-function) are churn engines. VCs need engagement growth.

Technology succeeding by reducing usage can't grow metrics. Misalignment is structural.`
  },
  {
    id: 104,
    question: "What's the end goal of all this?",
    answer: `[The most human post-human](/glossary#the-most-human-post-human).

Matched environments, enhanced by technology. Baseline thriving plus capability enhancement. Meeting needs fully, then [augmenting](/glossary#augment).`
  },
  {
    id: 105,
    question: "How do you know if you've arrived?",
    answer: `Do you wake up with a role, in a group, with a goal?

If yes, you've arrived. If no, you haven't. No credentials required.`
  },
  {
    id: 106,
    question: "What do WHO studies show?",
    answer: `Better schizophrenia outcomes in developing countries with less medication, more social support.

Environment matters more than pharmaceuticals.`
  },
  {
    id: 107,
    question: "What do hunter-gatherer studies show?",
    answer: `Chronic psychiatric conditions rare or absent in genuinely matched populations.

Limited data, but directionally clear. [Mismatch](/glossary#mismatch) correlates with pathology.`
  },
  {
    id: 108,
    question: "What do environmental interventions show?",
    answer: `Nature exposure, co-living reduce symptoms independent of medication.

Change the environment, symptoms decrease—even without changing brain chemistry.`
  },
  {
    id: 109,
    question: "What do intentional communities show?",
    answer: `Long-term stability is possible with proper governance.

Twin Oaks (58 years). East Wind (51 years). Convergent solutions arrived at independently.`
  },
  {
    id: 110,
    question: "What is Twin Oaks?",
    answer: `Intentional community since 1967. ~100 adults.

Labor credits for [visible contribution](/glossary#visible-contribution). [Rotation](/glossary#rotation). [Transparency](/glossary#transparency). High life satisfaction.`
  },
  {
    id: 111,
    question: "What is East Wind?",
    answer: `Intentional community since 1974. ~70 members.

Nut butter business. Rotating coordinators. Full [transparency](/glossary#transparency). Reduced anxiety from belonging.`
  },
  {
    id: 112,
    question: "What's step one?",
    answer: `Reduce [mismatch](/glossary#mismatch) load.

Audit [parasocial relationships](/glossary#parasocial-relationships). Reduce [open loops](/glossary#open-loop). [Circadian](/glossary#circadian-rhythm) basics. Move your body. Don't build [tribe](/glossary#the-150-tribe) while maximally mismatched.`
  },
  {
    id: 113,
    question: "What's step two?",
    answer: `Deepen, not broaden.

Stop meeting new people temporarily. Invest in existing relationships. Identify your actual [5](/glossary#the-5). Depth over breadth.`
  },
  {
    id: 114,
    question: "What's step three?",
    answer: `Reduce [proxy](/glossary#proxy) dependence.

Notice which [proxies](/glossary#proxy) you're using. Time-box their use while building real alternatives. Can't quit cold turkey without something real.`
  },
  {
    id: 115,
    question: "What's step four?",
    answer: `Build.

One dinner. One finished project. One person who sees your contribution. One [closed loop](/glossary#closed-loop). Understanding changes nothing.`
  },
  {
    id: 116,
    question: "What's the smallest change you can make right now?",
    answer: `Identify your [5](/glossary#the-5). One shared meal per week. One [loop](/glossary#closed-loop) closed daily. Morning light. Movement.

Minimum viable [demismatch](/glossary#demismatch).`
  },
  {
    id: 117,
    question: "What if you can't build tribe right now?",
    answer: `Reduce [mismatch](/glossary#mismatch) load first.

[Circadian](/glossary#circadian-rhythm) alignment, nature exposure, reduced strangers. Move from 90% mismatched to 70%. Better positioned for later.`
  },
  {
    id: 118,
    question: "How long does this take?",
    answer: `Years, not weeks.

The [double shift](/glossary#double-shift) makes it slow. Anyone promising quick fixes is selling another [proxy](/glossary#proxy).`
  },
  {
    id: 119,
    question: "Why is building a new life so exhausting?",
    answer: `The [double shift](/glossary#double-shift).

8 hours capitalist work + 2-3 hours tribal maintenance. Unsustainable long-term. Something has to give.`
  },
  {
    id: 120,
    question: "Why do most attempts at this fail?",
    answer: `The [great filter](/glossary#great-filter). [Double shift](/glossary#double-shift) burnout, resource constraints, emerging hierarchies.

Not character failure. Predictable difficulty. [Fission-fusion](/glossary#fission-fusion) means "failure" might be one stage in a longer process.`
  },
  {
    id: 121,
    question: "Who can attempt this first?",
    answer: `People with resources: flexibility, savings, existing relationships.

Not fair, but realistic. First adopters create maps others follow.`
  },
  {
    id: 122,
    question: "What if your tribe attempt fails?",
    answer: `[Fission-fusion](/glossary#fission-fusion) is normal.

Even temporary tribes are valuable. Skills developed. Relationships persist. First attempt teaches. Second builds on it.`
  },
  {
    id: 123,
    question: "What's the most common mistake people make?",
    answer: `Reading about [mismatch](/glossary#mismatch) while sitting alone, scrolling, under artificial light.

Understanding is not progress. Close this tab. Find your people. Build something.`
  },
  {
    id: 124,
    question: "Will life be meaningful without struggle?",
    answer: `Yes. Constructive scarcity remains.

Challenges requiring effort, cooperation, skill. The [tribe](/glossary#the-150-tribe) still needs to raise children, resolve conflicts, create together. Meaning requires challenge, not suffering.`
  },
  {
    id: 125,
    question: "Isn't some suffering necessary?",
    answer: `Material deprivation? No—toxic scarcity. Challenge and effort? Yes—constructive scarcity.

Toxic is imposed and traumatizing. Constructive is chosen and growth-producing.`
  },
  {
    id: 126,
    question: "Why isn't UBI the answer?",
    answer: `Solves resource distribution, not meaning.

Money without role, [tribe](/glossary#the-150-tribe), purpose. UBI + [atomized individual](/glossary#atomized-individual) = comfortable meaninglessness.`
  },
  {
    id: 127,
    question: "What does automation change?",
    answer: `Eliminates human roles in production.

The [proxy](/glossary#proxy) purpose work provides is disappearing. Rebuild meaning through [tribe](/glossary#the-150-tribe), not jobs that won't exist.`
  },
  {
    id: 128,
    question: "What drives all human behavior?",
    answer: `Survive and reproduce.

[Direct fitness](/glossary#direct-fitness): hunger, fear, lust. [Indirect fitness](/glossary#indirect-fitness): status, reputation, coalition. No exceptions.`
  },
  {
    id: 129,
    question: "Why do you have urges you can't control?",
    answer: `[Direct fitness](/glossary#direct-fitness). Survival and reproduction mechanisms running automatically.

The system isn't malfunctioning. It's doing exactly what it evolved to do.`
  },
  {
    id: 130,
    question: "Why do you need other people's approval so badly?",
    answer: `[Indirect fitness](/glossary#indirect-fitness). Survival through social mechanisms.

What people thought determined whether you ate, found mates, got protected. The drive isn't weakness—it's machinery.`
  },
  {
    id: 131,
    question: "Why do you feel obligated to return favors?",
    answer: `[Reciprocal altruism](/glossary#reciprocal-altruism). Foundation of cooperation beyond kinship.

You help today, they help tomorrow. The feeling of obligation is evolved infrastructure.`
  },
  {
    id: 132,
    question: "What's the difference between wants and needs?",
    answer: `Wants: fame, money, perfect life. Needs: small [tribe](/glossary#the-150-tribe), real connection, security.

Wants are shaped by [mismatch](/glossary#mismatch). Chasing wants while needs go unmet = permanent dissatisfaction.`
  },
  {
    id: 133,
    question: "Can you train yourself to maintain more relationships?",
    answer: `No. The limit is biological.

Finite neocortex. Finite time. You can have more followers. You can't have more friends. [Dunbar's numbers](/glossary#dunbars-numbers) aren't failure—they're architecture.`
  },
  {
    id: 134,
    question: "What's the right size for a real community?",
    answer: `The [band](/glossary#the-50-band): ~50 people. 5-8 families in daily interaction.

Share meals. Work alongside. [Fire circle](/glossary#fire-circle) every night. This is what your hardware expects.`
  },
  {
    id: 135,
    question: "Why do you feel like a stranger in your own city?",
    answer: `Because you are. Beyond [150](/glossary#the-150-tribe), everyone is a stranger.

Millions of people, no one you know. [Dunbar's limit](/glossary#dunbars-numbers) in action.`
  },
  {
    id: 136,
    question: "Can technology extend Dunbar's number?",
    answer: `Weak ties, yes. Strong ties, no.

Technology lets you stay loosely connected to more people. Cannot make you capable of intimate relationship with more than [5](/glossary#the-5).`
  },
  {
    id: 137,
    question: "Why does your brain lie to you about what you need?",
    answer: `It's not lying—it's running outdated software.

Calibrated for survival in the [EEA](/glossary#eea), not for truth. The dashboard was designed for different terrain.`
  },
  {
    id: 138,
    question: "Do you perceive reality accurately?",
    answer: `No. You perceive a dashboard.

Evolution optimized for survival, not accuracy. Truth was never the goal. Fitness was.`
  },
  {
    id: 139,
    question: "Why are mass shootings a modern phenomenon?",
    answer: `Killing strangers would be inconceivable in the [EEA](/glossary#eea).

Everyone was known. [Stranger overload](/glossary#stranger-overload) makes strangers into categories. Categories are easier to kill.`
  },
  {
    id: 140,
    question: "Is this just \"we weren't meant to live like this\"?",
    answer: `Yes, but with 300,000 years of evidence and a specific spec sheet.

Not nostalgia. Biology. The [EEA](/glossary#eea) is documented. The [mismatch](/glossary#mismatch) is measurable.`
  },
  {
    id: 141,
    question: "Is all entertainment bad for you?",
    answer: `No. Art isn't [proxy](/glossary#proxy).

Art continues [fire circle](/glossary#fire-circle) function: processing, sense-making, truth-telling. [Proxies](/glossary#proxy) deplete. Art nourishes.`
  },
  {
    id: 142,
    question: "Is this anti-psychiatry?",
    answer: `Anti-misdiagnosis.

Psychiatric conditions are real patterns. They're just not diseases—they're responses to [mismatch](/glossary#mismatch). Different diagnosis, different solutions.`
  },
  {
    id: 143,
    question: "Is this anti-technology?",
    answer: `No. Technology is [pharmakon](/glossary#pharmakon)—both poison and cure.

Same tools creating [mismatch](/glossary#mismatch) can serve [demismatching](/glossary#demismatch). Depends on design.`
  },
  {
    id: 144,
    question: "What is this website?",
    answer: `A framework explaining why modern humans suffer and what conditions would let them thrive.

Not therapy. Not self-help. A spec sheet for human nature.`
  },
  {
    id: 145,
    question: "What are you trying to do?",
    answer: `Change how people understand suffering.

It's not you. It's the environment. Once you see it, you can't unsee it.`
  },
  {
    id: 146,
    question: "Why should you care?",
    answer: `Because you're probably suffering and blaming yourself.

Because "solutions" haven't worked. Because understanding the problem is step one.`
  },
  {
    id: 147,
    question: "Who is this for?",
    answer: `Anyone who feels something is deeply wrong but can't name it.

Therapists tired of band-aids. Technologists who want to build things that help. Parents watching kids struggle.`
  },
  {
    id: 148,
    question: "What should you do after reading this?",
    answer: `Stop blaming yourself. Understand the pattern. Then build.

Your own [tribe](/glossary#the-150-tribe). Your own closure. Your own [visible contribution](/glossary#visible-contribution). Understanding alone changes nothing.`
  },
  {
    id: 149,
    question: "Why is this free?",
    answer: `No one owns truth about human nature.

Fork it, improve it, implement it. The point is not to profit—the point is for you to stop suffering.`
  },
  {
    id: 150,
    question: "What's with all the images?",
    answer: `2,500+ visuals in the library. Framework is dense. Images make it visceral.

Use them. They're free too.`
  },
  {
    id: 151,
    question: "How do you know this isn't just another self-help thing?",
    answer: `Self-help sells individual solutions to systemic problems.

This framework says: problem is environmental, solution is collective, personal optimization is part of the problem.`
  },
  {
    id: 152,
    question: "\"You're an introvert.\"",
    answer: `Introversion = how you recover, not what you need.

You need [tribe](/glossary#the-150-tribe) with a quieter role. The [EEA](/glossary#eea) had roles for every temperament. Introverts still need their [5](/glossary#the-5).`
  },
  {
    id: 153,
    question: "\"Different people need different things.\"",
    answer: `Surface variation exists. Deep structure is universal.

No human thrives isolated, purposeless, surrounded by strangers, with permanent [open loops](/glossary#open-loop).`
  },
  {
    id: 154,
    question: "\"You're romanticizing the past.\"",
    answer: `27% infant mortality. 48% child death before 15. Violence, scarcity, disease.

The framework claims the *social* environment matched hardware. You can have modern medicine AND social structures that work.`
  },
  {
    id: 155,
    question: "\"This sounds like a cult.\"",
    answer: `Cults: charismatic leader, isolation, information control, punishment for leaving.

Framework: no leader, [transparency](/glossary#transparency), embedded in society, [viable exit](/glossary#viable-exit). This is a document.`
  },
  {
    id: 156,
    question: "\"Society can't reorganize.\"",
    answer: `Society doesn't need to. *You* need to build [tribe](/glossary#the-150-tribe) within existing society.

Social layer, not replacement for civilization. You still have job, government. You also have your [50](/glossary#the-50-band).`
  },
  {
    id: 157,
    question: "\"Only privileged people can do this.\"",
    answer: `Partly true. First tribes from those who can experiment.

Also: many "underprivileged" communities already have more tribal structure. Wealth often correlates with isolation.`
  },
  {
    id: 158,
    question: "\"What about people who genuinely can't form relationships?\"",
    answer: `Some neurological differences exist.

Framework claims *most* suffering is environmental. For genuine difference: modified structures, different roles. Everyone needs their version of [tribe](/glossary#the-150-tribe).`
  },
  {
    id: 159,
    question: "\"Isn't this just 'touch grass' with extra steps?\"",
    answer: `Yes and no.

"Touch grass" captures something real. Framework explains *why* and what else is needed. Touch grass is necessary but insufficient.`
  },
  {
    id: 160,
    question: "What's the one thing you should remember?",
    answer: `You're not broken. Your environment is [mismatched](/glossary#mismatch).

Stop fixing yourself. Start building conditions that would let you thrive. The [fish](/glossary#fish-on-land) needs water.`
  },
  {
    id: 161,
    question: "What now?",
    answer: `Close this tab.

You've understood enough. Only building helps. Go find one person. Make one meal. Close one [loop](/glossary#closed-loop). Start.`
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

  const glossaryTerm = glossaryPopup ? glossaryById[glossaryPopup] : null;


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
    <section className="py-20 max-w-5xl mx-auto px-4 md:px-8">
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes faq-reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .faq-reveal-anim {
          animation: faq-reveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Section Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="section-divider-thick mb-4" />
          <h2 className="headline-secondary text-[#0A0A0A]">
            Quick <span className="text-[#C75B39]">Answers</span>
          </h2>
        </div>
        <Link
          href="/faq"
          className="text-sm font-bold uppercase tracking-widest text-[#C75B39] hover:text-[#A84A2D] transition-colors flex items-center gap-2"
        >
          <span>All 160</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      <div
        className={`transition-all duration-500 ${
          isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        {/* THE QUESTION — Using site's color-blocked style */}
        <div
          className={`relative overflow-hidden ${!isRevealed ? 'cursor-pointer group' : ''}`}
          onClick={!isRevealed ? handleReveal : undefined}
          style={{ backgroundColor: '#C75B39' }}
        >
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-grid opacity-10" />

          <div className="relative p-8 md:p-12">
            {/* Question number badge */}
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-12 flex items-center justify-center bg-white/20 text-white font-bold text-lg">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">
                of {tileData.length}
              </span>
            </div>

            {/* THE HEADLINE — ALL CAPS for bold, brave, direct impact */}
            <h3
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight font-black uppercase tracking-wide"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {currentQ.question}
            </h3>

            {/* Reveal CTA */}
            {!isRevealed && (
              <div className="mt-8 flex items-center gap-4">
                <span className="text-white/80 text-sm font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                  <span className="hidden md:inline">Click</span>
                  <span className="md:hidden">Tap</span>
                  {" "}to reveal
                </span>
                <div className="h-px bg-white/30 w-8 group-hover:w-16 transition-all duration-500" />
                <svg className="w-5 h-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* THE ANSWER */}
        {isRevealed && (
          <div className="faq-reveal-anim">
            {/* Answer content — White background */}
            <div className="bg-white">
              <div className="p-8 md:p-12 flex flex-col items-center text-center">
                {/* Answer text */}
                <div className="text-lg md:text-xl text-[#4A4A4A] leading-relaxed space-y-4 max-w-2xl">
                  {parseAnswer(currentQ.answer, handleGlossaryClick)}
                </div>

              </div>
            </div>

            {/* NEXT QUESTION TEASER — Dark section */}
            <div
              className="bg-[#0A0A0A] cursor-pointer group/next"
              onClick={handleNext}
            >
              <div className="p-8 md:p-12 flex items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#C75B39] mb-3">
                    Up Next
                  </p>
                  <p
                    className="text-lg md:text-xl lg:text-2xl text-white/70 group-hover/next:text-white leading-tight font-bold uppercase tracking-wide transition-colors"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {nextQ.question}
                  </p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-[#C75B39] text-white group-hover/next:bg-white group-hover/next:text-[#C75B39] transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION BAR */}
        <div className="bg-[#F0EDE6] border-t border-[#E5E0D8]">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Nav controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleRewind}
                className="w-10 h-10 flex items-center justify-center text-[#8B8B8B] hover:text-[#C75B39] hover:bg-white transition-all"
                title="Back to first"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handlePrev}
                className="w-10 h-10 flex items-center justify-center text-[#8B8B8B] hover:text-[#C75B39] hover:bg-white transition-all"
                title="Previous"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 flex items-center justify-center text-[#8B8B8B] hover:text-[#C75B39] hover:bg-white transition-all"
                title="Next"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3 flex-1 max-w-xs mx-4">
              <div className="flex-1 h-1 bg-[#E5E0D8] relative">
                <div
                  className="absolute left-0 top-0 h-full bg-[#C75B39] transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / tileData.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-[#8B8B8B] font-bold tabular-nums">
                {currentIndex + 1}/{tileData.length}
              </span>
            </div>

            {/* View all link */}
            <Link
              href="/faq"
              className="btn-secondary !py-2 !px-4 !text-xs"
            >
              View All
            </Link>
          </div>
        </div>
      </div>


      {/* Glossary Popup Modal */}
      {glossaryPopup && glossaryTerm && (
        <div
          className="modal-overlay"
          onClick={() => setGlossaryPopup(null)}
        >
          <div
            className="modal-content max-w-lg w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setGlossaryPopup(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#0A0A0A] text-white flex items-center justify-center hover:bg-[#C75B39] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-8 overflow-y-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-[#C75B39] mb-2">Glossary</p>
              <h3 className="headline-secondary text-[#0A0A0A] mb-6 pr-8">
                {glossaryTerm.title}
              </h3>
              <div className="space-y-4">
                {glossaryTerm.definition.map((paragraph, idx) => (
                  <p key={idx} className="text-[#4A4A4A] text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
