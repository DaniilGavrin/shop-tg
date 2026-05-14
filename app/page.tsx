'use client';

import { useEffect, useState } from 'react';
import { BottomNavigation } from './components/BottomNavigation';
import { CartScreen } from './components/CartScreen';
import { CatalogScreen } from './components/CatalogScreen';
import { HomeIntro } from './components/HomeIntro';
import { LoadingScreen } from './components/LoadingScreen';
import { ProfilePanel } from './components/ProfilePanel';
import { getDisplayTelegramUser, setupTelegramWebApp } from './lib/telegram';
import type { AppTab, TelegramUser } from './types/telegram';

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setupTelegramWebApp();

    const timer = window.setTimeout(() => {
      setUser(getDisplayTelegramUser());
      setLoading(false);
    }, 350);

    return () => window.clearTimeout(timer);
  }, []);

  if (loading || !user) {
    return <LoadingScreen />;
  }

  return (
    <main className="app-shell">
      <section className="app-content">
        {activeTab === 'home' && <HomeIntro user={user} />}
        {activeTab === 'catalog' && <CatalogScreen />}
        {activeTab === 'cart' && <CartScreen />}
        {activeTab === 'profile' && <ProfilePanel user={user} />}
      </section>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}
