'use client';

import { useEffect, useRef } from 'react';
import { saveTelegramUser } from '../lib/telegram';

declare global {
  interface Window {
    TelegramLoginWidget?: {
      auth: (options: any, callback: (data: any) => void) => void;
    };
  }
}

export function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const handleAuth = (data: any) => {
      console.log('Telegram auth success', data);

      // id_token или user data
      saveTelegramUser(data);

      window.location.reload();
    };

    // создаём callback в window (для data-onauth fallback)
    (window as any).onTelegramAuth = handleAuth;

    const script = document.createElement('script');

    script.async = true;
    script.src = 'https://oauth.telegram.org/js/telegram-login.js?5';

    script.setAttribute('data-client-id', '7173695626');
    script.setAttribute('data-onauth', 'onTelegramAuth(data)');
    script.setAttribute('data-request-access', 'write');

    ref.current.innerHTML = '';
    ref.current.appendChild(script);

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, []);

  return (
    <div className="mt-3 overflow-hidden rounded-2xl">
      <div ref={ref} />
    </div>
  );
}