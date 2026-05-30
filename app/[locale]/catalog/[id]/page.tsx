// app/[locale]/catalog/[id]/page.tsx
import { notFound } from 'next/navigation';
import { ScreenTitle } from '../../../components/ScreenTitle';
import { useTranslation } from '../../../lib/i18n/useTranslation';

type ProductResponse = {
  item: {
    id: number;
    name: string;
    short_description: string;
    description: string;
    base_price_rub: number;
    category: string;
    preview_image: string | null;
    metadata: {
      stack: string[];
      delivery: { days: number };
      features: string[];
    };
    is_configurable: boolean;
    is_active: boolean;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shop.bytewizard.ru';

async function getProduct(id: string): Promise<ProductResponse['item'] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/catalog/${id}`, {
      next: { revalidate: 300 }, // кэш 5 минут
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API ${res.status}`);

    const data: ProductResponse = await res.json();
    return data.item.is_active ? data.item : null;
  } catch {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // 🔧 Временное решение: useTranslation только на клиенте, поэтому для SSR-страницы
  // используем fallback-словарь напрямую
  const isRu = (await params).locale === 'ru';
  const t = {
    product: {
      base_price: isRu ? 'Базовая цена:' : 'Base price:',
      delivery: isRu ? 'Срок:' : 'Delivery:',
      days: isRu ? 'дн.' : 'days',
      features: isRu ? 'Возможности:' : 'Features:',
      stack: isRu ? 'Технологии:' : 'Stack:',
      configurable_badge: isRu ? '⚙️ Конфигурируемый' : '⚙️ Configurable',
      configure_hint: isRu 
        ? 'Этот товар можно настроить под ваши нужды. Конфигуратор доступен в приложении.' 
        : 'This product is configurable. Use the in-app configurator.',
      add_to_cart: isRu ? 'В корзину' : 'Add to cart',
    },
  };

  const priceFormatted = new Intl.NumberFormat('ru-RU').format(product.base_price_rub);

  return (
    <>
      {/* 🔹 Заголовок — название товара, по центру, неон */}
      <header className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gradient-neon">
          {product.name}
        </h1>
        
        {/* Бейдж конфигурируемости */}
        {product.is_configurable && (
          <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-[rgba(0,240,255,0.15)] border border-[rgba(0,240,255,0.4)] text-[var(--neon-blue)]">
            {t.product.configurable_badge}
          </span>
        )}
      </header>

      {/* 🔹 Краткое описание */}
      <p className="mt-4 text-[var(--text-dim)] text-center max-w-2xl mx-auto">
        {product.short_description}
      </p>

      {/* 🔹 Карточка с основной инфо */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_28px_rgba(176,38,255,0.18)]">
        <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />
        
        <div className="p-5 space-y-4">
          {/* Цена */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-[var(--text-dim)]">{t.product.base_price}</span>
            <span className="text-2xl font-bold text-[var(--neon-purple)]">
              {priceFormatted} ₽
            </span>
          </div>

          {/* Категория и доставка */}
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-2 py-1 rounded bg-[rgba(176,38,255,0.15)] text-[var(--neon-purple)]">
              {product.category}
            </span>
            <span className="px-2 py-1 rounded bg-[rgba(0,240,255,0.15)] text-[var(--neon-blue)]">
              {t.product.delivery} {product.metadata.delivery.days} {t.product.days}
            </span>
          </div>

          {/* Стек технологий */}
          {product.metadata.stack?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-2">
                {t.product.stack}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.metadata.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded bg-[var(--bg-surface)] border border-[rgba(176,38,255,0.2)] text-[var(--text-main)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Фичи */}
          {product.metadata.features?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-2">
                {t.product.features}
              </p>
              <ul className="space-y-1">
                {product.metadata.features.slice(0, 6).map((feature) => (
                  <li key={feature} className="text-sm text-[var(--text-main)] flex items-center gap-2">
                    <span className="text-[var(--neon-pink)]">✦</span>
                    {feature}
                  </li>
                ))}
                {product.metadata.features.length > 6 && (
                  <li className="text-xs text-[var(--text-dim)] italic">
                    +{product.metadata.features.length - 6} {isRu ? 'ещё' : 'more'}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Подсказка про конфигуратор */}
          {product.is_configurable && (
            <div className="mt-4 p-3 rounded-xl bg-[rgba(0,240,255,0.08)] border border-[rgba(0,240,255,0.25)]">
              <p className="text-sm text-[var(--neon-blue)]">{t.product.configure_hint}</p>
            </div>
          )}

          {/* Кнопка "В корзину" — заглушка */}
          <button
            type="button"
            className="
              w-full mt-2 py-3 rounded-xl font-semibold
              bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))]
              text-white shadow-[var(--glow-purple)]
              transition hover:opacity-90 active:scale-[0.99]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            disabled
            title={isRu ? 'Функция в разработке' : 'Coming soon'}
          >
            {t.product.add_to_cart}
          </button>
        </div>
      </section>
    </>
  );
}