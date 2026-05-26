export const dictionaries = {
  ru: {
    home: {
      welcome: 'Добро пожаловать',
      featured_title: 'Рекомендуем',
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
      contacts_hint: 'Все способы связи',
      legal: 'Документы',
      legal_hint: 'Оферта, политика, реквизиты'
    },
    legal: {
      title: 'Документы',
      privacy: 'Политика конфиденциальности',
      terms: 'Пользовательское соглашение',
      license: 'Лицензионное соглашение',
      requisites: 'Реквизиты ИП',
      refund: 'Возврат и отмена',
      open_in_cloud: 'Открыть в просмотрщике',
      updated: 'Обновлено:',
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
      featured_title: 'Featured',
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
      contacts_hint: 'All ways to connect',
      legal: 'Legal',
      legal_hint: 'Terms, privacy, requisites'
    },
    legal: {
      title: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      license: 'Software License',
      requisites: 'Business Details',
      refund: 'Refund Policy',
      open_in_cloud: 'Open in viewer',
      updated: 'Updated:',
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