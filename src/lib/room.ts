const LS_ROOM = 'wc26-room';
const ROOM_RE = /^[a-z0-9]{4,12}$/;
// base31: 10 dígitos + letras, excluyendo i, l, o (visualmente ambiguos).
const CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';

export function generateRoomId(): string {
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return id;
}

export function isValidRoomId(id: string | null | undefined): id is string {
  return !!id && ROOM_RE.test(id);
}

export function getRoomFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const r = new URLSearchParams(window.location.search).get('room');
  return isValidRoomId(r) ? r : null;
}

export function getRoomFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  const r = localStorage.getItem(LS_ROOM);
  return isValidRoomId(r) ? r : null;
}

export function persistRoom(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_ROOM, id);
}

export function getRoomShareUrl(id: string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.set('room', id);
  return url.toString();
}
