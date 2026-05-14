'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.setHeaderColor('#0a0514');
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
    }
  }, []);

  if (!user) return null; // Просто ничего не рендерим, пока нет данных

  return (
    <div className="min-h-screen bg-[#0a0514] text-white relative overflow-hidden">
      
      {/* === ГЛАВНЫЙ ЭКРАН === */}
      
      {/* Кнопка меню (гамбургер) */}
      <button 
        onClick={() => setMenuOpen(true)}
        className="absolute top-4 left-4 z-10 text-2xl text-purple-400"
      >
        ☰
      </button>

      {/* Центрированный заголовок */}
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
          ByteWizard Shop
        </h1>
      </div>

      {/* === БОКОВОЕ МЕНЮ (SIDEBAR) === */}
      
      {/* Затемнение фона при открытом меню */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Сама панель меню */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#130a24] z-30 transform transition-transform duration-200 ease-out border-r border-purple-500/30 ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Кнопка закрытия */}
        <button 
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-xl text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {/* Профиль по центру */}
        <div className="flex flex-col items-center justify-center h-full px-4">
          
          {/* Аватарка */}
          <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-b from-purple-500 to-fuchsia-500 mb-4">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0514]">
              {user.photo_url ? (
                <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
              )}
            </div>
          </div>

          {/* Имя и Фамилия */}
          <p className="text-lg font-semibold text-center">
            {user.first_name} {user.last_name || ''}
          </p>
          
          {/* ID пользователя (мелко) */}
          <p className="text-xs text-purple-400 font-mono mt-1">
            ID: {user.id}
          </p>
          
        </div>
      </div>

    </div>
  );
}