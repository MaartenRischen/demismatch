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

// Extract title words from file name
function getTitleWords(fileName) {
  return fileName
    .replace(/^\d+_/, '')
    .replace(/\.(png|jpeg|jpg)$/i, '')
    .toUpperCase()
    .split('_')
    .filter(w => w.length > 2 && w !== 'THE');
}

// COMPREHENSIVE per-question search terms based on ANSWER content
// This is the key: manually crafted terms for each question that match available images
const questionSearchTerms = {
  // Questions 1-20 (regenerate if user's selections were deleted)
  1: ['MISMATCH', 'LONELY', 'BURNOUT', 'DEPRESSION', 'MODERN', 'CONDITION'],
  2: ['ANCESTRAL', 'EVOLVED', 'TRIBE', 'CONDITION', 'MODERN', 'MISMATCH'],
  3: ['RUMINATION', 'OVERTHINK', 'LOOP', 'OPEN', 'WORRY', 'UNFINISHED', 'CONTROL'],
  4: ['FINISHED', 'CLOSED', 'COMPLETE', 'SATISFACTION', 'HUNT', 'CLOSURE', 'DONE', 'LOOP'],
  5: ['STATUS', 'STRANGER', 'JUDGMENT', 'REPUTATION', 'PRESTIGE'],
  6: ['DUNBAR', 'FRIEND', 'INTIMATE', 'CIRCLE', 'TRIBE', 'GATHER', 'GROUP', 'SOCIAL', 'LIMIT', 'NUMBER'],
  7: ['PARASOCIAL', 'FOLLOWER', 'CELEBRITY', 'LONELY', 'AUDIENCE', 'CROWD'],
  8: ['PROXY', 'SUBSTITUTE', 'FAKE', 'REPLACEMENT', 'REAL', 'SATISFY'],
  9: ['BULLSHIT', 'JOB', 'QUICK', 'FIX', 'PROXY', 'MEANINGLESS'],
  10: ['WANT', 'NEED', 'TRIBE', 'REAL', 'PROXY', 'MORE', 'CHASE'],
  11: ['SIGNAL', 'SYMPTOM', 'EMOTION', 'DATA', 'MESSAGE'],
  12: ['SIGNAL', 'ENVIRONMENT', 'WRONG', 'FEELING', 'ANXIETY'],
  13: ['SIGNAL', 'SYMPTOM', 'DIAGNOSIS', 'PSYCHIATR', 'TREAT'],
  14: ['OIL', 'LIGHT', 'ENGINE', 'SUPPRESS', 'MEDICATION', 'PILL'],
  15: ['ANXIETY', 'THREAT', 'LOOP', 'OPEN', 'STRANGER', 'ALARM'],
  16: ['DEPRESSION', 'MEANING', 'TRIBE', 'PURPOSE', 'LOOP', 'SIGNAL'],
  17: ['FISH', 'WATER', 'ENVIRONMENT', 'WRONG', 'FLOP', 'LAND'],
  18: ['DISORDER', 'DIAGNOSIS', 'FLOP', 'PATHOLOG', 'MISMATCH'],
  19: ['SLEEP', 'TRIBE', 'CONTRIBUTION', 'FISH', 'ENVIRONMENT', 'BREAK'],
  20: ['CAMPFIRE', 'FIRE', 'TRIBE', 'BELONG', 'GATHER', 'CIRCLE', 'ANCESTRAL', 'BAND'],

  // Questions 21-30
  21: ['RUMINATION', 'OVERTHINK', 'PLAN', 'LOOP', 'CHURN', 'PROBLEM'],
  22: ['AUDIENCE', 'JUDGMENT', 'CRITIC', 'WATCH', 'IMAGIN', 'INTERNAL'],
  23: ['NEGATIV', 'WORST', 'THREAT', 'FEAR', 'BIAS', 'PHANTOM'],
  24: ['PERFECT', 'ENOUGH', 'GOOD', 'STANDARD', 'INADEQUA', 'TRAP'],
  25: ['CONTROL', 'PARTIAL', 'UNCERTAIN', 'POWER', 'AGENCY', 'LOOP'],
  26: ['FRIEND', 'FIVE', 'CLOSE', 'INTIMATE', 'VULNERAB', 'CALL'],
  27: ['FRIEND', 'FRIENDSHIP', 'INTIMATE', 'CLOSE', 'DEATH', 'LOSS', 'MEANINGFUL', 'CONTACT'],
  29: ['WORK', 'MEANINGLESS', 'ABSTRACT', 'HUNT', 'EAT', 'DELAYED', 'RETURN'],
  30: ['BULLSHIT', 'JOB', 'MEANINGLESS', 'TANGIBLE', 'CONTRIBUT', 'VISIBLE'],

  // Questions 31-40
  31: ['STRANGER', 'CROWD', 'OVERLOAD', 'EXHAUST', 'CITY', 'ASSESS'],
  32: ['STRANGER', 'ANCESTOR', 'ENCOUNTER', 'LIFETIME', 'DAILY', 'KNOWN'],
  33: ['COMPAR', 'STATUS', 'MILLION', 'BILLION', 'GLOBAL', 'LOCAL'],
  34: ['STATUS', 'SURVIVAL', 'PRESTIGE', 'RESOURCE', 'ALLIES', 'MATES'],
  35: ['HYPERSTIMUL', 'PORN', 'JUNK', 'FAKE', 'EXAGGERAT', 'HIJACK'],
  36: ['PARASOCIAL', 'CELEBRITY', 'ONE-WAY', 'BOND', 'INFLUENC', 'NAME'],
  37: ['PROFIT', 'SUFFER', 'CONSUMER', 'ATOMIZ', 'CUSTOMER', 'SEVER'],
  38: ['EXPLOIT', 'FORMULA', 'MONETIZ', 'BLOCK', 'PROXY', 'SATISFY'],
  39: ['ALONE', 'MANIPUL', 'ATOMIZ', 'VULNERAB', 'COUNTER', 'NARRATIVE'],
  40: ['SLOT', 'MACHINE', 'VARIABLE', 'RATIO', 'GAMBL', 'RANDOM', 'REWARD'],

  // Questions 41-50
  41: ['DOPAMINE', 'REWARD', 'ANTICIPAT', 'SPIKE', 'TRIGGER', 'TOLERANCE'],
  42: ['SCROLL', 'DOOMSCROLL', 'EXPLOIT', 'PRODUCT', 'ATTENTION', 'ALGORITHM', 'LONELY'],
  43: ['SEROTONIN', 'CHEMICAL', 'IMBALANCE', 'DEBUNK', 'SSRI', 'OVERRIDE'],
  44: ['MEDICATION', 'SIGNAL', 'OVERRIDE', 'SUPPRESS', 'PILL', 'OIL', 'LIGHT'],
  45: ['PHARMA', 'CHEMICAL', 'GHOSTWRIT', 'SELL', 'PAID', 'EXPERT'],
  46: ['GHOSTWRIT', 'PHARMA', 'RESEARCH', 'PAPER', 'ACADEMIC', 'MARKET'],
  47: ['CORTISOL', 'STRESS', 'CHRONIC', 'TIGER', 'SPIKE', 'BODY'],
  48: ['NEWS', 'MEDIA', 'THREAT', 'LOOP', 'WORRY', 'CORTISOL', 'BREAKING'],
  49: ['FOOD', 'BLISS', 'POINT', 'SUGAR', 'FAT', 'SALT', 'CRAVE', 'ADDICT'],
  50: ['DATING', 'APP', 'SWIPE', 'MATCH', 'FAIL', 'USER', 'OUTCOME'],

  // Questions 51-60
  51: ['PORN', 'HYPERSTIMUL', 'MATING', 'NOVELTY', 'DOPAMINE', 'PARTNER'],
  52: ['SELF-HELP', 'BOOK', 'INDIVIDUAL', 'SOLUTION', 'SYSTEMIC', 'BUY'],
  53: ['CELEBRITY', 'FAME', 'PARASOCIAL', 'STATUS', 'BOND', 'INVEST'],
  54: ['SPORT', 'TEAM', 'FAN', 'TRIBAL', 'BELONG', 'PROXY', 'ENEMY'],
  55: ['INCENT', 'MONEY', 'FUND', 'PROFIT', 'CONSPIR', 'DRUG'],
  56: ['WHALE', 'EXPLOIT', 'GAMBL', 'VULNERAB', 'REVENUE', 'ADDICT'],
  57: ['CONSUMER', 'PRODUCT', 'MARKETING', 'BRAND', 'INFLUENCER', 'BUY', 'SELL'],
  58: ['SLOT', 'MACHINE', 'GAMBL', 'RANDOM', 'VARIABLE', 'REWARD', 'ADDICT'],
  59: ['RAT', 'PARK', 'LONELY', 'ISOLAT', 'ENRICH', 'ENVIRONMENT', 'DRUG'],
  60: ['ADDICTION', 'ADDICT', 'PROXY', 'SUBSTITU', 'DRIVE', 'REDIRECT'],

  // Questions 61-70
  61: ['ADHD', 'HUNTER', 'COGNIT', 'SCAN', 'ATTENTION', 'MOVEMENT', 'NOVELTY'],
  63: ['ANXIETY', 'SOCIAL', 'INTERNAL', 'AUDIENCE', 'FEAR', 'CRITIC'],
  64: ['BURNOUT', 'BURN', 'EXHAUST', 'PURPOSE', 'EFFORT', 'VISIBLE', 'MEANINGLESS'],
  65: ['IMPOSTER', 'CREDENTIAL', 'SYNDROME', 'RECOGNI', 'VISIBLE', 'CONTRIBUT'],
  66: ['DISEASE', 'BIOMARKER', 'BLOOD', 'TEST', 'BEHAVIOR', 'DESCRIPT'],
  67: ['HERIT', 'HEIGHT', 'INHERIT', 'GENETIC', 'COGNITIVE', 'PATTERN'],
  68: ['BRAIN', 'DIFFER', 'MUSICIAN', 'TAXI', 'PATHOLOGY', 'CONSEQUENCE'],
  69: ['NEUROPLASTIC', 'BRAIN', 'CHANGE', 'EXPERIENCE', 'EFFECT', 'RESHAPE'],
  70: ['THERAPY', 'THERAPIST', 'PROXY', 'PAID', 'INTIMA', 'SESSION', 'TRIBE'],

  // Questions 71-80
  71: ['MEDICATION', 'MINUTE', 'CHECK', 'DOSAGE', 'CONTEXT', 'PSYCHIATR'],
  72: ['MEDICATION', 'NECESSARY', 'SOCIAL', 'WHO', 'STRUCTUR', 'OUTCOME'],
  73: ['DIE', 'DEATH', 'EUTHANA', 'PSYCHIATR', 'ENVIRONMENT'],
  74: ['CAMPFIRE', 'FIRE', 'STORY', 'BONFIRE', 'CIRCLE', 'TOGETHER', 'NIGHT', 'BOND'],
  75: ['ALLOPARENT', 'PARENT', 'ALONE', 'NUCLEAR', 'CHILD', 'ADULT', 'BURNOUT'],
  76: ['AGE', 'CHILD', 'SEPARATE', 'MIXED', 'INSTITUTION', 'PLAY', 'MENTOR'],
  77: ['APPRENTICE', 'LEARN', 'OBSERV', 'PARTICIPAT', 'SKILL', 'CONTRIBUT'],
  78: ['DEMAND', 'SHARING', 'POVERTY', 'SURPLUS', 'GIVE', 'ASK', 'GROUP'],
  79: ['IMMEDIATE', 'RETURN', 'HUNT', 'GATHER', 'CONSUME', 'TANGIBLE', 'LOOP'],
  80: ['LEADER', 'PERMANENT', 'EXPERT', 'DOMAIN', 'TRACKER', 'HUNT'],

  // Questions 81-90
  81: ['EGALITARIAN', 'DOMINAN', 'BOAST', 'HOARD', 'COALITION', 'SUPPRESS'],
  82: ['CONFLICT', 'RESOLU', 'HUMOR', 'CASCADE', 'RIDICUL', 'SHUN', 'EXILE'],
  83: ['CIRCADIAN', 'LIGHT', 'WAKE', 'SLEEP', 'MORNING', 'AFTERNOON', 'DARK'],
  84: ['BIRTH', 'SPACING', 'BREASTFEED', 'CHILD', 'YEAR', 'PARENT', 'INFANT'],
  85: ['INFANT', 'CONTACT', 'CARRY', 'BABY', 'CONSTANT', 'CO-SLEEP', 'HOLD'],
  86: ['FISSION', 'FUSION', 'BREAK', 'APART', 'CONFLICT', 'FACTION', 'HEALTHY'],
  87: ['METAPOPUL', 'INBRED', 'MARRIAGE', 'EXCHANG', 'SEASONAL', 'GATHER'],
  88: ['GOVERNANCE', 'HIERARCHY', 'EXPLICIT', 'DAMAGE', 'MECHANISM', 'STRUCTUR'],
  89: ['CULT', 'TRIBE', 'LEADER', 'EXIT', 'CHARISMAT', 'INFORMAT', 'ISOLAT'],
  90: ['LEADER', 'LEADERSHIP', 'POWER', 'EQUAL', 'HIERARCHY', 'AUTHORITY', 'BOSS'],

  // Questions 91-100
  91: ['TRANSPAREN', 'SEE', 'EVERYTHING', 'INFORMATION', 'ASYMMETR', 'POWER'],
  92: ['DOMAIN', 'SEPAR', 'ROLE', 'MULTIPLE', 'POWER', 'CONCENTR'],
  93: ['ONBOARD', 'FILTER', 'MANIPUL', 'TRIAL', 'PERIOD', 'SURFACE'],
  94: ['LEAVE', 'EXIT', 'VIABLE', 'QUIT', 'VALUE', 'BAR', 'CULT'],
  95: ['AUROVILLE', 'SCALE', 'DUNBAR', 'FAIL', 'FLAT', 'GOVERNANCE'],
  96: ['DEMISMATCH', 'FIX', 'ALIGN', 'CONSCIOUS', 'BIOLOGY', 'FORWARD'],
  97: ['AUGMENT', 'BROKEN', 'AMPLIF', 'DYSFUNCT', 'TECHNOLOG', 'ISOLAT'],
  98: ['AUGMENT', 'ENHANC', 'COMMUNICAT', 'TRIBE', 'AI', 'CAPABILITY'],
  99: ['PHARMAKON', 'POISON', 'CURE', 'BOTH', 'IMPLEMENT', 'HEAL'],
  100: ['MEET', 'PERSON', 'FACE', 'PHYSICAL', 'PRESENCE', 'TOGETHER', 'GATHER'],

  // Questions 101-110
  101: ['AI', 'TRIBE', 'FORMATION', 'MATCH', 'NERVOUS', 'CONFLICT'],
  102: ['VIDEO', 'CALL', 'TRIBE', 'PARASOCIAL', 'SCROLL', 'STRANGER'],
  103: ['VC', 'VENTURE', 'FUND', 'DECAY', 'CHURN', 'ENGAG', 'GROWTH'],
  104: ['POST-HUMAN', 'GOAL', 'THRIV', 'MATCH', 'ENHANC', 'BASELINE'],
  105: ['ROLE', 'GROUP', 'GOAL', 'ARRIV', 'WAKE', 'CREDENTIAL'],
  106: ['WHO', 'DEVELOP', 'OUTCOME', 'SCHIZOPHREN', 'MEDICATION', 'SOCIAL'],
  107: ['HUNTER', 'GATHERER', 'STUDY', 'RARE', 'CHRONIC', 'ABSENT'],
  108: ['NATURE', 'EXPOS', 'INTERVEN', 'SYMPTOM', 'CO-LIV', 'REDUC'],
  109: ['INTENTIONAL', 'COMMUNIT', 'STABIL', 'TWIN', 'OAKS', 'EAST', 'WIND'],
  110: ['COMMUNITY', 'INTENTIONAL', 'TOGETHER', 'COLLABORATION', 'SHARE', 'CONTRIBUTE', 'LABOR'],

  // Questions 111-120
  111: ['EAST', 'WIND', 'NUT', 'BUTTER', 'COORDINAT', 'TRANSPAREN'],
  112: ['STEP', 'ONE', 'REDUC', 'LOAD', 'AUDIT', 'PARASOCIAL', 'LOOP'],
  113: ['STEP', 'TWO', 'DEEPEN', 'BROADEN', 'INVEST', 'RELATIONSHIP'],
  114: ['STEP', 'THREE', 'PROXY', 'DEPEND', 'TIME-BOX', 'ALTERNATIV'],
  115: ['STEP', 'FOUR', 'BUILD', 'DINNER', 'FINISH', 'PROJECT', 'CONTRIBUT'],
  116: ['SMALL', 'CHANGE', 'FIVE', 'MEAL', 'LOOP', 'LIGHT', 'MOVEMENT'],
  117: ['BUILD', 'TRIBE', 'REDUC', 'CIRCADIAN', 'NATURE', 'STRANGER'],
  118: ['YEAR', 'WEEK', 'LONG', 'SLOW', 'DOUBLE', 'SHIFT', 'QUICK'],
  119: ['DOUBLE', 'SHIFT', 'EXHAUST', 'UNSUSTAIN', 'CAPITALIST', 'TRIBAL'],
  120: ['GREAT', 'FILTER', 'FAIL', 'ATTEMPT', 'BURNOUT', 'RESOURCE', 'HIERARCHY'],

  // Questions 121-130
  121: ['RESOURCE', 'FLEXIB', 'FIRST', 'PRIVILEGE', 'SAVING', 'RELATIONSHIP'],
  122: ['FISSION', 'FUSION', 'FAIL', 'TEMPORAR', 'SKILL', 'PERSIST', 'TEACH'],
  123: ['READ', 'ALONE', 'SCROLL', 'MISTAKE', 'UNDERSTAND', 'PROGRESS'],
  124: ['MEANING', 'STRUGGLE', 'SCARCIT', 'CHALLENG', 'CONSTRUCTIV', 'EFFORT'],
  125: ['SUFFER', 'NECESSARY', 'TOXIC', 'CONSTRUCTIV', 'SCARCIT', 'TRAUMA'],
  126: ['UBI', 'MONEY', 'RESOURCE', 'MEANING', 'ROLE', 'TRIBE', 'PURPOSE'],
  127: ['AUTOMAT', 'ROLE', 'ELIMINAT', 'PRODUCT', 'PROXY', 'PURPOSE', 'JOB'],
  128: ['SURVIVE', 'REPRODUC', 'DRIVE', 'BEHAVIOR', 'DIRECT', 'INDIRECT'],
  129: ['URGE', 'CONTROL', 'DIRECT', 'FITNESS', 'SURVIVAL', 'AUTOMATIC'],
  130: ['APPROVAL', 'INDIRECT', 'FITNESS', 'VALIDATION', 'SURVIVAL', 'SOCIAL'],

  // Questions 131-140
  131: ['RECIPROC', 'FAVOR', 'OBLIGAT', 'ALTRUISM', 'COOPERAT', 'HELP'],
  132: ['WANT', 'NEED', 'DIFFER', 'FAME', 'MONEY', 'TRIBE', 'CONNECT'],
  133: ['TRAIN', 'LIMIT', 'BIOLOG', 'DUNBAR', 'NEOCORTEX', 'TIME', 'FOLLOWER'],
  134: ['BAND', 'FIFTY', 'SIZE', 'FAMILY', 'MEAL', 'FIRE', 'CIRCLE'],
  135: ['STRANGER', 'CITY', 'MILLION', 'DUNBAR', 'LIMIT', 'ACTION'],
  136: ['FRIEND', 'SOCIAL', 'NETWORK', 'CONNECT', 'RELATIONSHIP', 'DIGITAL', 'VIRTUAL'],
  137: ['BRAIN', 'LIE', 'OUTDATED', 'SOFTWARE', 'CALIBRAT', 'SURVIVAL'],
  138: ['PERCEIV', 'REALITY', 'DASHBOARD', 'ACCURAC', 'EVOLUT', 'SURVIVAL'],
  139: ['SHOOTING', 'KILL', 'STRANGER', 'MASS', 'OVERLOAD', 'CATEGORY'],

  // Questions 141-161
  141: ['ART', 'ENTERTAINMENT', 'FIRE', 'CIRCLE', 'PROXY', 'DEPLET', 'NOURISH'],
  142: ['ANTI', 'PSYCHIATR', 'MISDIAGNOS', 'RESPONSE', 'REAL', 'PATTERN'],
  143: ['ANTI', 'TECHNOLOG', 'PHARMAKON', 'DESIGN', 'POISON', 'CURE'],
  144: ['WEBSITE', 'FRAMEWORK', 'SPEC', 'SHEET', 'EXPLAIN', 'SUFFER'],
  145: ['UNDERSTAND', 'SUFFER', 'ENVIRONMENT', 'CHANGE', 'SEE', 'UNSEE'],
  146: ['CARE', 'SUFFER', 'BLAME', 'YOURSELF', 'SOLUTION', 'WORK'],
  147: ['WHO', 'WRONG', 'THERAPIST', 'TECHNOLOG', 'PARENT', 'KID'],
  148: ['STOP', 'BLAME', 'BUILD', 'TRIBE', 'CLOSURE', 'CONTRIBUT'],
  149: ['FREE', 'TRUTH', 'FORK', 'IMPROV', 'PROFIT', 'POINT'],
  150: ['ART', 'GALLERY', 'VISUAL', 'GRAPHIC', 'DESIGN', 'CREATE', 'ILLUSTRATION'],
  151: ['SELF-HELP', 'INDIVIDUAL', 'SYSTEMIC', 'PERSONAL', 'SELL', 'COLLECT'],
  160: ['BROKEN', 'ENVIRONMENT', 'MISMATCH', 'FISH', 'FIX', 'BUILD', 'THRIV'],
  161: ['START', 'BEGIN', 'ACTION', 'NOW', 'CLOSE', 'BUILD', 'PERSON', 'MEAL']
};

// Score an image against search terms - STRICT matching only
function scoreImage(img, searchTerms) {
  const titleWords = getTitleWords(img.file_name);
  let score = 0;

  for (const term of searchTerms) {
    for (const tw of titleWords) {
      // STRICT matching rules:
      // 1. Exact match always scores
      // 2. For terms 5+ chars: word can start with term (RUMINATION matches RUMINAT)
      // 3. For terms 4 chars: must be exact match or word starts with term + at least 2 more chars
      // This prevents: CARE matching CAREER, PLAN matching PLANE
      let matched = false;

      if (tw === term) {
        matched = true;
      } else if (term.length >= 5 && tw.startsWith(term)) {
        matched = true;
      } else if (term.length === 4 && tw.startsWith(term) && tw.length >= term.length + 2) {
        // E.g., CARE only matches CARETAKER (8 chars), not CAREER (6 chars)
        matched = true;
      }

      if (matched) {
        score += 100;
        break;  // Only count each term once per image
      }
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

  // Create valid file names set
  const validFileNames = new Set(usableImages.map(img => img.file_name));

  const finalImageMap = {};
  const globallyUsedFileNames = new Set();

  // Process ALL tiles (1-161) - REGENERATE EVERYTHING, don't preserve partial user selections
  for (const faq of faqData) {
    const qId = faq.id;
    const searchTerms = questionSearchTerms[qId];

    if (!searchTerms) {
      console.log(`Q${qId}: No search terms defined, skipping`);
      finalImageMap[String(qId)] = [];
      continue;
    }

    // Generate matches fresh based on answer content
    const scored = usableImages.map(img => ({
      img,
      score: scoreImage(img, searchTerms)
    })).filter(s => s.score > 0);

    scored.sort((a, b) => b.score - a.score);

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

    finalImageMap[String(qId)] = selected;

    // Progress for key questions
    if ([1, 2, 3, 4, 5, 20, 21, 27, 30, 42, 70, 74, 100, 130, 160].includes(qId)) {
      console.log(`\nQ${qId}: ${faq.q}`);
      console.log(`  Terms: ${searchTerms.slice(0, 5).join(', ')}`);
      console.log(`  Top 4: ${selected.slice(0, 4).map(u => u.split('/').pop()).join(', ')}`);
    }
  }

  // Save results
  writeFileSync('/private/tmp/final_semantic_imagemap.json', JSON.stringify(finalImageMap, null, 2));
  console.log('\n\nSaved to /private/tmp/final_semantic_imagemap.json');

  // Statistics
  let withMatches = 0;
  let without = 0;
  for (const faq of faqData) {
    const matches = finalImageMap[String(faq.id)] || [];
    if (matches.length > 0) {
      withMatches++;
    } else {
      without++;
      console.log(`NO MATCHES: Q${faq.id}: ${faq.q}`);
    }
  }
  console.log(`\nWith matches: ${withMatches}, Without: ${without}`);

  // Update HTML
  console.log('\nUpdating HTML file...');
  const questionDataForHtml = faqData.map(faq => {
    const urls = finalImageMap[String(faq.id)] || [];
    return {
      id: faq.id,
      question: faq.q || faq.question,
      answer: faq.a || faq.answer,
      preselected: urls.map((url, idx) => ({
        id: 0,
        file_name: url.split('/').pop(),
        folder_name: decodeURIComponent(url.split('/').slice(-2, -1)[0]),
        title: url.split('/').pop().replace(/^\d+_/, '').replace(/\.png|\.jpeg|\.jpg/i, '').replace(/_/g, ' '),
        image_url: url,
        score: 100 - idx
      }))
    };
  });

  let html = readFileSync('/private/tmp/image_selector_v6.html', 'utf8');
  const regex = /const questionData = \[[\s\S]*?\];/;
  html = html.replace(regex, 'const questionData = ' + JSON.stringify(questionDataForHtml) + ';');
  writeFileSync('/private/tmp/image_selector_v8.html', html);
  console.log('Updated /private/tmp/image_selector_v8.html');

  console.log('\n=== DONE ===');
}

generateMatches().catch(console.error);
