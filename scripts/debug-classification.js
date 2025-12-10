#!/usr/bin/env node

const MASTERLIST_URL = 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-data/masterlist.json';

// Test images that should be PROBLEM
const TEST_TITLES = [
  'THE WORK MARTYR',
  'THE SUNDAY SCARIES', 
  'THE WELLNESS',
  'MENTAL HEALTH IS HEALTH'
];

// PROBLEM indicators - these are definitive negative signals
const problemWords = [
  'mismatch', 'problem', 'anxiety', 'stress', 'isolation', 'loneliness',
  'dysfunction', 'exploitation', 'trap', 'proxy', 'unfulfilled', 'toxic',
  'emptiness', 'disconnection', 'artificial', 'superficial', 'addictive',
  'suffering', 'inadequacy', 'alienation', 'fear', 'dread', 'despair',
  'hopeless', 'overwhelm', 'burnout', 'exhaustion', 'fatigue', 'tired',
  'sad', 'depressed', 'depression', 'lonely', 'alone', 'withdrawn',
  'shame', 'guilt', 'failure', 'rejected', 'excluded', 'abandoned',
  'numb', 'hollow', 'void', 'meaningless', 'pointless', 'stuck',
  'trapped', 'helpless', 'powerless', 'lost', 'confused', 'broken',
  'hurt', 'pain', 'ache', 'crisis', 'breakdown', 'collapse',
  'conflict', 'struggle', 'fight', 'battle', 'war', 'tension',
  'negative', 'harmful', 'damaging', 'destructive', 'dangerous',
  'false', 'fake', 'pretend', 'illusion', 'delusion', 'lie',
  'substitute', 'replacement', 'surrogate', 'at the expense of',
  'lack of', 'absence of', 'without', 'missing', 'loss of', 'losing'
];

// SOLUTION indicators - positive outcomes achieved
const solutionWords = [
  'solution', 'demismatch', 'de-mismatch', 'after demismatch',
  'resolution', 'resolved', 'healed', 'healing', 'recovery', 'recovered',
  'restored', 'restoration', 'reconnected', 'reunited', 'realigned',
  'thriving', 'flourishing', 'blooming', 'growing', 'growth',
  'joy', 'joyful', 'happy', 'happiness', 'content', 'contentment',
  'peace', 'peaceful', 'calm', 'serene', 'tranquil', 'relaxed',
  'satisfied', 'satisfaction', 'fulfilled', 'gratitude', 'grateful',
  'hope', 'hopeful', 'optimistic', 'confident', 'empowered',
  'strong', 'resilient', 'capable', 'competent', 'mastery',
  'free', 'freedom', 'liberated', 'autonomous', 'independent',
  'connected', 'bonded', 'united', 'together', 'supported',
  'loved', 'cared for', 'nurtured', 'cherished', 'valued',
  'meaningful work', 'genuine connection', 'true belonging',
  'real community', 'authentic relationship', 'deep bond'
];

// Negative context patterns
const negativeContextPatterns = [
  /proxy for \w+/g,
  /substitute for \w+/g,
  /lack of \w+/g,
  /absence of \w+/g,
  /loss of \w+/g,
  /missing \w+/g,
  /without \w+/g,
  /no (real|genuine|true|authentic)/g,
  /at the expense of/g,
  /instead of (real|genuine|true)/g,
  /not (truly|really|genuinely)/g,
  /false sense of/g,
  /illusion of/g
];

const strongProblemWords = ['mismatch', 'proxy', 'trap', 'exploitation', 'dysfunction', 'toxic'];

function debugClassify(image) {
  const desc = (image.analysis?.visual_description || '').toLowerCase();
  
  // Check for comparison pattern
  const comparisonPattern = /before.*after|before demismatch.*after demismatch|left.*right|two.*(panel|section|side)|split.?panel|divided into|side.by.side/i;
  const isComparison = comparisonPattern.test(desc);
  
  // Build combined text
  const text = [
    image.analysis?.visual_description,
    image.analysis?.meaning_interpretation,
    image.analysis?.emotional_analysis,
    image.analysis?.content_description
  ].join(' ').toLowerCase();
  
  // Count problem words
  const problemMatches = problemWords.filter(w => text.includes(w));
  let probScore = problemMatches.length;
  
  // Count solution words
  const solutionMatches = solutionWords.filter(w => text.includes(w));
  let solScore = solutionMatches.length;
  
  // Check for negative context patterns
  let negativeContextCount = 0;
  const negativeContextFound = [];
  for (const pattern of negativeContextPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      negativeContextCount += matches.length;
      negativeContextFound.push(...matches);
    }
  }
  probScore += negativeContextCount * 3;
  
  // Strong problem word bonus
  const strongMatches = strongProblemWords.filter(w => text.includes(w));
  probScore += strongMatches.length * 2;
  
  // Classification
  const classification = probScore >= solScore ? 'problem' : 'solution';
  
  return {
    title: image.analysis?.text_title || image.file_name,
    currentType: image.image_type,
    isComparison,
    text: text.substring(0, 500) + '...',
    problemMatches,
    solutionMatches,
    negativeContextFound,
    probScore,
    solScore,
    classification: isComparison ? 'comparison' : classification
  };
}

async function main() {
  console.log('Fetching masterlist...\n');
  
  const response = await fetch(MASTERLIST_URL);
  const masterlist = await response.json();
  
  console.log(`Loaded ${masterlist.images.length} images\n`);
  console.log('='.repeat(80));
  
  for (const testTitle of TEST_TITLES) {
    const image = masterlist.images.find(img => 
      (img.analysis?.text_title || img.file_name || '').toUpperCase().includes(testTitle.toUpperCase())
    );
    
    if (!image) {
      console.log(`\n❌ NOT FOUND: "${testTitle}"`);
      continue;
    }
    
    const debug = debugClassify(image);
    
    console.log(`\n📷 "${debug.title}" (ID: ${image.id})`);
    console.log(`   Current type in DB: ${debug.currentType}`);
    console.log(`   Is comparison pattern: ${debug.isComparison}`);
    console.log(`\n   PROBLEM words found (${debug.problemMatches.length}):`);
    console.log(`   ${debug.problemMatches.length > 0 ? debug.problemMatches.join(', ') : '(none)'}`);
    console.log(`\n   SOLUTION words found (${debug.solutionMatches.length}):`);
    console.log(`   ${debug.solutionMatches.length > 0 ? debug.solutionMatches.join(', ') : '(none)'}`);
    console.log(`\n   NEGATIVE CONTEXT patterns found:`);
    console.log(`   ${debug.negativeContextFound.length > 0 ? debug.negativeContextFound.join(', ') : '(none)'}`);
    console.log(`\n   SCORES: problem=${debug.probScore}, solution=${debug.solScore}`);
    console.log(`\n   → Classification: ${debug.classification}`);
    console.log(`   → Expected: problem`);
    console.log(`   → ${debug.classification === 'problem' ? '✅ CORRECT' : '❌ WRONG'}`);
    console.log('\n' + '-'.repeat(80));
  }
  
  // Also show some stats
  console.log('\n\n=== CHECKING FOR SYSTEMATIC ISSUES ===\n');
  
  let wrongCount = 0;
  const wrongExamples = [];
  
  for (const image of masterlist.images) {
    const debug = debugClassify(image);
    
    // Check if solution has more problem words than solution words
    if (image.image_type === 'solution' && debug.probCount > debug.solCount && !debug.isComparison) {
      wrongCount++;
      if (wrongExamples.length < 10) {
        wrongExamples.push({
          title: debug.title,
          probCount: debug.probCount,
          solCount: debug.solCount,
          problemMatches: debug.problemMatches.slice(0, 5)
        });
      }
    }
  }
  
  console.log(`Found ${wrongCount} "solution" images that have MORE problem words than solution words!\n`);
  console.log('Examples:');
  for (const ex of wrongExamples) {
    console.log(`  - "${ex.title}": problem=${ex.probCount}, solution=${ex.solCount} (${ex.problemMatches.join(', ')})`);
  }
}

main().catch(console.error);

