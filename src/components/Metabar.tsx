'use client';
import { useTheme, THEMES, Theme } from '@/contexts/ThemeContext';

interface MetabarProps {
  matchesPlayed: number;
  totalGoals: number;
  topScorer: string | null;
  champion: string | null;
  onReset: () => void;
  onSimulateAll: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const THEME_ICONS: Record<Theme, string> = {
  editorial: '📘',
  'panini-premium': '✨',
  'panini-classic': '☀',
  dark: '☾',
};

export function Metabar({
  matchesPlayed,
  totalGoals,
  topScorer,
  champion,
  onReset,
  onSimulateAll,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: MetabarProps) {
  const { t, theme, setTheme, lang, setLang } = useTheme();

  const cycleTheme = () => {
    const idx = THEMES.indexOf(theme);
    setTheme(THEMES[(idx + 1) % THEMES.length]);
  };

  const cell = 'flex flex-col gap-1 px-3 md:px-5 py-3 min-w-0';
  const label =
    'font-mono text-[9px] md:text-[10px] uppercase tracking-[0.18em] whitespace-nowrap';
  const value =
    'font-display text-[22px] md:text-[28px] leading-none whitespace-nowrap truncate';
  const sep = { borderLeft: '1px solid var(--rule)' };

  const ctrlBase =
    'font-mono text-[9px] md:text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 border transition-colors disabled:opacity-40';
  const ctrlStyle = {
    borderColor: 'var(--ink)',
    color: 'var(--ink)',
    background: 'transparent',
  } as const;
  const ctrlPrimaryStyle = {
    borderColor: 'var(--ink)',
    background: 'var(--gold)',
    color: 'var(--ink)',
  } as const;

  return (
    <div
      data-panel="true"
      className="w-full border-b"
      style={{ borderColor: 'var(--ink)', background: 'var(--paper-edge)' }}
    >
      <div
        className="mx-auto max-w-7xl px-5 md:px-8 flex items-stretch flex-wrap"
        style={{ color: 'var(--ink)' }}
      >
        <div className={cell}>
          <span className={label} style={{ color: 'var(--mute)' }}>
            {t('matchesPlayed')}
          </span>
          <span className={value}>
            <span style={{ color: 'var(--accent)' }}>{matchesPlayed}</span>
            <span style={{ color: 'var(--mute)' }}>/104</span>
          </span>
        </div>

        <div className={cell} style={sep}>
          <span className={label} style={{ color: 'var(--mute)' }}>
            {t('totalGoals')}
          </span>
          <span className={value} style={{ color: 'var(--accent)' }}>
            {totalGoals}
          </span>
        </div>

        <div className={cell} style={sep}>
          <span className={label} style={{ color: 'var(--mute)' }}>
            {t('topScorer')}
          </span>
          <span className={value}>
            {topScorer ? topScorer : <span style={{ color: 'var(--mute)' }}>—</span>}
          </span>
        </div>

        <div className={cell} style={sep}>
          <span className={label} style={{ color: 'var(--mute)' }}>
            {t('champion')}
          </span>
          <span className={value}>
            {champion ? champion : <span style={{ color: 'var(--mute)' }}>—</span>}
          </span>
        </div>

        {/* Controls cell */}
        <div
          className="flex items-center gap-1.5 px-3 md:px-5 py-3 ml-auto flex-wrap"
          style={sep}
        >
          <button
            className={ctrlBase}
            style={ctrlStyle}
            onClick={() => setLang(lang === 'es' ? 'pt' : 'es')}
            title={t('language')}
          >
            {lang === 'es' ? '🇪🇸 ES' : '🇧🇷 PT'}
          </button>

          <button
            className={ctrlBase}
            style={ctrlStyle}
            onClick={cycleTheme}
            title={t('theme')}
            aria-label={t('theme')}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>{THEME_ICONS[theme]}</span>
          </button>

          <button
            className={ctrlBase}
            style={ctrlStyle}
            onClick={onUndo}
            disabled={!canUndo}
            title={t('undo')}
            aria-label={t('undo')}
          >
            ↶
          </button>

          <button
            className={ctrlBase}
            style={ctrlStyle}
            onClick={onRedo}
            disabled={!canRedo}
            title={t('redo')}
            aria-label={t('redo')}
          >
            ↷
          </button>

          <button
            className={ctrlBase}
            style={{ background: 'var(--card)', borderColor: 'var(--ink)', color: 'var(--ink)' }}
            onClick={onReset}
          >
            {t('reset')}
          </button>

          <button className={ctrlBase} style={ctrlPrimaryStyle} onClick={onSimulateAll}>
            ⚡ {t('simulateAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
