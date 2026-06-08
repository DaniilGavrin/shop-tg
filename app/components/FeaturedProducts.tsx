'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import type { CatalogItem } from '../types/catalog';
import { useTranslation } from '../lib/i18n/useTranslation';

// 🔥 Выносим базовый URL в константу (или импортируй из lib/api)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bytewizard.ru';

export function FeaturedProducts() {
  const { t } = useTranslation();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadFeatured = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/catalog/featured`, {
          // ✅ Для клиентского фетча: кэш браузера на 6 часов
          cache: 'force-cache',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) throw new Error(`API ERROR ${response.status}`);
        
        const data = await response.json();
        
        if (!cancelled) {
          setItems(data.items || []);
          setLoading(false);
        }
      } catch (error) {
        console.error('Featured load error:', error);
        if (!cancelled) setLoading(false); // Чтобы убрать скелетон при ошибке
      }
    };

    loadFeatured();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <FeaturedSkeleton />;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-bold text-[var(--text-main)]">
        {t.home.featured_title}
      </h2>
      
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function FeaturedSkeleton() {
  return (
    <section className="mt-8 animate-pulse">
      <div className="mb-4 h-7 w-40 rounded bg-[var(--bg-surface)]" />
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-3xl bg-[var(--bg-surface)]" />
        ))}
      </div>
    </section>
  );
}