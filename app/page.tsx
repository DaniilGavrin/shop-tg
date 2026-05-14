'use client';
import { useEffect, useState } from 'react';

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

type Tab = 'home' | 'history' | 'profile';

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
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-main)] relative pb-24">
      
      {/* === ГЛАВНЫЙ ЭКРАН === */}
      {activeTab === 'home' && (
        <main className="px-6 pt-12 pb-8">
          <h1 className="text-3xl font-bold text-center mb-3 text-gradient-neon 
                         drop-shadow-[0_0_20px_rgba(176,38,255,0.7)]">
            ByteWizard Shop
          </h1>

          <div className="glass rounded-2xl p-6 border border-[var(--neon-purple)]/20">
            <p className="text-lg text-center">
              Добро пожаловать, <span className="text-[var(--neon-purple)] font-semibold">{user.first_name}</span>! 👋
            </p>
            <p className="text-[var(--text-dim)] text-center text-sm mt-2">
              Здесь скоро будут твои заказы и настройки
            </p>
          </div>
        </main>
      )}

      {/* === ЭКРАН ИСТОРИИ === */}
      {activeTab === 'history' && (
        <main className="px-6 pt-12 pb-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gradient-neon">
            История
          </h1>
          
          <div className="glass rounded-2xl p-8 border border-[var(--neon-purple)]/20 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-[var(--text-dim)]">История заказов пока пуста</p>
          </div>
        </main>
      )}

      {/* === ЭКРАН ПРОФИЛЯ === */}
      {activeTab === 'profile' && (
        <main className="px-6 pt-12 pb-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gradient-neon">
            Профиль
          </h1>

          <div className="glass rounded-2xl p-6 border border-[var(--neon-purple)]/30 mb-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-full 
                              bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-pink)] 
                              blur-md opacity-70" />
                <div className="relative w-24 h-24 rounded-full overflow-hidden 
                              border-2 border-[var(--neon-purple)] bg-[var(--bg-deep)]">
                  {user.photo_url ? (
                    <img 
                      src={user.photo_url} 
                      alt="avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-[var(--bg-surface)]">
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

            <div className="h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)] to-transparent my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[var(--neon-purple)]/10">
                <span className="text-[var(--text-dim)]">Telegram ID</span>
                <span className="font-mono text-[var(--neon-purple)]">{user.id}</span>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* === НИЖНЯЯ НАВИГАЦИЯ (как на скриншоте) === */}
      <nav className="fixed bottom-6 left-4 right-4 z-50 safe-area-pb">
        <div className="glass rounded-2xl border border-[var(--neon-purple)]/30 backdrop-blur-xl px-2 py-2">
          <div className="flex items-center justify-around relative">
            
            {/* Кнопка: Главная */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-3 
                          transition-all duration-300 relative
                          ${activeTab === 'home' 
                            ? 'text-[var(--neon-purple)]' 
                            : 'text-gray-500 hover:text-gray-300'}`}
            >
              {activeTab === 'home' && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-14 h-14 
                              bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-pink)] 
                              rounded-full flex items-center justify-center
                              shadow-[0_0_20px_rgba(176,38,255,0.6)]
                              border-2 border-[var(--neon-purple)]/50">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
                  </svg>
                </div>
              )}
              <svg 
                className={`w-6 h-6 mb-1 ${activeTab === 'home' ? 'opacity-0' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className={`text-xs font-medium ${activeTab === 'home' ? 'opacity-0' : ''}`}>
                Главная
              </span>
            </button>

            {/* Кнопка: История */}
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-3 
                          transition-all duration-300 relative
                          ${activeTab === 'history' 
                            ? 'text-[var(--neon-purple)]' 
                            : 'text-gray-500 hover:text-gray-300'}`}
            >
              {activeTab === 'history' && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-14 h-14 
                              bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-pink)] 
                              rounded-full flex items-center justify-center
                              shadow-[0_0_20px_rgba(176,38,255,0.6)]
                              border-2 border-[var(--neon-purple)]/50">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              <svg 
                className={`w-6 h-6 mb-1 ${activeTab === 'history' ? 'opacity-0' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`text-xs font-medium ${activeTab === 'history' ? 'opacity-0' : ''}`}>
                История
              </span>
            </button>

            {/* Кнопка: Профиль */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-3 
                          transition-all duration-300 relative
                          ${activeTab === 'profile' 
                            ? 'text-[var(--neon-purple)]' 
                            : 'text-gray-500 hover:text-gray-300'}`}
            >
              {activeTab === 'profile' && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-14 h-14 
                              bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-pink)] 
                              rounded-full flex items-center justify-center
                              shadow-[0_0_20px_rgba(176,38,255,0.6)]
                              border-2 border-[var(--neon-purple)]/50">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
              <svg 
                className={`w-6 h-6 mb-1 ${activeTab === 'profile' ? 'opacity-0' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className={`text-xs font-medium ${activeTab === 'profile' ? 'opacity-0' : ''}`}>
                Профиль
              </span>
            </button>

          </div>
        </div>
      </nav>

    </div>
  );
}