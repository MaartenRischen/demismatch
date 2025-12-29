import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

// Read env from .env.local
const envContent = readFileSync('/Users/maartenrischen/SQUARETRUTHS/.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2];
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Connecting to Supabase...');
const supabase = createClient(supabaseUrl, supabaseKey);

// UNUSED_SERIES - must match the library page
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
  if (!img.series || !Array.isArray(img.series) || img.series.length === 0) {
    return false;
  }
  return img.series.every(s => UNUSED_SERIES.includes(s));
}

// User's provided imageMap for tiles 1-20 (to track already used images)
const userImageMap = {
  "1": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/2_THE_LONELY_APARTMENT.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/5_THE_BURNOUT.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/73_THE_DEPRESSION_DIAGNOSTIC.png"
  ],
  "2": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/74_THE_ENVIRONMENT_DESIGN.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/97_THE_ENVIRONMENT_ENGINEERING.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/72_THE_WATER_SECURED.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/17_THE_WATER_SWIMMING.png"
  ],
  "3": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/90_THE_RUMINATION.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/12_THE_OVERTHINKING.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/22_THE_NEWS_ADDICTION.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/53_THE_FEAR_FEED.png"
  ],
  "4": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/5_THE_STATUS_ANXIETY.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/19_THE_ANXIETY.png"
  ],
  "5": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/53_THE_MEANINGLESS_JOB.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/32_THE_MEANINGFUL_PROJECT.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/73_THE_DEPRESSION_DIAGNOSTIC.png"
  ],
  "6": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/41_THE_PURPOSE_VACANCY.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/45_THE_PURPOSE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/2_THE_LONELY_APARTMENT.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/8_THE_PURPOSE.png"
  ],
  "7": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/22_THE_AUDIENCE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/23_THE_JUDGMENT.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/14_THE_STRANGER.png"
  ],
  "8": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/2_THE_KITCHEN_FULL_OF_PEOPLE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/91_THE_REAL_TRIBE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/8_THE_PEOPLE_WHO_MATTER.png"
  ],
  "9": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/26_THE_BULLSHIT_JOB.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/76_THE_BULLSHIT_JOB.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/39_THE_BULLSHIT_JOB.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png"
  ],
  "10": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/6_THE_KNOWN_BY_ALL.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/74_THE_ENVIRONMENT_DESIGN.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/100_THE_FIRST_STEP.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/1_THE_MORNING_LIGHT.png"
  ],
  "11": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/100_THE_MODERN_CONDITION.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/67_THE_WATER_IMMERSION.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/74_THE_ENVIRONMENT_DESIGN.png"
  ],
  "12": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/76_THE_DOOMSCROLL.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/22_THE_NEWS_ADDICTION.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/53_THE_FEAR_FEED.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/52_THE_OUTRAGE.png"
  ],
  "13": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/51_THE_SCROLL_HOLE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/59_THE_REWARD_PREDICTION.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/32_THE_DATING_APP.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/58_THE_PHONE_CHECK.png"
  ],
  "14": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/3_THE_MEALS_AS_RITUAL.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/1_THE_BREAKFAST_TABLE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/3_THE_EATING_ALONE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/49_THE_FAST_FOOD.png"
  ],
  "15": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/73_THE_SUNLIGHT_DEPRIVATION.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/1_THE_MORNING_LIGHT.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/78_THE_LIGHT_RECLAIMED.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/84_THE_CIRCADIAN_RESET.png"
  ],
  "16": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/27_THE_VULNERABILITY.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/41_THE_INTIMACY_RESTORED.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/97_THE_INTIMACY.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/29_THE_INTIMACY_PROXY.png"
  ],
  "17": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/65_THE_EXERCISE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/80_THE_MOVEMENT.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/62_THE_BODY_RESTORED.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/76_THE_OUTDOOR_GYM.png"
  ],
  "18": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/8_THE_TRIBE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/91_THE_REAL_TRIBE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/34_THE_NETWORK_VS_TRIBE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/13_THE_BELONGING.png"
  ],
  "19": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/73_THE_VACATION.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/63_THE_ESCAPES.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/26_THE_WEEKEND.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/7_THE_VACATION_RETURN.png"
  ],
  "20": [
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/13_THE_BELONGING.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/8_THE_TRIBE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/94_THE_GROUP_EXERCISE.png",
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/41_THE_GATHERING.png"
  ]
};

// Extract title from filename (e.g., "10_THE_MISMATCH.png" -> ["the", "mismatch"])
function extractTitleWords(fileName) {
  if (!fileName) return [];
  // Remove number prefix and extension
  const name = fileName.replace(/^\d+_/, '').replace(/\.png$/i, '').toLowerCase();
  // Split by underscores
  return name.split('_').filter(w => w.length > 2 && w !== 'the');
}

// Simple word stemming
function stem(word) {
  if (!word) return '';
  word = word.toLowerCase();
  // Simple suffix removal
  if (word.endsWith('ing')) return word.slice(0, -3);
  if (word.endsWith('ed')) return word.slice(0, -2);
  if (word.endsWith('s') && word.length > 3) return word.slice(0, -1);
  if (word.endsWith('tion')) return word.slice(0, -4);
  if (word.endsWith('ness')) return word.slice(0, -4);
  return word;
}

// Extract words from text for matching
function extractWords(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .map(w => stem(w));
}

// Score an image for a question
function scoreImage(img, question, answer) {
  let score = 0;

  const questionWords = extractWords(question);
  const answerWords = extractWords(answer);
  const titleWords = extractTitleWords(img.file_name);
  const titleText = (img.title || '').toLowerCase();

  // Title keyword matching (highest priority - like user's matching)
  for (const titleWord of titleWords) {
    const stemmedTitle = stem(titleWord);

    // Check if title word appears in question
    for (const qWord of questionWords) {
      if (stemmedTitle === qWord || titleWord === qWord) {
        score += 200; // High priority for title-question match
      }
    }

    // Check if title word appears in answer
    for (const aWord of answerWords) {
      if (stemmedTitle === aWord || titleWord === aWord) {
        score += 100; // Medium priority for title-answer match
      }
    }
  }

  // Body text matching
  if (img.search_text || img.body_text) {
    const bodyText = (img.search_text || img.body_text || '').toLowerCase();
    for (const qWord of questionWords) {
      if (bodyText.includes(qWord)) score += 15;
    }
    for (const aWord of answerWords) {
      if (bodyText.includes(aWord)) score += 10;
    }
  }

  // Tags matching
  if (img.tags_normalized && Array.isArray(img.tags_normalized)) {
    for (const tag of img.tags_normalized) {
      const tagStem = stem(tag);
      for (const qWord of questionWords) {
        if (tagStem === qWord) score += 30;
      }
      for (const aWord of answerWords) {
        if (tagStem === aWord) score += 20;
      }
    }
  }

  // Framework concepts matching
  if (img.framework_concepts && Array.isArray(img.framework_concepts)) {
    for (const concept of img.framework_concepts) {
      const conceptWords = extractWords(concept);
      for (const cWord of conceptWords) {
        for (const qWord of questionWords) {
          if (cWord === qWord) score += 40;
        }
        for (const aWord of answerWords) {
          if (cWord === aWord) score += 25;
        }
      }
    }
  }

  return score;
}

async function fetchAllImages() {
  const allData = [];
  const pageSize = 1000;
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    console.log(`Fetching images ${offset} to ${offset + pageSize}...`);
    const { data, error } = await supabase
      .from('image_embeddings')
      .select('id, file_name, folder_name, title, image_url, image_type, categories, series, framework_concepts, tags_normalized, search_text')
      .range(offset, offset + pageSize - 1)
      .order('id');

    if (error) {
      console.error('Error:', error);
      break;
    }

    if (data && data.length > 0) {
      allData.push(...data);
      offset += pageSize;
      hasMore = data.length === pageSize;
    } else {
      hasMore = false;
    }
  }

  console.log(`Total images fetched: ${allData.length}`);
  return allData;
}

async function generateMatches() {
  // Load FAQ data
  const faqData = JSON.parse(readFileSync('/private/tmp/faq_data.json', 'utf8'));
  console.log(`Loaded ${faqData.length} FAQs`);

  // Fetch all images
  const allImages = await fetchAllImages();

  // Filter out unused series
  const usableImages = allImages.filter(img => !isImageUnused(img));
  console.log(`Usable images (excluding unused series): ${usableImages.length}`);

  // Track which images are already used in tiles 1-20
  const usedInFirst20 = new Set();
  for (const urls of Object.values(userImageMap)) {
    for (const url of urls) {
      usedInFirst20.add(url);
    }
  }
  console.log(`Images already used in tiles 1-20: ${usedInFirst20.size}`);

  // Track globally used images for uniqueness
  const globallyUsedTop4 = new Set(usedInFirst20);

  // Generate matches for questions 21-150
  const imageMap = { ...userImageMap };

  for (let qId = 21; qId <= Math.min(150, faqData.length); qId++) {
    const faq = faqData.find(f => f.id === qId);
    if (!faq) continue;

    const question = faq.q || faq.question;
    const answer = faq.a || faq.answer;

    // Score all usable images
    const scored = usableImages.map(img => ({
      img,
      score: scoreImage(img, question, answer)
    })).filter(s => s.score > 0);

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Select top 20, ensuring first 4 are unique (not used in other tiles' top 4)
    const selected = [];
    const usedInThisTile = new Set();

    for (const { img } of scored) {
      const url = img.image_url || `${supabaseUrl}/storage/v1/object/public/mismatch-images/${img.folder_name}/${img.file_name}`;

      if (usedInThisTile.has(url)) continue;

      // For first 4, check global uniqueness
      if (selected.length < 4) {
        if (globallyUsedTop4.has(url)) continue;
        globallyUsedTop4.add(url);
      }

      selected.push(url);
      usedInThisTile.add(url);

      if (selected.length >= 20) break;
    }

    // Pad with any remaining images if needed
    if (selected.length < 20) {
      for (const { img } of scored) {
        if (selected.length >= 20) break;
        const url = img.image_url || `${supabaseUrl}/storage/v1/object/public/mismatch-images/${img.folder_name}/${img.file_name}`;
        if (!usedInThisTile.has(url)) {
          selected.push(url);
          usedInThisTile.add(url);
        }
      }
    }

    imageMap[String(qId)] = selected;

    if (qId % 10 === 0) {
      console.log(`Processed question ${qId}: ${selected.length} images, top match: ${selected[0]?.split('/').pop() || 'none'}`);
    }
  }

  // Generate TypeScript output
  let output = `const imageMap: Record<number, string[]> = {\n`;

  for (let i = 1; i <= 150; i++) {
    const urls = imageMap[String(i)] || [];
    if (urls.length > 0) {
      output += `  "${i}": [\n`;
      for (const url of urls) {
        output += `    "${url}",\n`;
      }
      output += `  ],\n`;
    }
  }

  output += `};\n`;

  // Save outputs
  writeFileSync('/private/tmp/generated_imagemap.ts', output);
  writeFileSync('/private/tmp/generated_imagemap.json', JSON.stringify(imageMap, null, 2));

  console.log('\n=== GENERATION COMPLETE ===');
  console.log(`Generated matches for ${Object.keys(imageMap).length} questions`);
  console.log('Saved to /private/tmp/generated_imagemap.ts');
  console.log('Saved to /private/tmp/generated_imagemap.json');

  // Show samples
  console.log('\n--- Sample Q21 ---');
  console.log('Question:', faqData.find(f => f.id === 21)?.q);
  console.log('Top 4 matches:');
  imageMap['21']?.slice(0, 4).forEach((url, i) => {
    console.log(`  ${i+1}. ${url.split('/').pop()}`);
  });

  console.log('\n--- Sample Q50 ---');
  console.log('Question:', faqData.find(f => f.id === 50)?.q);
  console.log('Top 4 matches:');
  imageMap['50']?.slice(0, 4).forEach((url, i) => {
    console.log(`  ${i+1}. ${url.split('/').pop()}`);
  });
}

generateMatches().catch(console.error);
