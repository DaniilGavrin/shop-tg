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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadFeatured = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/catalog/featured`, {
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
        if (!cancelled) setLoading(false);
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

  if (error) {
    return (
      <div className="mt-8 p-4 rounded-xl border border-red-500/30 bg-red-900/10 text-red-300 text-sm">
        ⚠️ Ошибка загрузки витрины: {error}
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-bold text-foreground">
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
      <div className="mb-4 h-7 w-40 rounded bg-secondary" />
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-xl bg-secondary" />
        ))}
      </div>
    </section>
  );
}