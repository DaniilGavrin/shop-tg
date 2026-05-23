'use client';

import { useEffect, useRef } from 'react';
import { saveTelegramUser } from '../lib/telegram';

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

export function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    window.onTelegramAuth = async (user) => {
      console.log('Telegram auth success', user);

      saveTelegramUser(user);

      window.location.reload();
    };

    const script = document.createElement('script');

    script.src = 'https://telegram.org/js/telegram-widget.js?22';

    script.async = true;

    script.setAttribute(
      'data-telegram-login',
      'ByteWIzardShop_bot'
    );

    script.setAttribute('data-size', 'large');

    script.setAttribute('data-radius', '16');

    script.setAttribute('data-request-access', 'write');

    script.setAttribute('data-userpic', 'false');

    script.setAttribute('data-onauth', 'onTelegramAuth(user)');

    ref.current.innerHTML = '';

    ref.current.appendChild(script);

    return () => {
      delete window.onTelegramAuth;
    };
  }, []);

  return (
    <div className="mt-3 overflow-hidden rounded-2xl">
      <div ref={ref} />
    </div>
  );
}