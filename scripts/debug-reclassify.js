#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ivlbjochxaupsblqdwyq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2];
const MASTERLIST_URL = 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-data/masterlist.json';

const TEST_TITLES = ['THE WORK MARTYR', 'THE SUNDAY SCARIES', 'THE WELLNESS'];

// Classification function
function classifyImage(image) {
  const desc = (image.analysis?.visual_description || '').toLowerCase();
  
  const comparisonPattern = /before.*after|before demismatch.*after demismatch|left.*right|two.*(panel|section|side)|split.?panel|divided into|side.by.side/i;
  if (comparisonPattern.test(desc)) {
    return 'comparison';
  }
  
  const text = [
    image.analysis?.visual_description,
    image.analysis?.meaning_interpretation,
    image.analysis?.emotional_analysis,
    image.analysis?.content_description
  ].join(' ').toLowerCase();
  
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
  
  let probScore = 0;
  for (const word of problemWords) {
    if (text.includes(word)) probScore += 1;
  }
  
  let solScore = 0;
  for (const word of solutionWords) {
    if (text.includes(word)) solScore += 1;
  }
  
  let negativeContextCount = 0;
  for (const pattern of negativeContextPatterns) {
    const matches = text.match(pattern);
    if (matches) negativeContextCount += matches.length;
  }
  probScore += negativeContextCount * 3;
  
  const strongProblemWords = ['mismatch', 'proxy', 'trap', 'exploitation', 'dysfunction', 'toxic'];
  for (const word of strongProblemWords) {
    if (text.includes(word)) probScore += 2;
  }
  
  return probScore >= solScore ? 'problem' : 'solution';
}

async function main() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('STEP 1: FETCHING MASTERLIST FROM SUPABASE');
  console.log('='.repeat(60));
  
  const response = await fetch(MASTERLIST_URL + '?t=' + Date.now());
  const masterlist = await response.json();
  console.log(`Loaded ${masterlist.images.length} images\n`);

  // Find test images and log BEFORE state
  console.log('='.repeat(60));
  console.log('STEP 2: BEFORE RECLASSIFICATION - TEST IMAGES');
  console.log('='.repeat(60));
  
  const testImages = [];
  for (const title of TEST_TITLES) {
    const img = masterlist.images.find(i => 
      (i.analysis?.text_title || i.file_name || '').toUpperCase().includes(title.toUpperCase())
    );
    if (img) {
      testImages.push(img);
      console.log(`\n  "${img.analysis?.text_title || img.file_name}" (ID: ${img.id})`);
      console.log(`  BEFORE image_type: "${img.image_type}"`);
    } else {
      console.log(`\n  ❌ NOT FOUND: "${title}"`);
    }
  }

  // Count original distribution
  const originalCounts = { problem: 0, solution: 0, comparison: 0 };
  for (const img of masterlist.images) {
    const type = img.image_type || 'unknown';
    if (originalCounts[type] !== undefined) originalCounts[type]++;
  }
  console.log('\n\nOriginal counts:', originalCounts);

  // RECLASSIFY
  console.log('\n' + '='.repeat(60));
  console.log('STEP 3: RECLASSIFYING ALL IMAGES');
  console.log('='.repeat(60));
  
  for (const img of masterlist.images) {
    const newType = classifyImage(img);
    img.image_type = newType; // MUTATE THE OBJECT
  }
  console.log('Reclassification complete.\n');

  // Log AFTER state for test images
  console.log('='.repeat(60));
  console.log('STEP 4: AFTER RECLASSIFICATION - TEST IMAGES');
  console.log('='.repeat(60));
  
  for (const img of testImages) {
    console.log(`\n  "${img.analysis?.text_title || img.file_name}" (ID: ${img.id})`);
    console.log(`  AFTER image_type: "${img.image_type}"`);
  }

  // Count new distribution
  const newCounts = { problem: 0, solution: 0, comparison: 0 };
  for (const img of masterlist.images) {
    const type = img.image_type;
    if (newCounts[type] !== undefined) newCounts[type]++;
  }
  console.log('\n\nNew counts:', newCounts);

  // UPLOAD
  console.log('\n' + '='.repeat(60));
  console.log('STEP 5: UPLOADING TO SUPABASE');
  console.log('='.repeat(60));
  
  masterlist.reclassified_at = new Date().toISOString();
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const jsonContent = JSON.stringify(masterlist, null, 2);
  const buffer = Buffer.from(jsonContent, 'utf-8');
  
  console.log(`\nJSON size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
  
  const { data, error } = await supabase.storage
    .from('mismatch-data')
    .upload('masterlist.json', buffer, {
      upsert: true,
      contentType: 'application/json',
      cacheControl: 'no-cache'
    });

  if (error) {
    console.error('Upload error:', error);
    process.exit(1);
  }
  
  console.log('Upload successful!\n');

  // VERIFY
  console.log('='.repeat(60));
  console.log('STEP 6: VERIFYING UPLOAD');
  console.log('='.repeat(60));
  
  // Wait a moment for propagation
  await new Promise(r => setTimeout(r, 1000));
  
  const verifyResponse = await fetch(MASTERLIST_URL + '?t=' + Date.now());
  const verifyMasterlist = await verifyResponse.json();
  
  console.log(`\nreclassified_at in uploaded file: ${verifyMasterlist.reclassified_at}`);
  
  for (const title of TEST_TITLES) {
    const img = verifyMasterlist.images.find(i => 
      (i.analysis?.text_title || i.file_name || '').toUpperCase().includes(title.toUpperCase())
    );
    if (img) {
      console.log(`\n  "${img.analysis?.text_title || img.file_name}"`);
      console.log(`  VERIFIED image_type: "${img.image_type}"`);
    }
  }

  const verifyCounts = { problem: 0, solution: 0, comparison: 0 };
  for (const img of verifyMasterlist.images) {
    const type = img.image_type;
    if (verifyCounts[type] !== undefined) verifyCounts[type]++;
  }
  console.log('\n\nVerified counts:', verifyCounts);
  
  console.log('\n' + '='.repeat(60));
  console.log('DONE');
  console.log('='.repeat(60));
}

main().catch(console.error);

