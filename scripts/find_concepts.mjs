import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envContent = readFileSync('/Users/maartenrischen/SQUARETRUTHS/.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) envVars[m[1]] = m[2];
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const UNUSED_SERIES = [
  "The Sequencing", "Dashboard Calibrated", "Meaning & Purpose 100",
  "The Trap Recognized", "The Bridge", "The Same Scene Two Eyes",
  "Utopia", "Misc", "Work Rest & Productivity",
  "The Mismatch Answer 100 DEMISMATCH TECH VOL6",
  "The Mismatch Answer 100 REAL THING VOL7", "The Mismatch Answer 100 VOL3",
  "The Mismatch Answer", "Dystopia", "Money & Status",
  "The Mismatch Actually 100 EVERYONE WRONG VOL11"
];

async function findImages() {
  const allData = [];
  let offset = 0;
  while (true) {
    const { data } = await supabase
      .from('image_embeddings')
      .select('file_name, series')
      .range(offset, offset + 999)
      .order('file_name');
    if (!data || data.length === 0) break;
    allData.push(...data);
    offset += 1000;
    if (data.length < 1000) break;
  }

  const usable = allData.filter(img => {
    if (!img.series || img.series.length === 0) return true;
    return !img.series.every(s => UNUSED_SERIES.includes(s));
  });

  console.log(`Total usable: ${usable.length}`);

  // Find images for key concepts
  const concepts = ['TRIBE', 'BELONG', 'INTIMA', 'EXERCISE', 'MOVE', 'VULN', 'RUMINA', 'OVERTHIN', 'CAMPFIRE', 'FIRE', 'CIRCADIAN', 'SLEEP', 'MORNING', 'GATHER', 'LOOP', 'CLOSE', 'FINISH', 'PURPOSE', 'MEANING', 'MISMATCH', 'ANXIETY', 'DEPRESS', 'LONELY'];

  for (const concept of concepts) {
    const matches = usable.filter(img => img.file_name.toUpperCase().includes(concept));
    console.log(`\n${concept}: ${matches.length} images`);
    matches.slice(0, 4).forEach(m => console.log(`  ${m.file_name}`));
  }
}
findImages();
