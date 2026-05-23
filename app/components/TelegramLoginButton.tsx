'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

export function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.onTelegramAuth = async (user) => {
      console.log(user);
    };

    const script = document.createElement('script');

    script.src =
      'https://telegram.org/js/telegram-widget.js?23';

    script.async = true;

    script.setAttribute(
      'data-telegram-login',
      'ByteWizardShop_bot'
    );

    script.setAttribute(
      'data-size',
      'large'
    );

    script.setAttribute(
      'data-onauth',
      'onTelegramAuth(user)'
    );

    setTimeout(() => {
      ref.current?.appendChild(script);
    }, 100);

    return () => {
      delete window.onTelegramAuth;
    };
  }, []);

  return <div ref={ref} />;
}