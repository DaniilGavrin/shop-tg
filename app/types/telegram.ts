export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  phone?: string;
  photo_url?: string;
};

export type TelegramLoginCallback = {
  id_token?: string;
  user?: TelegramUser;
  error?: string;
};

export type TelegramLogin = {
  init: (
    options: {
      client_id: number;
      request_access?: ('write' | 'phone')[];
      lang?: string;
      nonce?: string;
    },

    callback: (
      data: TelegramLoginCallback
    ) => void
  ) => void;

  open: () => void;
};

export type TelegramWebApp = {
  initDataUnsafe?: {
    user?: TelegramUser;
  };

  expand: () => void;

  setHeaderColor: (
    color: string
  ) => void;

  setBackgroundColor: (
    color: string
  ) => void;

  isVersionAtLeast?: (
    version: string
  ) => boolean;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
      Login?: TelegramLogin;
    };
  }
}

export type AppTab =
  | 'home'
  | 'catalog'
  | 'cart'
  | 'profile';