import { NextRequest, NextResponse } from 'next/server';
import { fullResyncFromMasterlist, getDatabaseCounts, fetchMasterlist } from '@/lib/masterlist-sync';

// POST /api/admin/resync - Full resync database from masterlist.json
export async function POST(request: NextRequest) {
  try {
    // Check for service role key (admin only)
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY - required for admin operations' 
      }, { status: 500 });
    }

    // Optional: Check for admin secret in request
    const body = await request.json().catch(() => ({}));
    const adminSecret = body.adminSecret || request.headers.get('x-admin-secret');
    
    // If ADMIN_SECRET env var is set, require it
    if (process.env.ADMIN_SECRET && adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Admin Resync] Starting full resync from masterlist.json...');
    
    // Get counts before
    const beforeCounts = await getDatabaseCounts();
    console.log('[Admin Resync] Database counts BEFORE:', beforeCounts);

    // Perform resync
    const result = await fullResyncFromMasterlist();
    console.log('[Admin Resync] Resync complete:', result);

    // Get counts after
    const afterCounts = await getDatabaseCounts();
    console.log('[Admin Resync] Database counts AFTER:', afterCounts);

    return NextResponse.json({
      success: true,
      result: {
        total: result.total,
        synced: result.synced,
        errors: result.errors
      },
      counts: {
        before: beforeCounts,
        after: afterCounts
      }
    });
  } catch (error) {
    console.error('[Admin Resync] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Resync failed' 
    }, { status: 500 });
  }
}

// GET /api/admin/resync - Get current sync status (masterlist vs database)
export async function GET() {
  try {
    // Check for service role key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY' 
      }, { status: 500 });
    }

    // Get masterlist info
    const masterlist = await fetchMasterlist();
    const masterlistCounts: Record<string, number> = {};
    for (const img of masterlist.images) {
      const type = img.image_type || 'null';
      masterlistCounts[type] = (masterlistCounts[type] || 0) + 1;
    }

    // Get database counts
    const databaseCounts = await getDatabaseCounts();

    // Calculate drift
    const allTypes = new Set([...Object.keys(masterlistCounts), ...Object.keys(databaseCounts)]);
    const drift: Record<string, { masterlist: number; database: number; diff: number }> = {};
    let totalDrift = 0;

    for (const type of allTypes) {
      const ml = masterlistCounts[type] || 0;
      const db = databaseCounts[type] || 0;
      drift[type] = { masterlist: ml, database: db, diff: ml - db };
      totalDrift += Math.abs(ml - db);
    }

    return NextResponse.json({
      masterlist: {
        total: masterlist.total_images,
        lastSynced: masterlist.last_synced_at,
        generatedAt: masterlist.generated_at,
        counts: masterlistCounts
      },
      database: {
        counts: databaseCounts
      },
      drift: {
        byType: drift,
        total: totalDrift,
        inSync: totalDrift === 0
      }
    });
  } catch (error) {
    console.error('[Admin Resync] Status error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to get status' 
    }, { status: 500 });
  }
}

