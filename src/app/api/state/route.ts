import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const MAX_BODY_BYTES = 200_000;
const TTL_SECONDS = 60 * 60 * 24 * 90;
const ROOM_RE = /^[a-z0-9]{4,12}$/;

interface RedisSetup {
  client: Redis;
  source: 'explicit-upstash' | 'explicit-kv' | 'parsed-redis-url';
}

function getRedisSetup(): RedisSetup | null {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    return {
      client: new Redis({ url: upstashUrl, token: upstashToken }),
      source: 'explicit-upstash',
    };
  }
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (kvUrl && kvToken) {
    return {
      client: new Redis({ url: kvUrl, token: kvToken }),
      source: 'explicit-kv',
    };
  }
  const tcpUrl = process.env.REDIS_URL ?? process.env.KV_URL;
  if (!tcpUrl) return null;
  try {
    const u = new URL(tcpUrl);
    if (!u.hostname || !u.password) return null;
    return {
      client: new Redis({
        url: `https://${u.hostname}`,
        token: decodeURIComponent(u.password),
      }),
      source: 'parsed-redis-url',
    };
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
    KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
    KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
    UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
  };
}

export async function GET(request: NextRequest) {
  // Health-check mode: /api/state?probe=1
  if (request.nextUrl.searchParams.get('probe') === '1') {
    const setup = getRedisSetup();
    return NextResponse.json({
      configured: Boolean(setup),
      source: setup?.source ?? null,
      envFlags: envFlags(),
    });
  }

  const setup = getRedisSetup();
  if (!setup) {
    return NextResponse.json(
      { error: 'sync_not_configured', envFlags: envFlags() },
      { status: 503 }
    );
  }
  const room = pickRoom(request);
  if (!room) {
    return NextResponse.json({ error: 'invalid_room' }, { status: 400 });
  }
  try {
    const data = await setup.client.get(`wc26:room:${room}`);
    if (!data) {
      return NextResponse.json({ exists: false }, { status: 404 });
    }
    return NextResponse.json({ exists: true, state: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[state GET] redis_error:', msg, 'source:', setup.source);
    return NextResponse.json(
      { error: 'redis_error', message: msg, source: setup.source },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const setup = getRedisSetup();
  if (!setup) {
    return NextResponse.json(
      { error: 'sync_not_configured', envFlags: envFlags() },
      { status: 503 }
    );
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
    await setup.client.set(
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
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[state PUT] redis_error:', msg, 'source:', setup.source);
    return NextResponse.json(
      { error: 'redis_error', message: msg, source: setup.source },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
