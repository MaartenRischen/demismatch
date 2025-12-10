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

// Database row type matching new Supabase columns
interface DbImageRow {
  id: number;
  file_name: string;
  folder_name: string;
  title: string | null;
  image_url: string | null;
  image_type: string | null;
  categories: string[] | null;
  framework_concepts: string[] | null;
  tags_normalized: string[] | null;
  search_text: string | null;
}

// Select columns for database query
const SELECT_COLUMNS = 'id, file_name, folder_name, title, image_url, image_type, categories, framework_concepts, tags_normalized, search_text';

// Transform database row to API response format
function transformRow(row: DbImageRow, supabaseUrl: string): ImageData | null {
  // Skip rows with no file_name or image_url
  if (!row.file_name && !row.image_url) {
    return null;
  }

  const fileName = row.file_name || '';
  const folderName = row.folder_name || '';

  // Use image_url from database if available, otherwise construct from folder/file
  const imageUrl = row.image_url ||
    `${supabaseUrl}/storage/v1/object/public/mismatch-images/${folderName}/${fileName}`;

  // Generate fallback title from filename if not set
  const title = row.title ||
    (fileName ? fileName.replace(/^\d+_/, '').replace(/\.png$/, '').replace(/_/g, ' ') : 'Untitled');

  // Extract body_text from search_text (first 500 chars before any JSON)
  let body_text = '';
  if (row.search_text) {
    const jsonStart = row.search_text.indexOf('{"');
    body_text = jsonStart > 0
      ? row.search_text.substring(0, jsonStart).trim()
      : row.search_text.substring(0, 500);
  }

  return {
    id: row.id,
    file_name: fileName,
    folder_name: folderName,
    title,
    body_text,
    image_type: row.image_type || 'problem',
    categories: row.categories || [],
    framework_concepts: row.framework_concepts || [],
    tags: row.tags_normalized || [],
    image_url: imageUrl
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');

    const supabase = getSupabase();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

    // If specific IDs requested, fetch just those
    if (idsParam) {
      const ids = idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      if (ids.length > 0) {
        const { data, error } = await supabase
          .from('image_embeddings')
          .select(SELECT_COLUMNS)
          .in('id', ids);

        if (error) throw error;

        const images: ImageData[] = (data as DbImageRow[] || [])
          .map(row => transformRow(row, supabaseUrl))
          .filter((img): img is ImageData => img !== null);

        return NextResponse.json({ images });
      }
    }

    // Fetch all images with pagination (Supabase limits to 1000 per query)
    const allData: DbImageRow[] = [];
    const pageSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('image_embeddings')
        .select(SELECT_COLUMNS)
        .range(offset, offset + pageSize - 1)
        .order('id');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        allData.push(...(data as DbImageRow[]));
        offset += pageSize;
        hasMore = data.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    const images: ImageData[] = allData
      .map(row => transformRow(row, supabaseUrl))
      .filter((img): img is ImageData => img !== null);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Images fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
