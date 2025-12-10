import { NextRequest, NextResponse } from 'next/server';
import { removeImageFromAll, updateImageMetadata } from '@/lib/masterlist-sync';

// DELETE /api/images/[id] - Delete an image from masterlist, database, and storage
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imageId = parseInt(id);

    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    // Check for service role key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY - required for delete operations' 
      }, { status: 500 });
    }

    // Remove from all locations (masterlist, database, storage)
    const result = await removeImageFromAll(imageId);

    return NextResponse.json({ 
      success: true, 
      deleted: imageId,
      details: {
        masterlistRemoved: result.masterlistRemoved,
        databaseRemoved: result.databaseRemoved,
        storageRemoved: result.storageRemoved,
        imagePath: result.imagePath
      }
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete image' 
    }, { status: 500 });
  }
}

// PATCH /api/images/[id] - Update image metadata in masterlist and database
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imageId = parseInt(id);

    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    // Check for service role key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY - required for update operations' 
      }, { status: 500 });
    }

    const body = await request.json();
    
    // Validate allowed fields
    const allowedFields = ['image_type', 'user_rating', 'user_notes', 'is_favorite', 'categories', 'framework_concepts', 'tags_normalized'];
    const updates: Record<string, unknown> = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Update in masterlist and database
    const updatedImage = await updateImageMetadata(imageId, updates);

    return NextResponse.json({ 
      success: true, 
      image: {
        id: updatedImage.id,
        image_type: updatedImage.image_type,
        user_rating: updatedImage.user_rating,
        user_notes: updatedImage.user_notes,
        is_favorite: updatedImage.is_favorite
      }
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to update image' 
    }, { status: 500 });
  }
}

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
