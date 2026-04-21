import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const MAX_BODY_BYTES = 200_000;
const TTL_SECONDS = 60 * 60 * 24 * 90;
const ROOM_RE = /^[a-z0-9]{4,12}$/;

function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function pickRoom(req: NextRequest): string | null {
  const r = req.nextUrl.searchParams.get('room');
  return r && ROOM_RE.test(r) ? r : null;
}

export async function GET(request: NextRequest) {
  if (!isKvConfigured()) {
    return NextResponse.json({ error: 'sync_not_configured' }, { status: 503 });
  }
  const room = pickRoom(request);
  if (!room) {
    return NextResponse.json({ error: 'invalid_room' }, { status: 400 });
  }
  try {
    const data = await kv.get(`wc26:room:${room}`);
    if (!data) {
      return NextResponse.json({ exists: false }, { status: 404 });
    }
    return NextResponse.json({ exists: true, state: data });
  } catch {
    return NextResponse.json({ error: 'kv_error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isKvConfigured()) {
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
    await kv.set(
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
    return NextResponse.json({ error: 'kv_error' }, { status: 500 });
  }
}

export const runtime = 'edge';
