import { notFound } from 'next/navigation';
import type { CatalogItem } from '../../../types/catalog';
import { ProductConfigurator } from './ProductConfigurator';
import { BackButton } from './BackButton';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bytewizard.ru';

async function getProduct(id: string): Promise<CatalogItem | null> {
  try {
    if (!id || id === 'undefined' || id === 'null') return null;
    const res = await fetch(`${API_BASE_URL}/catalog/${id}`, {
      next: { revalidate: 259200 },
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
  const { locale, id } = await params;
  const product = await getProduct(id);
  
  if (!product) notFound();
  
  const priceFormatted = new Intl.NumberFormat('ru-RU').format(product.base_price_rub);
  const isRu = locale !== 'en';
  
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
        <BackButton />
        <h1 className="mx-auto text-center text-xl md:text-2xl font-bold truncate max-w-[75%] px-2" style={{ color: 'var(--foreground)' }}>
          {product.name}
        </h1>
      </header>
      <p className="mt-2 text-center max-w-2xl mx-auto px-2" style={{ color: 'var(--muted-foreground)' }}>
        {product.short_description}
      </p>
      <section className="mt-4 card">
        <div className="p-5 space-y-5">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{t.base_price}</span>
              <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{priceFormatted} ₽</span>
            </div>
            <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'var(--secondary)', color: 'var(--accent)' }}>
              {t.delivery} {product.metadata.delivery.base_days} {t.days}
            </span>
          </div>
          {product.metadata.stack?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--muted-foreground)' }}>{t.stack}</p>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {product.metadata.stack.map(tech => (
                  <span key={tech} className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          {product.metadata.features?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--muted-foreground)' }}>{t.features}</p>
              <div className="max-h-40 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
                {product.metadata.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'var(--foreground)' }}>
                    <span style={{ color: 'var(--accent)' }}>✦</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      {product.is_configurable && Object.keys(product.metadata.config_schema).length > 0 && (
        <ProductConfigurator product={product} locale={locale} />
      )}
      <div className="h-24" />
    </>
  );
}