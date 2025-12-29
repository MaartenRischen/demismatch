import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

// Read env from .env.local
const envContent = readFileSync('/Users/maartenrischen/SQUARETRUTHS/.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2];
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Connecting to Supabase...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAllImages() {
  const allData = [];
  const pageSize = 1000;
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    console.log(`Fetching images ${offset} to ${offset + pageSize}...`);
    const { data, error } = await supabase
      .from('image_embeddings')
      .select('id, file_name, folder_name, title, image_url')
      .range(offset, offset + pageSize - 1)
      .order('id');

    if (error) {
      console.error('Error:', error);
      break;
    }

    if (data && data.length > 0) {
      allData.push(...data);
      offset += pageSize;
      hasMore = data.length === pageSize;
    } else {
      hasMore = false;
    }
  }

  console.log(`Total images fetched: ${allData.length}`);
  return allData;
}

async function updatePreselections() {
  // Load data
  const questionData = JSON.parse(readFileSync('/private/tmp/new_question_data.json', 'utf8'));
  const imageMap = JSON.parse(readFileSync('/private/tmp/generated_imagemap.json', 'utf8'));

  console.log(`Loaded ${questionData.length} questions`);
  console.log(`Loaded imageMap with ${Object.keys(imageMap).length} entries`);

  // Fetch all images to get metadata
  const allImages = await fetchAllImages();

  // Create URL to image lookup
  const urlToImage = {};
  for (const img of allImages) {
    const url = img.image_url || `${supabaseUrl}/storage/v1/object/public/mismatch-images/${img.folder_name}/${img.file_name}`;
    urlToImage[url] = img;
  }
  console.log(`Created URL lookup with ${Object.keys(urlToImage).length} entries`);

  // Update each question's preselected
  let updated = 0;
  for (const q of questionData) {
    const urls = imageMap[String(q.id)];
    if (urls && urls.length > 0) {
      // Convert URLs to image objects
      const preselected = [];
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const img = urlToImage[url];
        if (img) {
          preselected.push({
            id: img.id,
            file_name: img.file_name,
            folder_name: img.folder_name,
            title: img.title || img.file_name,
            image_url: url,
            score: 100 - i // Decreasing score based on position
          });
        } else {
          // Image not found in database, create minimal entry
          const parts = url.split('/');
          const fileName = parts[parts.length - 1];
          const folderName = parts[parts.length - 2];
          preselected.push({
            id: 0,
            file_name: fileName,
            folder_name: folderName,
            title: fileName.replace(/^\d+_/, '').replace('.png', '').replace(/_/g, ' '),
            image_url: url,
            score: 100 - i
          });
        }
      }
      q.preselected = preselected;
      updated++;
    }
  }

  console.log(`Updated ${updated} questions with new preselections`);

  // Save updated data
  writeFileSync('/private/tmp/updated_question_data.json', JSON.stringify(questionData, null, 2));
  console.log('Saved to /private/tmp/updated_question_data.json');

  // Show sample
  const q21 = questionData.find(q => q.id === 21);
  console.log('\n--- Sample Q21 ---');
  console.log('Question:', q21?.question);
  console.log('Preselected count:', q21?.preselected?.length);
  console.log('Top 3:');
  q21?.preselected?.slice(0, 3).forEach((img, i) => {
    console.log(`  ${i+1}. ${img.file_name} (id: ${img.id})`);
  });
}

updatePreselections().catch(console.error);
