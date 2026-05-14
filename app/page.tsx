'use client';
import { useEffect, useState } from 'react';

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
        <p className="text-[var(--text-dim)]">Не удалось загрузить данные</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-main)] relative overflow-hidden">
      
      {/* === КНОПКА МЕНЮ (верхний левый угол) === */}
      <button 
        onClick={() => setMenuOpen(true)}
        className="fixed top-4 left-4 z-30 text-3xl p-2 rounded-lg 
                   text-[var(--neon-purple)] hover:text-[var(--neon-pink)]
                   transition-all duration-200
                   shadow-[0_0_15px_rgba(176,38,255,0.8)]
                   hover:shadow-[0_0_25px_rgba(255,0,127,0.9)]
                   active:scale-95"
        aria-label="Открыть меню"
      >
        ☰
      </button>

      {/* === ЗАГОЛОВОК (сверху по центру) === */}
      <header className="pt-16 pb-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gradient-neon 
                       drop-shadow-[0_0_20px_rgba(176,38,255,0.7)]">
          ByteWizard Shop
        </h1>
      </header>

      {/* === ОСНОВНОЙ КОНТЕНТ === */}
      <main className="px-4 pb-8">
        {/* Сюда потом добавишь карточки товаров, категории и т.д. */}
        <div className="glass rounded-2xl p-6 border border-[var(--neon-purple)]/20">
          <p className="text-[var(--text-dim)] text-center">
            Добро пожаловать, {user.first_name}! 👋<br/>
            Здесь скоро будут твои заказы и настройки.
          </p>
        </div>
      </main>

      {/* === ЗАТЕМНЕНИЕ ФОНА === */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* === SIDEBAR (исправленная анимация) === */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[var(--bg-surface)] z-50 
                      border-r border-[var(--neon-purple)]/30
                      transition-transform duration-300 ease-out
                      ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Кнопка закрытия */}
        <button 
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-2xl text-gray-400 
                     hover:text-[var(--neon-pink)] transition-colors p-2"
        >
          ✕
        </button>

        {/* Профиль */}
        <div className="flex flex-col items-center justify-center h-full px-6 py-8">
          
          {/* Аватар с неоном */}
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-full 
                          bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-pink)] 
                          blur-md opacity-70 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full overflow-hidden 
                          border-2 border-[var(--neon-purple)] bg-[var(--bg-deep)]">
              {user.photo_url ? (
                <img 
                  src={user.photo_url} 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
              )}
            </div>
          </div>

          {/* Имя */}
          <p className="text-xl font-bold text-center">
            {user.first_name} {user.last_name || ''}
          </p>
          
          {/* Юзернейм или ID */}
          {user.username ? (
            <p className="text-sm text-[var(--neon-blue)] font-mono mt-1">@{user.username}</p>
          ) : (
            <p className="text-xs text-[var(--text-dim)] font-mono mt-1">ID: {user.id}</p>
          )}

          {/* Декоративная линия */}
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)] to-transparent my-6" />

          {/* Кнопки меню */}
          <nav className="w-full space-y-2">
            {['🛒 Мои заказы', '⚙️ Настройки', '❓ Помощь'].map((item, i) => (
              <button
                key={i}
                className="w-full text-left px-4 py-3 rounded-xl glass 
                           hover:bg-[var(--neon-purple)]/10 
                           hover:border-[var(--neon-pink)]/50 
                           transition-all text-[var(--text-main)] 
                           hover:text-[var(--neon-pink)]"
              >
                {item}
              </button>
            ))}
          </nav>

        </div>
      </div>
    </div>
  );
}