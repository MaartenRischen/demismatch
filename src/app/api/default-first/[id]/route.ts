import { NextRequest, NextResponse } from 'next/server';
import { updateImageMetadata } from '@/lib/masterlist-sync';

function isAuthorized(request: NextRequest): boolean {
  const token = process.env.DEV_ADMIN_TOKEN;
  if (!token) {
    return process.env.NODE_ENV !== 'production';
  }
  return request.headers.get('x-admin-token') === token;
}

// PATCH /api/default-first/[id]  { show_first_default: boolean }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const imageId = parseInt(id, 10);
    if (Number.isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const showFirstDefault = !!body?.show_first_default;

    const updated = await updateImageMetadata(imageId, { show_first_default: showFirstDefault });

    return NextResponse.json({
      success: true,
      image: {
        id: updated.id,
        show_first_default: (updated as any).show_first_default === true,
      },
    });
  } catch (error) {
    console.error('Default-first update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update default-first' },
      { status: 500 }
    );
  }
}
