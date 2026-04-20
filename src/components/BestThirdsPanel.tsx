'use client';
import { INITIAL_GROUPS } from '@/data/groups';
import { getTable } from '@/lib/utils';
import { TeamLabel } from './TeamLabel';
import { useTheme } from '@/contexts/ThemeContext';

interface BestThirdsPanelProps {
  matches: any[];
}

export function BestThirdsPanel({ matches }: BestThirdsPanelProps) {
  const { t } = useTheme();
  const ranked = Object.keys(INITIAL_GROUPS)
    .map((g) => ({ g, row: getTable(g, matches)[2] }))
    .filter((x) => x.row)
    .sort(
      (a, b) =>
        b.row!.pts - a.row!.pts ||
        b.row!.sg - a.row!.sg ||
        b.row!.gf - a.row!.gf
    );

  return (
    <div
      className="border"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--ink)',
        boxShadow: 'var(--shadow)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      <div
        className="px-4 py-3 font-mono uppercase tracking-[0.2em] border-b flex items-center justify-between"
        style={{
          fontSize: 10,
          color: 'var(--accent)',
          borderColor: 'var(--rule)',
        }}
      >
        <span>{t('bestThirdsTitle')}</span>
        <span style={{ color: 'var(--mute)' }}>8/12</span>
      </div>
      <ul>
        {ranked.map((x, i) => {
          const qualifies = i < 8;
          return (
            <li
              key={x.row!.name}
              className={`flex items-center justify-between px-3 py-2 ${
                qualifies ? '' : 'opacity-40'
              }`}
              style={{
                background: qualifies ? 'var(--paper-edge)' : undefined,
                borderLeft: qualifies
                  ? '3px solid var(--pos3)'
                  : '3px solid transparent',
                borderBottom: '1px solid var(--rule)',
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="font-mono w-4 text-center"
                  style={{ fontSize: 10, color: 'var(--mute)' }}
                >
                  {i + 1}
                </span>
                <span
                  className="font-display shrink-0"
                  style={{ fontSize: 13, color: 'var(--ink)' }}
                >
                  {x.g}
                </span>
                <TeamLabel name={x.row!.name} variant="inline" />
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="font-mono tabular-nums"
                  style={{ fontSize: 10, color: 'var(--mute)' }}
                >
                  {x.row!.sg > 0 ? `+${x.row!.sg}` : x.row!.sg}
                </span>
                <span
                  className="font-display"
                  style={{ fontSize: 16, color: 'var(--ink)' }}
                >
                  {x.row!.pts}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
