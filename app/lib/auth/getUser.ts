import { getTelegramWebApp } from '../telegram';

export function getAuthUser() {
  if (typeof window === 'undefined') return null;

  // 1. Telegram WebApp (главный источник)
  const tg = getTelegramWebApp();

  const webAppUser = tg?.initDataUnsafe?.user;
  if (webAppUser) return webAppUser;

  // 2. Backend session (если добавишь JWT позже)
  const session = localStorage.getItem('session');
  if (session) return JSON.parse(session);

  // 3. Fallback widget
  const raw = localStorage.getItem('telegram_user');
  if (raw) return JSON.parse(raw);

  return null;
}