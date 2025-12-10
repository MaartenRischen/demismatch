#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ivlbjochxaupsblqdwyq.supabase.co';
// Accept service role key from env var or command line arg
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2];
const MASTERLIST_URL = 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-data/masterlist.json';

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY not provided');
  console.error('\nUsage:');
  console.error('  Option 1: node scripts/reclassify-masterlist-supabase.js <service_role_key>');
  console.error('  Option 2: export SUPABASE_SERVICE_ROLE_KEY=your_key && node scripts/reclassify-masterlist-supabase.js');
  console.error('\nGet your service role key from:');
  console.error('  Supabase Dashboard > Project Settings > API > service_role key');
  process.exit(1);
}

// Classification function
function classifyImage(image) {
  const desc = (image.analysis?.visual_description || '').toLowerCase();
  
  // COMPARISON: Two-panel before/after images
  const comparisonPattern = /before.*after|before demismatch.*after demismatch|left.*right|two.*(panel|section|side)|split.?panel|divided into|side.by.side/i;
  if (comparisonPattern.test(desc)) {
    return 'comparison';
  }
  
  // For single-panel: check sentiment
  const text = [
    image.analysis?.visual_description,
    image.analysis?.meaning_interpretation,
    image.analysis?.emotional_analysis,
    image.analysis?.content_description
  ].join(' ').toLowerCase();
  
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
  
  // Negative context patterns that negate solution words
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
  
  // Count problem words (each match = 1 point)
  let probScore = 0;
  for (const word of problemWords) {
    if (text.includes(word)) {
      probScore += 1;
    }
  }
  
  // Count solution words (each match = 1 point)
  let solScore = 0;
  for (const word of solutionWords) {
    if (text.includes(word)) {
      solScore += 1;
    }
  }
  
  // Check for negative context patterns - these indicate the image is about PROBLEMS
  // even if solution words appear (e.g., "proxy for belonging" is a problem)
  let negativeContextCount = 0;
  for (const pattern of negativeContextPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      negativeContextCount += matches.length;
    }
  }
  
  // If negative context patterns are found, boost problem score significantly
  probScore += negativeContextCount * 3;
  
  // Strong problem indicators get extra weight
  const strongProblemWords = ['mismatch', 'proxy', 'trap', 'exploitation', 'dysfunction', 'toxic'];
  for (const word of strongProblemWords) {
    if (text.includes(word)) {
      probScore += 2; // Extra weight for definitive problem indicators
    }
  }
  
  // Default to problem if scores are equal or close
  // (most images in this collection are about problems/mismatches)
  return probScore >= solScore ? 'problem' : 'solution';
}

async function main() {
  console.log('Fetching masterlist.json from Supabase...');
  
  // Fetch masterlist from public URL
  let masterlist;
  try {
    const response = await fetch(MASTERLIST_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch masterlist: ${response.status} ${response.statusText}`);
    }
    masterlist = await response.json();
    console.log(`✓ Loaded ${masterlist.images?.length || 0} images`);
  } catch (error) {
    console.error('Error fetching masterlist:', error.message);
    process.exit(1);
  }
  
  // Track original distribution
  const originalDist = {};
  for (const img of masterlist.images || []) {
    const type = img.image_type || 'unknown';
    originalDist[type] = (originalDist[type] || 0) + 1;
  }
  
  console.log('\n=== ORIGINAL DISTRIBUTION ===');
  for (const [type, count] of Object.entries(originalDist).sort()) {
    console.log(`  ${type}: ${count}`);
  }
  
  // Reclassify
  console.log('\nReclassifying images...');
  const changes = { problem: 0, solution: 0, comparison: 0 };
  const changedImages = [];
  
  for (const img of masterlist.images || []) {
    const oldType = img.image_type || 'unknown';
    const newType = classifyImage(img);
    
    if (oldType !== newType) {
      changedImages.push({
        id: img.id,
        title: img.analysis?.text_title || img.file_name,
        oldType,
        newType
      });
    }
    
    img.image_type = newType;
    changes[newType]++;
  }
  
  // Track new distribution
  const newDist = {};
  for (const img of masterlist.images || []) {
    const type = img.image_type;
    newDist[type] = (newDist[type] || 0) + 1;
  }
  
  console.log('\n=== NEW DISTRIBUTION ===');
  for (const [type, count] of Object.entries(newDist).sort()) {
    console.log(`  ${type}: ${count}`);
  }
  
  console.log(`\n=== CHANGES ===`);
  console.log(`  Total images changed: ${changedImages.length}`);
  
  // Show sample changes
  if (changedImages.length > 0) {
    console.log('\n=== SAMPLE CHANGES (first 20) ===');
    for (const change of changedImages.slice(0, 20)) {
      console.log(`  [${change.id}] "${change.title}": ${change.oldType} → ${change.newType}`);
    }
  }
  
  // Update metadata
  masterlist.generated_at = new Date().toISOString();
  masterlist.reclassified_at = new Date().toISOString();
  
  // Upload back to Supabase
  console.log('\nUploading reclassified masterlist to Supabase...');
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Convert to JSON string and then to Buffer
    const jsonContent = JSON.stringify(masterlist, null, 2);
    const buffer = Buffer.from(jsonContent, 'utf-8');
    
    // Upload to storage (use Buffer for binary upload)
    const { data, error } = await supabase.storage
      .from('mismatch-data')
      .upload('masterlist.json', buffer, {
        upsert: true,
        contentType: 'application/json',
        cacheControl: 'no-cache'
      });
    
    if (error) {
      throw error;
    }
    
    console.log('✓ Successfully uploaded masterlist.json to Supabase storage');
    console.log(`  Path: mismatch-data/masterlist.json`);
    
    // Verify upload by fetching public URL
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/mismatch-data/masterlist.json`;
    console.log(`  Public URL: ${publicUrl}`);
    
  } catch (error) {
    console.error('Error uploading to Supabase:', error.message);
    console.error('Full error:', error);
    
    // Save locally as backup
    const backupPath = './masterlist_reclassified_backup.json';
    fs.writeFileSync(backupPath, JSON.stringify(masterlist, null, 2));
    console.log(`\nSaved backup to: ${backupPath}`);
    
    process.exit(1);
  }
  
  console.log('\n✓ Done! Masterlist reclassified and uploaded to Supabase.');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

