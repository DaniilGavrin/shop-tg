'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { BottomNavigation } from './components/BottomNavigation';
import { getDisplayTelegramUser, setupTelegramWebApp } from './lib/telegram';
import { getCurrentUser } from './lib/auth';
import { UserProvider } from './lib/UserContext';
import type { AppTab, TelegramUser } from './types/telegram';

const DEFAULT_USER: TelegramUser = {
  id: 0, first_name: 'Guest', last_name: '', username: 'guest', photo_url: '',
};

function getLocale(pathname: string) {
  const part = pathname.split('/')[1];
  return part === 'ru' || part === 'en' ? part : 'ru';
}

function getActiveTab(pathname: string, locale: string): AppTab {
  if (pathname === `/${locale}`) return 'home';
  if (pathname.includes('/catalog')) return 'catalog';
  if (pathname.includes('/cart')) return 'cart';
  if (pathname.includes('/profile')) return 'profile';
  return 'home';
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const locale = useMemo(() => getLocale(pathname), [pathname]);
  const activeTab = useMemo(() => getActiveTab(pathname, locale), [pathname, locale]);
  const showBottomNav = useMemo(() => !/\/catalog\/\d+$/.test(pathname), [pathname]);
  const [user, setUser] = useState<TelegramUser>(DEFAULT_USER);

  useEffect(() => {
    setupTelegramWebApp();
    let cancelled = false;
    const run = async () => {
      try {
        const authUser = await getCurrentUser();
        if (!cancelled && authUser?.user) {
          setUser({
            id: Number(authUser.user.tg_id),
            first_name: authUser.user.first_name || 'User',
            last_name: authUser.user.last_name || '',
            username: authUser.user.username || '',
            photo_url: authUser.user.photo_url || '',
          });
          return;
        }
      } catch {}
      const tgUser = getDisplayTelegramUser();
      if (!cancelled && tgUser && tgUser.id !== 0) setUser(tgUser);
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const handleTabChange = (tab: AppTab) => {
    const routes: Record<AppTab, string> = {
      home: `/${locale}`,
      catalog: `/${locale}/catalog`,
      cart: `/${locale}/cart`,
      profile: `/${locale}/profile`,
    };
    startTransition(() => router.push(routes[tab]));
  };

  return (
    <UserProvider user={user}>
      <main className="app-shell min-h-screen w-full flex flex-col overflow-x-hidden">
        {isPending && (
          <div
            className="fixed top-0 left-0 right-0 h-1 animate-pulse z-50"
            style={{ backgroundColor: 'var(--primary)' }}
          />
        )}
        <section className="app-content flex-1 w-full min-w-0">{children}</section>
        {showBottomNav ? (
          <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        ) : (
          <div className="safe-area-pb" />
        )}
      </main>
    </UserProvider>
  );
}