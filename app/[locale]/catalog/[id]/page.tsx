'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ConfigSelection = Record<string, string | string[] | boolean>;

type ProductItem = {
  id: number;
  name: string;
  short_description: string;
  description: string;
  base_price_rub: number;
  category: string;
  preview_image: string | null;
  metadata: {
    stack: string[];
    delivery: { days: number; base_days: number };
    features: string[];
    config_schema?: {
      fields: Array<{
        id: string;
        type: 'select' | 'multiselect' | 'checkbox' | 'textarea';
        label: string;
        options?: Array<{ value: string; label: string; price_modifier?: number; delivery_modifier?: number }>;
      }>;
    };
  };
  is_configurable: boolean;
  is_active: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shop.bytewizard.ru';

async function fetchProduct(id: string): Promise<ProductItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/catalog/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API ${res.status}`);
    
    const data: { item: ProductItem } = await res.json();
    return data.item.is_active ? data.item : null;
  } catch {
    return null;
  }
}

// 🔹 Заглушки для будущей логики конфигуратора
function calculateDynamicPrice(basePrice: number, _sel: ConfigSelection, _schema?: ProductItem['metadata']['config_schema']): number {
  return basePrice;
}

function calculateDynamicDelivery(baseDays: number, _sel: ConfigSelection, _schema?: ProductItem['metadata']['config_schema']): number {
  return baseDays;
}

export default function ProductPage() {
  const router = useRouter();
  const { locale, id } = useParams<{ locale: string; id: string }>();
  
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<ConfigSelection>({});

  const isRu = locale !== 'en';

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      const data = await fetchProduct(id);
      if (!cancelled) {
        setProduct(data);
        setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  // Динамические значения (пока = базовым)
  const displayPrice = product ? calculateDynamicPrice(product.base_price_rub, selections, product.metadata.config_schema) : 0;
  const displayDeliveryDays = product ? calculateDynamicDelivery(product.metadata.delivery.base_days || product.metadata.delivery.days, selections, product.metadata.config_schema) : 0;

  const t = {
    back: isRu ? '← Назад' : '← Back',
    base_price: isRu ? 'Базовая цена:' : 'Base price:',
    delivery: isRu ? 'Срок:' : 'Delivery:',
    days: isRu ? 'дн.' : 'days',
    features: isRu ? 'Возможности:' : 'Features:',
    stack: isRu ? 'Технологии:' : 'Stack:',
    add_to_cart: isRu ? 'В корзину' : 'Add to cart',
    price_prefix: isRu ? 'Итого:' : 'Total:',
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--neon-purple)] border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    router.replace(`/${locale || 'ru'}/catalog`);
    return null;
  }

  const priceFormatted = new Intl.NumberFormat('ru-RU').format(displayPrice);

  return (
    <>
      {/* Хедер с кнопкой "Назад" + название */}
      <header className="sticky top-0 z-40 relative flex items-center h-14 px-4 bg-transparent">
        <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-3 p-2 rounded-xl border border-[rgba(176,38,255,0.3)] text-[var(--neon-purple)] hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)] active:scale-[0.98] transition"
            aria-label={t.back}
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <h1 className="mx-auto text-center text-xl md:text-2xl font-bold text-gradient-neon truncate max-w-[75%] px-2">
            {product.name}
        </h1>
      </header>

      <p className="mt-2 text-[var(--text-dim)] text-center max-w-2xl mx-auto px-2">
        {product.short_description}
      </p>

      {/* Карточка товара */}
      <section className="mt-4 overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_28px_rgba(176,38,255,0.18)]">
        <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />
        <div className="p-5 space-y-5">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-[var(--text-dim)]">{t.base_price}</span>
              <span className="text-2xl font-bold text-[var(--neon-purple)]">{priceFormatted} ₽</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[rgba(0,240,255,0.15)] border border-[rgba(0,240,255,0.3)] text-[var(--neon-blue)] text-sm">
              {t.delivery} {displayDeliveryDays} {t.days}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs rounded bg-[rgba(176,38,255,0.15)] text-[var(--neon-purple)] border border-[rgba(176,38,255,0.25)]">
              {product.category}
            </span>
          </div>

          {product.metadata.stack?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-2">{t.stack}</p>
              <div className="flex flex-wrap gap-2">
                {product.metadata.stack.map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs rounded bg-[var(--bg-surface)] border border-[rgba(176,38,255,0.2)] text-[var(--text-main)]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.metadata.features?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-2">{t.features}</p>
              <div className="max-h-48 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
                {product.metadata.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-[var(--text-main)]">
                    <span className="text-[var(--neon-pink)] mt-0.5">✦</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="h-24" />

      {/* Липкий бар */}
      <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
        <div className="mx-auto max-w-md px-4 pb-2">
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-[rgba(176,38,255,0.4)] bg-[var(--bg-surface-glass)] backdrop-blur-xl shadow-[0_-4px_32px_rgba(0,0,0,0.4),var(--glow-purple)]">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">{t.price_prefix}</p>
              <p className="text-lg font-bold text-[var(--neon-purple)] truncate">{priceFormatted} ₽</p>
            </div>
            <button
              type="button"
              disabled
              className="
                shrink-0 px-6 py-3 rounded-xl font-semibold
                bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))]
                text-white shadow-[var(--glow-purple)]
                transition hover:opacity-90 active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {t.add_to_cart}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}