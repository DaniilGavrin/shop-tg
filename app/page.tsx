'use client';
import { useEffect, useState } from 'react';

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

type Tab = 'home' | 'profile';

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
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
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[var(--neon-purple)] animate-pulse" />
          <p className="text-[var(--text-dim)] animate-pulse">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)] pb-20">
        <p className="text-[var(--text-dim)]">Не удалось загрузить данные</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-main)] relative pb-20">
      
      {/* === ГЛАВНЫЙ ЭКРАН === */}
      {activeTab === 'home' && (
        <main className="px-4 pt-16 pb-8">
          {/* Заголовок */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gradient-neon 
                         drop-shadow-[0_0_20px_rgba(176,38,255,0.7)]">
            ByteWizard Shop
          </h1>

          {/* Приветственный блок */}
          <div className="glass rounded-2xl p-6 border border-[var(--neon-purple)]/20 mb-6">
            <p className="text-lg text-center mb-2">
              Добро пожаловать, <span className="text-[var(--neon-purple)] font-semibold">{user.first_name}</span>! 👋
            </p>
            <p className="text-[var(--text-dim)] text-center text-sm">
              Здесь скоро будут твои заказы и настройки
            </p>
          </div>

          {/* Карточки (заглушки для будущего контента) */}
          <div className="space-y-4">
            <div className="glass rounded-xl p-4 border border-[var(--neon-purple)]/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-pink)] flex items-center justify-center text-2xl">
                  🛒
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-main)]">Мои заказы</h3>
                  <p className="text-sm text-[var(--text-dim)]">Пока нет активных заказов</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-[var(--neon-purple)]/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-main)]">Быстрые покупки</h3>
                  <p className="text-sm text-[var(--text-dim)]">Популярные товары</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* === ЭКРАН ПРОФИЛЯ === */}
      {activeTab === 'profile' && (
        <main className="px-4 pt-16 pb-8">
          <h1 className="text-2xl font-bold text-center mb-8 text-gradient-neon">
            Профиль
          </h1>

          {/* Карточка профиля */}
          <div className="glass rounded-2xl p-6 border border-[var(--neon-purple)]/30 mb-6">
            {/* Аватар */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-full 
                              bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-pink)] 
                              blur-md opacity-70" />
                <div className="relative w-28 h-28 rounded-full overflow-hidden 
                              border-2 border-[var(--neon-purple)] bg-[var(--bg-deep)]">
                  {user.photo_url ? (
                    <img 
                      src={user.photo_url} 
                      alt="avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-[var(--bg-surface)]">
                      👤
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold text-center">
                {user.first_name} {user.last_name || ''}
              </h2>
              
              {user.username ? (
                <p className="text-sm text-[var(--neon-blue)] font-mono mt-1">@{user.username}</p>
              ) : (
                <p className="text-xs text-[var(--text-dim)] font-mono mt-1">ID: {user.id}</p>
              )}
            </div>

            {/* Разделитель */}
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)] to-transparent my-4" />

            {/* Информация */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[var(--neon-purple)]/10">
                <span className="text-[var(--text-dim)]">Telegram ID</span>
                <span className="font-mono text-[var(--neon-purple)]">{user.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--neon-purple)]/10">
                <span className="text-[var(--text-dim)]">Язык</span>
                <span className="text-[var(--text-main)]">🇷🇺 Русский</span>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="space-y-3">
            <button className="w-full glass py-3 px-4 rounded-xl border border-[var(--neon-purple)]/20 
                             hover:bg-[var(--neon-purple)]/10 hover:border-[var(--neon-pink)]/50 
                             transition-all text-[var(--text-main)] text-left flex items-center gap-3">
              <span className="text-xl">⚙️</span>
              <span>Настройки</span>
            </button>
            
            <button className="w-full glass py-3 px-4 rounded-xl border border-[var(--neon-purple)]/20 
                             hover:bg-[var(--neon-purple)]/10 hover:border-[var(--neon-pink)]/50 
                             transition-all text-[var(--text-main)] text-left flex items-center gap-3">
              <span className="text-xl">❓</span>
              <span>Помощь и поддержка</span>
            </button>

            <button className="w-full glass py-3 px-4 rounded-xl border border-[var(--neon-purple)]/20 
                             hover:bg-red-500/10 hover:border-red-500/50 
                             transition-all text-red-400 text-left flex items-center gap-3 mt-6">
              <span className="text-xl">🚪</span>
              <span>Выйти</span>
            </button>
          </div>
        </main>
      )}

      {/* === НИЖНЯЯ НАВИГАЦИЯ (TAB BAR) === */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-[var(--neon-purple)]/30 
                      backdrop-blur-lg z-50 safe-area-pb">
        <div className="flex items-center justify-around max-w-md mx-auto">
          
          {/* Кнопка: Главная */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-4 
                        transition-all duration-200 relative
                        ${activeTab === 'home' 
                          ? 'text-[var(--neon-purple)]' 
                          : 'text-gray-500 hover:text-gray-300'}`}
          >
            {activeTab === 'home' && (
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--neon-purple)]/10 to-transparent" />
            )}
            {/* Иконка дома */}
            <svg 
              className={`w-6 h-6 mb-1 ${activeTab === 'home' ? 'drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]' : ''}`}
              fill={activeTab === 'home' ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs font-medium">Главная</span>
            {activeTab === 'home' && (
              <div className="absolute bottom-0 w-12 h-0.5 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-pink)] 
                            rounded-full shadow-[0_0_10px_rgba(176,38,255,0.8)]" />
            )}
          </button>

          {/* Кнопка: Профиль */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-4 
                        transition-all duration-200 relative
                        ${activeTab === 'profile' 
                          ? 'text-[var(--neon-purple)]' 
                          : 'text-gray-500 hover:text-gray-300'}`}
          >
            {activeTab === 'profile' && (
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--neon-purple)]/10 to-transparent" />
            )}
            {/* Иконка профиля */}
            <svg 
              className={`w-6 h-6 mb-1 ${activeTab === 'profile' ? 'drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]' : ''}`}
              fill={activeTab === 'profile' ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs font-medium">Профиль</span>
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 w-12 h-0.5 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-pink)] 
                            rounded-full shadow-[0_0_10px_rgba(176,38,255,0.8)]" />
            )}
          </button>

        </div>
      </nav>

    </div>
  );
}