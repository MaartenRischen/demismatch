#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ivlbjochxaupsblqdwyq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2];
const MASTERLIST_URL = 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-data/masterlist.json';

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function main() {
  console.log('='.repeat(60));
  console.log('SYNCING image_type FROM MASTERLIST.JSON TO DATABASE');
  console.log('='.repeat(60));

  // Fetch masterlist
  console.log('\n1. Fetching masterlist.json from storage...');
  const response = await fetch(MASTERLIST_URL + '?t=' + Date.now());
  const masterlist = await response.json();
  console.log(`   Loaded ${masterlist.images.length} images`);

  // Connect to database
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Get current database state for test images
  console.log('\n2. Checking current database state...');
  const testIds = [1251, 612, 242]; // THE WORK MARTYR, THE SUNDAY SCARIES, THE WELLNESS CULT
  
  const { data: beforeData } = await supabase
    .from('image_embeddings')
    .select('id, file_name, image_type')
    .in('id', testIds);
  
  console.log('\n   BEFORE update (from database):');
  for (const row of beforeData || []) {
    console.log(`     ID ${row.id}: image_type = "${row.image_type}"`);
  }

  // Count current distribution in database
  const { data: allBefore } = await supabase
    .from('image_embeddings')
    .select('image_type');
  
  const beforeCounts = { problem: 0, solution: 0, comparison: 0, explanation: 0, null: 0 };
  for (const row of allBefore || []) {
    const type = row.image_type || 'null';
    beforeCounts[type] = (beforeCounts[type] || 0) + 1;
  }
  console.log('\n   Database counts BEFORE:', beforeCounts);

  // Update database with masterlist values
  console.log('\n3. Updating database with masterlist image_type values...');
  
  let updated = 0;
  let errors = 0;
  
  // Process in batches
  const batchSize = 100;
  for (let i = 0; i < masterlist.images.length; i += batchSize) {
    const batch = masterlist.images.slice(i, i + batchSize);
    
    for (const img of batch) {
      const { error } = await supabase
        .from('image_embeddings')
        .update({ image_type: img.image_type })
        .eq('id', img.id);
      
      if (error) {
        errors++;
        if (errors <= 5) console.error(`   Error updating ID ${img.id}:`, error.message);
      } else {
        updated++;
      }
    }
    
    process.stdout.write(`\r   Progress: ${Math.min(i + batchSize, masterlist.images.length)}/${masterlist.images.length}`);
  }
  
  console.log(`\n   Updated: ${updated}, Errors: ${errors}`);

  // Verify update
  console.log('\n4. Verifying update...');
  
  const { data: afterData } = await supabase
    .from('image_embeddings')
    .select('id, file_name, image_type')
    .in('id', testIds);
  
  console.log('\n   AFTER update (from database):');
  for (const row of afterData || []) {
    console.log(`     ID ${row.id}: image_type = "${row.image_type}"`);
  }

  // Count new distribution
  const { data: allAfter } = await supabase
    .from('image_embeddings')
    .select('image_type');
  
  const afterCounts = { problem: 0, solution: 0, comparison: 0, explanation: 0, null: 0 };
  for (const row of allAfter || []) {
    const type = row.image_type || 'null';
    afterCounts[type] = (afterCounts[type] || 0) + 1;
  }
  console.log('\n   Database counts AFTER:', afterCounts);

  console.log('\n' + '='.repeat(60));
  console.log('DONE');
  console.log('='.repeat(60));
}

main().catch(console.error);

