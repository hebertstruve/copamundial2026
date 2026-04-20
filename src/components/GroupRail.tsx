'use client';
import { useRef, KeyboardEvent } from 'react';
import { INITIAL_GROUPS } from '@/data/groups';

interface GroupRailProps {
  active: string;
  onSelect: (g: string) => void;
  playedPerGroup: Record<string, number>;
}

export function GroupRail({ active, onSelect, playedPerGroup }: GroupRailProps) {
  const groups = Object.keys(INITIAL_GROUPS);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = groups.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next !== null) {
      e.preventDefault();
      onSelect(groups[next]);
      refs.current[next]?.focus();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Seleccionar grupo"
      className="flex md:flex-col gap-1.5 overflow-x-auto pb-2"
    >
      {groups.map((g, i) => {
        const isActive = active === g;
        const played = playedPerGroup[g] ?? 0;
        return (
          <button
            key={g}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="radio"
            aria-checked={isActive}
            aria-label={`Grupo ${g} · ${played} de 6 partidos jugados`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(g)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="flex-shrink-0 flex flex-col items-center justify-center border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            style={{
              width: 54,
              height: 54,
              background: isActive ? 'var(--ink)' : 'var(--card)',
              color: isActive ? 'var(--paper)' : 'var(--ink)',
              borderColor: isActive ? 'var(--accent)' : 'var(--ink)',
              borderRadius: 'var(--radius-card)',
              boxShadow: isActive ? 'var(--shadow)' : undefined,
            }}
          >
            <span
              aria-hidden="true"
              className="font-display leading-none"
              style={{ fontSize: 30 }}
            >
              {g}
            </span>
            <span
              aria-hidden="true"
              className="font-mono tracking-[0.15em]"
              style={{
                fontSize: 8,
                color: isActive ? 'var(--paper)' : 'var(--mute)',
              }}
            >
              {played}/6
            </span>
          </button>
        );
      })}
    </div>
  );
}
