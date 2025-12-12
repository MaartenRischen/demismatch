import { NextRequest, NextResponse } from 'next/server';
import { getClientIpHash } from '@/lib/client-ip';
import { getSupabaseServiceClient } from '@/lib/supabase-service';

// PATCH /api/favorites/[id]  { is_favorite: boolean }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imageId = parseInt(id, 10);
    if (Number.isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const isFavorite = !!body?.is_favorite;

    const ipHash = getClientIpHash(request);
    const supabase = getSupabaseServiceClient();

    if (isFavorite) {
      const { error } = await supabase
        .from('user_favorites')
        .upsert({ ip_hash: ipHash, image_id: imageId }, { onConflict: 'ip_hash,image_id' });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('ip_hash', ipHash)
        .eq('image_id', imageId);
      if (error) throw error;
    }

    return NextResponse.json({ success: true, image_id: imageId, is_favorite: isFavorite });
  } catch (error) {
    console.error('Favorites update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update favorite' },
      { status: 500 }
    );
  }
}
