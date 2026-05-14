'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Функция проверки
    const checkTelegram = () => {
      const tg = (window as any).Telegram;
      
      if (tg && tg.WebApp) {
        const webApp = tg.WebApp;
        webApp.expand();
        
        // Устанавливаем цвета сразу
        if (webApp.backgroundColor) document.documentElement.style.setProperty('--tg-bg', webApp.backgroundColor);
        if (webApp.textColor) document.documentElement.style.setProperty('--tg-text', webApp.textColor);

        if (webApp.initDataUnsafe?.user) {
          setUser(webApp.initDataUnsafe.user);
        } else {
          // Если пользователь не передан (редко, но бывает при первой загрузке)
          setUser({ first_name: 'Пользователь' });
        }
      } else {
        setError('Telegram SDK не найден');
      }
    };

    // Пробуем сразу
    checkTelegram();

    // И пробуем через полсекунды (страховка)
    const timer = setTimeout(checkTelegram, 500);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">️ {error}</p>
        <p className="text-sm opacity-60">Убедись, что открыл Mini App через бота, а не прямую ссылку в браузере.</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Обновить
        </button>
      </div>
    );
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen animate-pulse">Загрузка...</div>;
  }

  return (
    <main className="p-4 max-w-md mx-auto space-y-4">
      <header className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        {user.photo_url && <img src={user.photo_url} alt="" className="w-10 h-10 rounded-full" />}
        <div>
          <h1 className="text-xl font-bold">ByteWizard Shop</h1>
          <p className="text-sm opacity-60">Привет, {user.first_name}!</p>
        </div>
      </header>

      <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold">🎮 Тестовый товар</h3>
        <p className="text-sm opacity-60 mt-1">Шаблон игры + инструкция</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="font-bold text-lg">50 ⭐</span>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
            В корзину
          </button>
        </div>
      </div>
    </main>
  );
}