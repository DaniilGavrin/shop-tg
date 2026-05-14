'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      // Красим хедер телеграма в цвет фона, чтобы было бесшовно
      tg.setHeaderColor('#05020a'); 
      
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      } else {
        setUser({ first_name: 'User', last_name: '' });
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#05020a]">
        <div className="text-2xl font-bold animate-pulse text-purple-500">
          LOADING SYSTEM...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      
      {/* --- ГЛАВНАЯ СТРАНИЦА --- */}
      <div className={`transition-all duration-300 ${menuOpen ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100'}`}>
        
        {/* Верхняя панель (Хедер) */}
        <header className="flex justify-between items-center p-4">
          <button 
            onClick={() => setMenuOpen(true)}
            className="text-3xl text-purple-400 hover:text-purple-300 transition"
          >
            ☰
          </button>
          <div className="w-8 h-8 rounded-full border border-purple-500/50 bg-purple-900/20 flex items-center justify-center">
             {/* Иконка магазина или лого */}
             <span className="text-xs">🛒</span>
          </div>
        </header>

        {/* Центральный контент */}
        <main className="flex flex-col items-center justify-center h-[70vh] px-6 text-center">
          
          {/* Логотип/Название */}
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(176,38,255,0.5)]">
            ByteWizard
          </h1>
          <p className="text-lg font-light tracking-widest text-purple-300 uppercase mb-8">
            Shop
          </p>

          {/* Декоративная линия */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full mb-6 shadow-[0_0_10px_#b026ff]"></div>

          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
            Цифровые товары и услуги в экосистеме TON.
            <br/>
            <span className="text-purple-500 mt-2 block">System Online</span>
          </p>

          {/* Кнопка призыва к действию (заглушка) */}
          <button className="mt-8 px-8 py-3 rounded-full bg-purple-600/20 border border-purple-500 text-purple-200 hover:bg-purple-600 hover:text-white hover:shadow-[0_0_20px_#b026ff] transition-all duration-300">
            Explore
          </button>
        </main>
      </div>

      {/* --- БОКОВОЕ МЕНЮ (DRAWER) --- */}
      {/* Оверлей (фон затемнения) */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Панель меню */}
      <div 
        className={`fixed top-0 left-0 h-full w-3/4 max-w-[300px] bg-[#0a0514] border-r border-purple-500/30 z-50 transform transition-transform duration-300 ease-in-out shadow-[10px_0_30px_rgba(0,0,0,0.8)] ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Шапка меню (Крестик) */}
          <div className="flex justify-end p-4">
            <button 
              onClick={() => setMenuOpen(false)}
              className="text-2xl text-gray-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Профиль (По центру) */}
          <div className="flex flex-col items-center mt-4 px-6">
            {/* Аватарка */}
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-b from-purple-500 to-pink-600 mb-4 shadow-[0_0_20px_rgba(176,38,255,0.6)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-black">
                {user.photo_url ? (
                  <img 
                    src={user.photo_url} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
                )}
              </div>
            </div>

            {/* Имя и Фамилия */}
            <h2 className="text-xl font-bold text-white text-center">
              {user.first_name} {user.last_name || ''}
            </h2>
            <p className="text-sm text-purple-400 font-mono mt-1">
              ID: {user.id}
            </p>

            {/* Статус */}
            <div className="mt-4 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-xs text-purple-300">
               Active
            </div>
          </div>

          {/* Разделитель */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-6"></div>

          {/* Пункты меню (Заглушки) */}
          <nav className="flex flex-col gap-2 px-6">
            <button className="text-left px-4 py-3 rounded-lg hover:bg-purple-800/30 text-gray-300 hover:text-purple-200 transition border border-transparent hover:border-purple-500/30">
              🛒 Мои покупки
            </button>
            <button className="text-left px-4 py-3 rounded-lg hover:bg-purple-800/30 text-gray-300 hover:text-purple-200 transition border border-transparent hover:border-purple-500/30">
              💰 Кошелёк
            </button>
            <button className="text-left px-4 py-3 rounded-lg hover:bg-purple-800/30 text-gray-300 hover:text-purple-200 transition border border-transparent hover:border-purple-500/30">
              ️ Настройки
            </button>
          </nav>

          {/* Футер меню */}
          <div className="mt-auto p-6 text-center">
            <p className="text-[10px] text-gray-600">ByteWizard Shop v1.0</p>
          </div>

        </div>
      </div>

    </div>
  );
}