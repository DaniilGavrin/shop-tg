// lib/telegram-login.ts
export function initTelegramLogin() {
  if (typeof window === 'undefined') return;

  if ((window as any).Telegram?.Login) return;

  const script = document.createElement('script');
  script.src = 'https://oauth.telegram.org/js/telegram-login.js';
  script.async = true;

  script.onload = () => {
    const tg = (window as any).Telegram;

    tg.Login.init(
      {
        client_id: Number(process.env.NEXT_PUBLIC_TG_BOT_ID),
        request_access: ['write'],
      },
      (user: any) => {
        // 🔥 ВАЖНО: тут только клиент, НЕ доверяем
        console.log('[TG LOGIN]', user);

        localStorage.setItem('telegram_user', JSON.stringify(user));

        // 👉 лучше сразу отправить на backend
        fetch('/api/auth/telegram-web', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
      }
    );
  };

  document.head.appendChild(script);
}