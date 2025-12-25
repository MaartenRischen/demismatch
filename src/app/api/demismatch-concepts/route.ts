import { NextResponse } from 'next/server';

const BUCKET_NAME = 'demismatchfirstthenaugment';
const SUPABASE_BASE_URL = `https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/${BUCKET_NAME}/`;

// Cache buster - increment this when images are updated
const CACHE_VERSION = 'v2';

// Available concept letters based on uploaded files
const AVAILABLE_LETTERS = ['A', 'F', 'J', 'K', 'O', 'R', 'T', 'X', 'Y'];

interface ConceptSeries {
  letter: string;
  mismatched: string;
  baseline: string;
  augmented: string;
}

// Check image with multiple extensions (.png, .jpeg)
async function findImage(baseUrl: string, baseName: string): Promise<string | null> {
  const extensions = ['png', 'jpeg', 'jpg'];

  for (const ext of extensions) {
    const url = `${baseUrl}${baseName}.${ext}`;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      // Return URL with cache buster
      if (response.ok) return `${url}?${CACHE_VERSION}`;
    } catch {
      // Continue to next extension
    }
  }
  return null;
}

export async function GET() {
  try {
    // Check each letter to see if it has all 3 images
    const conceptPromises = AVAILABLE_LETTERS.map(async (letter) => {
      // Check all 3 images in parallel, trying multiple extensions
      const [mismatchedUrl, baselineUrl, augmentedUrl] = await Promise.all([
        findImage(SUPABASE_BASE_URL, `${letter}1_Mismatched`),
        findImage(SUPABASE_BASE_URL, `${letter}2_Baseline`),
        findImage(SUPABASE_BASE_URL, `${letter}3_Augmented`),
      ]);

      // Only return concept if all 3 images exist
      if (mismatchedUrl && baselineUrl && augmentedUrl) {
        return {
          letter,
          mismatched: mismatchedUrl,
          baseline: baselineUrl,
          augmented: augmentedUrl,
        } as ConceptSeries;
      }
      return null;
    });

    const results = await Promise.all(conceptPromises);
    const concepts = results.filter((c): c is ConceptSeries => c !== null);

    return NextResponse.json({ concepts }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err) {
    console.error('Error fetching concepts:', err);
    return NextResponse.json({ error: 'Failed to fetch concepts' }, { status: 500 });
  }
}
