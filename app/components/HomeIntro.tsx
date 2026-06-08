'use client';

import { useTranslation } from '../lib/i18n/useTranslation';
import { useUser } from '../lib/UserContext';

export function HomeIntro() {
  const { t } = useTranslation();
  const user = useUser();

  return (
    <header className="text-center">
      <h1 className="text-3xl font-bold text-gradient-neon">ByteWizard Shop</h1>

      <p className="mt-4 rounded-2xl border border-[rgba(176,38,255,0.28)] bg-[var(--bg-surface-glass)] px-5 py-4 text-lg font-medium shadow-[0_0_22px_rgba(176,38,255,0.22)] backdrop-blur-md">
        {t.home.welcome},{' '}
        <span className="font-bold text-[var(--neon-purple)]">{user.first_name}</span>!
      </p>
    </header>
  );
}