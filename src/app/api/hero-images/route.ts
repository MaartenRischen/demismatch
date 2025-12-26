import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase-service';

const BUCKET_NAME = 'new_images';
const SUPABASE_BASE_URL = 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public';

export async function GET() {
  try {
    const supabase = getSupabaseServiceClient();

    // List all files in the new_images bucket
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error('Error listing bucket:', error);
      return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
    }

    // Filter to only image files and construct public URLs
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    const images = files
      .filter(file => {
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
        return imageExtensions.includes(ext) && !file.name.startsWith('.');
      })
      .map(file => ({
        name: file.name,
        url: `${SUPABASE_BASE_URL}/${BUCKET_NAME}/${file.name}`,
        // Extract a display name from the filename
        displayName: file.name
          .replace(/\.[^/.]+$/, '') // Remove extension
          .replace(/_/g, ' ') // Replace underscores with spaces
          .replace(/^\d+_?/, ''), // Remove leading numbers
      }));

    return NextResponse.json({ images }, {
      headers: {
        // Cache for 5 minutes, but allow revalidation
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    console.error('Error fetching hero images:', err);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
