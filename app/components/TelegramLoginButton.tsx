'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    onTelegramAuth?: (data: any) => void;
  }
}

export function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const script = document.createElement('script');

    script.src =
      'https://oauth.telegram.org/js/telegram-login.js?5';

    script.async = true;

    script.setAttribute('data-client-id', '7173695626');

    script.setAttribute(
      'data-redirect-url',
      `${window.location.origin}/auth/telegram`
    );

    // 🔥 сохраняем куда вернуться
    script.setAttribute(
      'data-state',
      encodeURIComponent(window.location.pathname)
    );

    script.setAttribute('data-request-access', 'phone');

    ref.current.innerHTML = '';
    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} />;
}