'use client';

import { useEffect, useRef } from 'react';
import { saveTelegramUser } from '../lib/telegram';

declare global {
  interface Window {
    onTelegramAuth: (data: any) => void;
  }
}

export function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // callback
    window.onTelegramAuth = (data) => {
      console.log('auth:', data);
      saveTelegramUser(data);
      window.location.reload();
    };

    // очищаем контейнер
    ref.current.innerHTML = '';

    // 1. создаём кнопку (ВАЖНО)
    const button = document.createElement('button');
    button.className = 'tg-auth-button';
    button.setAttribute('data-style', 'shine');

    ref.current.appendChild(button);

    // 2. загружаем SDK ПОСЛЕ кнопки
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://oauth.telegram.org/js/telegram-login.js?5';

    script.setAttribute('data-client-id', '7173695626');
    script.setAttribute('data-onauth', 'onTelegramAuth(data)');
    script.setAttribute('data-request-access', 'phone');

    ref.current.appendChild(script);

    return () => {
        
    };
  }, []);

  return <div ref={ref} />;
}