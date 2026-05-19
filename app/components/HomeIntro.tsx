import { useTranslation } from '../lib/i18n/useTranslation';
import type { TelegramUser } from '../types/telegram';

type HomeIntroProps = {
  user: TelegramUser;
};

export function HomeIntro({ user }: HomeIntroProps) {
  const { t } = useTranslation();

  return (
    <header className="text-center">
      <h1 className="text-3xl font-bold text-gradient-neon">ByteWizard Shop</h1>
      <p className="mt-8 rounded-2xl border border-[rgba(176,38,255,0.28)] bg-[var(--bg-surface-glass)] px-5 py-5 text-lg font-medium shadow-[0_0_22px_rgba(176,38,255,0.22)] backdrop-blur-md">
        {t.home.welcome},{' '}
        <span className="font-bold text-[var(--neon-purple)]">{user.first_name}</span>!
      </p>
    </header>
  );
}
