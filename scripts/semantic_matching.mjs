import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

const envContent = readFileSync('/Users/maartenrischen/SQUARETRUTHS/.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) envVars[m[1]] = m[2];
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabase = createClient(supabaseUrl, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);

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

// Extract clean title words from file name (for matching)
function getTitleWords(fileName) {
  return fileName
    .replace(/^\d+_/, '')           // Remove leading number
    .replace(/\.(png|jpeg|jpg)$/i, '') // Remove extension
    .replace(/_/g, ' ')              // Replace underscores with spaces
    .toUpperCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && w !== 'THE');
}

// WHOLE WORD matching - not substring!
function matchesWord(titleWords, searchWord) {
  const upper = searchWord.toUpperCase();
  return titleWords.some(tw => tw === upper || tw.startsWith(upper) || tw.endsWith(upper));
}

// Semantic mapping: question concepts → image search terms
// Based on ANSWER content, not just question text
const conceptToImageTerms = {
  // Core concepts
  'mismatch': ['MISMATCH', 'MODERN', 'CONDITION', 'WRONG'],
  'eea': ['ANCESTRAL', 'TRIBE', 'SAVANNAH', 'HUNTER', 'GATHERER', 'FIRE', 'CAMPFIRE'],
  'open loop': ['RUMINATION', 'OVERTHINK', 'WORRY', 'LOOP', 'UNFINISHED'],
  'closed loop': ['FINISHED', 'COMPLETE', 'CLOSURE', 'DONE', 'SATISFIED'],
  'status': ['STATUS', 'PRESTIGE', 'RANK', 'HIERARCHY', 'COMPARISON'],
  'indirect fitness': ['STATUS', 'REPUTATION', 'APPROVAL', 'VALIDATION'],
  'dunbar': ['TRIBE', 'GROUP', 'CIRCLE', 'GATHERING', 'FRIENDS', 'INTIMATE'],
  'parasocial': ['PARASOCIAL', 'CELEBRITY', 'INFLUENCER', 'FOLLOWER', 'AUDIENCE'],
  'proxy': ['PROXY', 'SUBSTITUTE', 'FAKE', 'REPLACEMENT'],
  'signal': ['SIGNAL', 'SYMPTOM', 'WARNING', 'INDICATOR'],
  'oil light': ['MEDICATION', 'PILL', 'SUPPRESS', 'OVERRIDE'],
  'fish on land': ['FISH', 'WATER', 'ENVIRONMENT', 'WRONG', 'FLOPPING'],
  'flopping disorder': ['DISORDER', 'DIAGNOSIS', 'LABEL', 'PATHOLOGY'],
  'tribe': ['TRIBE', 'COMMUNITY', 'BELONG', 'GATHERING', 'TOGETHER', 'GROUP'],
  'fire circle': ['FIRE', 'CAMPFIRE', 'NIGHT', 'CIRCLE', 'STORY', 'BONFIRE'],
  'visible contribution': ['CONTRIBUTION', 'VISIBLE', 'MEANINGFUL', 'PURPOSE', 'IMPACT'],
  'bullshit job': ['BULLSHIT', 'MEANINGLESS', 'POINTLESS', 'USELESS'],
  'stranger overload': ['STRANGER', 'CROWD', 'OVERLOAD', 'CITY', 'ANONYMOUS'],
  'hyperstimuli': ['HYPERSTIMUL', 'PORN', 'JUNK', 'SUGAR', 'FAKE'],
  'variable ratio': ['SLOT', 'MACHINE', 'GAMBL', 'VARIABLE', 'RANDOM'],
  'dopamine': ['DOPAMINE', 'REWARD', 'ANTICIPAT', 'SPIKE'],
  'scroll': ['SCROLL', 'DOOMSCROLL', 'FEED', 'PHONE', 'SCREEN'],
  'serotonin': ['SEROTONIN', 'CHEMICAL', 'IMBALANCE', 'SSRI'],
  'medication': ['MEDICATION', 'PILL', 'DRUG', 'PHARMA', 'PRESCRIPTION'],
  'cortisol': ['CORTISOL', 'STRESS', 'CHRONIC', 'TIGER'],
  'dating app': ['DATING', 'APP', 'SWIPE', 'MATCH'],
  'porn': ['PORN', 'SEXUAL', 'NOVELTY'],
  'addiction': ['ADDICTION', 'ADDICT', 'CRAVING', 'WITHDRAW'],
  'therapy': ['THERAPY', 'THERAPIST', 'SESSION', 'COUCH'],
  'circadian': ['CIRCADIAN', 'SLEEP', 'LIGHT', 'MORNING', 'WAKE', 'SUNLIGHT'],
  'alloparenting': ['ALLOPARENT', 'CHILD', 'PARENT', 'VILLAGE', 'RAISING'],
  'demand sharing': ['SHARING', 'SHARE', 'GIVE', 'RESOURCE'],
  'immediate return': ['HUNT', 'GATHER', 'EAT', 'IMMEDIATE', 'TANGIBLE'],
  'leader': ['LEADER', 'CHIEF', 'EXPERT', 'AUTHORITY'],
  'egalitarian': ['EGALITARIAN', 'EQUAL', 'FLAT', 'SHARE'],
  'conflict resolution': ['CONFLICT', 'RESOLUTION', 'HUMOR', 'RIDICULE'],
  'fission fusion': ['FISSION', 'FUSION', 'SPLIT', 'REFORM'],
  'rotation': ['ROTATION', 'ROTATE', 'TURN', 'ALTERNATE'],
  'transparency': ['TRANSPARENT', 'OPEN', 'VISIBLE', 'INFORMATION'],
  'viable exit': ['EXIT', 'LEAVE', 'QUIT', 'FREEDOM'],
  'demismatch': ['DEMISMATCH', 'FIX', 'REPAIR', 'ALIGN', 'RESTORE'],
  'augment': ['AUGMENT', 'ENHANCE', 'TECHNOLOGY', 'IMPROVE'],
  'pharmakon': ['PHARMAKON', 'POISON', 'CURE', 'BOTH'],
  'decay function': ['DECAY', 'MEET', 'PERSON', 'PHYSICAL', 'PRESENCE'],
  'double shift': ['EXHAUSTION', 'BURNOUT', 'SHIFT', 'TIRED'],
  'great filter': ['FAILURE', 'FILTER', 'FAIL', 'ATTEMPT'],
  'reciprocal altruism': ['RECIPROCAL', 'FAVOR', 'HELP', 'RETURN'],
  'intimacy': ['INTIMACY', 'INTIMATE', 'CLOSE', 'VULNERABLE', 'DEEP'],
  'vulnerability': ['VULNERABILITY', 'VULNERABLE', 'OPEN', 'TRUST'],
  'movement': ['MOVEMENT', 'EXERCISE', 'MOVE', 'BODY', 'PHYSICAL', 'WALK', 'RUN'],
  'food': ['FOOD', 'MEAL', 'EAT', 'DIET', 'HUNGER', 'COOK'],
  'sleep': ['SLEEP', 'SLEEPING', 'NIGHT', 'REST', 'BED'],
  'anxiety': ['ANXIETY', 'ANXIOUS', 'WORRY', 'PANIC', 'FEAR'],
  'depression': ['DEPRESSION', 'DEPRESSED', 'SAD', 'EMPTY', 'MEANING'],
  'loneliness': ['LONELY', 'LONELINESS', 'ALONE', 'ISOLATED', 'ISOLATION'],
  'shame': ['SHAME', 'GUILT', 'EMBARRASS'],
  'grief': ['GRIEF', 'LOSS', 'MOURN', 'DEATH'],
  'meaning': ['MEANING', 'PURPOSE', 'MEANINGFUL', 'WHY'],
  'belonging': ['BELONGING', 'BELONG', 'COMMUNITY', 'INCLUDED'],
  'connection': ['CONNECTION', 'CONNECT', 'BOND', 'RELATIONSHIP'],
  'nature': ['NATURE', 'OUTDOOR', 'FOREST', 'TREE', 'NATURAL'],
  'cook': ['COOK', 'KITCHEN', 'PREPARE', 'MEAL'],
  'ritual': ['RITUAL', 'TRADITION', 'CEREMONY', 'SACRED'],
  'music': ['MUSIC', 'SING', 'SONG', 'RHYTHM'],
  'dance': ['DANCE', 'DANCING', 'MOVE', 'RHYTHM'],
  'art': ['ART', 'CREATE', 'CREATIVE', 'MAKE'],
  'story': ['STORY', 'NARRATIVE', 'TELL', 'MYTH'],
  'elder': ['ELDER', 'WISDOM', 'OLD', 'AGE'],
  'birth': ['BIRTH', 'BABY', 'NEW', 'BORN'],
  'death': ['DEATH', 'DYING', 'END', 'FUNERAL'],
  'automation': ['AUTOMATION', 'AUTOMATE', 'ROBOT', 'MACHINE'],
  'ubi': ['UBI', 'MONEY', 'INCOME', 'RESOURCE']
};

// Extract glossary terms from answer text
function extractGlossaryTerms(answer) {
  const matches = answer.match(/\[([^\]]+)\]\(\/glossary#[^)]+\)/g) || [];
  return matches.map(m => {
    const termMatch = m.match(/\[([^\]]+)\]/);
    return termMatch ? termMatch[1].toLowerCase() : '';
  }).filter(t => t);
}

// Get image search terms for a question based on its answer
function getSearchTermsForQuestion(question, answer) {
  const glossaryTerms = extractGlossaryTerms(answer);
  const allTerms = [];

  // Map glossary terms to image search terms
  glossaryTerms.forEach(term => {
    Object.entries(conceptToImageTerms).forEach(([concept, imageTerms]) => {
      if (term.includes(concept) || concept.includes(term)) {
        allTerms.push(...imageTerms);
      }
    });
  });

  // Also check for key phrases in the answer
  const answerLower = answer.toLowerCase();
  Object.entries(conceptToImageTerms).forEach(([concept, imageTerms]) => {
    if (answerLower.includes(concept)) {
      allTerms.push(...imageTerms);
    }
  });

  return [...new Set(allTerms)];
}

// Score an image against search terms using WHOLE WORD matching
function scoreImage(img, searchTerms) {
  const titleWords = getTitleWords(img.file_name);
  let score = 0;

  for (const term of searchTerms) {
    if (matchesWord(titleWords, term)) {
      score += 100;
    }
  }

  return score;
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

async function generateMatches() {
  console.log('Loading data...');
  const faqData = JSON.parse(readFileSync('/private/tmp/faq_data.json', 'utf8'));
  const userImageMap = JSON.parse(readFileSync('/private/tmp/generated_imagemap.json', 'utf8'));

  console.log('Fetching images from database...');
  const allImages = await fetchAllImages();
  const usableImages = allImages.filter(img => !isUnused(img));
  console.log(`Total: ${allImages.length}, Usable: ${usableImages.length}`);

  // Create a set of valid image file names for quick lookup
  const validFileNames = new Set(usableImages.map(img => img.file_name));

  // Track globally used file names (for uniqueness)
  const globallyUsedFileNames = new Set();

  const finalImageMap = {};

  // Process tiles 1-20: Keep user's selections but filter out deleted images
  console.log('\nProcessing tiles 1-20 (user selections)...');
  for (let i = 1; i <= 20; i++) {
    const userUrls = userImageMap[String(i)] || [];
    const validUrls = [];

    for (const url of userUrls) {
      const fileName = url.split('/').pop();
      // Check if this file exists in usable images
      if (validFileNames.has(fileName)) {
        validUrls.push(url);
        globallyUsedFileNames.add(fileName);
      } else {
        console.log(`  Tile ${i}: Removed deleted image ${fileName}`);
      }
    }

    finalImageMap[String(i)] = validUrls;
  }

  // Process tiles 21+: Generate semantic matches
  console.log('\nGenerating semantic matches for tiles 21+...');

  for (const faq of faqData) {
    if (faq.id <= 20) continue;

    const question = faq.q || faq.question;
    const answer = faq.a || faq.answer;

    // Get search terms based on answer content
    const searchTerms = getSearchTermsForQuestion(question, answer);

    if (searchTerms.length === 0) {
      console.log(`  Q${faq.id}: No search terms found, skipping`);
      finalImageMap[String(faq.id)] = [];
      continue;
    }

    // Score all usable images
    const scored = usableImages.map(img => ({
      img,
      score: scoreImage(img, searchTerms)
    })).filter(s => s.score > 0);

    scored.sort((a, b) => b.score - a.score);

    // Select top images, avoiding duplicates by file name
    const selected = [];
    const usedHere = new Set();

    for (const { img } of scored) {
      if (selected.length >= 20) break;

      const fileName = img.file_name;
      if (usedHere.has(fileName)) continue;

      const url = img.image_url || `${supabaseUrl}/storage/v1/object/public/mismatch-images/${img.folder_name}/${img.file_name}`;
      selected.push(url);
      usedHere.add(fileName);
      globallyUsedFileNames.add(fileName);
    }

    finalImageMap[String(faq.id)] = selected;

    // Progress
    if (faq.id % 20 === 0) {
      console.log(`  Q${faq.id}: ${question.substring(0, 40)}...`);
      console.log(`    Terms: ${searchTerms.slice(0, 5).join(', ')}`);
      console.log(`    Top 2: ${selected.slice(0, 2).map(u => u.split('/').pop()).join(', ')}`);
    }
  }

  // Save results
  writeFileSync('/private/tmp/semantic_imagemap.json', JSON.stringify(finalImageMap, null, 2));
  console.log('\nSaved to /private/tmp/semantic_imagemap.json');

  // Quality check
  console.log('\n=== QUALITY CHECK ===');
  const checkIds = [21, 27, 30, 42, 50, 60, 70, 74, 80, 100, 120, 130];
  for (const qId of checkIds) {
    const faq = faqData.find(f => f.id === qId);
    if (!faq) continue;
    const terms = getSearchTermsForQuestion(faq.q, faq.a);
    console.log(`\nQ${qId}: ${faq.q}`);
    console.log(`  Search terms: ${terms.slice(0, 5).join(', ')}`);
    console.log(`  Top 4: ${(finalImageMap[String(qId)] || []).slice(0, 4).map(u => u.split('/').pop()).join(', ')}`);
  }

  // Statistics
  let withMatches = 0;
  let without = 0;
  for (const faq of faqData) {
    if ((finalImageMap[String(faq.id)] || []).length > 0) {
      withMatches++;
    } else {
      without++;
      console.log(`NO MATCHES: Q${faq.id}`);
    }
  }
  console.log(`\nWith matches: ${withMatches}, Without: ${without}`);
}

generateMatches().catch(console.error);
