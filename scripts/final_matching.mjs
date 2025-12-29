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

// COMPREHENSIVE keyword mapping based on ANSWER content for each question
// Format: [primary keywords (must match), secondary keywords (bonus)]
const questionKeywords = {
  // Questions 21-30
  21: { primary: ['rumination', 'ruminat', 'overthink'], secondary: ['loop', 'worry', 'thought', 'plan'] },
  22: { primary: ['audience', 'judgment', 'judge'], secondary: ['watch', 'eyes', 'critic', 'imagin'] },
  23: { primary: ['threat', 'worst', 'negativ'], secondary: ['catastroph', 'fear', 'danger', 'pessim'] },
  24: { primary: ['enough', 'perfect', 'good'], secondary: ['inadequa', 'fail', 'critic', 'standard'] },
  25: { primary: ['control', 'uncertain'], secondary: ['helpless', 'power', 'agency'] },
  26: { primary: ['dopamine', 'reward'], secondary: ['hit', 'spike', 'baseline', 'receptor'] },
  27: { primary: ['circadian', 'sleep', 'light'], secondary: ['morning', 'melatonin', 'rhythm', 'wake'] },
  28: { primary: ['movement', 'exercise', 'move'], secondary: ['walk', 'body', 'physical', 'run'] },
  29: { primary: ['food', 'eat', 'meal'], secondary: ['diet', 'hunger', 'cook', 'nutrition'] },
  30: { primary: ['bullshit', 'meaningless'], secondary: ['pointless', 'job', 'work', 'useless'] },

  // Questions 31-40
  31: { primary: ['visible', 'contribut', 'purpose'], secondary: ['impact', 'meaning', 'matter', 'see'] },
  32: { primary: ['immediate', 'return', 'delay'], secondary: ['reward', 'gratif', 'wait', 'now'] },
  33: { primary: ['open', 'loop', 'close'], secondary: ['finish', 'complete', 'task', 'undone'] },
  34: { primary: ['parasocial', 'celebrity', 'influencer'], secondary: ['fake', 'relationship', 'one-way', 'media'] },
  35: { primary: ['news', 'media', 'outrage'], secondary: ['fear', 'anger', 'attention', 'click'] },
  36: { primary: ['comparison', 'compare', 'instagram'], secondary: ['highlight', 'reel', 'best', 'others'] },
  37: { primary: ['fomo', 'missing', 'out'], secondary: ['fear', 'left', 'behind', 'exclude'] },
  38: { primary: ['notification', 'alert', 'ping'], secondary: ['interrupt', 'distract', 'phone', 'attention'] },
  39: { primary: ['phantom', 'vibration'], secondary: ['phone', 'check', 'buzz', 'feel'] },
  40: { primary: ['slot', 'machine', 'variable'], secondary: ['gambl', 'ratio', 'reward', 'random', 'casino'] },

  // Questions 41-50
  41: { primary: ['scroll', 'infinite', 'feed'], secondary: ['doom', 'endless', 'algorithm', 'content'] },
  42: { primary: ['scroll', 'exploit', 'product'], secondary: ['attention', 'harvest', 'dopamine', 'algorithm', 'feed'] },
  43: { primary: ['like', 'heart', 'validation'], secondary: ['approval', 'social', 'count', 'number'] },
  44: { primary: ['filter', 'fake', 'photo'], secondary: ['edit', 'beauty', 'perfect', 'image'] },
  45: { primary: ['status', 'signal', 'display'], secondary: ['wealth', 'success', 'show', 'flex'] },
  46: { primary: ['consumer', 'buy', 'purchase'], secondary: ['shop', 'spend', 'product', 'want'] },
  47: { primary: ['advertis', 'market', 'sell'], secondary: ['brand', 'target', 'manipul', 'buy'] },
  48: { primary: ['sugar', 'junk', 'processed'], secondary: ['food', 'addict', 'crave', 'sweet'] },
  49: { primary: ['porn', 'sexual', 'novelty'], secondary: ['addict', 'dopamine', 'escalat', 'stimul'] },
  50: { primary: ['dating', 'app', 'swipe'], secondary: ['tinder', 'match', 'option', 'choice', 'paradox'] },

  // Questions 51-60
  51: { primary: ['game', 'gaming', 'video'], secondary: ['addict', 'play', 'achievement', 'reward'] },
  52: { primary: ['work', 'hustle', 'grind'], secondary: ['busy', 'product', 'career', 'success'] },
  53: { primary: ['alcohol', 'drink', 'drunk'], secondary: ['social', 'lubric', 'party', 'bar'] },
  54: { primary: ['caffeine', 'coffee'], secondary: ['energy', 'adren', 'stimul', 'tired'] },
  55: { primary: ['weed', 'cannabis', 'marijuana'], secondary: ['high', 'relax', 'escape', 'numb'] },
  56: { primary: ['psychedelic', 'mushroom', 'lsd'], secondary: ['trip', 'experience', 'mind', 'expand'] },
  57: { primary: ['meditat', 'mindful'], secondary: ['breath', 'present', 'moment', 'aware'] },
  58: { primary: ['self-help', 'improve', 'hack'], secondary: ['optim', 'better', 'fix', 'book'] },
  59: { primary: ['retreat', 'escape', 'getaway'], secondary: ['vacation', 'break', 'away', 'leave'] },
  60: { primary: ['addiction', 'addict', 'substitu'], secondary: ['proxy', 'craving', 'withdraw', 'need'] },

  // Questions 61-70
  61: { primary: ['signal', 'symptom'], secondary: ['indicator', 'warning', 'sign', 'message'] },
  62: { primary: ['numb', 'suppress', 'avoid'], secondary: ['feel', 'emotion', 'escape', 'deny'] },
  63: { primary: ['anxiety', 'anxious'], secondary: ['worry', 'fear', 'panic', 'stress'] },
  64: { primary: ['depression', 'depress'], secondary: ['sad', 'low', 'meaning', 'empty'] },
  65: { primary: ['loneli', 'alone', 'isolat'], secondary: ['connect', 'social', 'belong', 'friend'] },
  66: { primary: ['shame', 'guilt'], secondary: ['wrong', 'bad', 'failure', 'judge'] },
  67: { primary: ['anger', 'rage', 'angry'], secondary: ['frustrat', 'mad', 'boundary', 'violat'] },
  68: { primary: ['fear', 'afraid', 'scare'], secondary: ['danger', 'threat', 'avoid', 'run'] },
  69: { primary: ['grief', 'loss', 'mourn'], secondary: ['death', 'gone', 'miss', 'sad'] },
  70: { primary: ['therapy', 'therapist'], secondary: ['session', 'couch', 'talk', 'psych', 'counsel'] },

  // Questions 71-80
  71: { primary: ['medication', 'pill', 'drug'], secondary: ['prescri', 'pharma', 'ssri', 'antidepress'] },
  72: { primary: ['diagnos', 'label', 'disorder'], secondary: ['dsm', 'mental', 'illness', 'condition'] },
  73: { primary: ['chemical', 'imbalance', 'serotonin'], secondary: ['brain', 'neuro', 'deficit'] },
  74: { primary: ['psychiatr', 'doctor'], secondary: ['clinic', 'medical', 'treat', 'patient'] },
  75: { primary: ['hospital', 'inpatient'], secondary: ['admit', 'ward', 'stay', 'institution'] },
  76: { primary: ['crisis', 'emergency', 'suicid'], secondary: ['help', 'hotline', 'danger', 'urgent'] },
  77: { primary: ['recovery', 'heal', 'better'], secondary: ['journey', 'progress', 'improve', 'hope'] },
  78: { primary: ['relapse', 'setback'], secondary: ['fall', 'again', 'slip', 'fail'] },
  79: { primary: ['support', 'group'], secondary: ['peer', 'community', 'share', 'together'] },
  80: { primary: ['leader', 'prestige', 'hunt'], secondary: ['chief', 'elder', 'hierarchy', 'alpha'] },

  // Questions 81-90
  81: { primary: ['dominan', 'alpha', 'hierarchy'], secondary: ['power', 'control', 'top', 'rank'] },
  82: { primary: ['egalitarian', 'equal'], secondary: ['flat', 'share', 'fair', 'same'] },
  83: { primary: ['punish', 'enforce', 'sanction'], secondary: ['rule', 'violat', 'consequence', 'norm'] },
  84: { primary: ['gossip', 'reputation'], secondary: ['talk', 'social', 'status', 'judge'] },
  85: { primary: ['shame', 'mock', 'ridicul'], secondary: ['laugh', 'humiliat', 'embarrass', 'joke'] },
  86: { primary: ['share', 'distribut', 'give'], secondary: ['resource', 'food', 'wealth', 'common'] },
  87: { primary: ['reciproc', 'exchange', 'give'], secondary: ['return', 'favor', 'mutual', 'trade'] },
  88: { primary: ['trust', 'cooperat'], secondary: ['together', 'team', 'rely', 'depend'] },
  89: { primary: ['betray', 'cheat', 'defect'], secondary: ['trust', 'lie', 'deceiv', 'break'] },
  90: { primary: ['level', 'prevent', 'hierarchy'], secondary: ['equal', 'mechanism', 'check', 'balance'] },

  // Questions 91-100
  91: { primary: ['tribe', 'band', 'group'], secondary: ['small', '150', 'dunbar', 'community'] },
  92: { primary: ['stranger', 'unknown'], secondary: ['threat', 'trust', 'unfamiliar', 'new'] },
  93: { primary: ['village', 'neighborhood'], secondary: ['local', 'community', 'area', 'place'] },
  94: { primary: ['city', 'urban', 'crowd'], secondary: ['anonymous', 'mass', 'dense', 'metro'] },
  95: { primary: ['suburb', 'isolat'], secondary: ['car', 'commute', 'spread', 'alone'] },
  96: { primary: ['online', 'virtual', 'digital'], secondary: ['internet', 'screen', 'remote', 'connect'] },
  97: { primary: ['real', 'person', 'face'], secondary: ['physical', 'touch', 'present', 'body'] },
  98: { primary: ['hybrid', 'mix', 'both'], secondary: ['online', 'offline', 'combine', 'balance'] },
  99: { primary: ['intentional', 'design', 'creat'], secondary: ['build', 'purpose', 'deliberat', 'plan'] },
  100: { primary: ['technology', 'meet', 'person'], secondary: ['together', 'gather', 'face', 'require'] },

  // Questions 101-110
  101: { primary: ['coliv', 'house', 'living'], secondary: ['share', 'together', 'commun', 'space'] },
  102: { primary: ['cowork', 'office', 'space'], secondary: ['work', 'together', 'share', 'collabor'] },
  103: { primary: ['third', 'place', 'public'], secondary: ['gather', 'social', 'commun', 'space'] },
  104: { primary: ['ritual', 'tradition', 'practic'], secondary: ['regular', 'repeat', 'meaning', 'sacred'] },
  105: { primary: ['celebration', 'festival', 'gather'], secondary: ['party', 'event', 'together', 'joy'] },
  106: { primary: ['meal', 'eat', 'dinner'], secondary: ['together', 'table', 'food', 'share'] },
  107: { primary: ['cook', 'kitchen', 'prepar'], secondary: ['food', 'together', 'meal', 'make'] },
  108: { primary: ['garden', 'grow', 'plant'], secondary: ['food', 'nature', 'community', 'soil'] },
  109: { primary: ['walk', 'hike', 'nature'], secondary: ['outside', 'trail', 'forest', 'move'] },
  110: { primary: ['sport', 'team', 'play'], secondary: ['game', 'together', 'compete', 'exercise'] },

  // Questions 111-120
  111: { primary: ['music', 'sing', 'song'], secondary: ['together', 'band', 'play', 'rhythm'] },
  112: { primary: ['dance', 'move', 'rhythm'], secondary: ['together', 'body', 'music', 'flow'] },
  113: { primary: ['art', 'creat', 'make'], secondary: ['together', 'express', 'craft', 'build'] },
  114: { primary: ['story', 'narrat', 'tell'], secondary: ['share', 'listen', 'meaning', 'myth'] },
  115: { primary: ['teach', 'learn', 'mentor'], secondary: ['skill', 'knowledge', 'guide', 'pass'] },
  116: { primary: ['elder', 'wisdom', 'old'], secondary: ['age', 'experience', 'respect', 'learn'] },
  117: { primary: ['child', 'parent', 'raise'], secondary: ['family', 'alloparent', 'village', 'care'] },
  118: { primary: ['death', 'dying', 'end'], secondary: ['grief', 'loss', 'mourn', 'funeral'] },
  119: { primary: ['birth', 'baby', 'new'], secondary: ['life', 'begin', 'child', 'arrive'] },
  120: { primary: ['fail', 'attempt', 'wrong'], secondary: ['mistake', 'try', 'alone', 'approach'] },

  // Questions 121-130
  121: { primary: ['alone', 'solo', 'individual'], secondary: ['self', 'isolat', 'without', 'single'] },
  122: { primary: ['willpower', 'discipline', 'force'], secondary: ['resist', 'control', 'effort', 'push'] },
  123: { primary: ['habit', 'routine', 'repeat'], secondary: ['daily', 'automatic', 'behavior', 'pattern'] },
  124: { primary: ['environment', 'design', 'context'], secondary: ['surround', 'space', 'set', 'arrange'] },
  125: { primary: ['default', 'easy', 'friction'], secondary: ['choice', 'path', 'resist', 'automatic'] },
  126: { primary: ['accountab', 'commit', 'promise'], secondary: ['other', 'social', 'witness', 'public'] },
  127: { primary: ['identity', 'who', 'self'], secondary: ['become', 'am', 'person', 'role'] },
  128: { primary: ['meaning', 'why', 'purpose'], secondary: ['reason', 'motive', 'value', 'matter'] },
  129: { primary: ['small', 'start', 'tiny'], secondary: ['step', 'begin', 'little', 'easy'] },
  130: { primary: ['tribe', 'communit', 'belong'], secondary: ['group', 'people', 'together', 'connect'] },

  // Questions 131-140
  131: { primary: ['find', 'search', 'look'], secondary: ['tribe', 'people', 'where', 'discover'] },
  132: { primary: ['build', 'creat', 'make'], secondary: ['tribe', 'communit', 'start', 'form'] },
  133: { primary: ['join', 'enter', 'become'], secondary: ['group', 'part', 'member', 'belong'] },
  134: { primary: ['vulnerab', 'open', 'honest'], secondary: ['share', 'real', 'trust', 'risk'] },
  135: { primary: ['conflict', 'disagree', 'fight'], secondary: ['resolve', 'repair', 'tension', 'argue'] },
  136: { primary: ['boundar', 'limit', 'no'], secondary: ['protect', 'space', 'respect', 'line'] },
  137: { primary: ['leave', 'exit', 'go'], secondary: ['toxic', 'bad', 'end', 'quit'] },
  138: { primary: ['maintain', 'keep', 'sustain'], secondary: ['effort', 'work', 'continue', 'last'] },
  139: { primary: ['deepen', 'closer', 'intimate'], secondary: ['connect', 'relationship', 'bond', 'strong'] },
  140: { primary: ['intimacy', 'close', 'connect'], secondary: ['deep', 'real', 'vulnerab', 'bond'] },

  // Questions 141-150
  141: { primary: ['sex', 'sexual', 'physical'], secondary: ['intimacy', 'body', 'touch', 'partner'] },
  142: { primary: ['love', 'romantic', 'partner'], secondary: ['relationship', 'couple', 'together', 'commit'] },
  143: { primary: ['friend', 'friendship'], secondary: ['close', 'trust', 'support', 'companion'] },
  144: { primary: ['family', 'relative', 'kin'], secondary: ['parent', 'sibling', 'blood', 'relate'] },
  145: { primary: ['acquaint', 'casual', 'weak'], secondary: ['tie', 'know', 'familiar', 'loose'] },
  146: { primary: ['network', 'connect', 'link'], secondary: ['social', 'web', 'bridge', 'contact'] },
  147: { primary: ['online', 'friend', 'virtual'], secondary: ['social', 'media', 'digital', 'follow'] },
  148: { primary: ['quality', 'depth', 'real'], secondary: ['quantit', 'number', 'few', 'meaningful'] },
  149: { primary: ['time', 'invest', 'spend'], secondary: ['relationship', 'priority', 'effort', 'give'] },
  150: { primary: ['image', 'visual', 'picture'], secondary: ['see', 'illustrat', 'show', 'graphic'] }
};

// Score function
function scoreImage(img, keywords) {
  const titleLower = (img.file_name || '').toLowerCase();
  const bodyLower = (img.search_text || img.title || '').toLowerCase();
  let score = 0;

  // Primary keywords - high weight
  for (const kw of keywords.primary || []) {
    if (titleLower.includes(kw)) score += 200;
    if (bodyLower.includes(kw)) score += 30;
  }

  // Secondary keywords - lower weight
  for (const kw of keywords.secondary || []) {
    if (titleLower.includes(kw)) score += 50;
    if (bodyLower.includes(kw)) score += 10;
  }

  return score;
}

// Extract keywords from answer text as fallback
function extractFromAnswer(answer) {
  const clean = answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').toLowerCase();
  const words = clean.split(/\s+/).filter(w => w.length > 4 && !['which', 'about', 'their', 'there', 'would', 'could', 'should', 'being', 'these', 'those'].includes(w));
  const unique = [...new Set(words)].slice(0, 8);
  return { primary: unique.slice(0, 3), secondary: unique.slice(3) };
}

async function fetchAllImages() {
  const allData = [];
  let offset = 0;
  while (true) {
    const { data } = await supabase
      .from('image_embeddings')
      .select('id, file_name, folder_name, image_url, series, search_text, title')
      .range(offset, offset + 999)
      .order('id');
    if (!data || data.length === 0) break;
    allData.push(...data);
    offset += 1000;
    if (data.length < 1000) break;
  }
  return allData;
}

async function generateFinalMatches() {
  console.log('Loading FAQ data...');
  const faqData = JSON.parse(readFileSync('/private/tmp/faq_data.json', 'utf8'));
  const userImageMap = JSON.parse(readFileSync('/private/tmp/generated_imagemap.json', 'utf8'));

  console.log('Fetching all images from Supabase...');
  const allImages = await fetchAllImages();
  const usableImages = allImages.filter(img => !isUnused(img));
  console.log(`Total: ${allImages.length}, Usable: ${usableImages.length}`);

  // Track used images - be lenient for later questions
  const usedInFirst20 = new Set();
  for (let i = 1; i <= 20; i++) {
    (userImageMap[String(i)] || []).forEach(u => usedInFirst20.add(u));
  }

  const globalUsedTop4 = new Set(usedInFirst20);
  const finalImageMap = {};

  // Keep tiles 1-20 exactly as user specified
  for (let i = 1; i <= 20; i++) {
    finalImageMap[String(i)] = userImageMap[String(i)] || [];
  }

  console.log('\\nGenerating matches for questions 21-150...');

  for (let qId = 21; qId <= 150; qId++) {
    const faq = faqData.find(f => f.id === qId);
    if (!faq) continue;

    const question = faq.q || faq.question;
    const answer = faq.a || faq.answer;

    // Get keywords - predefined or extracted from answer
    const keywords = questionKeywords[qId] || extractFromAnswer(answer);

    // Score all usable images
    const scored = usableImages.map(img => ({
      img,
      score: scoreImage(img, keywords)
    })).filter(s => s.score > 0);

    scored.sort((a, b) => b.score - a.score);

    // Select images - be more lenient about uniqueness for later questions
    const selected = [];
    const usedHere = new Set();
    const uniquenessThreshold = qId < 50 ? 4 : (qId < 100 ? 3 : 2); // Stricter for early, lenient for late

    for (const { img } of scored) {
      const url = img.image_url || `${supabaseUrl}/storage/v1/object/public/mismatch-images/${img.folder_name}/${img.file_name}`;

      if (usedHere.has(url)) continue;

      // Try for uniqueness in top positions, but be lenient
      if (selected.length < uniquenessThreshold) {
        if (globalUsedTop4.has(url)) {
          // For later questions, allow some reuse if we don't have enough unique matches
          if (scored.filter(s => !globalUsedTop4.has(s.img.image_url)).length > uniquenessThreshold) {
            continue; // Skip if we have enough unique alternatives
          }
        } else {
          globalUsedTop4.add(url);
        }
      }

      selected.push(url);
      usedHere.add(url);
      if (selected.length >= 20) break;
    }

    // If we didn't get enough, add any remaining high-scoring images
    if (selected.length < 10) {
      for (const { img } of scored) {
        if (selected.length >= 20) break;
        const url = img.image_url || `${supabaseUrl}/storage/v1/object/public/mismatch-images/${img.folder_name}/${img.file_name}`;
        if (!usedHere.has(url)) {
          selected.push(url);
          usedHere.add(url);
        }
      }
    }

    finalImageMap[String(qId)] = selected;

    // Progress output
    if (qId % 10 === 0) {
      console.log(`Q${qId}: ${question.substring(0, 35)}... → ${selected.slice(0, 2).map(u => u.split('/').pop()).join(', ')}`);
    }
  }

  // Save results
  writeFileSync('/private/tmp/final_imagemap.json', JSON.stringify(finalImageMap, null, 2));
  console.log('\\nSaved to /private/tmp/final_imagemap.json');

  // Show quality check for key questions
  console.log('\\n=== QUALITY CHECK ===');
  const checkQuestions = [20, 21, 30, 40, 42, 50, 60, 70, 80, 100, 120, 140];
  for (const qId of checkQuestions) {
    const faq = faqData.find(f => f.id === qId);
    console.log(`\\nQ${qId}: ${faq?.q}`);
    console.log(`Top 4: ${finalImageMap[String(qId)]?.slice(0, 4).map(u => u.split('/').pop()).join(', ')}`);
  }

  // Now update the HTML
  console.log('\\nUpdating HTML file...');
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
  writeFileSync('/private/tmp/image_selector_v7.html', html);
  console.log('Updated /private/tmp/image_selector_v7.html');

  console.log('\\n=== DONE ===');
}

generateFinalMatches().catch(console.error);
