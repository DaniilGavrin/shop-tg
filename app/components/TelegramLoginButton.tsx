'use client';

import { useEffect, useRef } from 'react';
import type { TelegramWebApp } from '../types/telegram';

export function TelegramLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initDoneRef = useRef(false);

  useEffect(() => {
    // Загружаем скрипт один раз
    if (initDoneRef.current) return;
    initDoneRef.current = true;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-login.js';
    script.async = true;

    script.onload = () => {
      if (!window.Telegram?.Login) {
        console.error('[Telegram] Login library not available');
        return;
      }

      const clientId = parseInt(process.env.NEXT_PUBLIC_TG_CLIENT_ID || '0', 10);

      if (!clientId) {
        console.error('[Telegram] Client ID not configured');
        return;
      }

      // Инициализируем с обработчиком
      window.Telegram.Login.init(
        { client_id: clientId, lang: 'en' },
        async (data) => {
          try {
            console.log('[TG LOGIN SUCCESS]', data);

            // Получаем id_token и user данные
            const { id_token, user } = data;

            if (!id_token) {
              console.error('[Telegram] No id_token received');
              return;
            }

            // Отправляем на backend для верификации
            const response = await fetch('/auth/telegram', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id_token }),
            });

            if (!response.ok) {
              console.error('[Telegram] Backend verification failed:', await response.text());
              return;
            }

            const result = await response.json();
            console.log('[TG AUTH SUCCESS]', result);

            // Сохраняем пользователя локально
            if (result.user) {
              localStorage.setItem('telegram_user', JSON.stringify(result.user));
            }

            // Перезагружаем страницу
            window.location.reload();
          } catch (err) {
            console.error('[Telegram] Auth error:', err);
          }
        }
      );
    };

    script.onerror = () => {
      console.error('[Telegram] Failed to load login library');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: удаляем скрипт при размонтировании
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleClick = () => {
    if (window.Telegram?.Login?.open) {
      window.Telegram.Login.open();
    } else {
      console.error('[Telegram] Login not initialized');
    }
  };

  return (
    <div ref={containerRef}>
      <button
        type="button"
        onClick={handleClick}
        className="rounded-lg border-2 border-[var(--neon-purple)] bg-[rgba(176,38,255,0.1)] px-4 py-2 text-sm font-semibold text-[var(--neon-purple)] transition hover:border-[var(--neon-pink)] hover:bg-[rgba(176,38,255,0.2)] hover:text-[var(--neon-pink)]"
      >
        Login with Telegram
      </button>
    </div>
  );
}