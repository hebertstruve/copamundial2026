'use client';
import { useRef, KeyboardEvent } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export type PhaseView = 'groups' | 'bracket' | 'final';

interface PhaseNavProps {
  view: PhaseView;
  onChange: (v: PhaseView) => void;
}

const PHASES: { id: PhaseView; tagKey: string; labelKey: string }[] = [
  { id: 'groups', tagKey: 'phaseGroupsTag', labelKey: 'phaseGroups' },
  { id: 'bracket', tagKey: 'phaseBracketTag', labelKey: 'phaseBracket' },
  { id: 'final', tagKey: 'phaseFinalTag', labelKey: 'phaseFinal' },
];

export function PhaseNav({ view, onChange }: PhaseNavProps) {
  const { t } = useTheme();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = PHASES.length - 1;
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') nextIdx = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowLeft') nextIdx = i === 0 ? last : i - 1;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = last;
    if (nextIdx !== null) {
      e.preventDefault();
      onChange(PHASES[nextIdx].id);
      refs.current[nextIdx]?.focus();
    }
  };

  return (
    <nav className="w-full border-b" style={{ borderColor: 'var(--ink)' }}>
      <div
        role="tablist"
        aria-label={t('phaseGroups') + ' / ' + t('phaseBracket') + ' / ' + t('phaseFinal')}
        className="mx-auto max-w-7xl px-5 md:px-8 grid grid-cols-3"
      >
        {PHASES.map((p, i) => {
          const active = view === p.id;
          return (
            <button
              key={p.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${p.id}`}
              id={`tab-${p.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(p.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="relative py-4 md:py-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
              style={{ color: active ? 'var(--ink)' : 'var(--mute)' }}
            >
              <div
                className="font-mono text-[9px] md:text-[11px] uppercase tracking-[0.2em] mb-2"
                style={{ color: active ? 'var(--accent)' : 'var(--mute)' }}
              >
                {t(p.tagKey)}
              </div>
              <div
                className="font-display leading-none uppercase"
                style={{ fontSize: 'clamp(18px, 2.6vw, 34px)' }}
              >
                {t(p.labelKey)}
              </div>
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute left-4 right-4 bottom-0 h-[3px]"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
