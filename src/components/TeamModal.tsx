'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_TEAMS, INITIAL_GROUPS } from '@/data/groups';
import { getTable } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useTeamModal } from '@/contexts/TeamModalContext';
import type { ScorerGoal } from '@/lib/simulate';

interface TeamModalProps {
  matches: any[];
  scorers: ScorerGoal[];
}

export function TeamModal({ matches, scorers }: TeamModalProps) {
  const modal = useTeamModal();
  const { t } = useTheme();
  const currentTeam = modal?.currentTeam ?? null;
  const team = currentTeam
    ? ALL_TEAMS.find((tm) => tm.name === currentTeam)
    : null;

  const group = currentTeam
    ? Object.keys(INITIAL_GROUPS).find((g) =>
        INITIAL_GROUPS[g].some((tm) => tm.name === currentTeam)
      )
    : undefined;

  const row =
    group && currentTeam
      ? getTable(group, matches).find((r) => r.name === currentTeam) ?? null
      : null;

  useEffect(() => {
    if (!modal?.isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') modal.close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal?.isOpen, modal]);

  const teamGoals = scorers.filter((s) => s.team === currentTeam);
  const byPlayer: Record<string, number> = {};
  teamGoals.forEach((g) => {
    byPlayer[g.player] = (byPlayer[g.player] ?? 0) + 1;
  });
  const playerList = Object.entries(byPlayer).sort((a, b) => b[1] - a[1]);

  return (
    <AnimatePresence>
      {modal?.isOpen && team && currentTeam && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={modal.close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-title"
            className="w-full max-w-[720px] max-h-[85vh] overflow-auto"
            style={{
              background: 'var(--card)',
              border: '2px solid var(--ink)',
              boxShadow: 'var(--shadow)',
              borderRadius: 'var(--radius-card)',
            }}
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between gap-4 px-6 py-4 border-b"
              style={{ borderColor: 'var(--rule)' }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={`https://flagcdn.com/w160/${team.code}.png`}
                  alt={currentTeam}
                  width={80}
                  style={{
                    height: 'auto',
                    border: '1px solid var(--rule)',
                    flexShrink: 0,
                  }}
                />
                <div className="min-w-0">
                  <div
                    id="team-modal-title"
                    className="font-display uppercase leading-none truncate"
                    style={{
                      fontSize: 'clamp(28px, 4vw, 48px)',
                      color: 'var(--ink)',
                    }}
                  >
                    {currentTeam}
                  </div>
                  {group && (
                    <div
                      className="font-mono uppercase tracking-[0.2em] mt-1"
                      style={{ fontSize: 10, color: 'var(--accent)' }}
                    >
                      {t('group')} {group}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={modal.close}
                className="font-display leading-none shrink-0"
                style={{ fontSize: 28, color: 'var(--ink)' }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div
              className="grid grid-cols-4 border-b"
              style={{ borderColor: 'var(--rule)' }}
            >
              <Stat label={t('gamesPlayed')} value={row?.pj ?? 0} />
              <Stat label={t('wins')} value={row?.v ?? 0} />
              <Stat label={t('draws')} value={row?.e ?? 0} />
              <Stat label={t('losses')} value={row?.d ?? 0} last />
            </div>
            <div
              className="grid grid-cols-4 border-b"
              style={{ borderColor: 'var(--rule)' }}
            >
              <Stat label={t('goalsFor')} value={row?.gf ?? 0} />
              <Stat label={t('goalsAgainst')} value={row?.gc ?? 0} />
              <Stat
                label={t('goalDiff')}
                value={row ? (row.sg > 0 ? `+${row.sg}` : String(row.sg)) : '0'}
              />
              <Stat label={t('pts')} value={row?.pts ?? 0} last accent />
            </div>

            <div className="px-6 py-4">
              <div
                className="font-mono uppercase tracking-[0.2em] mb-3"
                style={{ fontSize: 10, color: 'var(--accent)' }}
              >
                {t('scorers')}
              </div>
              {playerList.length === 0 ? (
                <div
                  className="font-headline italic"
                  style={{ color: 'var(--mute)' }}
                >
                  —
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {playerList.map(([player, goals]) => (
                    <li
                      key={player}
                      className="flex items-center justify-between"
                    >
                      <span
                        className="font-display uppercase"
                        style={{ fontSize: 14, color: 'var(--ink)' }}
                      >
                        {player}
                      </span>
                      <span
                        className="font-mono tabular-nums"
                        style={{ fontSize: 12, color: 'var(--mute)' }}
                      >
                        ⚽ {goals}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({
  label,
  value,
  last = false,
  accent = false,
}: {
  label: string;
  value: string | number;
  last?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className="py-4 px-2 text-center"
      style={{ borderRight: last ? undefined : '1px solid var(--rule)' }}
    >
      <div
        className="font-mono uppercase tracking-[0.18em] mb-1"
        style={{ fontSize: 9, color: 'var(--mute)' }}
      >
        {label}
      </div>
      <div
        className="font-display leading-none"
        style={{
          fontSize: 32,
          color: accent ? 'var(--accent)' : 'var(--ink)',
        }}
      >
        {value}
      </div>
    </div>
  );
}
