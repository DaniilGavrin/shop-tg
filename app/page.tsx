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
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05020a]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#b026ff] animate-spin" 
               style={{borderTopColor: 'transparent'}} />
          <p className="text-[#8b5cf6] animate-pulse">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05020a]">
        <p className="text-[#8b5cf6]">Ошибка загрузки</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05020a] text-[#f3e8ff] relative" 
         style={{paddingBottom: '100px'}}>
      
      {/* === КОНТЕНТ === */}
      <div className="px-6 pt-12">
        <h1 className="text-3xl font-bold text-center mb-2"
            style={{
              background: 'linear-gradient(135deg, #b026ff, #ff007f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(176, 38, 255, 0.5)'
            }}>
          ByteWizard Shop
        </h1>

        <div className="mt-8 p-6 rounded-2xl text-center"
             style={{
               background: 'rgba(19, 10, 36, 0.85)',
               backdropFilter: 'blur(12px)',
               border: '1px solid rgba(176, 38, 255, 0.3)',
               boxShadow: '0 0 20px rgba(176, 38, 255, 0.3)'
             }}>
          <p className="text-lg mb-2">
            Добро пожаловать, <span style={{color: '#b026ff', fontWeight: '600'}}>{user.first_name}</span>! 👋
          </p>
          <p className="text-sm" style={{color: '#8b5cf6'}}>
            Здесь скоро будут твои заказы и настройки
          </p>
        </div>

        {activeTab === 'history' && (
          <div className="mt-6 p-8 rounded-2xl text-center"
               style={{
                 background: 'rgba(19, 10, 36, 0.85)',
                 backdropFilter: 'blur(12px)',
                 border: '1px solid rgba(176, 38, 255, 0.2)'
               }}>
            <div className="text-5xl mb-4">📋</div>
            <p style={{color: '#8b5cf6'}}>История пуста</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="mt-6 p-6 rounded-2xl"
               style={{
                 background: 'rgba(19, 10, 36, 0.85)',
                 backdropFilter: 'blur(12px)',
                 border: '1px solid rgba(176, 38, 255, 0.3)'
               }}>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-4xl"
                   style={{
                     background: 'linear-gradient(135deg, #b026ff, #ff007f)',
                     boxShadow: '0 0 20px rgba(176, 38, 255, 0.5)'
                   }}>
                {user.photo_url ? (
                  <img src={user.photo_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  '👤'
                )}
              </div>
              <h2 className="text-xl font-bold">{user.first_name} {user.last_name || ''}</h2>
              {user.username && <p className="text-sm mt-1" style={{color: '#00f0ff'}}>@{user.username}</p>}
            </div>
          </div>
        )}
      </div>

      {/* === НИЖНЕЕ МЕНЮ === */}
      <div className="fixed bottom-6 left-4 right-4 z-50">
        <div className="flex items-end justify-center gap-2">
          
          {/* Главная */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex-1 max-w-[100px] py-4 px-3 rounded-2xl transition-all duration-300 relative"
            style={{
              background: activeTab === 'home' 
                ? 'linear-gradient(135deg, #b026ff, #ff007f)'
                : 'rgba(19, 10, 36, 0.85)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${activeTab === 'home' ? '#b026ff' : 'rgba(176, 38, 255, 0.2)'}`,
              boxShadow: activeTab === 'home' ? '0 0 20px rgba(176, 38, 255, 0.5)' : 'none',
              transform: activeTab === 'home' ? 'translateY(-10px)' : 'translateY(0)',
              color: activeTab === 'home' ? 'white' : '#8b5cf6'
            }}>
            <svg className="w-6 h-6 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
            </svg>
            <span className="text-xs font-medium">Главная</span>
          </button>

          {/* История */}
          <button
            onClick={() => setActiveTab('history')}
            className="flex-1 max-w-[100px] py-4 px-3 rounded-2xl transition-all duration-300"
            style={{
              background: activeTab === 'history' 
                ? 'linear-gradient(135deg, #b026ff, #ff007f)'
                : 'rgba(19, 10, 36, 0.85)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${activeTab === 'history' ? '#b026ff' : 'rgba(176, 38, 255, 0.2)'}`,
              boxShadow: activeTab === 'history' ? '0 0 20px rgba(176, 38, 255, 0.5)' : 'none',
              transform: activeTab === 'history' ? 'translateY(-10px)' : 'translateY(0)',
              color: activeTab === 'history' ? 'white' : '#8b5cf6'
            }}>
            <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium">История</span>
          </button>

          {/* Профиль */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex-1 max-w-[100px] py-4 px-3 rounded-2xl transition-all duration-300"
            style={{
              background: activeTab === 'profile' 
                ? 'linear-gradient(135deg, #b026ff, #ff007f)'
                : 'rgba(19, 10, 36, 0.85)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${activeTab === 'profile' ? '#b026ff' : 'rgba(176, 38, 255, 0.2)'}`,
              boxShadow: activeTab === 'profile' ? '0 0 20px rgba(176, 38, 255, 0.5)' : 'none',
              transform: activeTab === 'profile' ? 'translateY(-10px)' : 'translateY(0)',
              color: activeTab === 'profile' ? 'white' : '#8b5cf6'
            }}>
            <svg className="w-6 h-6 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-xs font-medium">Профиль</span>
          </button>

        </div>
      </div>
    </div>
  );
}