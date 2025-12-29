import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

const envContent = readFileSync('/Users/maartenrischen/SQUARETRUTHS/.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2];
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const UNUSED_SERIES = [
  "The Sequencing", "Dashboard Calibrated", "Meaning & Purpose 100",
  "The Trap Recognized", "The Bridge", "The Same Scene Two Eyes",
  "Utopia", "Misc", "Work Rest & Productivity",
  "The Mismatch Answer 100 DEMISMATCH TECH VOL6",
  "The Mismatch Answer 100 REAL THING VOL7", "The Mismatch Answer 100 VOL3",
  "The Mismatch Answer", "Dystopia", "Money & Status",
  "The Mismatch Actually 100 EVERYONE WRONG VOL11"
];

function isUnused(img) {
  if (!img.series || img.series.length === 0) return false;
  return img.series.every(s => UNUSED_SERIES.includes(s));
}

// DIRECT keyword mapping for each question based on ANSWER content
const questionKeywords = {
  20: ['fire', 'campfire', 'savannah', 'tribe', 'band', 'ancestral', 'hunter', 'gather'],
  21: ['rumination', 'ruminat', 'overthink', 'loop', 'worry', 'thought'],
  22: ['audience', 'judgment', 'watch', 'eyes', 'critic'],
  23: ['threat', 'worst', 'catastroph', 'negativ', 'fear'],
  24: ['enough', 'perfect', 'inadequa', 'fail', 'critic'],
  25: ['control', 'uncertain', 'helpless'],
  26: ['reward', 'dopamine', 'hit', 'spike'],
  27: ['sleep', 'circadian', 'light', 'morning', 'melatonin'],
  28: ['move', 'exercise', 'walk', 'body', 'physical'],
  29: ['food', 'eat', 'meal', 'diet', 'hunger'],
  30: ['bullshit', 'meaningless', 'pointless', 'job', 'work'],
  40: ['slot', 'machine', 'gambl', 'variable', 'casino'],
  42: ['scroll', 'feed', 'doom', 'algorithm', 'attention', 'exploit'],
  50: ['dating', 'app', 'swipe', 'tinder', 'match'],
  51: ['porn', 'sexual', 'novelty'],
  60: ['addiction', 'addict', 'craving', 'substitu', 'proxy'],
  70: ['therapy', 'therapist', 'session', 'couch', 'psych'],
  71: ['medication', 'pill', 'drug', 'prescri', 'pharma'],
  80: ['leader', 'prestige', 'chief', 'hunt', 'elder'],
  90: ['level', 'equal', 'hierarchy', 'share'],
  100: ['meeting', 'person', 'together', 'face', 'gather'],
  120: ['fail', 'wrong', 'mistake', 'attempt'],
  130: ['tribe', 'communit', 'belong', 'group'],
  140: ['connection', 'intimacy', 'vulnerab', 'trust'],
  150: ['image', 'visual', 'picture', 'see']
};

// Score by direct keyword match in title
function scoreByKeywords(img, keywords) {
  if (!keywords || keywords.length === 0) return 0;

  const titleLower = (img.file_name || '').toLowerCase();
  let score = 0;

  for (const kw of keywords) {
    if (titleLower.includes(kw)) {
      score += 100;
    }
  }

  return score;
}

// Fallback: extract key terms from answer text
function extractAnswerTerms(answer) {
  const clean = answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').toLowerCase();
  const words = clean.split(/\s+/).filter(w => w.length > 4);
  return [...new Set(words)].slice(0, 10);
}

async function fetchAllImages() {
  const allData = [];
  let offset = 0;
  while (true) {
    const { data } = await supabase
      .from('image_embeddings')
      .select('id, file_name, folder_name, image_url, series')
      .range(offset, offset + 999)
      .order('id');
    if (!data || data.length === 0) break;
    allData.push(...data);
    offset += 1000;
    if (data.length < 1000) break;
  }
  return allData;
}

async function main() {
  const faqData = JSON.parse(readFileSync('/private/tmp/faq_data.json', 'utf8'));
  const userImageMap = JSON.parse(readFileSync('/private/tmp/generated_imagemap.json', 'utf8'));

  console.log('Fetching images...');
  const allImages = await fetchAllImages();
  const usableImages = allImages.filter(img => !isUnused(img));
  console.log(`Usable: ${usableImages.length}`);

  const usedTop4 = new Set();
  for (let i = 1; i <= 20; i++) {
    (userImageMap[String(i)] || []).slice(0, 4).forEach(u => usedTop4.add(u));
  }

  const newImageMap = {};
  for (let i = 1; i <= 20; i++) {
    newImageMap[String(i)] = userImageMap[String(i)] || [];
  }

  for (let qId = 21; qId <= 150; qId++) {
    const faq = faqData.find(f => f.id === qId);
    if (!faq) continue;

    const answer = faq.a || faq.answer;

    // Get keywords for this question (predefined or extracted from answer)
    let keywords = questionKeywords[qId];
    if (!keywords) {
      keywords = extractAnswerTerms(answer);
    }

    // Score all images
    const scored = usableImages.map(img => ({
      img,
      score: scoreByKeywords(img, keywords)
    })).filter(s => s.score > 0);

    scored.sort((a, b) => b.score - a.score);

    const selected = [];
    const usedHere = new Set();

    for (const { img } of scored) {
      const url = img.image_url || `${supabaseUrl}/storage/v1/object/public/mismatch-images/${img.folder_name}/${img.file_name}`;
      if (usedHere.has(url)) continue;

      // Unique top 4
      if (selected.length < 4 && usedTop4.has(url)) continue;
      if (selected.length < 4) usedTop4.add(url);

      selected.push(url);
      usedHere.add(url);
      if (selected.length >= 20) break;
    }

    newImageMap[String(qId)] = selected;
  }

  writeFileSync('/private/tmp/direct_imagemap.json', JSON.stringify(newImageMap, null, 2));
  console.log('Saved to /private/tmp/direct_imagemap.json');

  // Show examples
  for (const qId of [20, 21, 42, 50, 70, 80]) {
    const faq = faqData.find(f => f.id === qId);
    const kw = questionKeywords[qId] || extractAnswerTerms(faq?.a || '');
    console.log(`\nQ${qId}: ${faq?.q?.substring(0, 40)}...`);
    console.log(`Keywords: ${kw.slice(0, 5).join(', ')}`);
    console.log(`Top 4: ${newImageMap[String(qId)]?.slice(0, 4).map(u => u.split('/').pop()).join(', ') || 'NONE'}`);
  }
}

main().catch(console.error);
