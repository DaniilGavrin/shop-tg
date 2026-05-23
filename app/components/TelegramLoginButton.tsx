'use client';

import { useEffect, useRef } from 'react';

export function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = '';

    // ВАЖНО: глобальный callback должен существовать
    (window as any).onTelegramAuth = async (user: any) => {
      await fetch('/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      window.location.href = '/ru/profile';
    };

    const script = document.createElement('script');

    script.async = true;
    script.src =
      'https://oauth.telegram.org/js/telegram-login.js?5';

    script.setAttribute('data-client-id', '7173695626');

    script.setAttribute('data-request-access', 'phone');

    script.setAttribute('data-onauth', 'onTelegramAuth(user)');

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} className="flex justify-center mt-3" />;
}