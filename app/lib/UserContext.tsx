'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { TelegramUser } from '../types/telegram';

const UserContext = createContext<TelegramUser | null>(null);

export function UserProvider({ children, user }: { children: ReactNode; user: TelegramUser | null }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}