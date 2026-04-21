'use client';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import type { SyncStatus } from '@/hooks/useRoomSync';
import { getRoomShareUrl } from '@/lib/room';

interface SyncBadgeProps {
  roomId: string | null;
  status: SyncStatus;
}

export function SyncBadge({ roomId, status }: SyncBadgeProps) {
  const { t } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!roomId) return;
    const url = getRoomShareUrl(roomId);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(t('syncCopyFallback'), url);
    }
  };

  const statusLabel: Record<SyncStatus, string> = {
    idle: t('syncIdle'),
    loading: t('syncLoading'),
    saving: t('syncSaving'),
    synced: t('syncSynced'),
    offline: t('syncOffline'),
    disabled: t('syncDisabled'),
  };

  const dotColor: Record<SyncStatus, string> = {
    idle: 'var(--mute)',
    loading: 'var(--gold)',
    saving: 'var(--gold)',
    synced: '#3fb96a',
    offline: 'var(--accent)',
    disabled: 'var(--mute)',
  };

  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <span
        className="flex items-center gap-1.5 font-mono uppercase tracking-[0.18em]"
        style={{ fontSize: 9, color: 'var(--mute)' }}
        title={roomId ? `${t('syncRoom')}: ${roomId}` : undefined}
      >
        <span
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            borderRadius: 9999,
            background: dotColor[status],
            boxShadow:
              status === 'synced'
                ? '0 0 6px rgba(63,185,106,0.6)'
                : undefined,
            display: 'inline-block',
          }}
        />
        {statusLabel[status]}
      </span>
      {roomId && status !== 'disabled' && (
        <button
          onClick={handleShare}
          className="font-mono uppercase tracking-[0.18em] px-2 py-1 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            fontSize: 9,
            background: copied ? 'var(--accent)' : 'transparent',
            color: copied ? 'var(--paper)' : 'var(--ink)',
            borderColor: 'var(--ink)',
          }}
          aria-label={t('syncShare')}
        >
          {copied ? `✓ ${t('syncCopied')}` : `🔗 ${roomId}`}
        </button>
      )}
    </div>
  );
}
