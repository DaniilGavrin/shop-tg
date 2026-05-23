'use client';

import { useEffect } from 'react';

export function TelegramLoginButton() {
  useEffect(() => {
    const init = async () => {
      const script = document.createElement('script');

      script.src =
        'https://telegram.org/js/telegram-login.js';

      script.async = true;

      script.onload = async () => {
        const TelegramLogin =
          (window as any).Telegram?.Login;

        if (!TelegramLogin) {
          console.error('Telegram Login unavailable');
          return;
        }

        try {
          TelegramLogin.init(
            {
              bot_id: process.env
                .NEXT_PUBLIC_TG_BOT_ID,

              origin: window.location.origin,

              request_access: true,
            },

            async (data: any) => {
              console.log('[TG OIDC]', data);

              const response = await fetch(
                '/auth/telegram',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type':
                      'application/json',
                  },
                  body: JSON.stringify(data),
                }
              );

              const result =
                await response.json();

              if (!result.ok) {
                console.error(result);
                return;
              }

              localStorage.setItem(
                'telegram_user',
                JSON.stringify(result.user)
              );

              window.location.reload();
            }
          );
        } catch (err) {
          console.error(err);
        }
      };

      document.body.appendChild(script);
    };

    init();
  }, []);

  return (
    <button
      onClick={() =>
        (window as any).Telegram?.Login?.open()
      }
      className="rounded-xl border border-[rgba(176,38,255,0.4)] px-4 py-2"
    >
      Login with Telegram
    </button>
  );
}