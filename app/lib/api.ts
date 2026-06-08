import type { CatalogResponse } from '../types/catalog';

const API_BASE_URL = 'https://api.bytewizard.ru';

export async function getCatalog(): Promise<CatalogResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/catalog`, {
      next: {
        revalidate: 60,
      },
    });

    console.log('API STATUS:', response.status);

    if (!response.ok) {
      throw new Error(`API ERROR ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('CATALOG FETCH ERROR:', error);

    return {
      items: [],
    };
  }
}

export async function getFeaturedCatalog(): Promise<CatalogResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/catalog/featured`, {
      // 🕒 Кэш на 6 часов (6 * 60 * 60 = 21600 секунд)
      next: { revalidate: 21600 },
    });

    if (!response.ok) {
      throw new Error(`API ERROR ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('FEATURED FETCH ERROR:', error);
    return { items: [] };
  }
}