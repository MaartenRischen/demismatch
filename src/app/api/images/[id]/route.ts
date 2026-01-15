import { NextRequest, NextResponse } from 'next/server';

// GET /api/images/[id] - Get a single image from database
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imageId = parseInt(id);

    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from('image_embeddings')
      .select('*')
      .eq('id', imageId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ image: data });
  } catch (error) {
    console.error('Get error:', error);
    return NextResponse.json({ error: 'Failed to get image' }, { status: 500 });
  }
}
