'use client';

import { useEffect } from 'react';

export function TelegramLoginButton() {
  useEffect(() => {
    // Проверяем, не загружен ли уже скрипт (защита от дублей в Strict Mode)
    if (document.querySelector('script[src*="telegram-login.js"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://oauth.telegram.org/js/telegram-login.js?5';
    script.async = true;
    
    // 🔥 ВСЕ data-* атрибуты — на самом скрипте, как в доке
    script.setAttribute('data-client-id', process.env.NEXT_PUBLIC_TG_BOT_ID || '7173695626');
    script.setAttribute('data-redirect-url', `${window.location.origin}/auth/telegram`);
    script.setAttribute('data-request-access', 'phone');
    script.setAttribute('data-lang', 'ru');
    script.setAttribute('data-size', 'large');
    
    const container = document.getElementById('tg-login-container');
    if (container) {
      container.innerHTML = ''; // очищаем, если есть старый контент
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center mt-3">
      {/* 🔥 ID обязателен — скрипт ищет это место */}
      <div id="tg-login-container" className="telegram-login-wrapper" />
    </div>
  );
}