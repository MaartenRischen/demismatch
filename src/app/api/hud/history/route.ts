import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getClientIpHash } from '@/lib/client-ip';
import { getSupabaseServiceClient } from '@/lib/supabase-service';

const BUCKET = 'hud-history';
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

function parseDataUrl(dataUrl: string): { mime: string; bytes: Buffer } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid data URL');
  const mime = match[1];
  const base64 = match[2];
  return { mime, bytes: Buffer.from(base64, 'base64') };
}

async function ensureBucketExists(): Promise<void> {
  const svc = getSupabaseServiceClient();
  // Try to create; ignore "already exists" style errors.
  try {
    // @ts-expect-error supabase-js typing differs by version; method exists at runtime
    const { error } = await svc.storage.createBucket(BUCKET, { public: false });
    if (error) {
      const msg = (error as any)?.message || '';
      // Some environments return 409/duplicate; accept it.
      if (!/exists|duplicate|already/i.test(msg)) {
        console.warn('[HUD History] createBucket error:', error);
      }
    }
  } catch (e) {
    // If createBucket isn't available or fails, assume bucket exists.
    console.warn('[HUD History] ensureBucketExists warning:', e);
  }
}

async function maybeCompressToJpeg(input: Buffer): Promise<{ mime: string; bytes: Buffer }> {
  // Keep history lightweight: store a reasonably sized JPEG.
  const sharp = (await import('sharp')).default;
  const out = await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();
  return { mime: 'image/jpeg', bytes: out };
}

export async function POST(request: NextRequest) {
  try {
    const { original_image, overlay_image, analysis, viewer_profile } = await request.json();

    if (!original_image || !analysis) {
      return NextResponse.json({ error: 'original_image and analysis are required' }, { status: 400 });
    }

    await ensureBucketExists();

    const ipHash = getClientIpHash(request);
    const id = randomUUID();

    const svc = getSupabaseServiceClient();

    // Prepare original (compressed)
    const originalParsed = parseDataUrl(original_image);
    const originalCompressed = await maybeCompressToJpeg(originalParsed.bytes);

    const originalPath = `${ipHash}/${id}.original.jpg`;
    const analysisPath = `${ipHash}/${id}.analysis.json`;
    const overlayPath = `${ipHash}/${id}.overlay.png`;

    const analysisPayload = {
      id,
      created_at: new Date().toISOString(),
      viewer_profile: viewer_profile || null,
      analysis,
      has_overlay: !!overlay_image,
    };

    const uploads: Array<Promise<any>> = [];
    uploads.push(
      svc.storage.from(BUCKET).upload(originalPath, originalCompressed.bytes, {
        contentType: originalCompressed.mime,
        upsert: false,
      })
    );
    uploads.push(
      svc.storage.from(BUCKET).upload(analysisPath, Buffer.from(JSON.stringify(analysisPayload), 'utf8'), {
        contentType: 'application/json',
        upsert: false,
      })
    );

    if (overlay_image) {
      // Keep overlay as-is if it is already an image; otherwise best-effort compress to PNG.
      const overlayParsed = parseDataUrl(overlay_image);
      let overlayBytes = overlayParsed.bytes;
      let overlayMime = overlayParsed.mime;

      // Force overlay to png for consistency if it's not png/jpeg/webp/gif
      if (!/^image\/(png|jpeg|webp|gif)$/.test(overlayMime)) {
        try {
          const sharp = (await import('sharp')).default;
          overlayBytes = await sharp(overlayBytes).png().toBuffer();
          overlayMime = 'image/png';
        } catch (e) {
          console.warn('[HUD History] Overlay conversion failed; storing original bytes', e);
        }
      }

      uploads.push(
        svc.storage.from(BUCKET).upload(overlayPath, overlayBytes, {
          contentType: overlayMime,
          upsert: false,
        })
      );
    }

    const results = await Promise.all(uploads);
    for (const r of results) {
      if (r?.error) {
        console.error('[HUD History] Upload error:', r.error);
        return NextResponse.json({ error: 'Failed to save history', details: String(r.error?.message || r.error) }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    console.error('[HUD History] Error:', e);
    return NextResponse.json({ error: 'Failed to save history', details: String(e) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureBucketExists();
    const ipHash = getClientIpHash(request);
    const svc = getSupabaseServiceClient();

    const { data: objects, error } = await svc.storage.from(BUCKET).list(ipHash, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) throw error;

    const analysisFiles = (objects || []).filter((o: any) => typeof o?.name === 'string' && o.name.endsWith('.analysis.json'));
    const top = analysisFiles.slice(0, 25);

    const entries = await Promise.all(
      top.map(async (obj: any) => {
        const analysisName = obj.name as string;
        const id = analysisName.replace(/\.analysis\.json$/, '');

        const analysisPath = `${ipHash}/${analysisName}`;
        const originalPath = `${ipHash}/${id}.original.jpg`;
        const overlayPath = `${ipHash}/${id}.overlay.png`;

        // Download analysis JSON for metadata
        let analysisJson: any = null;
        try {
          const { data: blob, error: dlErr } = await svc.storage.from(BUCKET).download(analysisPath);
          if (dlErr) throw dlErr;
          const text = await (blob as any).text();
          analysisJson = JSON.parse(text);
        } catch (e) {
          console.warn('[HUD History] Failed to read analysis json:', id, e);
        }

        // Signed URLs (overlay optional)
        const { data: origSigned } = await svc.storage.from(BUCKET).createSignedUrl(originalPath, SIGNED_URL_TTL_SECONDS);
        const { data: overlaySigned } = await svc.storage.from(BUCKET).createSignedUrl(overlayPath, SIGNED_URL_TTL_SECONDS);

        return {
          id,
          created_at: analysisJson?.created_at || obj.created_at || obj.updated_at || null,
          viewer_profile: analysisJson?.viewer_profile || null,
          analysis: analysisJson?.analysis || null,
          original_url: origSigned?.signedUrl || null,
          overlay_url: overlaySigned?.signedUrl || null,
        };
      })
    );

    return NextResponse.json({ entries });
  } catch (e) {
    console.error('[HUD History] GET error:', e);
    return NextResponse.json({ error: 'Failed to load history', details: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureBucketExists();
    const ipHash = getClientIpHash(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const svc = getSupabaseServiceClient();
    const paths = [
      `${ipHash}/${id}.analysis.json`,
      `${ipHash}/${id}.original.jpg`,
      `${ipHash}/${id}.overlay.png`,
    ];

    const { error } = await svc.storage.from(BUCKET).remove(paths);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[HUD History] DELETE error:', e);
    return NextResponse.json({ error: 'Failed to delete history item', details: String(e) }, { status: 500 });
  }
}


