import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const MAX_BODY_BYTES = 200_000;
const TTL_SECONDS = 60 * 60 * 24 * 90;
const ROOM_RE = /^[a-z0-9]{4,12}$/;

/**
 * Vercel Marketplace Redis (Upstash) injects only REDIS_URL
 * (rediss://default:TOKEN@HOST:PORT). We derive the REST credentials
 * at runtime so the function stays edge-friendly and no manual env
 * vars are ever needed. Falls back to the explicit UPSTASH_* vars or
 * the legacy KV_REST_API_* pair if they happen to be present.
 */
function getRedis(): Redis | null {
  const explicitUrl =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const explicitToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (explicitUrl && explicitToken) {
    return new Redis({ url: explicitUrl, token: explicitToken });
  }
  const tcpUrl = process.env.REDIS_URL ?? process.env.KV_URL;
  if (!tcpUrl) return null;
  try {
    const u = new URL(tcpUrl);
    if (!u.hostname || !u.password) return null;
    return new Redis({
      url: `https://${u.hostname}`,
      token: decodeURIComponent(u.password),
    });
  } catch {
    return null;
  }
}

function pickRoom(req: NextRequest): string | null {
  const r = req.nextUrl.searchParams.get('room');
  return r && ROOM_RE.test(r) ? r : null;
}

export async function GET(request: NextRequest) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'sync_not_configured' }, { status: 503 });
  }
  const room = pickRoom(request);
  if (!room) {
    return NextResponse.json({ error: 'invalid_room' }, { status: 400 });
  }
  try {
    const data = await redis.get(`wc26:room:${room}`);
    if (!data) {
      return NextResponse.json({ exists: false }, { status: 404 });
    }
    return NextResponse.json({ exists: true, state: data });
  } catch {
    return NextResponse.json({ error: 'redis_error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'sync_not_configured' }, { status: 503 });
  }
  const room = pickRoom(request);
  if (!room) {
    return NextResponse.json({ error: 'invalid_room' }, { status: 400 });
  }
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (
    !body ||
    typeof body !== 'object' ||
    !Array.isArray((body as { matches?: unknown }).matches) ||
    !Array.isArray((body as { bracket?: unknown }).bracket) ||
    !Array.isArray((body as { scorers?: unknown }).scorers)
  ) {
    return NextResponse.json({ error: 'invalid_shape' }, { status: 400 });
  }
  const payload = body as { matches: unknown[]; bracket: unknown[]; scorers: unknown[] };
  try {
    await redis.set(
      `wc26:room:${room}`,
      {
        matches: payload.matches,
        bracket: payload.bracket,
        scorers: payload.scorers,
        updatedAt: Date.now(),
      },
      { ex: TTL_SECONDS }
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'redis_error' }, { status: 500 });
  }
}

export const runtime = 'edge';
