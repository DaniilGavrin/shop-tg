'use client';
import { useTranslation } from '../lib/i18n/useTranslation';
import { useUser } from '../lib/UserContext';

export function HomeIntro() {
  const { t } = useTranslation();
  const user = useUser();
  return (
    <header className="text-center">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
        ByteWizard Shop
      </h1>
      <p className="card mt-4 text-lg font-medium">
        {t.home.welcome},{' '}
        <span className="font-bold" style={{ color: 'var(--primary)' }}>
          {user.first_name}
        </span>!
      </p>
    </header>
  );
}