'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { I18N, Language } from '@/data/i18n';

export type Theme = 'editorial' | 'dark' | 'panini-classic' | 'panini-premium';
export const THEMES: Theme[] = ['editorial', 'dark', 'panini-classic', 'panini-premium'];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Language;
  setLang: (l: Language) => void;
  dark: boolean;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('editorial');
  const [lang, setLangState] = useState<Language>('es');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('wc26-theme') as Theme | null;
    if (savedTheme && THEMES.includes(savedTheme)) {
      setThemeState(savedTheme);
    } else {
      const legacyDark = localStorage.getItem('wc26-dark');
      if (legacyDark === 'true') setThemeState('dark');
    }
    const savedLang = localStorage.getItem('wc26-lang');
    if (savedLang === 'es' || savedLang === 'pt') setLangState(savedLang);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wc26-theme', theme);
  }, [theme, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = lang;
    localStorage.setItem('wc26-lang', lang);
  }, [lang, hydrated]);

  const dark = theme === 'dark' || theme === 'panini-premium';

  const value: ThemeContextValue = {
    theme,
    setTheme: setThemeState,
    lang,
    setLang: setLangState,
    dark,
    t: (key: string) => I18N[key]?.[lang] ?? key,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
