import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'new_images';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url) {
      throw new Error('Supabase URL not configured');
    }

    const key = serviceKey || anonKey;
    if (!key) {
      throw new Error('No Supabase key available');
    }

    const supabase = createClient(url, key);

    // Try to list files from new_images bucket first
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
      });

    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    let images: { name: string; url: string; displayName: string }[] = [];

    // If bucket has images, use them
    if (!error && files && files.length > 0) {
      images = files
        .filter(file => {
          const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
          return imageExtensions.includes(ext) && !file.name.startsWith('.');
        })
        .map(file => ({
          name: file.name,
          url: `${url}/storage/v1/object/public/${BUCKET_NAME}/${file.name}`,
          displayName: file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/_/g, ' ')
            .replace(/^\d+_?/, ''),
        }));
    }

    // Fallback: use images from the library if bucket is empty
    if (images.length === 0) {
      const { data: dbImages } = await supabase
        .from('image_embeddings')
        .select('id, file_name, folder_name, image_url')
        .limit(30);

      if (dbImages && dbImages.length > 0) {
        images = dbImages
          .filter(row => row.file_name || row.image_url)
          .map(row => ({
            name: row.file_name || `image-${row.id}`,
            url: row.image_url || `${url}/storage/v1/object/public/mismatch-images/${row.folder_name}/${row.file_name}`,
            displayName: (row.file_name || '')
              .replace(/\.[^/.]+$/, '')
              .replace(/_/g, ' ')
              .replace(/^\d+_?/, ''),
          }));
      }
    }

    return NextResponse.json({ images }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    console.error('Error fetching hero images:', err);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
