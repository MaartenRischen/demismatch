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
  rank?: number;
}

export interface SearchResponse {
  whats_happening: string;
  the_players: string;
  whats_missing: string;
  what_actually_helps: string;
  example_comment: string;
  problem_images: ImageResult[];
  solution_images: ImageResult[];
}

// LLM-based search that understands the evolutionary mismatch framework
export async function searchImagesWithLLM(text: string): Promise<SearchResponse> {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Search failed');
  }

  const data = await response.json();
  return {
    whats_happening: data.whats_happening || '',
    the_players: data.the_players || '',
    whats_missing: data.whats_missing || '',
    what_actually_helps: data.what_actually_helps || '',
    example_comment: data.example_comment || '',
    problem_images: data.problem_images || [],
    solution_images: data.solution_images || []
  };
}
