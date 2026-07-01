'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { TelegramUser } from '../types/telegram';

const DEFAULT_USER: TelegramUser = {
  id: 0,
  first_name: 'Guest',
  last_name: '',
  username: 'guest',
  photo_url: '',
};

const UserContext = createContext<TelegramUser>(DEFAULT_USER);

export function UserProvider({ children, user }: { children: ReactNode; user: TelegramUser }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  return context ?? DEFAULT_USER;
}