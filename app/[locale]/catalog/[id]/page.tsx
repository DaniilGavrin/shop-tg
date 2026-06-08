'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import type { CatalogItem, ConfigField } from '../../../types/catalog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bytewizard.ru';

type Selections = Record<string, string | string[] | number | boolean>;

async function fetchProduct(id: string): Promise<CatalogItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/catalog/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data: { item: CatalogItem } = await res.json();
    return data.item.is_active ? data.item : null;
  } catch {
    return null;
  }
}

// 🔹 НОВАЯ ФУНКЦИЯ: Валидация обязательных полей
function validateRequiredFields(
  schema: Record<string, ConfigField>,
  selections: Selections
): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const [fieldId, field] of Object.entries(schema)) {
    // Пропускаем необязательные поля
    if (!field.required) continue;
    
    const val = selections[fieldId];
    let isEmpty = false;

    // Проверяем пустоту в зависимости от типа поля
    switch (field.type) {
      case 'textarea':
      case 'select':
        isEmpty = typeof val !== 'string' || val.trim() === '';
        break;
      case 'checkbox':
        // Для чекбоксов "обязательно" обычно значит "должен быть отмечен"
        isEmpty = val !== true;
        break;
      case 'number':
        isEmpty = typeof val !== 'number' || isNaN(val);
        break;
      case 'multiselect':
        isEmpty = !Array.isArray(val) || val.length === 0;
        break;
      default:
        isEmpty = val === undefined || val === null || val === '';
    }

    if (isEmpty) {
      missing.push(field.label);
    }
  }
  
  return { isValid: missing.length === 0, missing };
}

function calculateDynamicPrice(
  basePrice: number,
  selections: Selections,
  schema: Record<string, ConfigField>
): number {
  let total = basePrice;
  for (const [fieldId, field] of Object.entries(schema)) {
    const val = selections[fieldId];
    if (val === undefined) continue;

    if (field.type === 'checkbox' && val === true) {
      total += field.price_modifier ?? 0;
    } else if (field.type === 'select' && typeof val === 'string') {
      const opt = field.options?.find(o => o.value === val);
      total += opt?.price_modifier ?? 0;
    } else if (field.type === 'number' && typeof val === 'number' && field.price_per_unit) {
      const baseCount = (field.default ?? field.min ?? 0) as number;
      const extra = Math.max(0, val - baseCount);
      total += extra * field.price_per_unit;
    } else if (field.type === 'multiselect' && Array.isArray(val)) {
      for (const v of val) {
        const opt = field.options?.find(o => o.value === v);
        total += opt?.price_modifier ?? 0;
      }
    }
  }
  return Math.round(total);
}

function calculateDynamicDelivery(
  baseDays: number,
  selections: Selections,
  schema: Record<string, ConfigField>,
  deliveryMeta: { min_days: number; max_days: number }
): number {
  let optionDays = 0;
  for (const [fieldId, field] of Object.entries(schema)) {
    if (fieldId === 'urgency') continue;
    const val = selections[fieldId];
    if (val === undefined) continue;
    
    const getDays = (mod?: number, price?: number) => 
      mod ?? Math.max(0, Math.floor((price ?? 0) / 8000));

    if (field.type === 'checkbox' && val === true) {
      optionDays += getDays(field.delivery_days_modifier, field.price_modifier);
    } else if (field.type === 'select' && typeof val === 'string') {
      const opt = field.options?.find(o => o.value === val);
      optionDays += getDays(opt?.delivery_days_modifier, opt?.price_modifier);
    } else if (field.type === 'multiselect' && Array.isArray(val)) {
      for (const v of val) {
        const opt = field.options?.find(o => o.value === v);
        optionDays += getDays(opt?.delivery_days_modifier, opt?.price_modifier);
      }
    }
  }

  let totalDays = baseDays + optionDays;

  const urgency = selections['urgency'] as string | undefined;
  const URGENCY_MULTIPLIERS: Record<string, number> = {
    normal: 1.0,
    fast: 0.85,
    ultra_fast: 0.70,
  };
  
  const multiplier = URGENCY_MULTIPLIERS[urgency ?? 'normal'] ?? 1.0;
  totalDays = Math.floor(totalDays * multiplier);

  const min = deliveryMeta.min_days || Math.floor(baseDays * 0.4);
  return Math.max(min, Math.ceil(totalDays));
}

export default function ProductPage() {
  const router = useRouter();
  const { locale, id } = useParams<{ locale: string; id: string }>();

  const [product, setProduct] = useState<CatalogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Selections>({});
  const [toast, setToast] = useState<string | null>(null);

  const isRu = locale !== 'en';

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      const data = await fetchProduct(id);
      if (!cancelled) {
        setProduct(data);
        setLoading(false);
        if (data?.metadata.config_schema) {
          const defaults: Selections = {};
          for (const [key, field] of Object.entries(data.metadata.config_schema)) {
            if (field.type === 'number') defaults[key] = field.default ?? field.min ?? 0;
            else if (field.type === 'checkbox') defaults[key] = false;
            else if (field.type === 'select') defaults[key] = field.default ?? '';
            else if (field.type === 'multiselect') defaults[key] = [];
          }
          setSelections(defaults);
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleSelectionChange = useCallback((fieldId: string, value: Selections[string]) => {
    setSelections(prev => ({ ...prev, [fieldId]: value }));
  }, []);

  const displayPrice = product
    ? calculateDynamicPrice(product.base_price_rub, selections, product.metadata.config_schema)
    : 0;

  const displayDeliveryDays = product
    ? calculateDynamicDelivery(
        product.metadata.delivery.base_days,
        selections,
        product.metadata.config_schema,
        product.metadata.delivery
      )
    : 0;

  // 🔹 ОБНОВЛЕННАЯ ФУНКЦИЯ: Добавление в корзину с валидацией
  const handleAddToCart = () => {
    if (!product) return;
    
    // 1. Запускаем валидацию
    const { isValid, missing } = validateRequiredFields(product.metadata.config_schema, selections);
    
    // 2. Если есть ошибки — блокируем добавление и показываем тост
    if (!isValid) {
      setToast(`⚠️ Заполните: ${missing.join(', ')}`);
      setTimeout(() => setToast(null), 3000);
      return;
    }

    // 3. Если всё ок — добавляем в корзину
    const cart = JSON.parse(localStorage.getItem('bw_cart') || '[]');
    cart.push({
      productId: product.id,
      name: product.name,
      selections,
      price: displayPrice,
      deliveryDays: displayDeliveryDays,
      addedAt: new Date().toISOString()
    });
    localStorage.setItem('bw_cart', JSON.stringify(cart));
    
    setToast(isRu ? '✅ Добавлено в корзину!' : '✅ Added to cart!');
    setTimeout(() => setToast(null), 2000);
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
  const t = {
    back: isRu ? '← Назад' : '← Back',
    base_price: isRu ? 'Базовая цена:' : 'Base price:',
    delivery: isRu ? 'Срок:' : 'Delivery:',
    days: isRu ? 'дн.' : 'days',
    features: isRu ? 'Возможности:' : 'Features:',
    stack: isRu ? 'Технологии:' : 'Stack:',
    add_to_cart: isRu ? 'В корзину' : 'Add to cart',
    price_prefix: isRu ? 'Итого:' : 'Total:',
    required: isRu ? '* обязательное поле' : '* required',
  };

  const renderField = (fieldId: string, field: ConfigField) => {
    const val = selections[fieldId];
    const commonLabel = (
      <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
        {field.label} {field.required && <span className="text-[var(--neon-pink)]">*</span>}
        {field.description && <span className="block text-xs text-[var(--text-dim)] font-normal mt-0.5">{field.description}</span>}
      </label>
    );

    if (field.type === 'textarea') {
      return (
        <div key={fieldId} className="space-y-1">
          {commonLabel}
          <textarea
            value={val as string || ''}
            onChange={e => handleSelectionChange(fieldId, e.target.value)}
            rows={4}
            required={field.required}
            className="w-full rounded-xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-main)] focus:border-[var(--neon-purple)] focus:outline-none"
          />
        </div>
      );
    }

    if (field.type === 'select' && field.options) {
      return (
        <div key={fieldId} className="space-y-1">
          {commonLabel}
          <select
            value={val as string || ''}
            onChange={e => handleSelectionChange(fieldId, e.target.value)}
            className="w-full rounded-xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-main)] focus:border-[var(--neon-purple)] focus:outline-none"
          >
            {field.options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label} {opt.price_modifier ? `(+${opt.price_modifier.toLocaleString('ru-RU')} ₽)` : ''}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === 'multiselect' && field.options) {
      const selected = (val as string[]) || [];
      return (
        <div key={fieldId} className="space-y-1">
          {commonLabel}
          <div className="flex flex-wrap gap-2">
            {field.options.map(opt => {
              const isActive = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    const next = isActive ? selected.filter(v => v !== opt.value) : [...selected, opt.value];
                    handleSelectionChange(fieldId, next);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition ${
                    isActive
                      ? 'border-[var(--neon-purple)] bg-[rgba(176,38,255,0.2)] text-[var(--neon-purple)]'
                      : 'border-[rgba(176,38,255,0.2)] text-[var(--text-dim)] hover:border-[var(--neon-pink)]'
                  }`}
                >
                  {opt.label} {opt.price_modifier ? `+${opt.price_modifier.toLocaleString('ru-RU')}` : ''}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (field.type === 'checkbox') {
      return (
        <div key={fieldId} className="flex items-center gap-3 py-2">
          <button
            type="button"
            onClick={() => handleSelectionChange(fieldId, !val)}
            className={`w-5 h-5 rounded border transition flex items-center justify-center ${
              val ? 'border-[var(--neon-purple)] bg-[var(--neon-purple)]' : 'border-[var(--text-dim)]'
            }`}
          >
            {val && <span className="text-[10px] text-white">✓</span>}
          </button>
          <span className="text-sm text-[var(--text-main)]">{field.label} {field.price_modifier ? `(+${field.price_modifier.toLocaleString('ru-RU')} ₽)` : ''}</span>
        </div>
      );
    }

    if (field.type === 'number') {
      return (
        <div key={fieldId} className="space-y-1">
          {commonLabel}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={field.min}
              max={field.max}
              value={val as number || 0}
              onChange={e => handleSelectionChange(fieldId, Number(e.target.value))}
              className="w-24 rounded-xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface)] p-2 text-sm text-[var(--text-main)] text-center focus:border-[var(--neon-purple)] focus:outline-none"
            />
            {field.price_per_unit && (
              <span className="text-xs text-[var(--text-dim)]">+{field.price_per_unit.toLocaleString('ru-RU')} ₽ / ед.</span>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-xl bg-[var(--bg-surface-glass)] border border-[var(--neon-purple)] text-[var(--neon-purple)] text-sm font-medium backdrop-blur-md animate-pulse shadow-[0_0_20px_rgba(176,38,255,0.3)]">
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-40 relative flex items-center h-14 px-4 bg-transparent">
        <button type="button" onClick={() => router.back()} className="absolute left-3 p-2 rounded-xl border border-[rgba(176,38,255,0.3)] text-[var(--neon-purple)] hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)] active:scale-[0.98] transition" aria-label={t.back}>
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
              {t.delivery} {displayDeliveryDays} {t.days}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs rounded bg-[rgba(176,38,255,0.15)] text-[var(--neon-purple)] border border-[rgba(176,38,255,0.25)] capitalize">{product.category}</span>
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

      {/* Конфигуратор */}
      {product.is_configurable && Object.keys(product.metadata.config_schema).length > 0 && (
        <section className="mt-6 p-5 rounded-2xl border border-[rgba(176,38,255,0.2)] bg-[var(--bg-surface-glass)]">
          <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">⚙️ Настройка проекта</h3>
          <div className="space-y-4">
            {Object.entries(product.metadata.config_schema).map(([key, field]) => renderField(key, field))}
          </div>
        </section>
      )}

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
              onClick={handleAddToCart}
              className="shrink-0 px-6 py-3 rounded-xl font-semibold bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))] text-white shadow-[var(--glow-purple)] transition hover:opacity-90 active:scale-[0.98]"
            >
              {t.add_to_cart}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}