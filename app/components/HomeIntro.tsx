'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '../lib/i18n/useTranslation';
import type { TelegramUser } from '../types/telegram';
import { getDisplayTelegramUser } from '../lib/telegram';

type HomeIntroProps = {
  // Пропсы больше не нужны — данные грузятся отдельно
};

export function HomeIntro({}: HomeIntroProps) {
  const { t } = useTranslation();
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [currency] = useState('RUB');

  useEffect(() => {
    setUser(getDisplayTelegramUser());
  }, []);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--text-dim)]">Загрузка...</p>
      </div>
    );
  }

  return (
    <header>
      {/* 🔝 Верхняя строка: Заголовок + Валюта */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gradient-neon">ByteWizard Shop</h1>
        
        <button
          type="button"
          className="
            shrink-0 rounded-xl border border-[rgba(176,38,255,0.3)]
            px-3 py-2 text-sm font-semibold text-[var(--neon-purple)]
            transition hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)]
            active:scale-[0.98]
          "
        >
          {currency} <span className="ml-1 text-xs opacity-70">▼</span>
        </button>
      </div>

      {/* 👋 Карточка приветствия */}
      <p className="mt-4 rounded-2xl border border-[rgba(176,38,255,0.28)] bg-[var(--bg-surface-glass)] px-5 py-4 text-center text-lg font-medium shadow-[0_0_22px_rgba(176,38,255,0.22)] backdrop-blur-md">
        {t.home.welcome},{' '}
        <span className="font-bold text-[var(--neon-purple)]">{user.first_name}</span>!
      </p>
    </header>
  );
}