'use client';
import { INITIAL_GROUPS } from '@/data/groups';
import { useTheme } from '@/contexts/ThemeContext';

interface GroupHeaderProps {
  groupId: string;
  onSimulateGroup?: () => void;
}

export function GroupHeader({ groupId, onSimulateGroup }: GroupHeaderProps) {
  const { t } = useTheme();
  const teams = INITIAL_GROUPS[groupId] ?? [];

  return (
    <div
      className="flex items-center gap-4 md:gap-6 pb-4 border-b"
      style={{ borderColor: 'var(--rule)' }}
    >
      <div
        className="font-display leading-[0.8] shrink-0"
        style={{
          fontSize: 'clamp(56px, 7vw, 82px)',
          color: 'var(--accent)',
        }}
      >
        {groupId}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="font-mono uppercase tracking-[0.2em]"
          style={{ fontSize: 10, color: 'var(--mute)' }}
        >
          {t('group')}
        </div>
        <div
          className="font-headline italic leading-tight truncate"
          style={{
            fontSize: 'clamp(15px, 1.6vw, 22px)',
            color: 'var(--ink)',
          }}
        >
          {teams.map((tm) => tm.name).join(' · ')}
        </div>
      </div>
      {onSimulateGroup && (
        <button
          onClick={onSimulateGroup}
          className="font-mono uppercase tracking-[0.2em] shrink-0 border-2 px-3 py-2"
          style={{
            background: 'var(--gold)',
            color: 'var(--ink)',
            borderColor: 'var(--ink)',
            fontSize: 10,
          }}
        >
          ⚡ {t('simulateGroup')}
        </button>
      )}
    </div>
  );
}
