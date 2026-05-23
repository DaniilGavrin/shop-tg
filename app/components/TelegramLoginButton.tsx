'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

export function TelegramLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    window.onTelegramAuth = async (user) => {
      try {
        console.log('[TG USER]', user);

        const response = await fetch('/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        const result = await response.json();

        console.log('[TG VERIFY]', result);

        if (!result.ok) {
          console.error('[TG VERIFY FAILED]');
          return;
        }

        localStorage.setItem(
          'telegram_user',
          JSON.stringify(result.user)
        );

        window.location.reload();
      } catch (err) {
        console.error('[TG LOGIN ERROR]', err);
      }
    };

    const script = document.createElement('script');

    script.async = true;

    script.src =
      'https://telegram.org/js/telegram-widget.js?23';

    script.setAttribute(
      'data-telegram-login',
      process.env.NEXT_PUBLIC_TG_BOT_USERNAME || ''
    );

    script.setAttribute('data-size', 'large');

    script.setAttribute('data-radius', '12');

    script.setAttribute(
      'data-request-access',
      'write'
    );

    script.setAttribute(
      'data-userpic',
      'false'
    );

    script.setAttribute(
      'data-onauth',
      'onTelegramAuth(user)'
    );

    containerRef.current.innerHTML = '';

    containerRef.current.appendChild(script);

    return () => {
      delete window.onTelegramAuth;
    };
  }, []);

  return <div ref={containerRef} />;
}