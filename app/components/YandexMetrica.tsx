'use client';

import { useEffect } from 'react';

const YANDEX_METRIKA_ID = '109855733';

export function YandexMetrika() {
  useEffect(() => {
    // Проверяем, что мы в браузере и Метрика ещё не загружена
    if (typeof window === 'undefined') return;
    if ((window as any).ym) return;

    // Таймаут: если Яндекс лежит больше 5 секунд — забиваем
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ Yandex.Metrika: timeout, skipping initialization');
    }, 5000);

    try {
      // Загружаем скрипт асинхронно
      const script = document.createElement('script');
      script.src = 'https://mc.yandex.ru/metrika/tag.js';
      script.async = true;
      
      // Обработка ошибок загрузки (если Яндекс недоступен)
      script.onerror = () => {
        clearTimeout(timeoutId);
        console.warn('⚠️ Yandex.Metrika: failed to load, skipping');
      };

      script.onload = () => {
        clearTimeout(timeoutId);
        
        try {
          // Инициализируем Метрику
          (window as any).ym = (window as any).ym || function() {
            ((window as any).ym.a = (window as any).ym.a || []).push(arguments);
          };
          (window as any).ym.l = Date.now(); // 🔥 ИСПРАВЛЕНО
          
          (window as any).ym(YANDEX_METRIKA_ID, 'init', {
            ssr: true,
            webvisor: true,
            clickmap: true,
            ecommerce: "dataLayer",
            accurateTrackBounce: true,
            trackLinks: true,
          });
          
          console.log('✅ Yandex.Metrika initialized');
        } catch (initError) {
          console.warn('⚠️ Yandex.Metrika: init error', initError);
        }
      };

      document.head.appendChild(script);
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('⚠️ Yandex.Metrika: script creation error', error);
    }

    // Cleanup при размонтировании
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Компонент ничего не рендерит
  return null;
}