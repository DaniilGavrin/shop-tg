import type { TelegramUser, TelegramWebApp } from '../types/telegram';

const FALLBACK_USER: TelegramUser = {
  id: 0,
  first_name: 'Гость',
};

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.Telegram?.WebApp ?? null;
}

export function getTelegramUser(): TelegramUser | null {
  return getTelegramWebApp()?.initDataUnsafe?.user ?? null;
}

export function getDisplayTelegramUser(): TelegramUser {
  return getTelegramUser() ?? FALLBACK_USER;
}

export function setupTelegramWebApp() {
  const tg = getTelegramWebApp();

  if (!tg) {
    return;
  }

  tg.expand();

  if (!tg.isVersionAtLeast || tg.isVersionAtLeast('6.1')) {
    tg.setHeaderColor('#05020a');
    tg.setBackgroundColor('#05020a');
  }
}
