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

function isImageUnused(img) {
  if (!img.series || !Array.isArray(img.series) || img.series.length === 0) return false;
  return img.series.every(s => UNUSED_SERIES.includes(s));
}

// Extract glossary terms from answer (the key concepts)
function extractGlossaryTerms(text) {
  const matches = text.match(/\[([^\]]+)\]\(\/glossary#([^)]+)\)/g) || [];
  return matches.map(m => {
    const termMatch = m.match(/\[([^\]]+)\]/);
    return termMatch ? termMatch[1].toLowerCase() : '';
  }).filter(t => t);
}

// Extract key phrases from answer text
function extractKeyPhrases(text) {
  // Remove markdown links but keep the text
  const clean = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').toLowerCase();

  // Key phrases that indicate important concepts
  const phrases = [];

  // Look for specific patterns
  if (clean.includes('eea')) phrases.push('eea', 'ancestral', 'savannah', 'evolved');
  if (clean.includes('fire circle')) phrases.push('fire', 'circle', 'campfire', 'bonfire');
  if (clean.includes('small band')) phrases.push('band', 'small group', 'hunter');
  if (clean.includes('variable ratio')) phrases.push('slot', 'gambl', 'variable', 'random reward');
  if (clean.includes('parasocial')) phrases.push('parasocial', 'celebrity', 'influencer', 'fake');
  if (clean.includes('scrolling')) phrases.push('scroll', 'feed', 'doom');
  if (clean.includes('product')) phrases.push('product', 'exploit', 'harvest', 'attention');
  if (clean.includes('proxy')) phrases.push('proxy', 'substitute', 'fake', 'replacement');
  if (clean.includes('bullshit job')) phrases.push('bullshit', 'meaningless', 'pointless');
  if (clean.includes('therapy')) phrases.push('therapy', 'therapist', 'session', 'couch');
  if (clean.includes('rumination')) phrases.push('rumination', 'ruminat', 'overthink', 'loop', 'worry');
  if (clean.includes('dating app')) phrases.push('dating', 'swipe', 'tinder', 'app');
  if (clean.includes('addiction')) phrases.push('addiction', 'addict', 'craving', 'withdraw');
  if (clean.includes('leader')) phrases.push('leader', 'chief', 'prestige', 'hierarchy');
  if (clean.includes('hunter-gatherer') || clean.includes('hunter gatherer')) phrases.push('hunter', 'gatherer', 'hunt', 'forag');
  if (clean.includes('tribe')) phrases.push('tribe', 'tribal');
  if (clean.includes('dunbar')) phrases.push('dunbar', '150', 'social limit');
  if (clean.includes('circadian')) phrases.push('circadian', 'sleep', 'light', 'morning');
  if (clean.includes('dopamine')) phrases.push('dopamine', 'reward', 'hit');

  return [...new Set(phrases)];
}

// Score image based on ANSWER content primarily
function scoreImageByAnswer(img, question, answer) {
  let score = 0;

  const titleLower = (img.file_name || '').toLowerCase();
  const titleClean = titleLower.replace(/^\d+_/, '').replace('.png', '').replace(/_/g, ' ');
  const titleWords = titleClean.split(' ').filter(w => w.length > 2);
  const bodyLower = (img.search_text || img.title || '').toLowerCase();

  // Extract concepts from answer (PRIMARY source)
  const glossaryTerms = extractGlossaryTerms(answer);
  const keyPhrases = extractKeyPhrases(answer);
  const answerClean = answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').toLowerCase();

  // Match glossary terms in title (highest priority)
  for (const term of glossaryTerms) {
    const termWords = term.split(' ');
    for (const tw of termWords) {
      if (tw.length > 3 && titleClean.includes(tw)) {
        score += 400;
      }
    }
  }

  // Match key phrases in title
  for (const phrase of keyPhrases) {
    if (titleClean.includes(phrase)) {
      score += 300;
    }
  }

  // Match answer words in title
  const answerWords = answerClean.split(/\s+/).filter(w => w.length > 4);
  for (const aw of answerWords) {
    if (titleClean.includes(aw)) {
      score += 100;
    }
  }

  // Match title words in answer (lower priority)
  for (const tw of titleWords) {
    if (tw.length > 3 && answerClean.includes(tw)) {
      score += 50;
    }
  }

  // Body text matching (lowest priority)
  for (const phrase of keyPhrases) {
    if (bodyLower.includes(phrase)) {
      score += 20;
    }
  }

  return score;
}

async function fetchAllImages() {
  const allData = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from('image_embeddings')
      .select('id, file_name, folder_name, title, image_url, series, search_text')
      .range(offset, offset + 999)
      .order('id');
    if (error || !data || data.length === 0) break;
    allData.push(...data);
    offset += 1000;
    if (data.length < 1000) break;
  }
  return allData;
}

async function generateAnswerBasedMatches() {
  const faqData = JSON.parse(readFileSync('/private/tmp/faq_data.json', 'utf8'));
  const userImageMap = JSON.parse(readFileSync('/private/tmp/generated_imagemap.json', 'utf8'));

  console.log('Fetching images...');
  const allImages = await fetchAllImages();
  const usableImages = allImages.filter(img => !isImageUnused(img));
  console.log(`Usable: ${usableImages.length}`);

  // Track used from tiles 1-20
  const usedInFirst20 = new Set();
  for (let i = 1; i <= 20; i++) {
    (userImageMap[String(i)] || []).forEach(u => usedInFirst20.add(u));
  }

  const globallyUsedTop4 = new Set(usedInFirst20);
  const newImageMap = {};

  // Keep 1-20 as-is
  for (let i = 1; i <= 20; i++) {
    newImageMap[String(i)] = userImageMap[String(i)] || [];
  }

  // Generate 21-150
  for (let qId = 21; qId <= 150; qId++) {
    const faq = faqData.find(f => f.id === qId);
    if (!faq) continue;

    const question = faq.q || faq.question;
    const answer = faq.a || faq.answer;

    const scored = usableImages.map(img => ({
      img,
      score: scoreImageByAnswer(img, question, answer)
    })).filter(s => s.score > 0);

    scored.sort((a, b) => b.score - a.score);

    const selected = [];
    const usedHere = new Set();

    for (const { img } of scored) {
      const url = img.image_url || `${supabaseUrl}/storage/v1/object/public/mismatch-images/${img.folder_name}/${img.file_name}`;
      if (usedHere.has(url)) continue;

      if (selected.length < 4 && globallyUsedTop4.has(url)) continue;
      if (selected.length < 4) globallyUsedTop4.add(url);

      selected.push(url);
      usedHere.add(url);
      if (selected.length >= 20) break;
    }

    newImageMap[String(qId)] = selected;
  }

  writeFileSync('/private/tmp/answer_imagemap.json', JSON.stringify(newImageMap, null, 2));
  console.log('Saved to /private/tmp/answer_imagemap.json');

  // Show key examples
  const examples = [20, 21, 42, 50, 70, 80];
  for (const qId of examples) {
    const faq = faqData.find(f => f.id === qId);
    console.log(`\nQ${qId}: ${faq?.q?.substring(0, 50)}...`);
    console.log(`Answer key: ${extractKeyPhrases(faq?.a || '').slice(0, 5).join(', ')}`);
    console.log(`Top 4: ${newImageMap[String(qId)]?.slice(0, 4).map(u => u.split('/').pop()).join(', ')}`);
  }
}

generateAnswerBasedMatches().catch(console.error);
