'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';

import { BottomNavigation } from './components/BottomNavigation';
import { getDisplayTelegramUser, setupTelegramWebApp } from './lib/telegram';
import { getCurrentUser } from './lib/auth';
import { UserProvider } from './lib/UserContext';

import type { AppTab, TelegramUser } from './types/telegram';

type ClientLayoutProps = {
  children: React.ReactNode;
};

const DEFAULT_USER: TelegramUser = {
  id: 0,
  first_name: 'Guest',
  last_name: '',
  username: 'guest',
  photo_url: '',
};

function getLocaleFromPath(pathname: string) {
  const part = pathname.split('/')[1];
  return part === 'ru' || part === 'en' ? part : 'ru';
}

function getActiveTabFromPath(pathname: string, locale: string): AppTab {
  if (pathname === `/${locale}`) return 'home';
  if (pathname.includes('/catalog')) return 'catalog';
  if (pathname.includes('/cart')) return 'cart';
  if (pathname.includes('/profile')) return 'profile';
  return 'home';
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const locale = useMemo(() => getLocaleFromPath(pathname), [pathname]);

  const activeTab = useMemo(
    () => getActiveTabFromPath(pathname, locale),
    [pathname, locale]
  );

  const showBottomNav = useMemo(() => {
    return !/\/catalog\/\d+$/.test(pathname);
  }, [pathname]);

  const [user, setUser] = useState<TelegramUser>(DEFAULT_USER);

  /**
   * 🔥 CRITICAL FIX:
   * предотвращаем layout jump от "Guest → User"
   */
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    setupTelegramWebApp();

    let cancelled = false;

    const checkAuth = async () => {
      try {
        const authUser = await getCurrentUser();

        if (cancelled) return;

        if (authUser?.user) {
          setUser({
            id: Number(authUser.user.tg_id),
            first_name: authUser.user.first_name || 'User',
            last_name: authUser.user.last_name || '',
            username: authUser.user.username || '',
            photo_url: authUser.user.photo_url || '',
          });
          return;
        }
      } catch {
        // ignore
      }

      const tgUser = getDisplayTelegramUser();

      if (tgUser && tgUser.id !== 0 && !cancelled) {
        setUser(tgUser);
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleTabChange = (tab: AppTab) => {
    const routes: Record<AppTab, string> = {
      home: `/${locale}`,
      catalog: `/${locale}/catalog`,
      cart: `/${locale}/cart`,
      profile: `/${locale}/profile`,
    };

    startTransition(() => {
      router.push(routes[tab]);
    });
  };

  /**
   * 🔥 FIX: стабилизируем initial paint
   * пока не hydrated — не даём layout пересобираться
   */
  if (!hydrated) {
    return (
      <UserProvider user={DEFAULT_USER}>
        <main className="app-shell">
          <section className="app-content">{children}</section>
        </main>
      </UserProvider>
    );
  }

  return (
    <UserProvider user={user}>
      <main className="app-shell min-h-screen w-full overflow-x-hidden flex flex-col">
        {isPending && (
          <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--neon-purple)] animate-pulse z-50" />
        )}

        <section className="app-content flex-1 w-full">
          {children}
        </section>

        {showBottomNav ? (
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        ) : (
          <div className="safe-area-pb" />
        )}
      </main>
    </UserProvider>
  );
}