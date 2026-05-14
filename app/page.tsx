'use client';

import { useEffect, useState } from 'react';
import { HomeIntro } from './components/HomeIntro';
import { getDisplayTelegramUser } from './lib/telegram';
import type { TelegramUser } from './types/telegram';

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    setUser(getDisplayTelegramUser());
  }, []);

  if (!user) return null;

  return <HomeIntro user={user} />;
}

