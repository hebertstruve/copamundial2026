'use client';
import { motion } from 'framer-motion';
import { ALL_TEAMS } from '@/data/groups';
import { useTheme } from '@/contexts/ThemeContext';

interface BracketMatchProps {
  match: any;
  onScoreChange: (id: string, side: string, val: string) => void;
  /** @deprecated kept for legacy page.tsx callers */
  dark?: boolean;
}

export function BracketMatch({ match: m, onScoreChange }: BracketMatchProps) {
  const { t } = useTheme();
  const isFinal = m.id === 'FINAL-1';
  const bothSet = m.teamH !== 'TBD' && m.teamA !== 'TBD';
  const isDraw = m.played && bothSet && m.scoreH === m.scoreA;
  const homeWinner = m.winner && m.winner === m.teamH;
  const awayWinner = m.winner && m.winner === m.teamA;

  return (
    <motion.div
      layout
      className="border"
      style={{
        background: 'var(--card)',
        borderColor: isFinal ? 'var(--gold)' : 'var(--ink)',
        borderWidth: isFinal ? 2 : 1,
        boxShadow: 'var(--shadow)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      <div
        className="px-3 py-1.5 font-mono uppercase tracking-[0.2em] border-b flex justify-between"
        style={{
          fontSize: 9,
          color: isFinal ? 'var(--gold)' : 'var(--mute)',
          borderColor: 'var(--rule)',
        }}
      >
        <span>{m.id}</span>
        {isDraw && <span style={{ color: 'var(--accent)' }}>{t('penalties')}</span>}
      </div>

      <BracketRow
        teamName={m.teamH}
        score={m.scoreH}
        pens={m.penH}
        isWinner={homeWinner}
        isLoser={m.winner && !homeWinner}
        showPens={isDraw}
        onScoreChange={(v) => onScoreChange(m.id, 'scoreH', v)}
        onPenChange={(v) => onScoreChange(m.id, 'penH', v)}
      />

      <div
        style={{
          borderTop: '1px dashed var(--rule)',
          margin: '0 12px',
        }}
      />

      <BracketRow
        teamName={m.teamA}
        score={m.scoreA}
        pens={m.penA}
        isWinner={awayWinner}
        isLoser={m.winner && !awayWinner}
        showPens={isDraw}
        onScoreChange={(v) => onScoreChange(m.id, 'scoreA', v)}
        onPenChange={(v) => onScoreChange(m.id, 'penA', v)}
      />
    </motion.div>
  );
}

function BracketRow({
  teamName,
  score,
  pens,
  isWinner,
  isLoser,
  showPens,
  onScoreChange,
  onPenChange,
}: {
  teamName: string;
  score: number;
  pens: number;
  isWinner: boolean | null;
  isLoser: boolean | null;
  showPens: boolean;
  onScoreChange: (v: string) => void;
  onPenChange: (v: string) => void;
}) {
  const team = ALL_TEAMS.find((t) => t.name === teamName);
  const isTBD = !team;

  const textStyle: React.CSSProperties = {
    color: isWinner ? 'var(--accent)' : isLoser ? 'var(--mute)' : 'var(--ink)',
    textDecoration: isLoser ? 'line-through' : undefined,
    opacity: isLoser ? 0.55 : 1,
  };

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {isTBD ? (
          <span
            className="font-headline italic"
            style={{ fontSize: 12, color: 'var(--mute)' }}
          >
            TBD
          </span>
        ) : (
          <>
            <img
              src={`https://flagcdn.com/w40/${team!.code}.png`}
              alt={teamName}
              style={{
                width: 20,
                flexShrink: 0,
                border: '1px solid var(--rule)',
                opacity: isLoser ? 0.5 : 1,
              }}
            />
            <span
              className="font-display uppercase truncate leading-none"
              style={{ fontSize: 14, ...textStyle }}
            >
              {teamName}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {showPens && (
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={pens}
            onChange={(e) => onPenChange(e.target.value)}
            aria-label={`Penales de ${isTBD ? 'equipo' : teamName}`}
            className="focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              width: 28,
              height: 28,
              fontSize: 11,
              textAlign: 'center',
              background: 'var(--paper-edge)',
              border: '1px dashed var(--accent)',
              color: 'var(--accent)',
              outline: 'none',
              fontFamily: 'var(--font-jetbrains)',
            }}
          />
        )}
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={score}
          onChange={(e) => onScoreChange(e.target.value)}
          aria-label={`Goles de ${isTBD ? 'equipo' : teamName}`}
          className="focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            width: 36,
            height: 36,
            fontSize: 18,
            textAlign: 'center',
            border: '2px solid var(--ink)',
            background: isWinner ? 'var(--ink)' : 'var(--card)',
            color: isWinner ? 'var(--paper)' : 'var(--ink)',
            outline: 'none',
            fontFamily: 'var(--font-anton)',
          }}
        />
      </div>
    </div>
  );
}
