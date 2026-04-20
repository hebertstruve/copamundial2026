'use client';
import { motion } from 'framer-motion';
import { getTable, computeBestThirds } from '@/lib/utils';
import { TeamLabel } from './TeamLabel';
import { useTheme } from '@/contexts/ThemeContext';

interface GroupTableProps {
  groupId: string;
  matches: any[];
}

export function GroupTable({ groupId, matches }: GroupTableProps) {
  const { t } = useTheme();
  const rows = getTable(groupId, matches);
  const bestThirds = computeBestThirds(matches);

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
        className="px-4 py-3 font-mono uppercase tracking-[0.2em] border-b"
        style={{
          fontSize: 10,
          color: 'var(--accent)',
          borderColor: 'var(--rule)',
        }}
      >
        {t('group')} {groupId}
      </div>

      <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr
            className="font-mono uppercase tracking-[0.12em]"
            style={{ fontSize: 9, color: 'var(--mute)' }}
          >
            <th className="px-3 py-2 text-center w-8">{t('pos')}</th>
            <th className="px-3 py-2">EQUIPO</th>
            <th className="px-2 py-2 text-center">{t('gamesPlayed')}</th>
            <th className="px-2 py-2 text-center">{t('goalDiff')}</th>
            <th className="px-3 py-2 text-right">{t('pts')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const pos = i + 1;
            let posColor = 'var(--mute)';
            let stripe: string | undefined;
            if (pos === 1) posColor = 'var(--pos1)';
            else if (pos === 2) posColor = 'var(--pos2)';
            else if (pos === 3) posColor = bestThirds.has(row.name) ? 'var(--pos3)' : 'var(--mute)';

            const qualified = pos <= 2 || (pos === 3 && bestThirds.has(row.name));
            if (qualified) stripe = 'var(--paper-edge)';

            return (
              <motion.tr
                layout
                key={row.name}
                style={{
                  background: stripe,
                  borderTop: '1px solid var(--rule)',
                }}
              >
                <td
                  className="px-3 py-2 text-center font-display"
                  style={{ color: posColor, fontSize: 16, lineHeight: 1 }}
                >
                  {pos}
                </td>
                <td className="px-3 py-2 min-w-0">
                  <TeamLabel name={row.name} variant="inline" />
                </td>
                <td
                  className="px-2 py-2 text-center font-mono"
                  style={{ fontSize: 11, color: 'var(--ink-soft)' }}
                >
                  {row.pj}
                </td>
                <td
                  className="px-2 py-2 text-center font-mono"
                  style={{ fontSize: 11, color: 'var(--ink-soft)' }}
                >
                  {row.sg > 0 ? `+${row.sg}` : row.sg}
                </td>
                <td
                  className="px-3 py-2 text-right font-display"
                  style={{ fontSize: 18, color: 'var(--ink)' }}
                >
                  {row.pts}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
