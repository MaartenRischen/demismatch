#!/usr/bin/env node
/**
 * Rebuild Taxonomy Index
 * 
 * Generates taxonomy_index.json from the database, including all categories,
 * series, and framework concepts.
 * 
 * Usage:
 *   node rebuild-taxonomy-index.js <SUPABASE_SERVICE_ROLE_KEY>
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ivlbjochxaupsblqdwyq.supabase.co';
const MASTERLIST_BUCKET = 'mismatch-data';
const TAXONOMY_PATH = 'taxonomy_index.json';

async function rebuildTaxonomyIndex(serviceRoleKey) {
    console.log('\n=== Rebuild Taxonomy Index ===\n');

    const supabase = createClient(SUPABASE_URL, serviceRoleKey, {
        auth: { persistSession: false }
    });

    // 1. Fetch all images from database
    console.log('1. Fetching all images from database...');
    const allImages = [];
    const pageSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('image_embeddings')
            .select('id, categories, series, framework_concepts')
            .range(offset, offset + pageSize - 1)
            .order('id');

        if (error) {
            console.error('Error fetching images:', error);
            process.exit(1);
        }

        if (data && data.length > 0) {
            allImages.push(...data);
            offset += pageSize;
            hasMore = data.length === pageSize;
        } else {
            hasMore = false;
        }
    }

    console.log(`   Fetched ${allImages.length} images`);

    // 2. Build taxonomy index
    console.log('\n2. Building taxonomy index...');
    const by_category = {};
    const by_series = {};
    const by_framework_concept = {};

    for (const image of allImages) {
        const imageId = image.id;

        // Process categories
        if (image.categories && Array.isArray(image.categories)) {
            for (const category of image.categories) {
                if (category && typeof category === 'string') {
                    if (!by_category[category]) {
                        by_category[category] = [];
                    }
                    if (!by_category[category].includes(imageId)) {
                        by_category[category].push(imageId);
                    }
                }
            }
        }

        // Process series
        if (image.series && Array.isArray(image.series)) {
            for (const series of image.series) {
                if (series && typeof series === 'string') {
                    if (!by_series[series]) {
                        by_series[series] = [];
                    }
                    if (!by_series[series].includes(imageId)) {
                        by_series[series].push(imageId);
                    }
                }
            }
        }

        // Process framework concepts
        if (image.framework_concepts && Array.isArray(image.framework_concepts)) {
            for (const concept of image.framework_concepts) {
                if (concept && typeof concept === 'string') {
                    if (!by_framework_concept[concept]) {
                        by_framework_concept[concept] = [];
                    }
                    if (!by_framework_concept[concept].includes(imageId)) {
                        by_framework_concept[concept].push(imageId);
                    }
                }
            }
        }
    }

    // Sort IDs in each array
    for (const category in by_category) {
        by_category[category].sort((a, b) => a - b);
    }
    for (const series in by_series) {
        by_series[series].sort((a, b) => a - b);
    }
    for (const concept in by_framework_concept) {
        by_framework_concept[concept].sort((a, b) => a - b);
    }

    const taxonomyIndex = {
        by_category,
        by_series,
        by_framework_concept
    };

    console.log(`   Found ${Object.keys(by_category).length} categories`);
    console.log(`   Found ${Object.keys(by_series).length} series`);
    console.log(`   Found ${Object.keys(by_framework_concept).length} framework concepts`);

    // 3. Show distribution
    console.log('\n=== Series Distribution ===');
    const seriesCounts = Object.entries(by_series)
        .map(([series, ids]) => [series, ids.length])
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20);
    
    for (const [series, count] of seriesCounts) {
        console.log(`  ${series}: ${count}`);
    }

    // 4. Upload to storage
    console.log('\n3. Uploading taxonomy_index.json to storage...');
    const taxonomyJson = JSON.stringify(taxonomyIndex, null, 2);
    
    const { error: uploadError } = await supabase
        .storage
        .from(MASTERLIST_BUCKET)
        .upload(TAXONOMY_PATH, taxonomyJson, {
            contentType: 'application/json',
            upsert: true
        });

    if (uploadError) {
        console.error('Error uploading taxonomy index:', uploadError);
        process.exit(1);
    }

    console.log('   ✅ Taxonomy index uploaded successfully');

    // 5. Summary
    console.log('\n=== Summary ===');
    console.log(`Total images processed: ${allImages.length}`);
    console.log(`Categories: ${Object.keys(by_category).length}`);
    console.log(`Series: ${Object.keys(by_series).length}`);
    console.log(`Framework concepts: ${Object.keys(by_framework_concept).length}`);
    console.log('\n✅ Taxonomy index rebuilt!');
    console.log('   The UI should now show all categories and series after refreshing.');
}

// Parse command line arguments
const args = process.argv.slice(2);
const serviceRoleKey = args[0];

if (!serviceRoleKey) {
    console.log('Usage: node rebuild-taxonomy-index.js <SUPABASE_SERVICE_ROLE_KEY>');
    console.log('');
    console.log('Environment variables:');
    console.log('  SUPABASE_URL - The Supabase project URL (optional, has default)');
    process.exit(1);
}

rebuildTaxonomyIndex(serviceRoleKey).catch(console.error);

