import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables not configured');
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

export interface ImageResult {
  id: number;
  title: string;
  body_text?: string;
  image_url: string;
  reason?: string;
}

export interface AngleResult {
  perspective: string;
  mismatch: string;
  ancestral: string;
  modern: string;
  ancestral_image: ImageResult | null;
  modern_image: ImageResult | null;
}

export interface ImageCluster {
  theme: string;
  images: ImageResult[];
}

export interface ShareVariants {
  short: string;
  medium: string;
  long: string;
}

export interface AnalysisResponse {
  surface: string;
  reframe: string;
  angles: AngleResult[];
  image_clusters: ImageCluster[];
  share_variants: ShareVariants;
}

// LLM-based analysis through the DEMISMATCH lens
export async function analyzeWithLLM(text: string): Promise<AnalysisResponse> {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Analysis failed');
  }

  const data = await response.json();
  return {
    surface: data.surface || '',
    reframe: data.reframe || '',
    angles: data.angles || [],
    image_clusters: data.image_clusters || [],
    share_variants: {
      short: data.share_variants?.short || '',
      medium: data.share_variants?.medium || '',
      long: data.share_variants?.long || ''
    }
  };
}

// Regenerate share text at a specific length
export async function regenerateShareText(
  originalContent: string,
  theReframe: string,
  theMechanism: string,
  length: 'short' | 'medium' | 'long'
): Promise<string> {
  const response = await fetch('/api/regenerate-comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      originalContent,
      theReframe,
      theMechanism,
      length
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Regeneration failed');
  }

  const data = await response.json();
  return data.comment || '';
}
