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
  
  const problemWords = [
    'mismatch', 'problem', 'anxiety', 'stress', 'isolation', 'loneliness',
    'dysfunction', 'exploitation', 'trap', 'proxy', 'unfulfilled', 'toxic',
    'emptiness', 'disconnection', 'artificial', 'superficial', 'addictive',
    'suffering', 'inadequacy', 'alienation'
  ];
  
  const solutionWords = [
    'solution', 'demismatch', 'fulfillment', 'connection', 'authentic',
    'genuine', 'tribal', 'community', 'meaningful', 'healthy', 'aligned',
    'belonging', 'purpose', 'thriving', 'well-being', 'restoration'
  ];
  
  const probCount = problemWords.filter(w => text.includes(w)).length;
  const solCount = solutionWords.filter(w => text.includes(w)).length;
  
  return probCount > solCount ? 'problem' : 'solution';
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
    
    // Convert to JSON string
    const jsonContent = JSON.stringify(masterlist, null, 2);
    
    // Upload to storage
    const { data, error } = await supabase.storage
      .from('mismatch-data')
      .upload('masterlist.json', jsonContent, {
        upsert: true,
        contentType: 'application/json'
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

