import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Supabase environment variables not configured');
    }
    supabase = createClient(url, key);
  }
  return supabase;
}

export interface ImageData {
  id: number;
  file_name: string;
  folder_name: string;
  title: string;
  body_text: string;
  image_type: string;
  categories: string[];
  framework_concepts: string[];
  tags: string[];
  image_url: string;
}

function extractMetadata(searchText: string, fileName: string): {
  title: string;
  body_text: string;
  image_type: string;
  categories: string[];
  framework_concepts: string[];
  tags: string[];
} {
  let title = fileName.replace(/^\d+_/, '').replace(/\.png$/, '').replace(/_/g, ' ');
  let body_text = '';
  let image_type = 'explanation';
  let categories: string[] = [];
  let framework_concepts: string[] = [];
  let tags: string[] = [];

  try {
    // Look for JSON metadata in search_text
    const jsonMatch = searchText.match(/\{[\s\S]*"title"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      title = parsed.title || title;
      body_text = parsed.body_text || '';
      image_type = parsed.image_type || 'explanation';
      categories = parsed.categories || [];
      framework_concepts = parsed.framework_concepts || [];
      tags = parsed.tags || [];
    }
  } catch {
    // Use defaults
  }

  // Get description from beginning of search_text if no body_text
  if (!body_text) {
    const descriptionEnd = searchText.indexOf('{"title"');
    body_text = descriptionEnd > 0
      ? searchText.substring(0, descriptionEnd).trim()
      : searchText.substring(0, 500);
  }

  return { title, body_text, image_type, categories, framework_concepts, tags };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');

    let query = getSupabase()
      .from('image_embeddings')
      .select('id, file_name, folder_name, search_text');

    // If specific IDs requested, filter to those
    if (idsParam) {
      const ids = idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      if (ids.length > 0) {
        query = query.in('id', ids);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    const images: ImageData[] = (data || []).map(row => {
      const metadata = extractMetadata(row.search_text, row.file_name);
      return {
        id: row.id,
        file_name: row.file_name,
        folder_name: row.folder_name,
        ...metadata,
        image_url: `${supabaseUrl}/storage/v1/object/public/mismatch-images/${row.folder_name}/${row.file_name}`
      };
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Images fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
