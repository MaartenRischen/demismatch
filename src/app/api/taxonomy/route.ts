import { NextResponse } from 'next/server';

const TAXONOMY_URL = 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-data/taxonomy_index.json';

let cachedTaxonomy: TaxonomyIndex | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface TaxonomyIndex {
  by_category: Record<string, number[]>;
  by_framework_concept: Record<string, number[]>;
}

export async function GET() {
  try {
    // Return cached data if fresh
    if (cachedTaxonomy && Date.now() - cacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedTaxonomy);
    }

    const response = await fetch(TAXONOMY_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch taxonomy');
    }

    cachedTaxonomy = await response.json();
    cacheTime = Date.now();

    return NextResponse.json(cachedTaxonomy);
  } catch (error) {
    console.error('Taxonomy fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch taxonomy' },
      { status: 500 }
    );
  }
}
