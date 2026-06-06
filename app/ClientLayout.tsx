'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BottomNavigation } from './components/BottomNavigation';
import { LoadingScreen } from './components/LoadingScreen';
import { getDisplayTelegramUser, setupTelegramWebApp } from './lib/telegram';
import { getCurrentUser } from './lib/auth';
import type { AppTab, TelegramUser } from './types/telegram';

type ClientLayoutProps = {
  children: React.ReactNode;
};

export function ClientLayout({ children }: ClientLayoutProps) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1] || 'ru';

  const showBottomNav = !pathname.match(/\/catalog\/\d+$/);

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
    setupTelegramWebApp();
    
    const checkAuth = async () => {
      const authUser = await getCurrentUser();
      console.log('[AUTH] getCurrentUser result:', authUser);

      if (authUser?.user) {
        console.log('[AUTH] User found:', authUser.user);
        setUser({
          id: Number(authUser.user.tg_id),
          first_name: authUser.user.first_name || 'User',
          last_name: authUser.user.last_name || '',
          username: authUser.user.username || '',
          photo_url: authUser.user.photo_url || '',
        });
        return;
      }
      
      
      console.log('[AUTH] No user from /me, trying Telegram WebApp');
      const tgUser = getDisplayTelegramUser();
      console.log('[AUTH] Telegram WebApp user:', tgUser);

      if (tgUser && tgUser.id !== 0) {
        setUser(tgUser);
        return;
      }
      
      console.log('[AUTH] Setting Guest user');
      setUser({
        id: 0,
        first_name: 'Guest',
        last_name: '',
        username: 'guest',
        photo_url: '',
      });
    };
    
    checkAuth();
  }, []);

  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <main className="app-shell">
      <section className="app-content">{children}</section>
      {showBottomNav ? (
        <BottomNavigation activeTab={getActiveTab()} onTabChange={handleTabChange} />
      ) : (
        <div className="safe-area-pb" />
      )}
    </main>
  );
}