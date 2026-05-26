export const dictionaries = {
  ru: {
    home: {
      welcome: 'Добро пожаловать',
    },
    nav: {
      home: 'Главная',
      catalog: 'Каталог',
      cart: 'Корзина',
      profile: 'Профиль',
      contact: 'Контакты'
    },
    profile: {
      account: 'Аккаунт',
      language: 'Язык',
      currency: 'Валюта',
      change: 'Изменить',
      contacts_hint: 'Все способы связи'
    },
    contact: {
      email_label: 'Почта', // 'Email' для en
      telegram_label: 'Telegram',
      vk_label: "ВКонтакте",
      wechat_label: "WeChat",
      discord_label: 'Discord',
      hint: 'Нажмите на карточку, чтобы связаться', // 'Tap a card to contact us' для en
    }
  },

  en: {
    home: {
      welcome: 'Welcome',
    },
    nav: {
      home: 'Home',
      catalog: 'Catalog',
      cart: 'Cart',
      profile: 'Profile',
      contact: 'Contact'
    },
    profile: {
      account: 'Account',
      language: 'Language',
      currency: 'Currency',
      change: 'Change',
      contacts_hint: 'All ways to connect'
    },
    contact: {
      email_label: 'Email',
      telegram_label: 'Telegram',
      vk_label: 'VK',
      wechat_label: "WeChat",
      discord_label: 'Discord',
      hint: 'Tap a card to contact us',
    }
  },
} as const;