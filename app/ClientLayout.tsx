'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BottomNavigation } from './components/BottomNavigation';
import { LoadingScreen } from './components/LoadingScreen';

import {
  getDisplayTelegramUser,
  setupTelegramWebApp,
} from './lib/telegram';

import type { AppTab, TelegramUser } from './types/telegram';

type ClientLayoutProps = {
  children: React.ReactNode;
};

export function ClientLayout({ children }: ClientLayoutProps) {
  const [user, setUser] = useState<TelegramUser | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  const locale = pathname.split('/')[1] || 'ru';

  const getActiveTab = (): AppTab => {
    if (pathname === `/${locale}`) return 'home';
    if (pathname.includes('/catalog')) return 'catalog';
    if (pathname.includes('/cart')) return 'cart';
    if (pathname.includes('/profile')) return 'profile';

    return 'home';
  };

  const handleTabChange = (tab: AppTab) => {
    const routes: Record<AppTab, string> = {
      home: `/${locale}`,
      catalog: `/${locale}/catalog`,
      cart: `/${locale}/cart`,
      profile: `/${locale}/profile`,
    };

    router.push(routes[tab]);
  };

  useEffect(() => {
    // Безопасная инициализация Telegram
    setupTelegramWebApp();

    // ВСЕГДА возвращает user или Guest
    const resolvedUser = getDisplayTelegramUser();

    setUser(resolvedUser);
  }, []);

  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <main className="app-shell">
      <section className="app-content">
        {children}
      </section>

      <BottomNavigation
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
      />
    </main>
  );
}