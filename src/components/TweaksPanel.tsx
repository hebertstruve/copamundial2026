'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, THEMES, Theme } from '@/contexts/ThemeContext';

const THEME_LABELS: Record<Theme, string> = {
  editorial: 'themeEditorial',
  dark: 'themeDark',
  'panini-classic': 'themePaniniClassic',
  'panini-premium': 'themePaniniPremium',
};

export function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const { t, theme, setTheme, lang, setLang } = useTheme();

  return (
    <div className="fixed right-4 bottom-4 z-30">
      <button
        onClick={() => setOpen((o) => !o)}
        className="font-mono uppercase tracking-[0.2em] px-3 py-2 border-2"
        style={{
          background: open ? 'var(--ink)' : 'var(--card)',
          color: open ? 'var(--paper)' : 'var(--ink)',
          borderColor: 'var(--ink)',
          fontSize: 10,
          boxShadow: 'var(--shadow)',
          borderRadius: 'var(--radius-card)',
        }}
        aria-expanded={open}
      >
        ⚙ {open ? '×' : 'Tweaks'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-panel="true"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 bottom-full mb-2 w-64 p-4 border-2"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--ink)',
              boxShadow: 'var(--shadow)',
              borderRadius: 'var(--radius-card)',
            }}
          >
            <Section label={t('language')}>
              <Row>
                <Opt
                  active={lang === 'es'}
                  onClick={() => setLang('es')}
                  label="🇪🇸 ES"
                />
                <Opt
                  active={lang === 'pt'}
                  onClick={() => setLang('pt')}
                  label="🇧🇷 PT"
                />
              </Row>
            </Section>

            <Section label={t('theme')}>
              <div className="grid grid-cols-2 gap-1.5">
                {THEMES.map((th) => (
                  <Opt
                    key={th}
                    active={theme === th}
                    onClick={() => setTheme(th)}
                    label={t(THEME_LABELS[th])}
                  />
                ))}
              </div>
            </Section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div
        className="font-mono uppercase tracking-[0.2em] mb-1.5"
        style={{ fontSize: 9, color: 'var(--mute)' }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-1.5">{children}</div>;
}

function Opt({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 font-mono uppercase tracking-[0.15em] px-2 py-1.5 border text-left"
      style={{
        background: active ? 'var(--ink)' : 'transparent',
        color: active ? 'var(--paper)' : 'var(--ink)',
        borderColor: 'var(--ink)',
        fontSize: 10,
      }}
    >
      {label}
    </button>
  );
}
