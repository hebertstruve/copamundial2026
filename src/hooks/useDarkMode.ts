'use client';
import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wc26-dark');
    if (saved !== null) setDark(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('wc26-dark', JSON.stringify(dark));
  }, [dark]);

  return { dark, setDark };
}
