'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [debug, setDebug] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const logs: string[] = [];
    
    // 1. Проверяем окно
    logs.push(`Window loaded: ${typeof window !== 'undefined'}`);
    
    if (typeof window === 'undefined') {
      setDebug(logs);
      return;
    }

    // 2. Проверяем Telegram объект
    const tg = (window as any).Telegram;
    logs.push(`window.Telegram exists: ${!!tg}`);
    
    if (!tg) {
      logs.push('💡 Открой через t.me/твой_бот/shortname');
      setDebug(logs);
      return;
    }

    // 3. Проверяем WebApp
    const webApp = tg.WebApp;
    logs.push(`Telegram.WebApp exists: ${!!webApp}`);
    
    if (!webApp) {
      setDebug(logs);
      return;
    }

    // 4. Успех — расширяем и получаем данные
    logs.push('✅ Telegram Mini App detected');
    webApp.expand?.();
    logs.push(`initDataUnsafe: ${!!webApp.initDataUnsafe}`);
    
    if (webApp.initDataUnsafe?.user) {
      setUser(webApp.initDataUnsafe.user);
      logs.push(`User: ${webApp.initDataUnsafe.user.first_name}`);
    }
    
    // 5. Применяем цвета
    if (webApp.backgroundColor) {
      document.documentElement.style.setProperty('--tg-bg', webApp.backgroundColor);
    }
    if (webApp.textColor) {
      document.documentElement.style.setProperty('--tg-text', webApp.textColor);
    }
    
    setDebug(logs);
  }, []);

  // Если есть пользователь — показываем магазин
  if (user) {
    return (
      <main className="p-4 max-w-md mx-auto space-y-4">
        <header className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
          {user.photo_url && (
            <img src={user.photo_url} alt="" className="w-12 h-12 rounded-full" />
          )}
          <div>
            <h1 className="text-xl font-bold">ByteWizard Shop</h1>
            <p className="text-sm opacity-60">@{user.username || `ID:${user.id}`}</p>
          </div>
        </header>

        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
          <h3 className="font-semibold">🎮 Шаблон игры</h3>
          <p className="text-sm opacity-60 mt-1">Готовый шаблон + инструкция</p>
          <div className="flex justify-between items-center mt-3">
            <span className="font-mono">50 ⭐ / 1.2 TON</span>
            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm">
              В корзину
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Если нет — показываем отладку
  return (
    <main className="p-4 font-mono text-sm">
      <h2 className="text-lg font-bold mb-4">🔍 Диагностика Mini App</h2>
      <div className="space-y-2">
        {debug.map((line, i) => (
          <div key={i} className="p-2 rounded bg-gray-100 dark:bg-gray-800">
            {line}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
        <p className="font-semibold">Чек-лист:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
          <li>Открываешь ссылку вида <code>https://t.me/БОТ/shortname</code>?</li>
          <li>В @BotFather → Mini App → URL указан <code>https://*.vercel.app</code>?</li>
          <li>После смены URL в BotFather нажал <code>/revoke</code> и заново создал приложение?</li>
        </ul>
      </div>
      
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 w-full py-2 rounded bg-blue-500 text-white"
      >
        🔄 Перезагрузить
      </button>
    </main>
  );
}