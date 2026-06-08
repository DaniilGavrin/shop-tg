import type { CatalogResponse } from '../types/catalog';

const API_BASE_URL = 'https://api.bytewizard.ru';

export async function getCatalog(): Promise<CatalogResponse> {
  try {
    console.log('[CATALOG] Fetching from API...');
    
    const response = await fetch(`${API_BASE_URL}/catalog`, {
      cache: 'no-store',
    });

    console.log('[CATALOG] API STATUS:', response.status);

    if (!response.ok) {
      throw new Error(`API ERROR ${response.status}`);
    }

    const data = await response.json();
    console.log('[CATALOG] Received items:', data.items?.length || 0);
    
    return data;
  } catch (error) {
    console.error('[CATALOG] FETCH ERROR:', error);
    return { items: [] };
  }
}

export async function getFeaturedCatalog(): Promise<CatalogResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/catalog/featured`, {
      next: { revalidate: 21600 }, // 6 часов
    });

    if (!response.ok) {
      throw new Error(`API ERROR ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('[FEATURED] FETCH ERROR:', error);
    return { items: [] };
  }
}