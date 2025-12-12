import { createHash } from 'crypto';
import type { NextRequest } from 'next/server';

function firstIpFromXForwardedFor(xff: string | null): string | null {
  if (!xff) return null;
  const first = xff.split(',')[0]?.trim();
  return first || null;
}

export function getClientIp(req: NextRequest): string {
  return (
    firstIpFromXForwardedFor(req.headers.get('x-forwarded-for')) ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function getClientIpHash(req: NextRequest): string {
  const rawIp = getClientIp(req);
  const salt = process.env.FAVORITES_HASH_SALT || (process.env.NODE_ENV === 'production' ? '' : 'dev-salt');
  if (process.env.NODE_ENV === 'production' && !salt) {
    return createHash('sha256').update(`missing-salt:${rawIp}`).digest('hex');
  }
  return createHash('sha256').update(`${salt}:${rawIp}`).digest('hex');
}
