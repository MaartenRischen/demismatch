const SUPABASE_STORAGE_BASE = 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public';

/**
 * Returns a proxied storage URL that routes through our domain for Cloudflare caching.
 * Use for all client-facing URLs (image src, URLs returned in API JSON responses).
 */
export function storageUrl(bucket: string, path: string): string {
  return `/storage/${bucket}/${path}`;
}

/**
 * Returns the direct Supabase Storage URL.
 * Use only for server-side fetches (e.g., fetching markdown/JSON in API routes).
 */
export function supabaseDirectUrl(bucket: string, path: string): string {
  return `${SUPABASE_STORAGE_BASE}/${bucket}/${path}`;
}
