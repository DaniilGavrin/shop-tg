'use client';

import { useEffect, useState } from 'react';

import { HomeIntro } from '../components/HomeIntro';

import { getDisplayTelegramUser } from '../lib/telegram';

import type { TelegramUser } from '../types/telegram';

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const resolvedUser = getDisplayTelegramUser();

    setUser(resolvedUser);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return <HomeIntro user={user} />;
}