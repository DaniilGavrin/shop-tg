'use client';
import { useEffect, useState } from 'react';

// Тип для данных пользователя из Telegram
interface TGUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export default function Home() {
  const [user, setUser] = useState<TGUser | null>(null);
  const [isTG, setIsTG] = useState(false);

  useEffect(() => {
    // Проверяем, запущено ли внутри Telegram
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      setIsTG(true);
      
      // Расширяем на весь экран
      tg.expand();
      
      // Получаем данные пользователя
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
      
      // Настраиваем цвета под тему
      document.documentElement.style.setProperty('--tg-bg', tg.backgroundColor || '#ffffff');
      document.documentElement.style.setProperty('--tg-text', tg.textColor || '#000000');
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg opacity-60 animate-pulse">
          {isTG ? 'Загрузка профиля...' : 'Откройте в Telegram'}
        </p>
      </div>
    );
  }

  return (
    <main className="p-4 max-w-md mx-auto space-y-4">
      <header className="flex items-center gap-3 pb-4 border-b border-[var(--tg-hint)]/20">
        {user.photo_url && (
          <img src={user.photo_url} alt="" className="w-12 h-12 rounded-full object-cover" />
        )}
        <div>
          <h1 className="text-xl font-bold">ByteWizard Shop</h1>
          <p className="text-sm opacity-60">@{user.username || user.id}</p>
        </div>
      </header>

      {/* Карточки товаров */}
      <ProductCard 
        title="🎮 Шаблон игры"
        desc="Готовый шаблон + документация"
        priceStars={50}
        priceTON={1.2}
        onAddToCart={() => console.log('Added to cart')}
      />
      <ProductCard 
        title="🛠 Консультация"
        desc="1 час диагностики + отчёт"
        priceStars={30}
        priceTON={0.8}
        onAddToCart={() => console.log('Added to cart')}
      />

      <footer className="pt-6 text-center text-xs opacity-40">
        TON + Telegram Mini Apps
      </footer>
    </main>
  );
}

// Простой компонент карточки (можно вынести в /components)
function ProductCard({ title, desc, priceStars, priceTON, onAddToCart }: {
  title: string; desc: string; priceStars: number; priceTON: number; onAddToCart: () => void;
}) {
  return (
    <div className="p-4 rounded-xl bg-[var(--tg-secondary)] border border-[var(--tg-hint)]/10">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm opacity-60 mt-1">{desc}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="font-mono text-sm">{priceStars} ⭐ / {priceTON} TON</span>
        <button 
          onClick={onAddToCart}
          className="px-4 py-2 rounded-lg font-medium hover:opacity-90 transition text-sm"
        >
          В корзину
        </button>
      </div>
    </div>
  );
}