'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  generateRoomId,
  getRoomFromStorage,
  getRoomFromUrl,
  persistRoom,
} from '@/lib/room';

export type SyncStatus =
  | 'idle'
  | 'loading'
  | 'saving'
  | 'synced'
  | 'offline'
  | 'disabled';

interface UseRoomSyncArgs<T> {
  state: T;
  /** Only start syncing once the local state has been hydrated. */
  ready: boolean;
  /** Called exactly once when the remote state exists for this room. */
  onRemoteLoad: (state: T) => void;
}

const DEBOUNCE_MS = 800;

export function useRoomSync<T>({
  state,
  ready,
  onRemoteLoad,
}: UseRoomSyncArgs<T>) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [status, setStatus] = useState<SyncStatus>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remoteLoadedRef = useRef(false);
  const statusRef = useRef<SyncStatus>('idle');

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // 1 · Resolve room ID: URL > localStorage > new
  useEffect(() => {
    const fromUrl = getRoomFromUrl();
    const fromStorage = getRoomFromStorage();
    const id = fromUrl || fromStorage || generateRoomId();
    setRoomId(id);
    persistRoom(id);
  }, []);

  // 2 · Load remote state once we have a room
  useEffect(() => {
    if (!roomId) return;
    let aborted = false;
    setStatus('loading');
    (async () => {
      try {
        const res = await fetch(`/api/state?room=${roomId}`, {
          cache: 'no-store',
        });
        if (aborted) return;
        if (res.status === 503) {
          setStatus('disabled');
          return;
        }
        if (res.status === 404) {
          remoteLoadedRef.current = true;
          setStatus('synced');
          return;
        }
        if (!res.ok) throw new Error('fetch_failed');
        const data = await res.json();
        remoteLoadedRef.current = true;
        if (data?.exists && data.state) {
          onRemoteLoad(data.state as T);
        }
        setStatus('synced');
      } catch {
        if (!aborted) setStatus('offline');
      }
    })();
    return () => {
      aborted = true;
    };
  }, [roomId, onRemoteLoad]);

  // 3 · Debounced save on state change
  useEffect(() => {
    if (!roomId || !ready || !remoteLoadedRef.current) return;
    if (statusRef.current === 'disabled') return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setStatus('saving');
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/state?room=${roomId}`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(state),
        });
        if (res.status === 503) {
          setStatus('disabled');
          return;
        }
        if (!res.ok) throw new Error('save_failed');
        setStatus('synced');
      } catch {
        setStatus('offline');
      }
    }, DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, roomId, ready]);

  const forceSave = useCallback(async () => {
    if (!roomId || statusRef.current === 'disabled') return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setStatus('saving');
    try {
      const res = await fetch(`/api/state?room=${roomId}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(state),
      });
      if (res.status === 503) setStatus('disabled');
      else if (!res.ok) setStatus('offline');
      else setStatus('synced');
    } catch {
      setStatus('offline');
    }
  }, [roomId, state]);

  return { roomId, status, forceSave };
}
