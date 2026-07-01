import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://shop.bytewizard.ru';

  return [
    // Главная
    { url: `${base}/ru`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/en`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },

    // Каталог
    { url: `${base}/ru/catalog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/en/catalog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

    // Корзина
    { url: `${base}/ru/cart`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/en/cart`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },

    // Профиль
    { url: `${base}/ru/profile`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/en/profile`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },

    // Заказы
    { url: `${base}/ru/profile/orders`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/en/profile/orders`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },

    // Контакты
    { url: `${base}/ru/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/en/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // Юридические страницы
    { url: `${base}/ru/legal`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/en/legal`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },

    { url: `${base}/ru/legal/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/en/legal/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },

    { url: `${base}/ru/legal/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/en/legal/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },

    { url: `${base}/ru/legal/license`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/en/legal/license`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },

    { url: `${base}/ru/legal/requisites`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/en/legal/requisites`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },

    { url: `${base}/ru/legal/refund`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/en/legal/refund`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];
}