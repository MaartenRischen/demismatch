import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

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

// Q30 keywords
const keywords = {
  primary: ['bullshit', 'meaningless', 'pointless', 'tangible'],
  secondary: ['job', 'work', 'useless', 'contribut', 'benefit']
};

function scoreImage(img, kw) {
  const titleLower = (img.file_name || '').toLowerCase();
  const bodyLower = (img.search_text || img.title || '').toLowerCase();
  let score = 0;
  for (const k of kw.primary || []) {
    if (titleLower.includes(k)) score += 200;
    if (bodyLower.includes(k)) score += 30;
  }
  for (const k of kw.secondary || []) {
    if (titleLower.includes(k)) score += 50;
    if (bodyLower.includes(k)) score += 10;
  }
  return score;
}

async function trace() {
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

  const usable = allData.filter(img => !isUnused(img));
  console.log('Total usable images:', usable.length);

  // Score for Q30
  const scored = usable.map(img => ({ img, score: scoreImage(img, keywords) }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  console.log('\nQ30 - Top 15 scored images:');
  scored.slice(0, 15).forEach((s, i) => {
    console.log(`  ${i+1}. ${s.score}: ${s.img.file_name}`);
  });

  // Check if BULLSHIT_JOB is in scored
  const bullshit = scored.filter(s => s.img.file_name.includes('BULLSHIT'));
  console.log('\nBULLSHIT_JOB images in scored:', bullshit.length);
  bullshit.forEach(s => console.log('  ', s.score, s.img.file_name));
}
trace();
