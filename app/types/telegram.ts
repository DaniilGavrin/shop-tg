export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

export type TelegramWebApp = {
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  isVersionAtLeast?: (version: string) => boolean;
  initDataUnsafe?: {
    user?: TelegramUser;
  };
};

export type TelegramLogin = {
  init(options: { client_id: number; redirect_uri?: string; lang?: string }, callback: (data: any) => void): void;
  auth(options: { client_id: number; redirect_uri?: string; lang?: string }, callback: (data: any) => void): void;
  open(): void;
};

export type AppTab = 'home' | 'catalog' | 'cart' | 'profile';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
      Login?: TelegramLogin;
    };
  }
}
