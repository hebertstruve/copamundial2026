'use client';
import { motion } from 'framer-motion';
import { ALL_TEAMS } from '@/data/groups';
import { useTheme } from '@/contexts/ThemeContext';

interface FinalViewProps {
  matches: any[];
  bracket: any[];
  topScorer?: { player: string; team: string; goals: number } | null;
}

export function FinalView({ matches, bracket, topScorer }: FinalViewProps) {
  const { t } = useTheme();

  const finalMatch = bracket.find((m) => m.id === 'FINAL-1');
  const champion = finalMatch?.winner ?? null;
  const runnerUp =
    finalMatch && finalMatch.winner
      ? finalMatch.winner === finalMatch.teamH
        ? finalMatch.teamA
        : finalMatch.teamH
      : null;

  const totalGoals =
    matches.reduce((acc, m) => acc + (m.scoreH + m.scoreA), 0) +
    bracket
      .filter((m) => m.played && m.teamH !== 'TBD' && m.teamA !== 'TBD')
      .reduce((acc, m) => acc + (m.scoreH + m.scoreA), 0);

  const totalPlayed =
    matches.filter((m) => m.played).length +
    bracket.filter((m) => m.played && m.teamH !== 'TBD' && m.teamA !== 'TBD').length;

  const finalScore =
    finalMatch && finalMatch.played
      ? `${finalMatch.scoreH}–${finalMatch.scoreA}${
          finalMatch.scoreH === finalMatch.scoreA
            ? ` (${finalMatch.penH}–${finalMatch.penA} pen)`
            : ''
        }`
      : null;

  return (
    <motion.div
      key="final"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8 md:py-12"
    >
      <div className="text-center">
        <div
          className="font-mono uppercase tracking-[0.28em] mb-4"
          style={{ fontSize: 11, color: 'var(--mute)' }}
        >
          COPA DEL MUNDO 2026 — {t('champion')}
        </div>

        {champion ? (
          <>
            <ChampionFlag teamName={champion} />
            <div
              className="font-display uppercase leading-[0.82] mt-2 mb-4"
              style={{
                fontSize: 'clamp(60px, 14vw, 220px)',
                color: 'var(--accent)',
              }}
            >
              {champion}
            </div>
            {finalScore && (
              <div
                className="font-headline italic"
                style={{
                  color: 'var(--ink-soft)',
                  fontSize: 'clamp(16px, 2vw, 24px)',
                }}
              >
                — vence {runnerUp} {finalScore} en la final —
              </div>
            )}
          </>
        ) : (
          <div
            className="font-display uppercase"
            style={{
              fontSize: 'clamp(40px, 10vw, 140px)',
              color: 'var(--mute)',
            }}
          >
            {t('champion')} POR DEFINIR
          </div>
        )}
      </div>

      {/* Podium */}
      {champion && (
        <div
          className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto"
        >
          <PodiumBlock position={2} teamName={runnerUp} labelKey="final2nd" />
          <PodiumBlock position={1} teamName={champion} labelKey="champion" highlight />
          <PodiumBlock position={3} teamName={null} labelKey="final3rd" />
        </div>
      )}

      {/* Stats */}
      <div
        className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-0 max-w-5xl mx-auto border-y-2"
        style={{ borderColor: 'var(--ink)' }}
      >
        <StatBlock label={t('tournamentGoals')} value={totalGoals} />
        <StatBlock label={t('matchesCount')} value={`${totalPlayed}/104`} />
        <StatBlock label={t('topScorer')} value={topScorer?.player ?? '—'} />
        <StatBlock label={t('topScorerGoals')} value={topScorer?.goals ?? '—'} last />
      </div>
    </motion.div>
  );
}

function ChampionFlag({ teamName }: { teamName: string }) {
  const team = ALL_TEAMS.find((t) => t.name === teamName);
  if (!team) return null;
  return (
    <div className="flex justify-center">
      <img
        src={`https://flagcdn.com/w320/${team.code}.png`}
        alt={teamName}
        style={{
          width: 'clamp(80px, 12vw, 180px)',
          height: 'auto',
          border: '2px solid var(--ink)',
          boxShadow: 'var(--shadow)',
        }}
      />
    </div>
  );
}

function PodiumBlock({
  position,
  teamName,
  labelKey,
  highlight = false,
}: {
  position: number;
  teamName: string | null;
  labelKey: string;
  highlight?: boolean;
}) {
  const { t } = useTheme();
  const team = teamName ? ALL_TEAMS.find((tm) => tm.name === teamName) : null;
  const scale = position === 1 ? 1 : position === 2 ? 0.85 : 0.75;

  return (
    <div
      className="flex flex-col items-center text-center border-2 p-4"
      style={{
        background: highlight ? 'var(--paper-edge)' : 'var(--card)',
        borderColor: highlight ? 'var(--accent)' : 'var(--ink)',
        boxShadow: highlight ? 'var(--shadow)' : undefined,
        borderRadius: 'var(--radius-card)',
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
      }}
    >
      <div
        className="font-display leading-none mb-1"
        style={{
          fontSize: 48,
          color: position === 1 ? 'var(--accent)' : position === 2 ? 'var(--gold)' : 'var(--pos3)',
        }}
      >
        {position}º
      </div>
      <div
        className="font-mono uppercase tracking-[0.2em] mb-2"
        style={{ fontSize: 9, color: 'var(--mute)' }}
      >
        {t(labelKey)}
      </div>
      {team ? (
        <>
          <img
            src={`https://flagcdn.com/w80/${team.code}.png`}
            alt={teamName!}
            width={48}
            style={{ height: 'auto', border: '1px solid var(--rule)' }}
          />
          <div
            className="font-display uppercase mt-2 leading-none"
            style={{ fontSize: 18, color: 'var(--ink)' }}
          >
            {teamName}
          </div>
        </>
      ) : (
        <div
          className="font-headline italic"
          style={{ color: 'var(--mute)', fontSize: 14 }}
        >
          —
        </div>
      )}
    </div>
  );
}

function StatBlock({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string | number;
  last?: boolean;
}) {
  return (
    <div
      className="p-4 md:p-6"
      style={{
        borderRight: last ? undefined : '1px solid var(--rule)',
      }}
    >
      <div
        className="font-mono uppercase tracking-[0.18em] mb-2"
        style={{ fontSize: 9, color: 'var(--mute)' }}
      >
        {label}
      </div>
      <div
        className="font-display leading-none"
        style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', color: 'var(--ink)' }}
      >
        {value}
      </div>
    </div>
  );
}
