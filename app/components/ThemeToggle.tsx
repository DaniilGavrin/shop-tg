'use client';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('bw_theme') as 'dark' | 'light' | null;
    if (saved) setTheme(saved);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('bw_theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-secondary w-full flex items-center justify-between"
      aria-label="Toggle theme"
    >
      <span className="flex items-center gap-2">
        <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
        <span>{theme === 'dark' ? 'Тёмная тема' : 'Светлая тема'}</span>
      </span>
      <span className="text-xs opacity-60">Переключить</span>
    </button>
  );
}