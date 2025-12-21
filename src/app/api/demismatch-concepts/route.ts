import { NextResponse } from 'next/server';

const BUCKET_NAME = 'demismatchfirstthenaugment';
const SUPABASE_BASE_URL = `https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/${BUCKET_NAME}/`;

// All possible concept letters (A-Z)
const POSSIBLE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface ConceptSeries {
  letter: string;
  mismatched: string;
  baseline: string;
  augmented: string;
}

async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    // Check each letter to see if it has all 3 images
    const conceptPromises = POSSIBLE_LETTERS.map(async (letter) => {
      const mismatchedUrl = `${SUPABASE_BASE_URL}${letter}1_Mismatched.png`;
      const baselineUrl = `${SUPABASE_BASE_URL}${letter}2_Baseline.png`;
      const augmentedUrl = `${SUPABASE_BASE_URL}${letter}3_Augmented.png`;

      // Check all 3 images in parallel
      const [mismatchedExists, baselineExists, augmentedExists] = await Promise.all([
        checkImageExists(mismatchedUrl),
        checkImageExists(baselineUrl),
        checkImageExists(augmentedUrl),
      ]);

      // Only return concept if all 3 images exist
      if (mismatchedExists && baselineExists && augmentedExists) {
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

    return NextResponse.json({ concepts });
  } catch (err) {
    console.error('Error fetching concepts:', err);
    return NextResponse.json({ error: 'Failed to fetch concepts' }, { status: 500 });
  }
}
