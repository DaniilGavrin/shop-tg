'use client';

import { useEffect, useRef } from 'react';

import type {
  TelegramLoginCallback,
} from '../types/telegram';

export function TelegramLoginButton() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    const script =
      document.createElement('script');

    script.src =
      'https://oauth.telegram.org/js/telegram-login.js?5';

    script.async = true;

    script.onload = () => {
      const login =
        window.Telegram?.Login;

      if (!login) {
        console.error(
          '[TG] Login SDK unavailable'
        );

        return;
      }

      const clientId = Number(
        process.env
          .NEXT_PUBLIC_TG_CLIENT_ID
      );

      if (!clientId) {
        console.error(
          '[TG] Missing client id'
        );

        return;
      }

      login.init(
        {
          client_id: clientId,
          request_access: ['write'],
          lang: 'en',
        },

        async (
          data: TelegramLoginCallback
        ) => {
          console.log(
            '[TG CALLBACK]',
            data
          );

          if (data.error) {
            console.error(
              '[TG ERROR]',
              data.error
            );

            return;
          }

          if (!data.id_token) {
            console.error(
              '[TG] Missing id_token'
            );

            return;
          }

          try {
            const response =
              await fetch(
                '/auth/telegram',
                {
                  method: 'POST',

                  headers: {
                    'Content-Type':
                      'application/json',
                  },

                  body: JSON.stringify({
                    id_token:
                      data.id_token,
                  }),
                }
              );

            const result =
              await response.json();

            console.log(
              '[TG VERIFY]',
              result
            );

            if (!result.ok) {
              return;
            }

            localStorage.setItem(
              'telegram_user',

              JSON.stringify(
                result.user
              )
            );

            window.location.reload();
          } catch (error) {
            console.error(
              '[TG FETCH ERROR]',
              error
            );
          }
        }
      );
    };

    script.onerror = () => {
      console.error(
        '[TG] Failed to load SDK'
      );
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  const handleLogin = () => {
    const login =
      window.Telegram?.Login;

    if (!login) {
      console.error(
        '[TG] SDK not initialized'
      );

      return;
    }

    login.open();
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="
        rounded-xl
        border
        border-[var(--neon-purple)]
        bg-[rgba(176,38,255,0.12)]
        px-4
        py-2
        text-sm
        font-semibold
        text-[var(--neon-purple)]
        transition
        hover:border-[var(--neon-pink)]
        hover:text-[var(--neon-pink)]
      "
    >
      Login with Telegram
    </button>
  );
}


async (data: TelegramLoginCallback) => {
  if (data.error) { /* ... */ return; }
  if (!data.id_token || !data.user?.id) return;

  // 🔹 Собираем полный пакет данных для бэка
  const payload = {
    tg_id: data.user.id,                // REQUIRED (NOT NULL)
    first_name: data.user.first_name,   // REQUIRED (NOT NULL)
    username: data.user.username ?? null,
    last_name: data.user.last_name ?? null,
    phone: data.user.phone ?? null,     // Придет, если юзер разрешил
    photo_url: data.user.photo_url ?? null,
    // id_token оставляем, если бэк захочет проверить подпись (опционально)
    id_token: data.id_token, 
  };

  try {
    // 🔹 Шлём НАПРЯМУЮ на твой FastAPI бэк
    const response = await fetch('https://api.shop.bytewizard.ru/users/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.ok) {
      // Сохраняем юзера локально и перезагружаем страницу
      localStorage.setItem('telegram_user', JSON.stringify(result.user));
      window.location.reload();
    } else {
      console.error('[BACKEND ERROR]', result.error);
    }
  } catch (err) {
    console.error('[FETCH ERROR]', err);
  }
}