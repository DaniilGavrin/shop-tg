import { notFound } from 'next/navigation';
import type { CatalogItem } from '../../../types/catalog';
import { ProductConfigurator } from './ProductConfigurator';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bytewizard.ru';

async function getProduct(id: string): Promise<CatalogItem | null> {
  try {
    if (!id || id === 'undefined' || id === 'null') {
      return null;
    }
    const res = await fetch(`${API_BASE_URL}/catalog/${id}`, {
      next: { revalidate: 259200 }, // 3 дня
    });
    if (res.status === 404 || res.status === 422) return null;
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data: { item: CatalogItem } = await res.json();
    return data.item.is_active ? data.item : null;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const resolvedParams = await params;
  
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const priceFormatted = new Intl.NumberFormat('ru-RU').format(product.base_price_rub);
  const isRu = resolvedParams.locale !== 'en';
  const t = {
    back: isRu ? '← Назад' : '← Back',
    base_price: isRu ? 'Базовая цена:' : 'Base price:',
    delivery: isRu ? 'Срок:' : 'Delivery:',
    days: isRu ? 'дн.' : 'days',
    features: isRu ? 'Возможности:' : 'Features:',
    stack: isRu ? 'Технологии:' : 'Stack:',
  };

  return (
    <>
      <header className="sticky top-0 z-40 relative flex items-center h-14 px-4 bg-transparent">
        <button type="button" onClick={() => window.history.back()} className="absolute left-3 p-2 rounded-xl border border-[rgba(176,38,255,0.3)] text-[var(--neon-purple)] hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)] active:scale-[0.98] transition" aria-label={t.back}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="mx-auto text-center text-xl md:text-2xl font-bold text-gradient-neon truncate max-w-[75%] px-2">{product.name}</h1>
      </header>
      
      <p className="mt-2 text-[var(--text-dim)] text-center max-w-2xl mx-auto px-2">{product.short_description}</p>

      <section className="mt-4 overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_28px_rgba(176,38,255,0.18)]">
        <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />
        <div className="p-5 space-y-5">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-[var(--text-dim)]">{t.base_price}</span>
              <span className="text-2xl font-bold text-[var(--neon-purple)]">{priceFormatted} ₽</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[rgba(0,240,255,0.15)] border border-[rgba(0,240,255,0.3)] text-[var(--neon-blue)] text-sm">
              {t.delivery} {product.metadata.delivery.base_days} {t.days}
            </span>
          </div>

          {product.metadata.stack?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-2">{t.stack}</p>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {product.metadata.stack.map(tech => (
                  <span key={tech} className="px-2 py-1 text-xs rounded bg-[var(--bg-surface)] border border-[rgba(176,38,255,0.2)] text-[var(--text-main)] whitespace-nowrap">{tech}</span>
                ))}
              </div>
            </div>
          )}

          {product.metadata.features?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-2">{t.features}</p>
              <div className="max-h-40 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
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

      {product.is_configurable && Object.keys(product.metadata.config_schema).length > 0 && (
        <ProductConfigurator product={product} locale={resolvedParams.locale} />
      )}
      
      <div className="h-24" />
    </>
  );
}