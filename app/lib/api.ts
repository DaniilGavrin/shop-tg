import type { CatalogResponse } from '../types/catalog';

const API_BASE_URL = 'https://api.shop.bytewizard.ru';

export async function getCatalog(): Promise<CatalogResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/catalog`, {
      cache: 'no-store',
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