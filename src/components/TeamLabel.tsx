'use client';
import { ALL_TEAMS } from '@/data/groups';
import { useTeamModal } from '@/contexts/TeamModalContext';

export type TeamLabelVariant = 'inline' | 'compact' | 'stacked' | 'large';
export type TeamLabelAlign = 'left' | 'right';

interface TeamLabelProps {
  name: string;
  variant?: TeamLabelVariant;
  align?: TeamLabelAlign;
  onClick?: () => void;
  /** Disable opening the team modal on click */
  nonInteractive?: boolean;
  /** @deprecated kept for legacy callers; new code uses CSS vars via theme */
  dark?: boolean;
  /** @deprecated legacy width class; use `variant` instead */
  size?: string;
}

export function TeamLabel({
  name,
  variant = 'inline',
  align = 'left',
  onClick,
  nonInteractive = false,
}: TeamLabelProps) {
  const team = ALL_TEAMS.find((t) => t.name === name);
  const isTBD = !team;
  const code = team?.code?.toUpperCase() ?? 'TBD';

  const modal = useTeamModal();
  const handleClick = onClick
    ? onClick
    : !isTBD && !nonInteractive && modal
    ? () => modal.open(name)
    : undefined;

  const clickable = !!handleClick;
  const Wrapper: 'button' | 'div' = clickable ? 'button' : 'div';
  const hover = clickable ? 'hover:opacity-80 cursor-pointer' : '';

  if (variant === 'stacked' || variant === 'large') {
    const isLarge = variant === 'large';
    const flagW = isLarge ? 48 : 36;
    const nameSize = isLarge ? 'clamp(22px,2.4vw,38px)' : 'clamp(18px,1.8vw,26px)';
    const codeSize = isLarge ? 12 : 10;
    const alignClass =
      align === 'right' ? 'items-end text-right' : 'items-start text-left';

    return (
      <Wrapper
        onClick={handleClick}
        className={`flex flex-col gap-1 min-w-0 ${alignClass} ${hover}`}
      >
        {isTBD ? (
          <span
            className="font-headline italic"
            style={{ fontSize: 14, color: 'var(--mute)' }}
          >
            TBD
          </span>
        ) : (
          <>
            <img
              src={`https://flagcdn.com/w80/${team.code}.png`}
              alt={name}
              width={flagW}
              style={{
                height: 'auto',
                border: '1px solid var(--rule)',
                boxShadow: 'var(--shadow)',
              }}
            />
            <span
              className="font-display uppercase leading-none truncate max-w-full"
              style={{ fontSize: nameSize, color: 'var(--ink)' }}
            >
              {name}
            </span>
            <span
              className="font-mono uppercase tracking-[0.18em]"
              style={{ fontSize: codeSize, color: 'var(--mute)' }}
            >
              {code}
            </span>
          </>
        )}
      </Wrapper>
    );
  }

  if (variant === 'compact') {
    return (
      <Wrapper
        onClick={handleClick}
        className={`flex items-center gap-2 min-w-0 ${hover}`}
      >
        {isTBD ? (
          <span
            className="font-mono italic uppercase tracking-widest"
            style={{ fontSize: 10, color: 'var(--mute)' }}
          >
            TBD
          </span>
        ) : (
          <>
            <img
              src={`https://flagcdn.com/w40/${team.code}.png`}
              alt={name}
              style={{
                width: 18,
                height: 'auto',
                flexShrink: 0,
                border: '1px solid var(--rule)',
              }}
            />
            <span
              className="font-mono uppercase tracking-[0.12em] truncate"
              style={{ fontSize: 11, color: 'var(--ink)' }}
            >
              {code}
            </span>
          </>
        )}
      </Wrapper>
    );
  }

  // inline (default): flag + full name
  return (
    <Wrapper
      onClick={handleClick}
      className={`flex items-center gap-2 min-w-0 ${hover}`}
    >
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
            src={`https://flagcdn.com/w40/${team.code}.png`}
            alt={name}
            style={{
              width: 22,
              height: 'auto',
              flexShrink: 0,
              border: '1px solid var(--rule)',
            }}
          />
          <span
            className="font-display uppercase truncate leading-none"
            style={{ fontSize: 14, color: 'var(--ink)' }}
          >
            {name}
          </span>
        </>
      )}
    </Wrapper>
  );
}
