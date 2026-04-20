'use client';
import { useTheme } from '@/contexts/ThemeContext';

export function Masthead() {
  const { t } = useTheme();

  return (
    <header
      className="w-full py-6 md:py-10"
      style={{
        borderTop: '3px double var(--ink)',
        borderBottom: '3px double var(--ink)',
      }}
    >
      <div
        className="mx-auto max-w-7xl px-5 md:px-8 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 md:gap-8"
        style={{ color: 'var(--ink)' }}
      >
        {/* Left meta — hidden on <640 to give the title breathing room */}
        <div className="hidden sm:block font-mono text-[9px] md:text-[10px] leading-[1.6] uppercase tracking-[0.18em] space-y-0.5">
          <div style={{ color: 'var(--accent)' }}>★ {t('edition')}</div>
          <div>LUN 19 JUL 2026</div>
          <div>{t('region')}</div>
        </div>

        {/* Title block */}
        <div className="text-center">
          <h1
            className="font-display font-black uppercase leading-[0.85]"
            style={{
              fontSize: 'clamp(36px, 7vw, 108px)',
              color: 'var(--ink)',
            }}
          >
            {t('titleLine1')}
          </h1>
          <div
            className="font-headline italic mt-1"
            style={{
              fontSize: 'clamp(14px, 2.2vw, 32px)',
              color: 'var(--accent)',
              fontWeight: 900,
            }}
          >
            — {t('titleLine2')} —
          </div>
        </div>

        {/* Right meta — hidden on <640 */}
        <div className="hidden sm:block font-mono text-[9px] md:text-[10px] leading-[1.6] uppercase tracking-[0.18em] text-right space-y-0.5">
          <div style={{ color: 'var(--accent)' }}>{t('hosts')}</div>
          <div>{t('selections')}</div>
          <div>{t('matches104')}</div>
        </div>
      </div>
    </header>
  );
}
