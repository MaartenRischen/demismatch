import { NextResponse } from 'next/server';

// FAQ data for the portal site
// This is a simplified version of the tile data from HomepageFAQTile
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  imageUrl: string;
}

// We export the first image from each question's gallery
const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Why do you feel so bad?",
    answer: `You're not broken. Your environment is [mismatched](/glossary#mismatch).

Your brain was built for conditions that no longer exist. The suffering isn't malfunction—it's accurate signal.`,
    imageUrl: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/hoffman_interface_theory_series/36_THE_MISMATCH_DIAGNOSTIC.png"
  },
  {
    id: 2,
    question: "Is something wrong with you, or with your environment?",
    answer: `The environment.

A [fish on land](/glossary#fish-on-land) flops. Its gills work perfectly—designed for water. You wouldn't medicate the flopping. You'd put it back.`,
    imageUrl: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png"
  },
  {
    id: 3,
    question: "Why can't you stop ruminating?",
    answer: `[Rumination](/glossary#rumination) is planning without anything to plan.

It evolved to solve problems. Now it runs on unsolvable ones. The machinery churns without producing output.`,
    imageUrl: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/12_THE_OVERTHINKING.png"
  },
  {
    id: 4,
    question: "What is anxiety actually?",
    answer: `Accurate threat detection.

[Open loops](/glossary#open-loop) everywhere. Strangers everywhere. The alarm is working. The environment is actually dangerous.`,
    imageUrl: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/19_THE_ANXIETY.png"
  },
  {
    id: 5,
    question: "What is depression actually?",
    answer: `Accurate meaning assessment.

No [tribe](/glossary#the-150-tribe). No [visible purpose](/glossary#visible-contribution). [Loops](/glossary#open-loop) that never close. The [signal](/glossary#signal-vs-symptom) is correct.`,
    imageUrl: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/73_THE_DEPRESSION_DIAGNOSTIC.png"
  },
  {
    id: 6,
    question: "Why is your suffering profitable?",
    answer: `A satisfied human is a terrible customer.

The [atomized individual](/glossary#atomized-individual)—severed from [tribe](/glossary#the-150-tribe), purpose, intimacy—is the ideal consumer. Your [mismatch](/glossary#mismatch) is the business model.`,
    imageUrl: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/2_THE_LONELY_APARTMENT.png"
  },
  {
    id: 7,
    question: "Why do you care what strangers think?",
    answer: `The [internal audience](/glossary#internal-audience). Imaginary critics generating real anxiety.

Your brain evolved being watched by 150. Now it simulates an audience. Harsher than any real one.`,
    imageUrl: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/22_THE_AUDIENCE.png"
  },
  {
    id: 8,
    question: "How many close friends do you actually need?",
    answer: `[Five](/glossary#the-5). People you'd call at 3am. Complete vulnerability.

If that circle has fewer than 5, that's the problem. Most modern people have 0-2.`,
    imageUrl: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png"
  },
  {
    id: 9,
    question: "Why does modern work feel meaningless?",
    answer: `[Immediate-return](/glossary#immediate-return-economy) vs. delayed-return.

Ancestral work: hunt → eat. Modern work: 8 hours of abstraction for invisible shareholders. Your meaning-making systems can't connect effort to survival.`,
    imageUrl: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/39_THE_BULLSHIT_JOB.png"
  },
  {
    id: 10,
    question: "What's step one?",
    answer: `Reduce [mismatch](/glossary#mismatch) load.

Audit [parasocial relationships](/glossary#parasocial-relationships). Reduce [open loops](/glossary#open-loop). [Circadian](/glossary#circadian-rhythm) basics. Move your body. Don't build [tribe](/glossary#the-150-tribe) while maximally mismatched.`,
    imageUrl: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/6_THE_KNOWN_BY_ALL.png"
  },
  {
    id: 11,
    question: "What's the one thing you should remember?",
    answer: `You're not broken. Your environment is [mismatched](/glossary#mismatch).

Stop fixing yourself. Start building conditions that would let you thrive. The [fish](/glossary#fish-on-land) needs water.`,
    imageUrl: "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png"
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
