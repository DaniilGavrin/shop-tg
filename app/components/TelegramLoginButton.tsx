'use client';

import { useEffect, useRef } from 'react';

export function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Очищаем контейнер
    ref.current.innerHTML = '';

    // Создаём скрипт виджета
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://oauth.telegram.org/js/telegram-login.js?5';
    
    // Обязательные атрибуты
    script.setAttribute('data-client-id', process.env.NEXT_PUBLIC_TG_BOT_ID || '7173695626');
    
    // 🔥 Ключевое: redirect_url должен быть ЗАРЕГИСТРИРОВАН в @BotFather
    // Формат: https://твой-домен/ру/профиль (без слэша в конце!)
    const redirectUrl = `${window.location.origin}/ru/profile`;
    script.setAttribute('data-redirect-url', redirectUrl);
    
    // Сохраняем текущий путь, чтобы вернуться после авторизации
    script.setAttribute('data-state', encodeURIComponent(window.location.pathname));
    
    // Запрашиваем телефон (опционально)
    script.setAttribute('data-request-access', 'phone');
    
    // Размер кнопки
    script.setAttribute('data-size', 'large');
    
    // Язык (ru/en)
    script.setAttribute('data-lang', 'ru');

    // ⚠️ НЕ используй data-onauth вместе с data-redirect-url — они конфликтуют!
    // Если хочешь JS-коллбек вместо редиректа — удали data-redirect-url и раскомментируй:
    /*
    window.onTelegramAuth = function(user: any) {
      // Отправляем данные на бэкенд для валидации
      fetch('/api/auth/telegram/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.location.href = '/ru/profile';
        }
      });
    };
    script.setAttribute('data-onauth', 'onTelegramAuth');
    */

    ref.current.appendChild(script);

    return () => {
      // Очистка при размонтировании
      ref.current!.innerHTML = '';
    };
  }, []);

  return (
    <div className="flex justify-center mt-3">
      <div ref={ref} className="telegram-login-container" />
    </div>
  );
}