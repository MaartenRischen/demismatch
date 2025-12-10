#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Path to masterlist.json
const MASTERLIST_PATH = '/Users/maartenrischen/Desktop/Filesophy/mismatch-library/backend/data/masterlist.json';

// Two-panel patterns for COMPARISON classification
const twoPanelPatterns = [
  /before.*after/i,
  /before demismatch.*after demismatch/i,
  /left.*right/i,
  /two (panel|section|scene|part|side)/i,
  /split.?panel/i,
  /divided into/i,
  /side.by.side/i,
  /juxtapos/i,
  /comparing|compares|comparison of/i,
  /\btwo\b.*\b(images?|pictures?|panels?|scenes?)\b/i,
  /first.*second/i,
  /one side.*other side/i,
  /contrast.*between/i,
];

// Negative indicators for PROBLEM classification
const negativeIndicators = [
  'mismatch', 'problem', 'negative', 'anxiety', 'stress', 'isolation',
  'loneliness', 'dysfunction', 'exploitation', 'harmful', 'trap',
  'false', 'proxy', 'unfulfilled', 'inadequate', 'toxic', 'emptiness',
  'disconnection', 'artificial', 'superficial', 'addictive', 'addiction',
  'depression', 'despair', 'suffering', 'pain', 'fear', 'worry',
  'overwhelm', 'burnout', 'exhaustion', 'shame', 'guilt', 'failure',
  'rejection', 'abandoned', 'excluded', 'distrust', 'betrayal',
  'meaningless', 'hollow', 'numb', 'boredom', 'existential crisis',
  'lonely', 'alone', 'alienation', 'withdrawn', 'disorientation',
  'doom', 'dread', 'panic', 'nervous', 'unease', 'threat',
  'danger', 'hypervigilance', 'confusion', 'chaos', 'overload',
  'breakdown', 'crisis', 'struggle', 'conflict', 'fight',
  'lost', 'stuck', 'trapped', 'powerless', 'helpless',
  'broken', 'damaged', 'hurt', 'wounded', 'scarred',
  'misaligned', 'disconnect', 'out of touch', 'detached',
  'unfulfilling', 'unsatisfying', 'empty', 'void', 'missing',
  'lacking', 'deficient', 'incomplete', 'fragmented',
  'modern problem', 'evolutionary trap', 'maladaptive'
];

// Positive indicators for SOLUTION classification
const positiveIndicators = [
  'solution', 'positive', 'demismatch', 'fulfillment', 'connection',
  'authentic', 'genuine', 'tribal', 'community', 'meaningful',
  'healthy', 'resolution', 'aligned', 'belonging', 'purpose',
  'real bond', 'true connection', 'natural', 'ancestral',
  'well-being', 'wellbeing', 'thriving', 'flourishing', 'growth',
  'healing', 'recovery', 'improvement', 'progress', 'success',
  'harmony', 'balance', 'peace', 'calm', 'serenity', 'tranquil',
  'joy', 'happiness', 'contentment', 'satisfaction', 'gratitude',
  'love', 'warmth', 'affection', 'care', 'support', 'trust',
  'friendship', 'companionship', 'kinship', 'solidarity',
  'engagement', 'involvement', 'participation', 'contribution',
  'achievement', 'accomplishment', 'mastery', 'competence',
  'freedom', 'autonomy', 'self-determination', 'agency',
  'hope', 'optimism', 'confidence', 'resilience', 'strength',
  'wisdom', 'insight', 'understanding', 'clarity', 'awareness',
  'integration', 'wholeness', 'unity', 'coherence',
  'evolutionary solution', 'fix', 'remedy', 'intervention',
  'de-mismatch', 'realignment', 'restore', 'reconnect'
];

function classifyImage(image) {
  const desc = image.analysis?.visual_description?.toLowerCase() || '';
  const meaning = image.analysis?.meaning_interpretation?.toLowerCase() || '';
  const emotional = image.analysis?.emotional_analysis?.toLowerCase() || '';
  const content = image.analysis?.content_description?.toLowerCase() || '';
  const title = (image.analysis?.text_title || image.file_name || '').toLowerCase();
  
  // Combine all text for sentiment analysis
  const fullText = `${desc} ${meaning} ${emotional} ${content} ${title}`;
  
  // COMPARISON: Check for actual two-panel before/after images
  if (twoPanelPatterns.some(p => p.test(desc))) {
    return 'comparison';
  }
  
  // Also check title for "before" and "after" patterns
  if (title.includes('before') && title.includes('after')) {
    return 'comparison';
  }
  
  // Check description for split-panel visual cues
  if (
    desc.includes('two panels') ||
    desc.includes('two-panel') ||
    desc.includes('split panel') ||
    desc.includes('split screen') ||
    desc.includes('divided into two') ||
    desc.includes('on the left') && desc.includes('on the right')
  ) {
    return 'comparison';
  }
  
  // PROBLEM vs SOLUTION: Check sentiment of single-panel images
  const negCount = negativeIndicators.filter(w => fullText.includes(w)).length;
  const posCount = positiveIndicators.filter(w => fullText.includes(w)).length;
  
  // Weight the counts - title matches are stronger signals
  const titleNegCount = negativeIndicators.filter(w => title.includes(w)).length;
  const titlePosCount = positiveIndicators.filter(w => title.includes(w)).length;
  
  const totalNeg = negCount + (titleNegCount * 2);
  const totalPos = posCount + (titlePosCount * 2);
  
  if (totalNeg > totalPos) return 'problem';
  if (totalPos > totalNeg) return 'solution';
  
  // Default to problem if unclear (most images depict mismatches)
  return 'problem';
}

function main() {
  console.log('Loading masterlist.json...');
  
  if (!fs.existsSync(MASTERLIST_PATH)) {
    console.error(`Error: masterlist.json not found at ${MASTERLIST_PATH}`);
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(MASTERLIST_PATH, 'utf-8'));
  
  // Track original distribution
  const originalDist = {};
  for (const img of data.images) {
    originalDist[img.image_type] = (originalDist[img.image_type] || 0) + 1;
  }
  
  console.log('\n=== ORIGINAL DISTRIBUTION ===');
  for (const [type, count] of Object.entries(originalDist).sort()) {
    console.log(`  ${type}: ${count}`);
  }
  
  // Reclassify
  console.log('\nReclassifying images...');
  const changes = { problem: 0, solution: 0, comparison: 0 };
  const changedImages = [];
  
  for (const img of data.images) {
    const oldType = img.image_type;
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
  for (const img of data.images) {
    newDist[img.image_type] = (newDist[img.image_type] || 0) + 1;
  }
  
  console.log('\n=== NEW DISTRIBUTION ===');
  for (const [type, count] of Object.entries(newDist).sort()) {
    console.log(`  ${type}: ${count}`);
  }
  
  console.log(`\n=== CHANGES ===`);
  console.log(`  Total images changed: ${changedImages.length}`);
  
  // Show sample changes
  console.log('\n=== SAMPLE CHANGES (first 20) ===');
  for (const change of changedImages.slice(0, 20)) {
    console.log(`  [${change.id}] "${change.title}": ${change.oldType} → ${change.newType}`);
  }
  
  // Backup original
  const backupPath = MASTERLIST_PATH.replace('.json', '_backup.json');
  console.log(`\nBacking up original to: ${backupPath}`);
  fs.writeFileSync(backupPath, fs.readFileSync(MASTERLIST_PATH));
  
  // Save updated masterlist
  console.log(`Saving updated masterlist to: ${MASTERLIST_PATH}`);
  data.generated_at = new Date().toISOString();
  fs.writeFileSync(MASTERLIST_PATH, JSON.stringify(data, null, 2));
  
  console.log('\n✓ Done! Masterlist updated.');
}

main();

