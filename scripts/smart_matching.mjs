import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

// Read env
const envContent = readFileSync('/Users/maartenrischen/SQUARETRUTHS/.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2];
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// UNUSED_SERIES
const UNUSED_SERIES = [
  "The Sequencing", "Dashboard Calibrated", "Meaning & Purpose 100",
  "The Trap Recognized", "The Bridge", "The Same Scene Two Eyes",
  "Utopia", "Misc", "Work Rest & Productivity",
  "The Mismatch Answer 100 DEMISMATCH TECH VOL6",
  "The Mismatch Answer 100 REAL THING VOL7", "The Mismatch Answer 100 VOL3",
  "The Mismatch Answer", "Dystopia", "Money & Status",
  "The Mismatch Actually 100 EVERYONE WRONG VOL11"
];

function isImageUnused(img) {
  if (!img.series || !Array.isArray(img.series) || img.series.length === 0) return false;
  return img.series.every(s => UNUSED_SERIES.includes(s));
}

// SEMANTIC CONCEPT MAPPING - what each question is REALLY about
const questionConcepts = {
  21: {
    topic: "rumination",
    concepts: ["rumination", "overthinking", "mental loop", "worry", "anxious thoughts", "planning without action"],
    goodTitles: ["rumination", "overthinking", "worry", "loop", "thought"],
    badTitles: ["eating", "food", "breakfast"]
  },
  22: {
    topic: "internal audience / imaginary judgment",
    concepts: ["internal audience", "judgment", "imaginary critics", "self-consciousness", "being watched"],
    goodTitles: ["audience", "judgment", "watched", "eyes", "critics", "self-conscious"],
    badTitles: []
  },
  23: {
    topic: "negativity bias / assuming worst",
    concepts: ["negativity bias", "catastrophizing", "worst case", "threat detection", "pessimism"],
    goodTitles: ["negativity", "threat", "catastroph", "worst", "pessim", "fear"],
    badTitles: []
  },
  24: {
    topic: "never good enough / perfectionism",
    concepts: ["perfectionism", "never enough", "inadequacy", "comparison", "self-criticism"],
    goodTitles: ["enough", "perfect", "inadequa", "comparison", "critic", "failure"],
    badTitles: []
  },
  25: {
    topic: "illusion of control",
    concepts: ["control", "illusion", "uncertainty", "helplessness", "agency"],
    goodTitles: ["control", "uncertain", "helpless", "agency", "power"],
    badTitles: []
  },
  30: {
    topic: "bullshit jobs - meaningless work",
    concepts: ["bullshit job", "meaningless work", "pointless labor", "no contribution"],
    goodTitles: ["bullshit", "meaningless", "pointless", "useless job"],
    badTitles: ["contribution"] // contribution is the OPPOSITE
  },
  40: {
    topic: "slot machines and variable ratio reinforcement",
    concepts: ["slot machine", "variable ratio", "gambling", "addiction mechanics", "random reward"],
    goodTitles: ["slot", "gambl", "variable", "reward", "casino", "addiction"],
    badTitles: ["anxiety"]
  },
  42: {
    topic: "social media EXPLOITATION - attention harvesting, being the product",
    concepts: ["exploitation", "attention harvesting", "dopamine manipulation", "you are the product", "variable ratio", "scroll addiction", "engagement farming"],
    goodTitles: ["scroll", "exploit", "product", "attention", "dopamine", "addiction", "feed", "algorithm", "engagement", "slot"],
    badTitles: ["anxiety", "lonely"] // NOT about anxiety or loneliness - about EXPLOITATION mechanics
  },
  50: {
    topic: "dating app exploitation",
    concepts: ["dating app", "swipe addiction", "commodification", "endless options", "paradox of choice"],
    goodTitles: ["dating", "swipe", "app", "choice", "option"],
    badTitles: []
  },
  60: {
    topic: "addiction as substitution",
    concepts: ["addiction", "substitute", "proxy", "real need", "underlying cause"],
    goodTitles: ["addiction", "substitute", "proxy", "need", "craving"],
    badTitles: []
  },
  70: {
    topic: "therapy limitations - proxy for real connection",
    concepts: ["therapy", "proxy", "paid intimacy", "professional relationship", "not real tribe"],
    goodTitles: ["therapy", "therapist", "session", "couch", "professional"],
    badTitles: []
  },
  80: {
    topic: "hunter-gatherer leadership - prestige not dominance",
    concepts: ["hunter gatherer", "leadership", "prestige", "egalitarian", "tribal leader"],
    goodTitles: ["leader", "hunt", "prestige", "tribe", "chief", "elder"],
    badTitles: []
  },
  90: {
    topic: "preventing permanent leaders - leveling mechanisms",
    concepts: ["leveling", "egalitarian", "preventing hierarchy", "sharing", "humility"],
    goodTitles: ["level", "equal", "share", "humble", "hierarchy"],
    badTitles: []
  },
  100: {
    topic: "technology requiring in-person meeting",
    concepts: ["technology", "in person", "meeting", "face to face", "real connection"],
    goodTitles: ["meeting", "person", "face", "together", "gather"],
    badTitles: ["exhaustion", "guilt"] // NOT about meeting exhaustion
  },
  120: {
    topic: "why attempts fail - wrong approach",
    concepts: ["failure", "wrong approach", "trying alone", "missing ingredient"],
    goodTitles: ["fail", "wrong", "mistake", "alone", "missing"],
    badTitles: []
  }
};

// Smart scoring based on conceptual relevance
function scoreImageSmart(img, qId, question, answer) {
  let score = 0;
  const concepts = questionConcepts[qId];

  const titleLower = (img.file_name || '').toLowerCase();
  const titleClean = titleLower.replace(/^\d+_/, '').replace('.png', '').replace(/_/g, ' ');
  const bodyLower = (img.search_text || img.title || '').toLowerCase();

  // If we have specific concept mapping for this question
  if (concepts) {
    // Check for good title matches
    for (const good of concepts.goodTitles) {
      if (titleClean.includes(good.toLowerCase())) {
        score += 300; // High score for conceptually relevant title
      }
    }

    // Penalize bad matches (wrong concept)
    for (const bad of concepts.badTitles) {
      if (titleClean.includes(bad.toLowerCase())) {
        score -= 500; // Strong penalty for wrong concept
      }
    }

    // Check concepts in body text
    for (const concept of concepts.concepts) {
      if (bodyLower.includes(concept.toLowerCase())) {
        score += 50;
      }
    }
  }

  // Fallback: basic keyword matching from question/answer
  const questionLower = question.toLowerCase();
  const answerLower = answer.toLowerCase();

  // Extract key nouns from title
  const titleWords = titleClean.split(' ').filter(w => w.length > 3);

  for (const word of titleWords) {
    if (questionLower.includes(word)) score += 100;
    if (answerLower.includes(word)) score += 50;
  }

  return score;
}

async function fetchAllImages() {
  const allData = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('image_embeddings')
      .select('id, file_name, folder_name, title, image_url, series, search_text')
      .range(offset, offset + 999)
      .order('id');

    if (error || !data || data.length === 0) break;
    allData.push(...data);
    offset += 1000;
    hasMore = data.length === 1000;
  }
  return allData;
}

async function generateSmartMatches() {
  const faqData = JSON.parse(readFileSync('/private/tmp/faq_data.json', 'utf8'));
  const userImageMap = JSON.parse(readFileSync('/private/tmp/generated_imagemap.json', 'utf8'));

  console.log('Fetching images...');
  const allImages = await fetchAllImages();
  const usableImages = allImages.filter(img => !isImageUnused(img));
  console.log(`Usable images: ${usableImages.length}`);

  // Track used images from tiles 1-20
  const usedInFirst20 = new Set();
  for (let i = 1; i <= 20; i++) {
    const urls = userImageMap[String(i)] || [];
    urls.forEach(u => usedInFirst20.add(u));
  }

  const globallyUsedTop4 = new Set(usedInFirst20);
  const newImageMap = {};

  // Keep tiles 1-20 as-is
  for (let i = 1; i <= 20; i++) {
    newImageMap[String(i)] = userImageMap[String(i)] || [];
  }

  // Generate for tiles 21-150
  for (let qId = 21; qId <= 150; qId++) {
    const faq = faqData.find(f => f.id === qId);
    if (!faq) continue;

    const question = faq.q || faq.question;
    const answer = faq.a || faq.answer;

    // Score all images
    const scored = usableImages.map(img => ({
      img,
      score: scoreImageSmart(img, qId, question, answer)
    })).filter(s => s.score > 0);

    scored.sort((a, b) => b.score - a.score);

    // Select top 20, ensuring first 4 unique
    const selected = [];
    const usedHere = new Set();

    for (const { img } of scored) {
      const url = img.image_url || `${supabaseUrl}/storage/v1/object/public/mismatch-images/${img.folder_name}/${img.file_name}`;
      if (usedHere.has(url)) continue;

      if (selected.length < 4) {
        if (globallyUsedTop4.has(url)) continue;
        globallyUsedTop4.add(url);
      }

      selected.push(url);
      usedHere.add(url);
      if (selected.length >= 20) break;
    }

    newImageMap[String(qId)] = selected;

    if (qId % 20 === 0 || [21, 42, 70].includes(qId)) {
      console.log(`Q${qId}: "${question.substring(0, 40)}..."`);
      console.log(`  Top: ${selected.slice(0, 3).map(u => u.split('/').pop()).join(', ')}`);
    }
  }

  writeFileSync('/private/tmp/smart_imagemap.json', JSON.stringify(newImageMap, null, 2));
  console.log('\nSaved to /private/tmp/smart_imagemap.json');

  // Show Q42 specifically
  console.log('\n=== Q42 Social Media Exploitation ===');
  console.log('Top 5:', newImageMap['42']?.slice(0, 5).map(u => u.split('/').pop()));
}

generateSmartMatches().catch(console.error);
