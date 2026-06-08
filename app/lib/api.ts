import type { CatalogResponse } from '../types/catalog';

const API_BASE_URL = 'https://api.bytewizard.ru';

let catalogCache: { data: CatalogResponse; timestamp: number } | null = null;
const CACHE_DURATION = 15 * 60 * 1000;

export async function getCatalog(): Promise<CatalogResponse> {
  if (catalogCache && Date.now() - catalogCache.timestamp < CACHE_DURATION) {
    console.log('[CATALOG] Loaded from cache');
    return catalogCache.data;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/catalog`, {
      next: {
        revalidate: 600,
      },
    });

    console.log('API STATUS:', response.status);

    if (!response.ok) {
      throw new Error(`API ERROR ${response.status}`);
    }

    const data = await response.json();
    
    catalogCache = { data, timestamp: Date.now() };
    
    return data;
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