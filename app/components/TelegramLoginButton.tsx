'use client';

import { useEffect, useRef } from 'react';

export function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const script = document.createElement('script');

    script.async = true;
    script.src =
      'https://oauth.telegram.org/js/telegram-login.js?5';

    script.setAttribute('data-client-id', '7173695626');

    script.setAttribute(
      'data-redirect-url',
      `${window.location.origin}/auth/telegram`
    );

    script.setAttribute(
      'data-state',
      encodeURIComponent(window.location.pathname)
    );

    script.setAttribute('data-request-access', 'phone');

    ref.current.innerHTML = '';
    ref.current.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center mt-3">
      <div ref={ref} />
    </div>
  );
}