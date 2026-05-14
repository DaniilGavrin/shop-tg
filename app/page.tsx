'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      // Получаем юзера
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      } else {
        setUser({ first_name: 'Гость' });
      }
    }
  }, []);

  if (!user) return <div className="p-4 text-center opacity-50">Загрузка...</div>;

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      {/* Шапка */}
      <header className="flex items-center gap-3">
        {/* Аватарка: жестко 48x48px, object-cover чтобы не сплющило */}
        {user.photo_url ? (
          <img 
            src={user.photo_url} 
            alt="User" 
            className="w-12 h-12 rounded-full object-cover border border-gray-500/20"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {user.first_name[0]}
          </div>
        )}
        
        <div>
          <h1 className="text-xl font-bold leading-tight">ByteWizard Shop</h1>
          <p className="text-sm opacity-60">Привет, {user.first_name}!</p>
        </div>
      </header>

      {/* Карточка товара */}
      <div className="p-4 rounded-xl border border-opacity-10 border-current bg-[var(--tg-theme-secondary-bg-color, #f5f5f5)]">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🎮</div>
          <div className="flex-1">
            <h3 className="font-bold text-base">Тестовый товар</h3>
            <p className="text-sm opacity-60 mt-1 leading-snug">
              Шаблон игры + инструкция по установке
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-1 font-mono font-medium">
            <span>50</span>
            <span className="text-yellow-500">⭐</span>
          </div>
          
          <button 
            className="px-5 py-2 rounded-lg bg-[var(--tg-theme-button-color, #3390ec)] text-[var(--tg-theme-button-text-color, #fff)] font-medium text-sm hover:opacity-90 active:scale-95 transition-transform"
            onClick={() => alert('Добавлено в корзину (пока что)')}
          >
            В корзину
          </button>
        </div>
      </div>

      {/* Футер */}
      <footer className="text-center text-xs opacity-40 pt-4">
        Powered by TON + Next.js
      </footer>
    </main>
  );
}