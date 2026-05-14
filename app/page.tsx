'use client';

import { useEffect, useState, type ReactNode } from 'react';

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        expand: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        initDataUnsafe?: {
          user?: TelegramUser;
        };
      };
    };
  }
}

type Tab = 'home' | 'history' | 'profile';

const tabs: Array<{
  id: Tab;
  label: string;
  icon: ReactNode;
}> = [
  {
    id: 'home',
    label: 'Главная',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5v-9.7Z" />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'История',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 20a1.2 1.2 0 0 1-1.2-1.2v-4.6A1.2 1.2 0 0 1 7 13h1.6a1.2 1.2 0 0 1 1.2 1.2v4.6A1.2 1.2 0 0 1 8.6 20H7Zm4.2 0a1.2 1.2 0 0 1-1.2-1.2V8.2A1.2 1.2 0 0 1 11.2 7h1.6A1.2 1.2 0 0 1 14 8.2v10.6a1.2 1.2 0 0 1-1.2 1.2h-1.6Zm4.2 0a1.2 1.2 0 0 1-1.2-1.2V5.2A1.2 1.2 0 0 1 15.4 4H17a1.2 1.2 0 0 1 1.2 1.2v13.6A1.2 1.2 0 0 1 17 20h-1.6Z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Профиль',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Zm-7.2 7.3c.7-3.8 3.5-5.7 7.2-5.7s6.5 1.9 7.2 5.7c.1.8-.5 1.5-1.3 1.5H6.1c-.8 0-1.4-.7-1.3-1.5Z" />
      </svg>
    ),
  },
];

function getTelegramUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
}

export default function Home() {
  const [user] = useState<TelegramUser | null>(() => getTelegramUser());
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.expand();
      tg.setHeaderColor('#05020a');
      tg.setBackgroundColor('#05020a');
    }

    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-deep)]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-2 border-[var(--neon-purple)] border-t-transparent" />
          <p className="animate-pulse text-[var(--text-dim)]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-deep)] px-6 text-center">
        <p className="text-[var(--text-dim)]">Ошибка загрузки</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-deep)] px-5 pt-12 text-[var(--text-main)]">
      <section className="mx-auto flex min-h-[calc(100vh-128px)] max-w-md flex-col pb-32">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient-neon">ByteWizard Shop</h1>
          <p className="mt-8 rounded-[28px] border border-[rgba(176,38,255,0.28)] bg-[var(--bg-surface-glass)] px-5 py-5 text-lg shadow-[0_0_22px_rgba(176,38,255,0.22)] backdrop-blur-md">
            Добро пожаловать,{' '}
            <span className="font-semibold text-[var(--neon-purple)]">{user.first_name}</span>!
          </p>
        </div>

        {activeTab === 'history' && (
          <div className="mt-6 rounded-[24px] border border-[rgba(176,38,255,0.18)] bg-[rgba(19,10,36,0.62)] px-5 py-6 text-center text-[var(--text-dim)]">
            История пуста
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="mt-6 rounded-[24px] border border-[rgba(176,38,255,0.22)] bg-[rgba(19,10,36,0.68)] px-5 py-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))] text-2xl font-bold shadow-[0_0_22px_rgba(176,38,255,0.45)]">
                {user.first_name[0]}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">
                  {user.first_name} {user.last_name || ''}
                </h2>
                {user.username && (
                  <p className="truncate text-sm text-[var(--neon-blue)]">@{user.username}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <nav className="safe-area-pb fixed inset-x-0 bottom-0 z-50 px-4 pb-4" aria-label="Главное меню">
        <div className="mx-auto grid h-[76px] max-w-md grid-cols-3 items-end rounded-[34px] border border-[rgba(176,38,255,0.2)] bg-[rgba(247,241,255,0.96)] px-4 shadow-[0_14px_42px_rgba(0,0,0,0.38),0_0_28px_rgba(176,38,255,0.22)] backdrop-blur-xl">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="relative flex h-[76px] flex-col items-center justify-end pb-3 text-[11px] font-semibold transition-colors duration-200"
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={[
                    'grid h-7 w-7 place-items-center transition-all duration-300 [&>svg]:h-[22px] [&>svg]:w-[22px] [&>svg]:fill-current',
                    isActive
                      ? '-translate-y-9 scale-125 rounded-full bg-white text-[var(--neon-purple)] shadow-[0_8px_28px_rgba(176,38,255,0.32)] ring-[10px] ring-[rgba(176,38,255,0.12)]'
                      : 'text-[#a7a9b4]',
                  ].join(' ')}
                >
                  {tab.icon}
                </span>
                <span className={isActive ? 'text-[var(--neon-purple)]' : 'text-[#a7a9b4]'}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
