'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      } else {
        setUser({ first_name: 'User', id: 0 });
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4 neon-text">⚡</div>
          <p className="text-cyan-400 animate-pulse-slow">Connecting to network...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      {/* Шапка с неоновым эффектом */}
      <header className="mb-8 pt-4">
        <div className="flex items-center gap-4">
          {/* АВАТАРКА: ЖЁСТКИЙ ФИКС РАЗМЕРА */}
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              minWidth: '48px',
              minHeight: '48px',
              maxWidth: '48px',
              maxHeight: '48px'
            }}
            className="rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.5)]"
          >
            {user.photo_url ? (
              <img 
                src={user.photo_url} 
                alt="User" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xl font-bold">
                {user.first_name[0]?.toUpperCase()}
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-2xl font-bold neon-text text-cyan-400">
              BYTEWIZARD
            </h1>
            <p className="text-sm text-gray-400">
              ID: <span className="text-purple-400 font-mono">{user.id}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Карточка товара в киберпанк стиле */}
      <div className="cyber-card rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="text-3xl">🎮</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-cyan-300 mb-1">
              GAME_TEMPLATE_v2.0
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Готовый шаблон игры + документация + исходники
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-yellow-400">50</span>
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-gray-500 text-xs ml-2">|</span>
            <span className="text-purple-400 text-sm ml-2">1.2 TON</span>
          </div>
          
          <button 
            className="cyber-button px-6 py-2 rounded text-sm"
            onClick={() => alert('Добавлено в систему')}
          >
            BUY NOW
          </button>
        </div>
      </div>

      {/* Вторая карточка */}
      <div className="cyber-card rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="text-3xl">🛠</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-cyan-300 mb-1">
              TECH_SUPPORT
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              1 час консультации + диагностика + отчёт
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-yellow-400">30</span>
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-gray-500 text-xs ml-2">|</span>
            <span className="text-purple-400 text-sm ml-2">0.8 TON</span>
          </div>
          
          <button 
            className="cyber-button px-6 py-2 rounded text-sm"
            onClick={() => alert('Добавлено в систему')}
          >
            BUY NOW
          </button>
        </div>
      </div>

      {/* Футер */}
      <footer className="text-center pt-6 pb-4">
        <p className="text-xs text-gray-600 font-mono">
          [ SYSTEM: ONLINE ]
        </p>
        <p className="text-xs text-gray-700 mt-1">
          POWERED BY TON NETWORK
        </p>
      </footer>
    </main>
  );
}