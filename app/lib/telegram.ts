import type {
  TelegramUser,
  TelegramWebApp,
} from '../types/telegram';

const FALLBACK_USER: TelegramUser = {
  id: 0,
  first_name: 'Guest',
  last_name: '',
  username: 'guest',
  photo_url: '',
};

const STORAGE_KEY = 'telegram_user';

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

function getStoredTelegramUser(): TelegramUser | null {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as TelegramUser;
  } catch (error) {
    console.error('[Telegram] Stored user parse error:', error);

    localStorage.removeItem(STORAGE_KEY);

    return null;
  }
}

export function saveTelegramUser(user: TelegramUser) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(user)
    );
  } catch (error) {
    console.error('[Telegram] Save user error:', error);
  }
}

export function clearTelegramUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[Telegram] Clear user error:', error);
  }
}

export function getTelegramUser(): TelegramUser | null {
  try {
    // 1. Telegram Mini App
    const tg = getTelegramWebApp();

    const telegramUser =
      tg?.initDataUnsafe?.user ?? null;

    if (telegramUser) {
      return telegramUser;
    }

    // 2. Telegram Login Widget
    const storedUser = getStoredTelegramUser();

    if (storedUser) {
      return storedUser;
    }

    // 3. Guest
    return null;
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

    // SDK недоступен
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