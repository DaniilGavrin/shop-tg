'use client';
import { useEffect, useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next";

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.setHeaderColor('#05020a');
      tg.setBackgroundColor('#05020a');
      
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
    }
    // Фолбэк: если через 2 сек нет данных — показываем демо
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[var(--neon-purple)] animate-pulse" />
          <p className="text-[var(--text-dim)]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)]">
        <p className="text-[var(--text-dim)]">Не удалось загрузить данные пользователя</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-main)] relative overflow-hidden">
      
      {/* === ГЛАВНЫЙ ЭКРАН === */}
      <button 
        onClick={() => setMenuOpen(true)}
        className="absolute top-4 left-4 z-10 text-3xl text-[var(--neon-purple)] hover:text-[var(--neon-pink)] transition-colors drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]"
        aria-label="Открыть меню"
      >
        ☰
      </button>

      <div className="flex items-center justify-center h-screen px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient-neon drop-shadow-[0_0_25px_rgba(176,38,255,0.6)] text-center">
          ByteWizard Shop
        </h1>
      </div>

      {/* === БОКОВОЕ МЕНЮ === */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className={`sidebar fixed top-0 left-0 h-full w-72 bg-[var(--bg-surface)] z-30 border-r border-[var(--neon-purple)]/30 ${menuOpen ? 'open' : ''}`}>
        
        {/* Кнопка закрытия */}
        <button 
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-xl text-gray-400 hover:text-[var(--neon-pink)] transition-colors"
        >
          ✕
        </button>

        {/* Профиль */}
        <div className="flex flex-col items-center justify-center h-full px-6 py-8">
          
          {/* Аватар с неоном */}
          <div className="avatar-neon mb-5">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--bg-deep)]">
              {user.photo_url ? (
                <img 
                  src={user.photo_url} 
                  alt={`${user.first_name}'s avatar`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
              )}
            </div>
          </div>

          {/* Имя */}
          <p className="text-xl font-bold text-center text-[var(--text-main)]">
            {user.first_name} {user.last_name || ''}
          </p>
          
          {/* Юзернейм или ID */}
          {user.username ? (
            <p className="text-sm text-[var(--neon-blue)] font-mono mt-1">@{user.username}</p>
          ) : (
            <p className="text-xs text-[var(--text-dim)] font-mono mt-1">ID: {user.id}</p>
          )}

          {/* Декоративная линия */}
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)] to-transparent my-6" />

          {/* Кнопки меню (заглушки) */}
          <nav className="w-full space-y-2">
            {['🛒 Мои заказы', '⚙️ Настройки', '❓ Помощь'].map((item, i) => (
              <button
                key={i}
                className="w-full text-left px-4 py-3 rounded-lg glass hover:bg-[var(--neon-purple)]/10 hover:border-[var(--neon-pink)]/50 transition-all text-[var(--text-main)] hover:text-[var(--neon-pink)]"
              >
                {item}
              </button>
            ))}
          </nav>

        </div>
      </div>

      <SpeedInsights />
    </div>
  );
}