'use client';
import { motion } from 'framer-motion';
import { VENUE_IMAGES, VENUE_LOCATION } from '@/data/schedule';
import { TeamLabel } from './TeamLabel';
import { useTheme } from '@/contexts/ThemeContext';

interface MatchCardProps {
  match: any;
  onScoreChange: (id: string, side: string, val: string) => void;
}

export function MatchCard({ match: m, onScoreChange }: MatchCardProps) {
  const { t } = useTheme();
  const venueInfo = VENUE_LOCATION[m.venue];
  const jornada = Number(String(m.id).split('-')[1]) + 1;
  const homeWins = m.played && m.scoreH > m.scoreA;
  const awayWins = m.played && m.scoreA > m.scoreH;

  return (
    <div className="wc-card">
    <motion.div
      layout
      className="overflow-hidden border"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--ink)',
        boxShadow: 'var(--shadow)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      {VENUE_IMAGES[m.venue] && (
        <div
          className="w-full h-28 md:h-32 overflow-hidden"
          style={{ background: 'var(--paper-edge)' }}
        >
          <img
            src={VENUE_IMAGES[m.venue]}
            alt={m.venue}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div
        className="flex items-start justify-between gap-3 px-4 py-2 border-b font-mono uppercase tracking-[0.18em]"
        style={{
          borderColor: 'var(--rule)',
          fontSize: 10,
          color: 'var(--ink-soft)',
        }}
      >
        <div className="flex flex-col min-w-0">
          <span className="font-bold truncate" style={{ color: 'var(--ink)' }}>
            {m.venue}
          </span>
          {venueInfo && (
            <span className="truncate" style={{ color: 'var(--mute)' }}>
              {venueInfo.city}
            </span>
          )}
        </div>
        <div className="text-right shrink-0">
          <div style={{ color: 'var(--ink)' }}>{m.date}</div>
          <div style={{ color: 'var(--mute)' }}>{m.time}</div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-5 px-4 py-5">
        <div className="flex justify-end">
          <TeamLabel name={m.home} variant="stacked" align="right" />
        </div>

        <div className="flex items-center gap-1.5">
          <ScoreInput
            value={m.scoreH}
            onChange={(v) => onScoreChange(m.id, 'scoreH', v)}
            winning={homeWins}
            ariaLabel={`Goles de ${m.home} contra ${m.away}`}
          />
          <span
            aria-hidden="true"
            className="font-display"
            style={{ fontSize: 26, color: 'var(--mute)', lineHeight: 1 }}
          >
            –
          </span>
          <ScoreInput
            value={m.scoreA}
            onChange={(v) => onScoreChange(m.id, 'scoreA', v)}
            winning={awayWins}
            ariaLabel={`Goles de ${m.away} contra ${m.home}`}
          />
        </div>

        <div className="flex justify-start">
          <TeamLabel name={m.away} variant="stacked" align="left" />
        </div>
      </div>

      <div
        className="flex justify-between items-center px-4 py-2 border-t font-mono uppercase tracking-[0.18em]"
        style={{
          borderColor: 'var(--rule)',
          fontSize: 9,
          color: 'var(--mute)',
        }}
      >
        <span>
          {m.played ? `Jornada ${Math.ceil(jornada / 2)}` : t('toBePlayed')}
        </span>
        <span>{m.id}</span>
      </div>
    </motion.div>
    </div>
  );
}

function ScoreInput({
  value,
  onChange,
  winning,
  ariaLabel,
}: {
  value: number;
  onChange: (v: string) => void;
  winning: boolean;
  ariaLabel: string;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className="font-display text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        width: 44,
        height: 54,
        fontSize: 24,
        border: '2px solid var(--ink)',
        background: winning ? 'var(--ink)' : 'var(--card)',
        color: winning ? 'var(--paper)' : 'var(--ink)',
        padding: '6px 0 4px',
        WebkitAppearance: 'none',
        MozAppearance: 'textfield',
      }}
    />
  );
}
