"use client";

import Link from "next/link";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { FAQStructuredData } from "@/components/StructuredData";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  subtitle?: string;
  questions: FAQItem[];
}

// Helper to render glossary links
function renderAnswer(answer: string) {
  const parts = answer.split(/(\[.*?\]\(\/glossary#.*?\))/g);
  return parts.map((part, index) => {
    const linkMatch = part.match(/\[(.*?)\]\((\/glossary#.*?)\)/);
    if (linkMatch) {
      return (
        <Link
          key={index}
          href={linkMatch[2]}
          className="glossary-link"
          style={{ color: '#C75B39', textDecoration: 'underline' }}
        >
          {linkMatch[1]}
        </Link>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

const faqCategories: FAQCategory[] = [
  {
    title: "WHAT IS THIS?",
    subtitle: "About the project",
    questions: [
      {
        id: 1,
        question: "What is this website?",
        answer: "A framework explaining why modern humans suffer and what conditions would let them thrive.\n\nNot therapy. Not self-help. A spec sheet for human nature."
      },
      {
        id: 2,
        question: "What are you trying to do?",
        answer: "Change how people understand suffering.\n\nIt's not you. It's the environment. Once you see it, you can't unsee it—and you can start building differently."
      },
      {
        id: 3,
        question: "Why should I care?",
        answer: "Because you're probably suffering and blaming yourself. Because the \"solutions\" you've tried haven't worked. Because understanding the actual problem is the first step to fixing it.\n\nAnd because once you understand, you can help others understand too."
      },
      {
        id: 4,
        question: "Who is this for?",
        answer: "Anyone who feels something is deeply wrong but can't name it.\n\nAlso: therapists tired of prescribing band-aids, technologists who want to build things that help, researchers looking for a unifying framework, parents watching their kids struggle."
      },
      {
        id: 5,
        question: "What do you want me to do after reading this?",
        answer: "Stop blaming yourself. Understand the pattern. Then build: your own [tribe](/glossary#the-150-tribe), your own closure, your own [visible contribution](/glossary#visible-contribution).\n\nUnderstanding alone changes nothing. Building changes everything."
      },
      {
        id: 6,
        question: "Why is this free?",
        answer: "No one owns truth about human nature.\n\nThe framework is open source. Fork it, improve it, implement it. The point is not to profit from you—the point is for you to stop suffering."
      },
      {
        id: 7,
        question: "What's with all the images?",
        answer: "2,500+ visuals in the library. Framework is dense. Images make it visceral.\n\nUse them for presentations, conversations, your own understanding. They're free too."
      },
      {
        id: 8,
        question: "How do I know this isn't just another self-help thing?",
        answer: "Self-help sells individual solutions to systemic problems. That's why it doesn't work—and why you keep buying more.\n\nThis framework says: the problem is environmental, the solution is collective, and anyone selling you personal optimization is part of the problem."
      },
      {
        id: 9,
        question: "Is this anti-psychiatry?",
        answer: "It's anti-misdiagnosis.\n\nPsychiatric conditions are real behavioral patterns. They're just not diseases—they're accurate responses to environmental [mismatch](/glossary#mismatch).\n\nDifferent diagnosis, different solutions."
      },
      {
        id: 10,
        question: "Is this anti-technology?",
        answer: "No. Technology is [pharmakon](/glossary#pharmakon)—both poison and cure.\n\nThe same tools creating [mismatch](/glossary#mismatch) can serve [demismatching](/glossary#demismatch). Depends on design, incentives, implementation."
      }
    ]
  },
  {
    title: "EVER WONDER WHY?",
    subtitle: "Entry hooks, the feeling something's wrong",
    questions: [
      {
        id: 11,
        question: "Why do I feel so bad?",
        answer: "You're not broken. Your environment is.\n\nThis is [mismatch](/glossary#mismatch)—the gap between what your biology expects and what it gets. Your brain was built for a world that no longer exists: small tribes, known faces, work with visible results, problems you could actually solve.\n\nThat feeling isn't malfunction. It's accurate feedback that your environmental conditions don't match your species' requirements."
      },
      {
        id: 12,
        question: "Why does modern life feel so wrong?",
        answer: "Because you evolved for completely different conditions.\n\nFor 300,000 years, humans lived in the [EEA](/glossary#eea)—the Environment of Evolutionary Adaptedness. Small bands of 30-50 people. Extended tribe of 150. Known faces everywhere. Daily closure on problems. Physical life with natural rhythms.\n\nYour neural hardware was calibrated for that world. Then everything changed—agriculture, cities, industry, digital technology—each shift faster than evolution could track. The [mismatch](/glossary#mismatch) is the gap. The wrongness you feel is accurate signal."
      },
      {
        id: 13,
        question: "Why can't I stop thinking about things I can't control?",
        answer: "You're caught in an [open loop](/glossary#open-loop).\n\nYour brain evolved to solve problems and move on. Threat appears → take action → threat resolved → emotion dissipates. The loop closes.\n\nBut climate change? The economy? That embarrassing thing you said in 2015? No action resolves them. The loop won't close. Your brain keeps trying to plan solutions for problems that don't admit solutions. It's working correctly—there just isn't anything for it to work with.\n\nModern life is an [open loop](/glossary#open-loop) factory."
      },
      {
        id: 14,
        question: "What would it feel like to actually finish something?",
        answer: "That's a [closed loop](/glossary#closed-loop). Problem resolved through action. Emotion dissipates because the situation is handled.\n\nHunt → eat → done. Conflict → resolution → done. Threat → escape → done.\n\n[Closed loops](/glossary#closed-loop) are the designed function of emotional states. They're supposed to motivate action, then release. Not persist forever.\n\nClosing loops where possible isn't productivity advice. It's restoring normal function to a system designed for resolution."
      },
      {
        id: 15,
        question: "Why do I care what strangers think?",
        answer: "Because in ancestral conditions, what people thought determined whether you survived.\n\nHigh-[status](/glossary#status) individuals got more resources, more allies, more protection. Low-status meant worse odds on everything. Social rejection wasn't hurt feelings—it was existential threat.\n\nThis is [indirect fitness](/glossary#indirect-fitness): survival through social mechanisms. The drive to be seen as valuable isn't vanity. It's survival machinery—still running, even though the tribe is gone."
      },
      {
        id: 16,
        question: "Is there a limit to how many people I can actually know?",
        answer: "Yes. Hard limit. [Dunbar's numbers](/glossary#dunbars-numbers):\n\n- **[5](/glossary#the-5)**: Intimate—you'd call them at 3am\n- **[15](/glossary#the-15)**: Close—their deaths would devastate you\n- **[50](/glossary#the-50-band)**: Good friends—daily interaction in ancestral conditions\n- **[150](/glossary#the-150-tribe)**: Meaningful—everyone you can know as an individual\n\nBeyond 150, people become categories. This isn't failure of effort or technology. It's neural architecture. The neocortex that processes social information is finite. You physically cannot have 500 close friends."
      }
    ]
  },
  {
    title: "FEEL FAMILIAR?",
    subtitle: "Relatable modern experiences",
    questions: [
      {
        id: 17,
        question: "I have 2,000 followers. Why am I lonely?",
        answer: "Followers aren't tribe. Recognition isn't relationship.\n\nThose 2,000 occupy mental space that could go to your [5](/glossary#the-5). They create [parasocial relationships](/glossary#parasocial-relationships)—one-way bonds with people who don't know you exist. Every influencer you emotionally invest in takes a slot meant for someone who could actually reciprocate.\n\nYour [Dunbar layers](/glossary#dunbars-numbers) are full of strangers. Your actual circle is empty."
      },
      {
        id: 18,
        question: "Why do substitutes never satisfy me?",
        answer: "Because they're designed not to.\n\nA [proxy](/glossary#proxy) hijacks a biological drive without satisfying the underlying need. Social media for belonging. Porn for intimacy. Junk food for nourishment. Each provides the *signal* your brain responds to, but not the *substance* the drive evolved to secure.\n\nMomentary relief. Increasing need. The more you consume, the hungrier you get."
      },
      {
        id: 19,
        question: "Why do quick fixes make things worse?",
        answer: "[Proxies](/glossary#proxy) can't satisfy because they address signals, not needs. They create tolerance requiring escalation. They prevent seeking real solutions. And they generate profit from your perpetual hunger.\n\nThe business model requires that they don't work. If social media actually met your belonging needs, you'd stop using it. If self-help actually fixed you, you wouldn't buy the next book."
      },
      {
        id: 20,
        question: "Why does getting what I want leave me wanting more?",
        answer: "Because you got what you *thought* you wanted, not what you need.\n\nWants: worldwide fame, million dollars, perfect Instagram life.\nNeeds: recognition by a small [tribe](/glossary#the-150-tribe), resource security in a sharing network, connection with flawed humans.\n\nYour wants are shaped by [mismatch](/glossary#mismatch)—culture selling you [proxies](/glossary#proxy) for the real thing. Chasing wants while needs go unmet = permanent dissatisfaction."
      },
      {
        id: 21,
        question: "Why do I feel like I'm failing even when I'm \"successful\"?",
        answer: "You got what culture told you to want, not what your biology needs.\n\nSuccess by modern metrics—money, followers, credentials—doesn't map to ancestral success. You might have high [status](/glossary#status) by abstract measures but have no [tribe](/glossary#the-150-tribe), no [visible contribution](/glossary#visible-contribution), no [closed loops](/glossary#closed-loop).\n\nThe feeling isn't imposter syndrome. It's accurate [signal](/glossary#signal-vs-symptom) that something essential is missing. The success is real. The satisfaction isn't."
      },
      {
        id: 22,
        question: "Why does modern work feel meaningless?",
        answer: "[Immediate-return](/glossary#immediate-return-economy) vs. delayed-return economy.\n\nAncestral work was visible: hunt → meat → everyone eats. 3-4 hours of effort, tangible results. Modern work: 8-12 hours of abstracted labor for invisible shareholders. You move information around a screen and cannot point to a single thing that exists because of your work.\n\nYour meaning-making systems literally cannot connect your effort to your survival. That's not laziness. That's accurate assessment."
      },
      {
        id: 23,
        question: "What are bullshit jobs?",
        answer: "Jobs whose existence the workers themselves cannot justify. Work that produces nothing tangible, benefits no one you know, and exists to perpetuate itself.\n\nDavid Graeber's research found a significant percentage of workers privately believe their jobs are meaningless—that if their position disappeared, the world would be no worse off.\n\nThis is work/purpose [mismatch](/glossary#mismatch) at civilizational scale. [Visible contribution](/glossary#visible-contribution) is a human need. [Bullshit jobs](/glossary#bullshit-jobs) structurally deny it."
      },
      {
        id: 24,
        question: "Why am I exhausted by crowds and cities?",
        answer: "[Stranger overload](/glossary#stranger-overload).\n\nYou encounter more unknown humans daily than ancestors met in years. Your brain can't stop assessing them—threat? ally? relevant? The social evaluation machinery runs constantly on inputs that were never supposed to exist.\n\nIn the [EEA](/glossary#eea), every face was known. You might encounter 1,000 strangers in a lifetime. Modern urban life reverses this completely. The drain of cities isn't just noise—it's relentless computation of faces your brain was never designed to process."
      },
      {
        id: 25,
        question: "Why can't I stop ruminating?",
        answer: "[Rumination](/glossary#rumination) is your brain's planning mechanism running without anything to plan.\n\nIt evolved to analyze problems and generate solutions. Threat → think → plan → execute → threat resolves → thinking stops. The [loop closes](/glossary#closed-loop).\n\nNow it runs on unsolvable problems. You replay the embarrassing moment but can't undo it. You worry about climate change but no action resolves it. The machinery churns without producing usable output.\n\nIt's working correctly. There just isn't anything for it to work with."
      },
      {
        id: 26,
        question: "Why do I imagine people judging me?",
        answer: "That's the [internal audience](/glossary#internal-audience). Imaginary critics generating real biological responses.\n\nYour brain evolved being watched by 150 known people whose opinions actually mattered. Now that external audience is gone, but the watching-being-watched system still runs. It simulates an audience—compiling critics from your past, media, social comparison—and generates real anxiety in response to imagined scrutiny.\n\nThe [internal audience](/glossary#internal-audience) never sleeps. And it's harsher than any real audience."
      },
      {
        id: 27,
        question: "Why do I always assume the worst?",
        answer: "[Negativity bias](/glossary#negativity-bias). An adaptation that kept ancestors alive.\n\nMissing a threat could be fatal. Missing an opportunity was usually recoverable. Evolution made threat detection hypersensitive. Better to assume the rustle is a snake than to assume it isn't.\n\nNow it runs on phantoms. You assume rejection when acceptance is more likely. You remember one criticism among ten compliments. The machinery is calibrated for real dangers that aren't there anymore."
      },
      {
        id: 28,
        question: "Why can I never be good enough?",
        answer: "The [perfectionism trap](/glossary#perfectionism-trap). Your [internal audience](/glossary#internal-audience) holds contradictory standards.\n\nBe ambitious but not competitive. Confident but not arrogant. Attractive but not vain. Successful but not obsessed. Any position you take violates some standard.\n\nThe critics are impossible to satisfy because their demands are mutually exclusive. The perfectionism isn't motivating excellence—it's generating paralysis."
      },
      {
        id: 29,
        question: "Why is almost-having-control worse than no control?",
        answer: "This is [partial control](/glossary#partial-control)—the worst anxiety zone.\n\nPure helplessness allows acceptance. Pure control allows action. [Partial control](/glossary#partial-control) traps you between. You can affect the outcome—so you can't let go. You can't determine the outcome—so you can't resolve it. The [loop](/glossary#open-loop) stays open.\n\nYour work affects job security but doesn't guarantee it. Your parenting influences your kids but doesn't determine who they become. You're perpetually in the zone of incomplete agency."
      },
      {
        id: 30,
        question: "Why do fake things feel better than real things?",
        answer: "[Hyperstimuli](/glossary#hyperstimuli)—stimuli exceeding anything in nature.\n\nEvolutionary biologist Tinbergen found birds would abandon their own eggs for larger, more colorful fake eggs. The fake eggs hijacked nesting instinct by exaggerating the features it responds to.\n\nPorn presents more sexual novelty than any real person. Junk food combines sugar/fat/salt in unnatural concentrations. Social media delivers more feedback than a [tribe](/glossary#the-150-tribe) of 150. Real satisfactions become inadequate by comparison."
      },
      {
        id: 31,
        question: "Why do I feel connected to people who don't know I exist?",
        answer: "[Parasocial relationships](/glossary#parasocial-relationships). One-way emotional bonds.\n\nYou know their face, their voice, their struggles. You feel connection. They've never heard your name. The relationship is entirely one-directional.\n\nThe problem: [parasocial bonds](/glossary#parasocial-relationships) occupy slots in your [Dunbar layers](/glossary#dunbars-numbers). Every influencer you emotionally invest in is a slot not occupied by someone who could actually reciprocate. You have finite capacity. It's being spent on people who will never know you."
      },
      {
        id: 32,
        question: "Why am I obsessed with celebrities?",
        answer: "Fame is [hyperstimulus](/glossary#hyperstimuli) for status recognition.\n\nYou form [parasocial bonds](/glossary#parasocial-relationships) with people who don't know you exist. They extract emotional investment without reciprocity. Every celebrity you track takes bandwidth from real relationships.\n\nThe obsession feels like connection. It's actually displacement."
      },
      {
        id: 33,
        question: "Why do sports fans act like it actually matters?",
        answer: "Tribal belonging through [proxy](/glossary#proxy).\n\nYou don't actually care about soccer. You're addicted to the feeling of belonging, shared goals, common enemies. Your team vs. their team satisfies something deep.\n\nIt almost meets the need for [tribe](/glossary#the-150-tribe). Almost."
      }
    ]
  },
  {
    title: "CERTAIN IT'S YOUR FAULT?",
    subtitle: "The reframe (it's not you)",
    questions: [
      {
        id: 34,
        question: "Is something wrong with me, or with my environment?",
        answer: "The environment. That's the core claim.\n\nImagine a [fish on land](/glossary#fish-on-land). It's flopping, gasping. Its gills work perfectly—designed for water. Its fins work perfectly—designed for swimming. The problem isn't broken fish. It's wrong environment.\n\nYou wouldn't medicate the flopping. You'd put the fish back in water.\n\nModern humans are fish on land. Our brains evolved for [EEA](/glossary#eea) conditions. We're flopping in [mismatched](/glossary#mismatch) environments—and diagnosing the flopping."
      },
      {
        id: 35,
        question: "What are my emotions actually telling me?",
        answer: "They're data. Information about whether current conditions match your biology's requirements.\n\nThe core question: [signal or symptom](/glossary#signal-vs-symptom)?\n\n**Signal**: Information requiring environmental response. The emotion tells you something needs addressing.\n**Symptom**: Malfunction requiring suppression. Broken machinery producing false output.\n\nThe framework claims most suffering is signal, not symptom. The feeling is accurate. The environment is wrong."
      },
      {
        id: 36,
        question: "So my feelings aren't the problem?",
        answer: "Correct. They're data. The problem is the environment generating them.\n\nYour anxiety isn't broken threat-detection. Your environment is actually threatening—unpredictable, uncontrollable, full of strangers. Your depression isn't chemical imbalance. Your life actually lacks meaning, tribe, [visible contribution](/glossary#visible-contribution).\n\nThe feelings are the [signal](/glossary#signal-vs-symptom). The [mismatch](/glossary#mismatch) is the cause."
      },
      {
        id: 37,
        question: "Are my symptoms trying to tell me something?",
        answer: "That's the right question. [Signal vs. symptom](/glossary#signal-vs-symptom) is the core distinction.\n\nPsychiatry treats almost everything as symptom—broken machinery to suppress. The framework claims most of it is signal—accurate feedback to act on.\n\nDifferent diagnosis, different treatment. If it's signal, suppression doesn't help. It just removes your awareness of the problem."
      },
      {
        id: 38,
        question: "What's wrong with just treating symptoms?",
        answer: "It's like covering the oil light instead of checking the engine.\n\nThe [oil light metaphor](/glossary#oil-light-metaphor): medication suppresses the [signal](/glossary#signal-vs-symptom) without addressing what it's responding to. The light goes off. The engine keeps degrading.\n\nSometimes you need signal suppression to function while you fix the cause. But signal suppression as the *whole* intervention? That's treating a warning as the problem."
      },
      {
        id: 39,
        question: "What is anxiety actually?",
        answer: "Accurate threat detection.\n\nYou're surrounded by strangers. Unpredictability everywhere. Stressors you can't control or escape. [Open loops](/glossary#open-loop) that never close. Your threat-detection system is firing because threats are actually present.\n\nThe alarm is working. The environment is actually dangerous—not physically like predators, but socially and psychologically in ways your [EEA](/glossary#eea) hardware can't distinguish."
      },
      {
        id: 40,
        question: "What is depression actually?",
        answer: "Accurate meaning assessment.\n\nYour life lacks [visible purpose](/glossary#visible-contribution). You have no [tribe](/glossary#the-150-tribe). Your work produces nothing tangible. Your [loops don't close](/glossary#open-loop).\n\nThe depression is accurate [signal](/glossary#signal-vs-symptom): meaning is actually absent. Purpose is actually missing. Connection is actually gone.\n\nThe feeling is data. The data is correct."
      },
      {
        id: 41,
        question: "Why do doctors diagnose the flopping?",
        answer: "Because they've normalized the land.\n\n[Flopping disorder](/glossary#flopping-disorder): pathologizing adaptive responses to environmental [mismatch](/glossary#mismatch). Anxiety in response to genuine threat becomes \"Generalized Anxiety Disorder.\" Depression in response to meaningless isolation becomes \"Major Depressive Disorder.\"\n\nWe name the flopping. Categorize the flopping. Medicate the flopping. Never mention that the [fish](/glossary#fish-on-land) isn't in water.\n\nThere's no billing code for \"wrong environment.\""
      },
      {
        id: 42,
        question: "What is ADHD actually?",
        answer: "Hunter cognition in a farmer world.\n\nScanning attention. Movement-seeking. Novelty-responsive. Immediate action orientation. These patterns were adaptive in the [EEA](/glossary#eea)—the hunter notices everything, responds quickly, doesn't sit still.\n\nThen we built classrooms that require sitting still for hours. Pathologized everyone who couldn't. Called it disorder. Medicated until they comply.\n\nADHD isn't broken attention. It's a different attentional style—one that served well for most of human history."
      },
      {
        id: 43,
        question: "Why is \"normal\" defined so narrowly?",
        answer: "[Farmer brain](/glossary#farmer-brain) became the standard.\n\nAgricultural societies required sitting still, following instructions, deferring gratification. Schools were designed to produce factory workers and obedient citizens. One narrow cognitive style became \"well-adjusted.\"\n\nCognitive styles that served foraging contexts—scanning attention, movement-seeking, novelty responsiveness—became \"disorder.\" We've taken one configuration, made it the norm, and declared everyone who doesn't fit broken."
      },
      {
        id: 44,
        question: "What is social anxiety actually?",
        answer: "Fear of the [internal audience](/glossary#internal-audience) projected onto real people.\n\nYou assume strangers are scrutinizing you with the intensity of your internal critics. They're not. They're barely aware you exist. But the phantom judges wear real faces.\n\n[Social anxiety](/glossary#social-anxiety) isn't fear of other people. It's fear of your own imagined critics, appearing as other people."
      },
      {
        id: 45,
        question: "What is burnout?",
        answer: "Work/purpose [mismatch](/glossary#mismatch).\n\nYour meaning-making systems cannot connect abstract labor to survival benefit. 8-12 hours of effort with no [visible contribution](/glossary#visible-contribution). No [closed loops](/glossary#closed-loop). No tangible result.\n\nBurnout isn't laziness. It's accurate assessment of futility. The work is actually meaningless, and your brain knows it."
      },
      {
        id: 46,
        question: "What is imposter syndrome?",
        answer: "Feeling like a fraud despite evidence of competence.\n\nOften: accurate recognition that your work doesn't visibly benefit anyone you know. You have credentials, accomplishments, recognition—but no [visible contribution](/glossary#visible-contribution) to people you actually care about.\n\nThe \"syndrome\" might be [signal](/glossary#signal-vs-symptom). The work might actually be disconnected from anything that matters."
      }
    ]
  },
  {
    title: "THE COMPLETE PICTURE",
    subtitle: "Mismatch and EEA explained",
    questions: [
      {
        id: 47,
        question: "What is mismatch?",
        answer: "The gap between what your biology expects and what your environment provides.\n\nYour brain was built for small tribes, known faces, [visible contribution](/glossary#visible-contribution), [closed loops](/glossary#closed-loop). It's running on strangers, abstraction, invisible impact, permanent anxiety.\n\n[Mismatch](/glossary#mismatch) isn't metaphor. It's measurable distance between spec and reality."
      },
      {
        id: 48,
        question: "What environment did humans actually evolve for?",
        answer: "The [EEA](/glossary#eea)—Environment of Evolutionary Adaptedness.\n\nSmall bands of 30-50 people. Extended [tribe](/glossary#the-150-tribe) of 150. Known faces—you might meet 1,000 strangers in a lifetime. Daily closure—work had [visible results](/glossary#visible-contribution). Physical life—constant movement, natural light cycles. [Fire circles](/glossary#fire-circle) every night. [Shared parenting](/glossary#alloparenting). [Demand sharing](/glossary#demand-sharing).\n\nThis is the spec sheet. Your brain was built to run on these inputs. We're running on something completely different."
      },
      {
        id: 49,
        question: "What does being in the wrong environment do to you?",
        answer: "Everything breaks that depends on the right environment to function.\n\nSleep without natural light cycles. Belonging without [tribe](/glossary#the-150-tribe). Meaning without [visible contribution](/glossary#visible-contribution). Calm without [closed loops](/glossary#closed-loop). Security without your [5](/glossary#the-5).\n\nThe [fish](/glossary#fish-on-land) isn't just uncomfortable on land. It's dying. Every system designed for water fails on land. The gasping isn't drama—it's accurate signal of fatal [mismatch](/glossary#mismatch)."
      },
      {
        id: 50,
        question: "What drives all human behavior?",
        answer: "Survive and reproduce.\n\nEverything traces back to these two, directly or indirectly. [Direct fitness](/glossary#direct-fitness): hunger, fear, lust. [Indirect fitness](/glossary#indirect-fitness): status, reputation, coalition. No exceptions.\n\nUnderstanding this explains everything else."
      },
      {
        id: 51,
        question: "Why do I have urges I can't control?",
        answer: "[Direct fitness](/glossary#direct-fitness). Survival and reproduction mechanisms that run automatically.\n\nHunger, thirst, fear, lust. These systems don't ask permission. They're running in the background, always, pushing you toward behaviors that historically promoted survival.\n\nThe system isn't malfunctioning. It's doing exactly what it evolved to do."
      },
      {
        id: 52,
        question: "Why do I need other people's approval so badly?",
        answer: "[Indirect fitness](/glossary#indirect-fitness). Survival through social mechanisms.\n\nIn ancestral conditions, what people thought determined whether you ate, found mates, got protected or abandoned. Social rejection was existential threat.\n\nThe drive to be seen as valuable isn't weakness—it's survival machinery still running."
      },
      {
        id: 53,
        question: "Why do I feel obligated to return favors?",
        answer: "[Reciprocal altruism](/glossary#reciprocal-altruism). The foundation of cooperation beyond kinship.\n\nYou help today, they help tomorrow. Neither makes sense alone, but over repeated interactions, both benefit. The feeling of obligation is evolved infrastructure.\n\nThe outrage at freeloaders, the tracking of who owes whom—this is cognitive machinery that built human sociality."
      },
      {
        id: 54,
        question: "How many close friends do I actually need?",
        answer: "[Five](/glossary#the-5). People you'd call at 3am. Complete vulnerability. Almost daily contact.\n\nThese are your emergency contacts not by form but by reality. The people who would drop everything. The people who've seen you at your worst. The people you don't perform for.\n\nIf that inner circle has fewer than 5 people—that's the problem. No amount of acquaintances, followers, or networking connections compensates. The intimacy layer serves functions the other layers cannot.\n\nMost modern people have 0-2."
      },
      {
        id: 55,
        question: "How many people can I genuinely care about?",
        answer: "About [15](/glossary#the-15). People whose deaths would devastate you. People whose current struggles you know without asking.\n\nThis is active care, not passive connection. You track what's happening in their lives. You notice when something's wrong. Maintaining this requires regular contact—hours per month minimum.\n\nMost people overestimate their 15. Count only people you've had meaningful contact with in the last month. The real number is usually smaller."
      },
      {
        id: 56,
        question: "What's the right size for a real community?",
        answer: "The [band](/glossary#the-50-band): ~50 people. 5-8 families in daily interaction.\n\nThis is who you'd see every day. Share meals with. Work alongside. Sit with at the [fire circle](/glossary#fire-circle) every night.\n\nThe nuclear family—two parents isolated—is an aberration. The [band](/glossary#the-50-band) is what your hardware expects."
      },
      {
        id: 57,
        question: "Can I train myself to maintain more relationships?",
        answer: "No. The limit is biological.\n\nThe neocortex that processes social information is finite. The time required to maintain relationships is finite. You cannot have 500 close friends. [Dunbar's numbers](/glossary#dunbars-numbers) aren't failure of effort—they're architecture.\n\nYou can have more followers. You can't have more friends."
      },
      {
        id: 58,
        question: "Why do I feel like a stranger in my own city?",
        answer: "Because you are. Beyond [150](/glossary#the-150-tribe), everyone is a stranger.\n\nYour city has millions of people but no one you actually know. Your brain can't model them as individuals—they're categories.\n\nThe isolation of cities isn't just feeling. It's [Dunbar's limit](/glossary#dunbars-numbers) in action."
      },
      {
        id: 59,
        question: "Can technology extend Dunbar's number?",
        answer: "You can extend weak ties. You cannot extend strong ties.\n\nTechnology lets you stay loosely connected to more people. It cannot make you capable of intimate relationship with more than [5](/glossary#the-5), close friendship with more than [15](/glossary#the-15).\n\nThe limit is biological, not technological."
      },
      {
        id: 60,
        question: "Why does my brain lie to me about what I need?",
        answer: "It's not lying—it's running outdated software.\n\nYour brain evolved perceiving what mattered for survival in the [EEA](/glossary#eea), not what's objectively true. The shortcuts were calibrated for a world that no longer exists.\n\nThe dashboard was designed for different terrain."
      },
      {
        id: 61,
        question: "Do I perceive reality accurately?",
        answer: "No. You perceive a dashboard.\n\nEvolution optimized for survival, not accuracy. You see what you needed to see to stay alive—300,000 years ago.\n\nTruth was never the goal. Fitness was."
      },
      {
        id: 62,
        question: "What's the difference between wants and needs?",
        answer: "Wants: worldwide fame, million dollars, perfect life.\nNeeds: recognition by small [tribe](/glossary#the-150-tribe), resource security, connection with flawed humans.\n\nWants are shaped by [mismatch](/glossary#mismatch)—culture selling you [proxies](/glossary#proxy). Needs are biological constants.\n\nChasing wants while needs go unmet = permanent dissatisfaction."
      },
      {
        id: 63,
        question: "Do rats get addicted because of drugs, or because of loneliness?",
        answer: "Loneliness. [Rat Park](/glossary#rat-park).\n\nStandard research: isolated rats in cages self-administer drugs to death. Conclusion: drugs are irresistibly addictive.\n\nBruce Alexander built \"Rat Park\"—enriched environment with other rats, space, stimulation. Same drugs available. Rats largely ignored them. Even addicted rats reduced consumption when moved to [Rat Park](/glossary#rat-park).\n\nThe variable isn't the drug. It's the environment."
      },
      {
        id: 64,
        question: "What is addiction actually?",
        answer: "Drive-seeking redirected to [proxies](/glossary#proxy).\n\nReal satisfactions are blocked, so you reach for substitutes. The drives work correctly. The pathways to real satisfaction are blocked. [Rat Park](/glossary#rat-park) showed this: rats in matched environments don't self-medicate. Isolated rats do.\n\nAddiction isn't the substance—it's the solution to [mismatch](/glossary#mismatch)."
      }
    ]
  },
  {
    title: "THE EXPLOITATION",
    subtitle: "Who profits from suffering",
    questions: [
      {
        id: 65,
        question: "Why is my suffering profitable?",
        answer: "A fully satisfied human is a terrible customer.\n\nEvery unmet need is a market. Lonely? Here's social media. Sexually frustrated? Here's porn. Hungry for meaning? Here's self-help. Anxious? Here's medication.\n\nThe [atomized individual](/glossary#atomized-individual)—severed from [tribe](/glossary#the-150-tribe), purpose, and intimacy—is the ideal consumer unit. Your [mismatch](/glossary#mismatch) is the business model."
      },
      {
        id: 66,
        question: "How do companies make money from my unhappiness?",
        answer: "The [exploitation formula](/glossary#exploitation-formula):\n\n1. Identify a real human need\n2. Block or degrade genuine satisfaction\n3. Offer a [proxy](/glossary#proxy) that mimics the signal without meeting the need\n4. Proxy doesn't satisfy (by design), generating repeat usage\n5. Monetize return visits\n6. Reinvest in making the proxy more addictive\n\nDating apps need you single. Social media needs you lonely. Self-help needs you broken."
      },
      {
        id: 67,
        question: "Why does being alone make me easier to manipulate?",
        answer: "The [atomized individual](/glossary#atomized-individual) has no counter-narrative.\n\nNo community to say \"you don't need that.\" No elders to provide perspective. No [tribe](/glossary#the-150-tribe) to meet belonging needs for real. So you seek substitutes in products and [parasocial relationships](/glossary#parasocial-relationships). You're vulnerable because no one's watching out for you.\n\nEvery industry that profits from human misery has an interest in maintaining atomization. This isn't conspiracy—it's incentive alignment."
      },
      {
        id: 68,
        question: "Who are the most exploited customers?",
        answer: "[Whales](/glossary#whales). Gambling industry term for vulnerable users who account for disproportionate revenue.\n\nProblem gamblers. People with addictive tendencies. Those using consumption to fill emotional voids. \"Whale hunting\" explicitly targets those least able to resist.\n\nYour vulnerability is their profit center. The business model depends on exploiting the people most susceptible to manipulation. Engagement metrics, personalization, A/B testing—all deployed to find and hook [whales](/glossary#whales)."
      },
      {
        id: 69,
        question: "Why are slot machines and social media so addictive?",
        answer: "[Variable ratio reinforcement](/glossary#variable-ratio-reinforcement)—the most addictive reward schedule known to psychology.\n\nIf you win every time, it's not compelling. If you never win, you stop. If you win unpredictably—sometimes after 3 pulls, sometimes 300—you become addicted.\n\nPull-to-refresh is literally a slot machine lever. You scroll and sometimes see something rewarding. Sometimes not. The variability keeps you scrolling. This is deliberate design by people who know exactly what they're doing."
      },
      {
        id: 70,
        question: "What is dopamine and how is it hijacked?",
        answer: "[Dopamine](/glossary#dopamine) drives reward-seeking. It spikes not when you get reward, but when you anticipate it.\n\nThe system was calibrated for intermittent natural rewards requiring effort. Modern technology delivers [dopamine](/glossary#dopamine) triggers without effort or genuine satisfaction. Constant activation downregulates receptors. You need more to feel the same.\n\nReal satisfactions become inadequate by comparison. A real relationship can't compete with infinite novelty. A real achievement can't compete with game leveling designed by behavioral psychologists."
      },
      {
        id: 71,
        question: "How does social media exploit me?",
        answer: "Profits from loneliness.\n\n[Variable ratio reinforcement](/glossary#variable-ratio-reinforcement) keeps you scrolling. [Parasocial bonds](/glossary#parasocial-relationships) fill your [Dunbar layers](/glossary#dunbars-numbers) with strangers. Engagement metrics optimize for time-on-app, not wellbeing. Your attention is the product sold to advertisers.\n\nThe platform needs you lonely enough to keep seeking connection, but never connected enough to leave."
      },
      {
        id: 72,
        question: "How does advertising exploit me?",
        answer: "$700B+ annually weaponizing evolutionary psychology.\n\nManufacturing inadequacy. Making you feel bad about yourself so you'll buy products to feel better. The inadequacy is created, not discovered. The solution they sell perpetuates the problem they created.\n\nEvery ad is a message: you're not enough. The product will fix you. It won't."
      },
      {
        id: 73,
        question: "How does gambling exploit me?",
        answer: "[Variable ratio reinforcement](/glossary#variable-ratio-reinforcement) perfected, then exported everywhere.\n\nLoot boxes. Gacha games. Engagement loops. The same psychology that makes slot machines addictive now powers apps, games, and platforms. [Whales](/glossary#whales)—vulnerable users—specifically targeted.\n\nThe techniques aren't hidden. They're documented, refined, and deployed against you deliberately."
      },
      {
        id: 74,
        question: "How does news media exploit me?",
        answer: "Profits from threat activation. \"If it bleeds, it leads.\"\n\n[Open loops](/glossary#open-loop) that never close. Anxiety about events you can't influence. Your [cortisol](/glossary#cortisol) elevated for engagement. The business model requires keeping you worried about things you can't fix."
      },
      {
        id: 75,
        question: "How does the food industry exploit me?",
        answer: "Engineers hyperpalatability. The [bliss point](/glossary#bliss-point)—precise combination of sugar, fat, salt for maximum craving without satisfaction.\n\nThese foods are designed to be impossible to eat in moderation. Not to taste good—traditional cuisines taste good AND satisfy. To create craving without satiation. Addiction is the feature, not the bug."
      },
      {
        id: 76,
        question: "How do dating apps exploit me?",
        answer: "Business model requires failure. Successful match = lost user.\n\nInfinite choice prevents depth. [Variable ratio reinforcement](/glossary#variable-ratio-reinforcement) keeps you swiping. Loneliest users are most valuable. Designed for engagement, not outcomes.\n\nIf the app actually helped you find a partner, you'd leave."
      },
      {
        id: 77,
        question: "How does porn exploit me?",
        answer: "[Hyperstimuli](/glossary#hyperstimuli) hijacking mating drive.\n\nUnlimited novelty impossible in nature. [Dopamine](/glossary#dopamine) system overwhelmed. Real partners become inadequate by comparison. Pair bonding disrupted.\n\nThe [proxy](/glossary#proxy) isn't satisfying the need—it's destroying capacity for the real thing."
      },
      {
        id: 78,
        question: "How does self-help exploit me?",
        answer: "Requires that self-help doesn't work.\n\nIndividual solutions to systemic problems. Repeat customers essential. The failure is the business model. If you were actually helped, you wouldn't buy the next book.\n\nSelf-help sells personal optimization for problems that are environmental. That's why it doesn't work—and why you keep buying more."
      },
      {
        id: 79,
        question: "Why isn't this common knowledge?",
        answer: "Incentives. Not conspiracy—just money.\n\nFunding goes to drug development, not environmental intervention. Media covers new treatments, not systemic critique. [Ghostwritten studies](/glossary#ghostwritten-studies) shape the literature. Academics who question pharma lose funding.\n\nTruth isn't profitable. Profitable isn't true."
      }
    ]
  },
  {
    title: "THE MISDIAGNOSIS",
    subtitle: "Psychiatric critique",
    questions: [
      {
        id: 80,
        question: "Is depression really a chemical imbalance?",
        answer: "The [serotonin hypothesis](/glossary#serotonin-hypothesis) has been debunked.\n\nFor decades, pharma marketed antidepressants as correcting \"chemical imbalance.\" In 2022, a comprehensive review concluded there's no consistent evidence depression is associated with low serotonin. The narrative was marketing, not science.\n\nSSRIs do *something*—but they don't correct a deficiency. They flood the system. That's [signal override](/glossary#signal-override), not repair."
      },
      {
        id: 81,
        question: "What does psychiatric medication actually do?",
        answer: "[Signal override](/glossary#signal-override). Floods neurotransmitter systems to suppress [signals](/glossary#signal-vs-symptom) without addressing what they're responding to.\n\nDepression signals meaning deficit. SSRIs don't create meaning—they suppress the signal. Anxiety signals threat. Benzos don't remove threats—they suppress the alarm.\n\nSometimes necessary. But signal override as the whole intervention? That's covering the [oil light](/glossary#oil-light-metaphor) while the engine degrades."
      },
      {
        id: 82,
        question: "How does pharma exploit me?",
        answer: "Invented \"chemical imbalance\" to sell chemicals. [Ghostwritten studies](/glossary#ghostwritten-studies). Paid key opinion leaders. 15-minute medication checks that don't ask about your environment.\n\nThe [serotonin hypothesis](/glossary#serotonin-hypothesis) was marketing dressed as science. Tolerance develops. Higher doses needed. Environment unchanged. The patient is managed, not healed."
      },
      {
        id: 83,
        question: "What are ghostwritten studies?",
        answer: "Research papers written by pharmaceutical companies and published under academic names.\n\nDrug company conducts study. Company writers draft the paper favorably. Respected academic gets offered authorship. Paper is published as \"independent evidence.\"\n\nThis is documented in industry litigation documents, not conspiracy theory. The \"scientific literature\" on psychiatric medications is substantially marketing material."
      },
      {
        id: 84,
        question: "Why is chronic stress destroying my body?",
        answer: "[Cortisol](/glossary#cortisol)—stress hormone designed to spike briefly for real threats, then dissipate.\n\nTiger appears: cortisol mobilizes energy for fight or flight. Tiger leaves: cortisol drops, you recover. Modern life: the tiger never leaves. News keeps threat-detection activated. Work stress doesn't resolve. Financial anxiety is perpetual.\n\nChronic [cortisol](/glossary#cortisol) elevation damages everything: immune function, memory, metabolism, sleep. Your health is the cost of permanent threat-mode."
      },
      {
        id: 85,
        question: "What's a 15-minute medication check?",
        answer: "Standard psychiatry visit. Enough time to adjust dosage. Not enough to understand context.\n\n\"How are you feeling? Side effects? Let's try a higher dose.\" Managing [signals](/glossary#signal-vs-symptom) so you can keep functioning in the environment causing them. The environment is never discussed. There isn't time."
      },
      {
        id: 86,
        question: "Is medication ever necessary?",
        answer: "Medication becomes \"necessary\" because we've destroyed social structures that would otherwise manage these states.\n\nAlternative: tribal containment. WHO studies show better outcomes in developing countries with less medication and more social support. The medication substitutes for the [tribe](/glossary#the-150-tribe) we don't have.\n\nSometimes [signal override](/glossary#signal-override) is needed for immediate function. But it should be a bridge, not a destination."
      },
      {
        id: 87,
        question: "Are psychiatric conditions real diseases?",
        answer: "No biomarkers. No blood tests. No brain scans that diagnose. Behavioral descriptions, not disease entities.\n\nPsychiatry diagnoses by observation, not measurement. \"Depression\" describes a pattern of behavior. It doesn't identify a pathological process the way \"cancer\" or \"diabetes\" does.\n\nThe conditions are real. The suffering is real. The claim that they're medical diseases like any other? That's a category error."
      },
      {
        id: 88,
        question: "But these conditions are heritable?",
        answer: "So is height. Heritability doesn't make something a disease.\n\nWhat's inherited: tendency toward certain cognitive patterns that served different roles in the [EEA](/glossary#eea). Hunter cognition. Threat-sensitivity. Deep-processing introversion. These aren't malfunctions—they're variations that become pathologized when the environment doesn't accommodate them."
      },
      {
        id: 89,
        question: "What about brain differences?",
        answer: "Musicians have different brains. Taxi drivers have different brains. Difference is not pathology.\n\nWe're comparing variation to one baseline—[farmer brain](/glossary#farmer-brain)—and calling deviation disease. The \"differences\" observed might also be consequences of [mismatch](/glossary#mismatch), not pre-existing conditions. Chronic stress reshapes the brain. The [mismatch](/glossary#mismatch) itself causes the changes."
      },
      {
        id: 90,
        question: "What about neuroplasticity?",
        answer: "The brain changes based on experience. The \"brain differences\" in psychiatric conditions might be effects, not causes.\n\nChronic stress reshapes neural architecture. Chronic isolation changes the brain. Chronic [mismatch](/glossary#mismatch) produces chronic adaptation to mismatched conditions.\n\nScanning a mismatched brain and calling the adaptations \"disease\" gets causality backwards."
      },
      {
        id: 91,
        question: "What's wrong with therapy?",
        answer: "Nothing—if it's a bridge to environmental change.\n\nProblem: therapy as [proxy](/glossary#proxy). $200/hour paid intimacy. Therapist as only person who \"really understands.\" Years of sessions without environmental change.\n\nTherapy should build capacity for real relationship and real change. When it substitutes for them, it's just more expensive loneliness management."
      },
      {
        id: 92,
        question: "Do people actually die from this?",
        answer: "Yes.\n\nZoraya ter Beek, 29, was euthanized in the Netherlands after psychiatrists said \"nothing more we can do.\" Without ever trying environmental intervention. Without ever addressing [mismatch](/glossary#mismatch). She's not alone.\n\nPeople are dying from treatable environmental [mismatch](/glossary#mismatch) while the system insists they have untreatable brain diseases. The stakes are life and death."
      }
    ]
  },
  {
    title: "THE EVIDENCE",
    subtitle: "Research and case studies",
    questions: [
      {
        id: 93,
        question: "What do WHO studies show?",
        answer: "Better schizophrenia outcomes in developing countries with less medication and more social support.\n\nThat's not coincidence. That's the mechanism. Environment matters more than pharmaceuticals."
      },
      {
        id: 94,
        question: "What do hunter-gatherer studies show?",
        answer: "Chronic psychiatric conditions rare or absent in genuinely matched populations.\n\n\"Schizophrenia is rare or nonexistent in hunter-gatherer populations.\" Limited data, but directionally clear. [Mismatch](/glossary#mismatch) correlates with pathology."
      },
      {
        id: 95,
        question: "What do environmental interventions show?",
        answer: "Nature exposure, co-living reduce symptoms independent of medication.\n\nEnvironment is the variable. Change the environment, symptoms decrease—even without changing brain chemistry."
      },
      {
        id: 96,
        question: "What do intentional communities show?",
        answer: "Long-term stability is possible with proper governance.\n\nTwin Oaks (58 years). East Wind (51 years). Kibbutzim. Communities arrived at similar solutions independently. Convergent evidence."
      },
      {
        id: 97,
        question: "What is Twin Oaks?",
        answer: "Intentional community since 1967. ~100 adults.\n\nLabor credits for [visible contribution](/glossary#visible-contribution). Role [rotation](/glossary#rotation). [Transparency](/glossary#transparency). High life satisfaction in internal surveys."
      },
      {
        id: 98,
        question: "What is East Wind?",
        answer: "Intentional community since 1974. ~70 members.\n\nNut butter business. Rotating coordinators. Full financial [transparency](/glossary#transparency). Anecdotal reports: reduced anxiety from belonging."
      },
      {
        id: 99,
        question: "What went wrong with Auroville?",
        answer: "Scale without [Dunbar layers](/glossary#dunbars-numbers).\n\nTried to operate flat at 3,000+ people. Governance broke down. Lesson: [band-scale](/glossary#the-50-band) (50-150) as operating unit even in larger networks."
      }
    ]
  },
  {
    title: "THE SPEC SHEET",
    subtitle: "What humans evolved for",
    questions: [
      {
        id: 100,
        question: "What did humans do together every night for 300,000 years?",
        answer: "The [fire circle](/glossary#fire-circle). 2-4 hours. Every single night.\n\nProcessing the day. Storytelling. Conflict resolution. Planning. Bonding. Teaching. The fire provided warmth; the circle provided communion.\n\nYour ancestors spent more time in relaxed communion each evening than most modern people spend per month. We replaced it with screens."
      },
      {
        id: 101,
        question: "Were parents ever meant to raise kids alone?",
        answer: "No. [Alloparenting](/glossary#alloparenting)—child-rearing by 20+ adults.\n\nGrandparents, aunts, uncles, older siblings, unrelated band members. A mother was never alone with her infant for hours. Someone was always there.\n\nThe nuclear family—two exhausted parents doing it alone—is a historical aberration. Parental burnout isn't personal failure. It's asking two people to do what twenty used to do."
      },
      {
        id: 102,
        question: "Why do we separate children by age?",
        answer: "We don't have to. Mixed-age play was the norm.\n\nFive-year-olds learning from ten-year-olds teaching fifteen-year-olds helping toddlers. Natural mentorship. Leadership development through teaching. Empathy through caring for younger children.\n\nAge-segregation is institutional convenience, not developmental necessity."
      },
      {
        id: 103,
        question: "What is apprenticeship?",
        answer: "Learning through observation and gradual participation. How humans learned everything for 300,000 years.\n\nA seven-year-old gathering herbs isn't playing—they're contributing. By teenage years: adult-level skills. [Visible contribution](/glossary#visible-contribution) from early age. Purpose built in.\n\nCompare to: 18+ years of abstract education before \"real\" contribution begins."
      },
      {
        id: 104,
        question: "How did hunter-gatherers prevent poverty?",
        answer: "[Demand sharing](/glossary#demand-sharing). Those with surplus share when asked.\n\nNot charity—obligation and insurance. If someone asks for food when you have extra, you give it. Tomorrow you might be asking. The system creates automatic redistribution, prevents accumulation, makes poverty impossible within the group.\n\nYou can't hoard when anyone can ask. You can't starve when you can ask."
      },
      {
        id: 105,
        question: "What was work like before money existed?",
        answer: "[Immediate-return](/glossary#immediate-return-economy). Resources consumed within hours of acquisition.\n\nHunt → eat. Gather → consume. Work → benefit. Direct line between effort and reward. No abstraction. No delayed gratification across months or years.\n\n3-4 hours of effort. Tangible results. [Closed loops](/glossary#closed-loop)."
      },
      {
        id: 106,
        question: "Did hunter-gatherers have leaders?",
        answer: "No permanent leaders. Different experts for different domains.\n\nBest tracker led hunts. Best diplomat handled relations. Best healer handled medicine. Outside their expertise: just a person.\n\nLeadership was situational and earned, not permanent and structural. Anyone who tried to boss people around faced [egalitarian enforcement](/glossary#egalitarian-enforcement)."
      },
      {
        id: 107,
        question: "How did tribes prevent anyone from taking over?",
        answer: "[Egalitarian enforcement](/glossary#egalitarian-enforcement). Active suppression of dominance.\n\nAny sign of dominance behavior—boasting, hoarding, bossing—triggered immediate coalition response. Successful hunters were obligated to share more, not less. Attempting to claim special status was met with ridicule and leveling humor.\n\nChristopher Boehm calls this \"reverse dominance hierarchy\"—the group collectively dominated would-be dominators."
      },
      {
        id: 108,
        question: "How did tribes handle conflict without police or courts?",
        answer: "The [conflict resolution cascade](/glossary#conflict-resolution-cascade): humor → public discussion → ridicule → shunning → exile → violence (rare).\n\nMost conflicts resolved early through joking that named the problem while defusing tension. Persistent antisocial behavior led to shunning. Exile was available but rare.\n\nThe system worked because relationships were permanent and reputation was inescapable."
      },
      {
        id: 109,
        question: "What about circadian rhythm?",
        answer: "Wake at dawn with light. Active through morning. Rest, socialize, nap in afternoon. [Fire circle](/glossary#fire-circle) at evening. Sleep with darkness. Every day.\n\nNo alarm clocks. No artificial light fragmenting the cycle. [Circadian](/glossary#circadian-rhythm) regularity was automatic because the environment provided consistent cues.\n\nModern circadian chaos—evening screens, irregular sleep, no morning light—breaks one of the most basic biological cycles."
      },
      {
        id: 110,
        question: "What about physical contact for infants?",
        answer: "Constant. Babies rarely put down.\n\nCarried in slings all day. Passed person to person. Co-sleeping at night. No infant experienced prolonged distress—someone always responded immediately.\n\nCompare to: infants isolated in cribs, \"sleep training\" that involves ignoring distress signals. The [mismatch](/glossary#mismatch) begins at birth."
      },
      {
        id: 111,
        question: "What is birth spacing?",
        answer: "3-4 years between children via extended breastfeeding.\n\nParents not overwhelmed. Grandmothers crucial. Fathers highly involved—among the Aka, fathers hold infants 20%+ of daytime hours.\n\nCompare to modern parenting: children close together, parents isolated, no [alloparenting](/glossary#alloparenting) support."
      },
      {
        id: 112,
        question: "How many strangers did ancestors encounter?",
        answer: "Maybe 1,000 in an entire lifetime. At seasonal gatherings, through trade, during rare travel.\n\nDaily life involved exclusively people whose entire history, personality, and relationship to you was known. Every interaction was with someone you'd known since birth and would know until death.\n\nNow you encounter thousands of strangers daily. Every commute, every store, every public space. The [mismatch](/glossary#mismatch) is total."
      },
      {
        id: 113,
        question: "How did small tribes avoid becoming inbred?",
        answer: "The [metapopulation](/glossary#metapopulation). 500-1500 people across multiple tribes connected through marriage, kinship, and trade.\n\nSeasonal gatherings. Marriage exchanges. Trade relationships. You knew your own [tribe](/glossary#the-150-tribe) intimately; you knew *of* the broader network.\n\nThis structure also provided resilience—if one band faced disaster, members could be absorbed by others."
      },
      {
        id: 114,
        question: "Is it normal for groups to break apart and reform?",
        answer: "Yes. [Fission-fusion](/glossary#fission-fusion)—natural social metabolism.\n\nWhen the band grew too large, it split. When conflict became unresolvable, one faction left. When resources shifted, groups reformed. The system was dynamic.\n\nThis wasn't dysfunction—it was how healthy human groups breathed. Permanence isn't the only success metric."
      }
    ]
  },
  {
    title: "THE DESTINATION",
    subtitle: "Solutions",
    questions: [
      {
        id: 115,
        question: "What would it mean to actually fix this?",
        answer: "[Demismatch](/glossary#demismatch). Conscious alignment of environment with biology.\n\nNot returning to caves—building forward with the spec sheet in hand. Reducing [stranger overload](/glossary#stranger-overload). Closing [open loops](/glossary#open-loop) where possible. Building or joining [tribe](/glossary#the-150-tribe). Finding work with [visible contribution](/glossary#visible-contribution). Replacing [proxies](/glossary#proxy) with real satisfactions.\n\nThe intervention isn't fixing yourself. It's changing your environmental conditions to match what your biology expects."
      },
      {
        id: 116,
        question: "Why can't technology just fix me directly?",
        answer: "You can't [augment](/glossary#augment) broken.\n\nIf a human is already mismatched—isolated, purposeless, chronically stressed—adding technology amplifies dysfunction. AI assistants become substitutes for connection. Productivity tools accelerate burnout. Social media deepens loneliness.\n\n[Demismatch](/glossary#demismatch) first, then augment. Get the human thriving, then enhance from there."
      },
      {
        id: 117,
        question: "Can technology enhance me once I'm not broken?",
        answer: "Yes. That's [augment](/glossary#augment).\n\nCommunication tools that coordinate an actual [tribe](/glossary#the-150-tribe). AI that extends capability rather than replacing relationship. Health tech that supports an already-healthy baseline.\n\nTechnology on thriving humans is different from technology on broken ones. The foundation matters."
      },
      {
        id: 118,
        question: "Can technology help, or does it only make things worse?",
        answer: "Both. [Pharmakon](/glossary#pharmakon)—Greek for both poison and cure.\n\nThe same tools creating [mismatch](/glossary#mismatch) can serve [demismatching](/glossary#demismatch)—if designed differently. Video calls can connect actual [tribe](/glossary#the-150-tribe). AI can coordinate real community.\n\nThe implementation determines whether it heals or harms. Currently most technology is designed for engagement, which means exploitation. Different design could flip it."
      },
      {
        id: 119,
        question: "What if technology required you to meet in person?",
        answer: "[Decay function](/glossary#decay-function). Technology designed to degrade without physical presence.\n\nFeatures that lock unless you've met in person recently. Success measured by *decreasing* use as real relationships develop. The opposite of engagement optimization.\n\nThis requires different economics—venture capital won't fund [decay functions](/glossary#decay-function). But it's what technology genuinely optimizing for wellbeing would look like."
      },
      {
        id: 120,
        question: "Can AI help me find my people?",
        answer: "Potentially. [Tribe formation AI](/glossary#tribe-formation-ai).\n\nMatching based on nervous system regulation, conflict styles, values. Modern village matchmaker. A discovery tool, not a relationship substitute.\n\nThis doesn't exist yet in meaningful form. It's a direction, not a product."
      },
      {
        id: 121,
        question: "Can I use existing technology to build real connection?",
        answer: "Yes. The question is: does it serve your [150](/glossary#the-150-tribe) or substitute [parasocial](/glossary#parasocial-relationships) engagement with strangers?\n\nVideo calls with actual [tribe](/glossary#the-150-tribe)? Yes. Coordination tools for real groups? Yes. AI as capability extension while embedded in community? Yes.\n\nInfinite scroll among strangers? [Proxy](/glossary#proxy). Know the difference."
      },
      {
        id: 122,
        question: "Why won't venture capital fund demismatch tech?",
        answer: "[Decay functions](/glossary#decay-function) are churn engines. VCs need engagement growth.\n\nTechnology that succeeds by reducing your usage can't grow engagement metrics. Different economics required: open source, non-profit, subscription models that don't require infinite growth.\n\nThe misalignment is structural. VC incentives and user wellbeing point different directions."
      },
      {
        id: 123,
        question: "What's the end goal of all this?",
        answer: "[The most human post-human](/glossary#the-most-human-post-human).\n\nHumans with matched environments, enhanced by technology. Not replacement but extension. Baseline thriving plus capability enhancement.\n\nNot transcending human needs through technology. Meeting those needs fully, then [augmenting](/glossary#augment) from that foundation."
      },
      {
        id: 124,
        question: "How do I know if I've arrived?",
        answer: "Do you wake up with a role, in a group, with a goal?\n\nIf yes, you've arrived. If no, you haven't. The simple test. No credentials required. No optimization.\n\nJust: do you belong, do you contribute, do you have purpose?"
      },
      {
        id: 125,
        question: "Why do modern tribes need explicit governance?",
        answer: "Because we're hierarchy-damaged.\n\nHumans entering tribes have been trained by hierarchical institutions—schools, corporations, governments—to accept and perpetuate dominance. [EEA](/glossary#eea) mechanisms don't work automatically on people with corporate backgrounds.\n\nExplicit structures prevent the hierarchy-trained from recreating what they know."
      },
      {
        id: 126,
        question: "What's the difference between a tribe and a cult?",
        answer: "Cult: charismatic leader, information control, isolation from outside, punishment for leaving.\n\nTribe: distributed authority, [transparency](/glossary#transparency), embedded in society, freedom to exit, no one profits from your membership.\n\nThe governance structure prevents cult dynamics."
      },
      {
        id: 127,
        question: "How do you prevent someone from becoming the permanent leader?",
        answer: "[Rotation](/glossary#rotation). Any power-accumulating role rotates formally on a schedule.\n\nExternal negotiator, conflict arbiter, resource controller—all rotate. The person good at negotiating doesn't become permanent negotiator accumulating outside relationships. No one occupies influence positions permanently.\n\nThis trades some efficiency for equality."
      },
      {
        id: 128,
        question: "Why does everyone need to see everything?",
        answer: "[Transparency](/glossary#transparency). Information asymmetry is proto-hierarchy.\n\nWhen some members know things others don't, those members have power. Finances visible to all. Decisions logged. No back-channels. No faction building through private coordination.\n\nThis feels uncomfortable for people trained in hierarchical organizations. [Transparency](/glossary#transparency) requires unlearning the instinct to hold cards close."
      },
      {
        id: 129,
        question: "Why shouldn't one person hold multiple roles?",
        answer: "[Domain separation](/glossary#domain-separation). Power concentration through role accumulation.\n\nIf one person is negotiator AND arbiter AND resource controller, they accumulate enough influence to dominate despite any formal rules. Separating domains prevents consolidation.\n\nEfficient? Less. Equal? More."
      },
      {
        id: 130,
        question: "How do you keep manipulators out?",
        answer: "[Onboarding filter](/glossary#onboarding-filter). Trial period to surface hierarchy-trained dominance patterns before full inclusion.\n\nPeople shaped by corporations may unconsciously attempt to establish hierarchy, manipulate information, build coalitions for personal advantage. Better to discover this during onboarding than after they've consolidated influence.\n\nNot everyone belongs in every tribe."
      },
      {
        id: 131,
        question: "What if I want to leave?",
        answer: "[Viable exit](/glossary#viable-exit). You can. That's the point.\n\nUnlike the [EEA](/glossary#eea), leaving doesn't mean death. This strengthens bargaining against dominators. You can leave. They know you can leave. You're held by value, not by bars.\n\nThis is what distinguishes tribe from cult."
      },
      {
        id: 132,
        question: "Will life be meaningful without struggle?",
        answer: "Yes. Constructive scarcity remains even with material abundance.\n\nChallenges requiring effort, cooperation, skill—these create conditions for meaning. Time limits. Skill mastery. Coordination problems. The [tribe](/glossary#the-150-tribe) still needs to raise children, resolve conflicts, create together.\n\nMeaning doesn't require suffering. It requires challenge."
      },
      {
        id: 133,
        question: "Isn't some suffering necessary?",
        answer: "Material deprivation? No. That's toxic scarcity—desperation that breaks cooperation. Good riddance.\n\nChallenge and effort? Yes. That's constructive scarcity. The difference: toxic scarcity is imposed and traumatizing; constructive scarcity is chosen and growth-producing."
      },
      {
        id: 134,
        question: "Why isn't UBI the answer?",
        answer: "Solves resource distribution, not meaning.\n\nMoney without role, [tribe](/glossary#the-150-tribe), purpose. UBI + [atomized individual](/glossary#atomized-individual) = comfortable meaninglessness.\n\nUBI addresses toxic scarcity. It doesn't address [mismatch](/glossary#mismatch). You need both."
      },
      {
        id: 135,
        question: "What does automation change?",
        answer: "Eliminates human roles in production.\n\nThe [proxy](/glossary#proxy) purpose that work provides is disappearing. Makes the framework more urgent—rebuild meaning through [tribe](/glossary#the-150-tribe), not through jobs that won't exist.\n\nAutomation makes [mismatch](/glossary#mismatch) worse unless we build alternatives first."
      },
      {
        id: 136,
        question: "Why are mass shootings a modern phenomenon?",
        answer: "Killing strangers you've never met would be inconceivable in the [EEA](/glossary#eea).\n\nEveryone was known. Every face had a history, a family, a relationship to you. The concept of murdering anonymous strangers wouldn't parse.\n\n[Stranger overload](/glossary#stranger-overload) makes strangers into categories. Categories are easier to kill."
      },
      {
        id: 137,
        question: "Is all entertainment bad for me?",
        answer: "No. Art isn't [proxy](/glossary#proxy).\n\nArt continues [fire circle](/glossary#fire-circle) function: processing experience, collective sense-making, truth-telling.\n\nTest: does it leave you emptier and needing more, or does it connect and illuminate? [Proxies](/glossary#proxy) deplete. Art nourishes."
      },
      {
        id: 138,
        question: "Is this just \"we weren't meant to live like this\"?",
        answer: "Yes, but with 300,000 years of evidence and a specific spec sheet.\n\nNot nostalgia. Not vibes. Biology. The [EEA](/glossary#eea) is documented. The [mismatch](/glossary#mismatch) is measurable.\n\n\"We weren't meant to live like this\" is correct. The framework explains exactly how and why."
      }
    ]
  },
  {
    title: "OBJECTIONS",
    subtitle: "Common pushback answered",
    questions: [
      {
        id: 139,
        question: "\"I'm an introvert.\"",
        answer: "Introversion = how you recover energy, not what you need.\n\nYou need [tribe](/glossary#the-150-tribe) with a quieter role. The [EEA](/glossary#eea) had roles for every temperament. Not isolation—predictable, low-demand belonging.\n\nIntroverts still need their [5](/glossary#the-5)."
      },
      {
        id: 140,
        question: "\"Different people need different things.\"",
        answer: "Surface variation exists. Deep structure is universal.\n\nNo human thrives isolated, purposeless, surrounded by strangers, with permanent [open loops](/glossary#open-loop). Vary the implementation, not the fundamentals."
      },
      {
        id: 141,
        question: "\"You're romanticizing the past.\"",
        answer: "27% infant mortality. 48% child death before age 15. Violence, scarcity, disease.\n\nThe framework doesn't claim the past was better—it claims the *social* environment matched the hardware. You can have modern medicine AND social structures that work."
      },
      {
        id: 142,
        question: "\"This sounds like a cult.\"",
        answer: "Cults: charismatic leader, isolation, information control, punishment for leaving.\n\nFramework: no leader, [transparency](/glossary#transparency), embedded in society, [viable exit](/glossary#viable-exit). The governance structure prevents cult dynamics.\n\nIf someone's trying to recruit you into something with a leader who can't be questioned, that's a cult. This is a document."
      },
      {
        id: 143,
        question: "\"Society can't reorganize.\"",
        answer: "Society doesn't need to. *You* need to build [tribe](/glossary#the-150-tribe) within existing society.\n\nThe tribe is a social layer, not replacement for civilization. You still have job, government, economy. You also have your [50](/glossary#the-50-band)."
      },
      {
        id: 144,
        question: "\"Only privileged people can do this.\"",
        answer: "Partly true.\n\nFirst tribes will come from those who can experiment. The question is whether success builds infrastructure lowering barriers for others.\n\nAlso: many \"underprivileged\" communities already have more tribal structure than affluent atomized ones. Wealth often correlates with isolation."
      },
      {
        id: 145,
        question: "\"What about people who genuinely can't form relationships?\"",
        answer: "Some genuine neurological differences exist.\n\nFramework claims *most* suffering is environmental, not neurological. For genuine difference: modified structures, different roles, augmented communication. The goal remains the same.\n\nEveryone needs their version of [tribe](/glossary#the-150-tribe)."
      },
      {
        id: 146,
        question: "\"Isn't this just 'touch grass' with extra steps?\"",
        answer: "Yes and no.\n\n\"Touch grass\" captures something real. The framework explains *why* it helps ([circadian](/glossary#circadian-rhythm), movement, reduced [strangers](/glossary#stranger-overload)) and what else is needed ([tribe](/glossary#the-150-tribe), purpose, [closed loops](/glossary#closed-loop)).\n\nTouch grass is necessary but insufficient."
      }
    ]
  },
  {
    title: "PRACTICAL FIRST STEPS",
    subtitle: "Action items",
    questions: [
      {
        id: 147,
        question: "What's step one?",
        answer: "Reduce [mismatch](/glossary#mismatch) load.\n\nAudit [parasocial relationships](/glossary#parasocial-relationships). Reduce [open loops](/glossary#open-loop). [Circadian](/glossary#circadian-rhythm) basics: wake with light, reduce evening screens. Move your body—not for fitness, for the neurochemistry your brain expects.\n\nDon't try to build [tribe](/glossary#the-150-tribe) while maximally mismatched. Reduce load first."
      },
      {
        id: 148,
        question: "What's step two?",
        answer: "Deepen, not broaden.\n\nStop meeting new people temporarily. Invest in existing relationships. Identify your actual [5](/glossary#the-5). Regular, repeated, low-stakes contact with the same people.\n\nDepth over breadth. Consistency over novelty."
      },
      {
        id: 149,
        question: "What's step three?",
        answer: "Reduce [proxy](/glossary#proxy) dependence.\n\nNotice which [proxies](/glossary#proxy) you're using. Ask what they're substituting for. Time-box their use while building real alternatives.\n\nYou can't quit [proxies](/glossary#proxy) cold turkey if you have nothing real to replace them with. Build the real thing first."
      },
      {
        id: 150,
        question: "What's step four?",
        answer: "Build.\n\nOne dinner. One finished project. One person who sees your contribution. One [closed loop](/glossary#closed-loop).\n\nUnderstanding changes nothing. Only building changes things."
      },
      {
        id: 151,
        question: "What's the smallest change I can make right now?",
        answer: "Identify your [5](/glossary#the-5) (or start building toward it). One regular shared meal per week. One [loop closed](/glossary#closed-loop) daily. One [proxy](/glossary#proxy) replaced with real alternative. Morning light. Movement.\n\nThis is minimum viable [demismatch](/glossary#demismatch)."
      },
      {
        id: 152,
        question: "What if I can't build tribe right now?",
        answer: "Reduce [mismatch](/glossary#mismatch) load first.\n\n[Circadian](/glossary#circadian-rhythm) alignment, nature exposure, reduced stranger interaction—these help even alone. Build capacity. Move from 90% mismatched to 70%.\n\nStill mismatched, but better positioned for when [tribe](/glossary#the-150-tribe) building becomes possible."
      },
      {
        id: 153,
        question: "How long does this take?",
        answer: "Years, not weeks.\n\nGraduated implementation: reduce load → deepen relationships → build toward [50](/glossary#the-50-band) → establish structure → physical consolidation.\n\nThe [double shift](/glossary#double-shift) makes it slow. Anyone promising quick fixes is selling you another [proxy](/glossary#proxy)."
      },
      {
        id: 154,
        question: "Why is building a new life so exhausting?",
        answer: "The [double shift](/glossary#double-shift).\n\nMaintaining wage labor while building tribal structure. 8 hours capitalist work + 2-3 hours tribal maintenance. It's unsustainable long-term.\n\nThis is the primary reason tribe formation attempts fail. You can't build new while fully maintaining old. Something has to give."
      },
      {
        id: 155,
        question: "Why do most attempts at this fail?",
        answer: "The [great filter](/glossary#great-filter). The [transition](/glossary#transition) period where [double shift](/glossary#double-shift) burnout, resource constraints, unresolved conflicts, and emerging hierarchies break the attempt.\n\nIt's not character failure. It's predictable difficulty. Expect it. Plan for it. Accept that [fission-fusion](/glossary#fission-fusion) dynamics mean \"failure\" might just be one stage in a longer process."
      },
      {
        id: 156,
        question: "Who can attempt this first?",
        answer: "People with resources: schedule flexibility, savings buffer, existing relationships, lower cost-of-living. Remote workers. Freelancers.\n\nThat's not fair, but it's realistic. First adopters create maps others follow. Someone has to go first."
      },
      {
        id: 157,
        question: "What if my tribe attempt fails?",
        answer: "[Fission-fusion](/glossary#fission-fusion) is normal.\n\nEven temporary tribes are valuable—years of genuine tribal experience, skills developed, relationships that persist. Permanence isn't the only success metric.\n\nThe first attempt teaches. The second builds on it. Failure is part of the process."
      },
      {
        id: 158,
        question: "What's the most common mistake people make?",
        answer: "Reading about [mismatch](/glossary#mismatch) while sitting alone, scrolling, under artificial light.\n\nUnderstanding is not progress. Information is not transformation.\n\nClose this tab. Go outside. Find your people. Build something."
      },
      {
        id: 159,
        question: "What's the one thing I should remember?",
        answer: "You're not broken. Your environment is [mismatched](/glossary#mismatch).\n\nStop trying to fix yourself. Start building the conditions that would let you thrive.\n\nThe [fish](/glossary#fish-on-land) doesn't need therapy to accept life on land. The fish needs water."
      },
      {
        id: 160,
        question: "What now?",
        answer: "Close this tab.\n\nYou've understood enough. Understanding more won't help. Only building helps.\n\nGo find one person. Make one meal. Close one [loop](/glossary#closed-loop). Start."
      }
    ]
  }
];

// Category colors for visual distinction
const categoryColors: Record<string, string> = {
  "WHAT IS THIS?": "#C75B39",
  "EVER WONDER WHY?": "#2D4A3E",
  "FEEL FAMILIAR?": "#C9A962",
  "WHOSE FAULT?": "#6B5B95",
  "THE BIG PICTURE": "#8B4513",
  "EXPLOITED": "#C84C4C",
  "THE MISDIAGNOSIS": "#4A7C59",
  "EVIDENCE": "#5B7C99",
  "THE SPEC SHEET": "#7C6B5B",
  "THE DESTINATION": "#D97A5C",
  "OBJECTIONS": "#6B6B6B",
  "PRACTICAL FIRST STEPS": "#3D5A4E",
};

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleQuestion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleCategory = (title: string) => {
    setExpandedCategory(expandedCategory === title ? null : title);
  };

  const getCategoryColor = (title: string) => categoryColors[title] || "#C75B39";

  return (
    <>
      <FAQStructuredData />
      <div className="min-h-screen bg-[#FAF9F6] text-[#1a1a1a] pt-20">
        <Navigation />

        {/* Hero Header */}
        <header className="relative overflow-hidden bg-[#0A0A0A] text-white">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="max-w-4xl mx-auto px-6 py-16 relative">
            <div className="section-divider-thick mb-6" style={{ background: '#C75B39' }} />
            <h1 className="headline-primary text-white mb-4">
              Frequently Asked <span className="text-[#C75B39]">Questions</span>
            </h1>
            <p className="text-xl text-[#E5E0D8] mb-8">
              160 questions. One framework. Everything you need to understand the mismatch.
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {faqCategories.slice(0, 6).map((cat) => (
                <button
                  key={cat.title}
                  onClick={() => {
                    setExpandedCategory(cat.title);
                    document.getElementById(cat.title.replace(/\s+/g, '-'))?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="touch-target px-3 py-2 md:px-3 md:py-1 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: getCategoryColor(cat.title),
                    color: '#fff'
                  }}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="space-y-6">
            {faqCategories.map((category, catIndex) => {
              const color = getCategoryColor(category.title);
              const isExpanded = expandedCategory === category.title;

              return (
                <div
                  key={category.title}
                  id={category.title.replace(/\s+/g, '-')}
                  className="scroll-mt-24"
                >
                  <button
                    onClick={() => toggleCategory(category.title)}
                    className="w-full text-left group"
                  >
                    <div
                      className="flex items-center justify-between p-6 transition-all duration-300"
                      style={{
                        backgroundColor: isExpanded ? color : 'transparent',
                        borderLeft: `4px solid ${color}`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Category number */}
                        <span
                          className="w-10 h-10 flex items-center justify-center text-sm font-bold"
                          style={{
                            backgroundColor: isExpanded ? 'rgba(255,255,255,0.2)' : color,
                            color: isExpanded ? '#fff' : '#fff'
                          }}
                        >
                          {String(catIndex + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h2
                            className="text-xl md:text-2xl font-bold transition-colors"
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              color: isExpanded ? '#fff' : '#1a1a1a'
                            }}
                          >
                            {category.title}
                          </h2>
                          {category.subtitle && (
                            <p
                              className="text-sm mt-1"
                              style={{ color: isExpanded ? 'rgba(255,255,255,0.8)' : '#666' }}
                            >
                              {category.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs font-bold px-2 py-1"
                          style={{
                            backgroundColor: isExpanded ? 'rgba(255,255,255,0.2)' : `${color}20`,
                            color: isExpanded ? '#fff' : color
                          }}
                        >
                          {category.questions.length} Q
                        </span>
                        <span
                          className="text-2xl transition-transform duration-300"
                          style={{
                            color: isExpanded ? '#fff' : color,
                            transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)'
                          }}
                        >
                          +
                        </span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="bg-white border-l-4 animate-fadeIn" style={{ borderColor: color }}>
                      {category.questions.map((item, qIndex) => (
                        <div
                          key={item.id}
                          className="border-b border-[#e5e5e5] last:border-b-0"
                        >
                          <button
                            onClick={() => toggleQuestion(item.id)}
                            className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-[#f8f8f8] transition-colors"
                          >
                            <span className="font-medium text-[#1a1a1a]">
                              <span
                                className="inline-block w-8 h-8 text-center text-sm font-bold mr-3 flex-shrink-0"
                                style={{
                                  backgroundColor: expandedId === item.id ? color : `${color}15`,
                                  color: expandedId === item.id ? '#fff' : color,
                                  lineHeight: '2rem'
                                }}
                              >
                                {qIndex + 1}
                              </span>
                              {item.question}
                            </span>
                            <span
                              className="text-xl flex-shrink-0 transition-transform duration-300"
                              style={{
                                color: expandedId === item.id ? color : '#999',
                                transform: expandedId === item.id ? 'rotate(45deg)' : 'rotate(0deg)'
                              }}
                            >
                              +
                            </span>
                          </button>

                          {expandedId === item.id && (
                            <div
                              className="px-5 pb-5 text-[#444] leading-relaxed whitespace-pre-line animate-fadeIn ml-11"
                              style={{ borderTop: `2px solid ${color}20` }}
                            >
                              <div className="pt-4">
                                {renderAnswer(item.answer)}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>

        {/* Footer CTA */}
        <footer className="bg-[#C75B39] py-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3
              className="text-2xl text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Still have questions?
            </h3>
            <p className="text-white/80 mb-6">
              The fish doesn't need therapy. The fish needs water.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/framework" className="btn-secondary !border-white/50 !text-white hover:!bg-white hover:!text-[#C75B39]">
                Read the Framework
              </Link>
              <Link href="/glossary" className="btn-secondary !border-white/50 !text-white hover:!bg-white hover:!text-[#C75B39]">
                Browse Glossary
              </Link>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
