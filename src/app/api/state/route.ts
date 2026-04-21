import { NextRequest, NextResponse } from 'next/server';
import Redis from 'ioredis';

const MAX_BODY_BYTES = 200_000;
const TTL_SECONDS = 60 * 60 * 24 * 90;
const ROOM_RE = /^[a-z0-9]{4,12}$/;

/**
 * Vercel Marketplace's Redis integration injects only REDIS_URL
 * (rediss://default:TOKEN@HOST:PORT). That host serves the Redis
 * protocol over tcp/tls but not HTTPS/REST, so @upstash/redis timed
 * out at 504. ioredis speaks native tcp; it requires nodejs runtime
 * (edge runtime forbids raw sockets).
 *
 * We cache the client across warm invocations to avoid reconnecting
 * on every request.
 */
let cached: Redis | null = null;
function getRedis(): Redis | null {
  if (cached) return cached;
  const url = process.env.REDIS_URL ?? process.env.KV_URL;
  if (!url) return null;
  try {
    cached = new Redis(url, {
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
      lazyConnect: false,
    });
    return cached;
  } catch {
    return null;
  }
}

function pickRoom(req: NextRequest): string | null {
  const r = req.nextUrl.searchParams.get('room');
  return r && ROOM_RE.test(r) ? r : null;
}

function envFlags() {
  return {
    REDIS_URL: Boolean(process.env.REDIS_URL),
    KV_URL: Boolean(process.env.KV_URL),
  };
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('probe') === '1') {
    const client = getRedis();
    let ping: string | null = null;
    let pingErr: string | null = null;
    if (client) {
      try {
        ping = await client.ping();
      } catch (e) {
        pingErr = e instanceof Error ? e.message : String(e);
      }
    }
    return NextResponse.json({
      configured: Boolean(client),
      envFlags: envFlags(),
      ping,
      pingErr,
    });
  }

  const client = getRedis();
  if (!client) {
    return NextResponse.json({ error: 'sync_not_configured' }, { status: 503 });
  }
  const room = pickRoom(request);
  if (!room) {
    return NextResponse.json({ error: 'invalid_room' }, { status: 400 });
  }
  try {
    const raw = await client.get(`wc26:room:${room}`);
    if (!raw) {
      return NextResponse.json({ exists: false }, { status: 404 });
    }
    return NextResponse.json({ exists: true, state: JSON.parse(raw) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[state GET] redis_error:', msg);
    return NextResponse.json({ error: 'redis_error', message: msg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const client = getRedis();
  if (!client) {
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
  const doc = {
    matches: payload.matches,
    bracket: payload.bracket,
    scorers: payload.scorers,
    updatedAt: Date.now(),
  };
  try {
    await client.set(`wc26:room:${room}`, JSON.stringify(doc), 'EX', TTL_SECONDS);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[state PUT] redis_error:', msg);
    return NextResponse.json({ error: 'redis_error', message: msg }, { status: 500 });
  }
}

export const runtime = 'nodejs';
