import { NextResponse } from 'next/server';

// FAQ data for the portal site
// This matches the tile data from HomepageFAQTile with imageUrls arrays
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  imageUrls: string[];
}

// Export first 4 images from each question's gallery for 2x2 grid display
const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Why do you feel so bad?",
    answer: `You're not broken. Your environment is [mismatched](/glossary#mismatch).

Your brain was built for conditions that no longer exist. The suffering isn't malfunction—it's accurate signal.`,
    imageUrls: [
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/2_THE_LONELY_APARTMENT.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/5_THE_BURNOUT.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/73_THE_DEPRESSION_DIAGNOSTIC.png"
    ]
  },
  {
    id: 2,
    question: "So, is something wrong with you, or with your environment?",
    answer: `The environment.

A [fish on land](/glossary#fish-on-land) flops. Its gills work perfectly—designed for water. You wouldn't medicate the flopping. You'd put it back.`,
    imageUrls: [
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/2_THE_LONELY_APARTMENT.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/72_THE_WATER_SECURED.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/17_THE_WATER_SWIMMING.png"
    ]
  },
  {
    id: 3,
    question: "Why can't you stop ruminating?",
    answer: `[Rumination](/glossary#rumination) is planning without anything to plan.

It evolved to solve problems. Now it runs on unsolvable ones. The machinery churns without producing output.`,
    imageUrls: [
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/90_THE_RUMINATION.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/12_THE_OVERTHINKING.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/22_THE_NEWS_ADDICTION.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/53_THE_FEAR_FEED.png"
    ]
  },
  {
    id: 4,
    question: "What is anxiety actually?",
    answer: `Accurate threat detection.

[Open loops](/glossary#open-loop) everywhere. Strangers everywhere. The alarm is working. The environment is actually dangerous.`,
    imageUrls: [
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/5_THE_STATUS_ANXIETY.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/19_THE_ANXIETY.png"
    ]
  },
  {
    id: 5,
    question: "What is depression actually?",
    answer: `Accurate meaning assessment.

No [tribe](/glossary#the-150-tribe). No [visible purpose](/glossary#visible-contribution). [Loops](/glossary#open-loop) that never close. The [signal](/glossary#signal-vs-symptom) is correct.`,
    imageUrls: [
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/53_THE_MEANINGLESS_JOB.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/32_THE_MEANINGFUL_PROJECT.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/73_THE_DEPRESSION_DIAGNOSTIC.png"
    ]
  },
  {
    id: 6,
    question: "Why is your suffering profitable?",
    answer: `A satisfied human is a terrible customer.

The [atomized individual](/glossary#atomized-individual)—severed from [tribe](/glossary#the-150-tribe), purpose, intimacy—is the ideal consumer. Your [mismatch](/glossary#mismatch) is the business model.`,
    imageUrls: [
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/41_THE_PURPOSE_VACANCY.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/45_THE_PURPOSE.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/2_THE_LONELY_APARTMENT.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/8_THE_PURPOSE.png"
    ]
  },
  {
    id: 7,
    question: "Why do you care what strangers think?",
    answer: `The [internal audience](/glossary#internal-audience). Imaginary critics generating real anxiety.

Your brain evolved being watched by 150. Now it simulates an audience. Harsher than any real one.`,
    imageUrls: [
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/22_THE_AUDIENCE.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/23_THE_JUDGMENT.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/14_THE_STRANGER.png"
    ]
  },
  {
    id: 8,
    question: "How many close friends do you actually need?",
    answer: `[Five](/glossary#the-5). People you'd call at 3am. Complete vulnerability.

If that circle has fewer than 5, that's the problem. Most modern people have 0-2.`,
    imageUrls: [
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/2_THE_KITCHEN_FULL_OF_PEOPLE.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/91_THE_REAL_TRIBE.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/8_THE_PEOPLE_WHO_MATTER.png"
    ]
  },
  {
    id: 9,
    question: "Why does modern work feel meaningless?",
    answer: `[Immediate-return](/glossary#immediate-return-economy) vs. delayed-return.

Ancestral work: hunt → eat. Modern work: 8 hours of abstraction for invisible shareholders. Your meaning-making systems can't connect effort to survival.`,
    imageUrls: [
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/26_THE_BULLSHIT_JOB.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/76_THE_BULLSHIT_JOB.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/39_THE_BULLSHIT_JOB.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png"
    ]
  },
  {
    id: 10,
    question: "What's step one?",
    answer: `Reduce [mismatch](/glossary#mismatch) load.

Audit [parasocial relationships](/glossary#parasocial-relationships). Reduce [open loops](/glossary#open-loop). [Circadian](/glossary#circadian-rhythm) basics. Move your body. Don't build [tribe](/glossary#the-150-tribe) while maximally mismatched.`,
    imageUrls: [
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/6_THE_KNOWN_BY_ALL.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/100_THE_FIRST_STEP.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/1_THE_MORNING_LIGHT.png"
    ]
  },
  {
    id: 11,
    question: "What's the one thing you should remember?",
    answer: `You're not broken. Your environment is [mismatched](/glossary#mismatch).

Stop fixing yourself. Start building conditions that would let you thrive. The [fish](/glossary#fish-on-land) needs water.`,
    imageUrls: [
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/100_THE_MODERN_CONDITION.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/67_THE_WATER_IMMERSION.png",
      "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png"
    ]
  }
];

export async function GET() {
  return NextResponse.json(faqData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
