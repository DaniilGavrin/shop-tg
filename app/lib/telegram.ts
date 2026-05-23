import type { TelegramUser, TelegramWebApp } from '../types/telegram';

const FALLBACK_USER: TelegramUser = {
  id: 0,
  first_name: 'Guest',
  last_name: '',
  username: 'guest',
  photo_url: '',
};

export function getTelegramWebApp(): TelegramWebApp | null {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.Telegram?.WebApp ?? null;
  } catch (error) {
    console.error('[Telegram] SDK access error:', error);

    return null;
  }
}

export function getTelegramUser(): TelegramUser | null {
  try {
    const tg = getTelegramWebApp();

    if (!tg) {
      return null;
    }

    return tg.initDataUnsafe?.user ?? null;
  } catch (error) {
    console.error('[Telegram] User resolve error:', error);

    return null;
  }
}

export function getDisplayTelegramUser(): TelegramUser {
  return getTelegramUser() ?? FALLBACK_USER;
}

export function setupTelegramWebApp() {
  try {
    const tg = getTelegramWebApp();

    // Telegram SDK отсутствует
    if (!tg) {
      console.warn('[Telegram] SDK unavailable');

      return;
    }

    tg.expand();

    if (!tg.isVersionAtLeast || tg.isVersionAtLeast('6.1')) {
      tg.setHeaderColor('#05020a');
      tg.setBackgroundColor('#05020a');
    }
  } catch (error) {
    console.error('[Telegram] Setup failed:', error);
  }
}