'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { CatalogItem, ConfigField } from '../../../types/catalog';

type Selections = Record<string, string | string[] | number | boolean>;

function validateRequiredFields(schema: Record<string, ConfigField>, selections: Selections): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const [fieldId, field] of Object.entries(schema)) {
    if (!field.required) continue;
    const val = selections[fieldId];
    let isEmpty = false;
    switch (field.type) {
      case 'textarea': case 'select': isEmpty = typeof val !== 'string' || val.trim() === ''; break;
      case 'checkbox': isEmpty = val !== true; break;
      case 'number': isEmpty = typeof val !== 'number' || isNaN(val); break;
      case 'multiselect': isEmpty = !Array.isArray(val) || val.length === 0; break;
      default: isEmpty = val === undefined || val === null || val === '';
    }
    if (isEmpty) missing.push(field.label);
  }
  return { isValid: missing.length === 0, missing };
}

function calculateDynamicPrice(basePrice: number, selections: Selections, schema: Record<string, ConfigField>): number {
  let total = basePrice;
  for (const [fieldId, field] of Object.entries(schema)) {
    const val = selections[fieldId];
    if (val === undefined) continue;
    if (field.type === 'checkbox' && val === true) total += field.price_modifier ?? 0;
    else if (field.type === 'select' && typeof val === 'string') {
      const opt = field.options?.find(o => o.value === val);
      total += opt?.price_modifier ?? 0;
    } else if (field.type === 'number' && typeof val === 'number' && field.price_per_unit) {
      const baseCount = (field.default ?? field.min ?? 0) as number;
      total += Math.max(0, val - baseCount) * field.price_per_unit;
    } else if (field.type === 'multiselect' && Array.isArray(val)) {
      for (const v of val) {
        const opt = field.options?.find(o => o.value === v);
        total += opt?.price_modifier ?? 0;
      }
    }
  }
  return Math.round(total);
}

function calculateDynamicDelivery(baseDays: number, selections: Selections, schema: Record<string, ConfigField>, deliveryMeta: { min_days: number; max_days: number }): number {
  let optionDays = 0;
  for (const [fieldId, field] of Object.entries(schema)) {
    if (fieldId === 'urgency') continue;
    const val = selections[fieldId];
    if (val === undefined) continue;
    const getDays = (mod?: number, price?: number) => mod ?? Math.max(0, Math.floor((price ?? 0) / 8000));
    if (field.type === 'checkbox' && val === true) optionDays += getDays(field.delivery_days_modifier, field.price_modifier);
    else if (field.type === 'select' && typeof val === 'string') {
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
  const URGENCY_MULTIPLIERS: Record<string, number> = { normal: 1.0, fast: 0.85, ultra_fast: 0.70 };
  const multiplier = URGENCY_MULTIPLIERS[urgency ?? 'normal'] ?? 1.0;
  totalDays = Math.floor(totalDays * multiplier);
  const min = deliveryMeta.min_days || Math.floor(baseDays * 0.4);
  return Math.max(min, Math.ceil(totalDays));
}

export function ProductConfigurator({ product, locale }: { product: CatalogItem; locale: string }) {
  const router = useRouter();
  const isRu = locale !== 'en';
  
  const [selections, setSelections] = useState<Selections>(() => {
    const defaults: Selections = {};
    for (const [key, field] of Object.entries(product.metadata.config_schema)) {
      if (field.type === 'number') defaults[key] = field.default ?? field.min ?? 0;
      else if (field.type === 'checkbox') defaults[key] = false;
      else if (field.type === 'select') defaults[key] = field.default ?? '';
      else if (field.type === 'multiselect') defaults[key] = [];
    }
    return defaults;
  });
  
  const [toast, setToast] = useState<string | null>(null);

  const handleSelectionChange = useCallback((fieldId: string, value: Selections[string]) => {
    setSelections(prev => ({ ...prev, [fieldId]: value }));
  }, []);

  const displayPrice = calculateDynamicPrice(product.base_price_rub, selections, product.metadata.config_schema);
  const displayDeliveryDays = calculateDynamicDelivery(product.metadata.delivery.base_days, selections, product.metadata.config_schema, product.metadata.delivery);

  const handleAddToCart = () => {
    const { isValid, missing } = validateRequiredFields(product.metadata.config_schema, selections);
    if (!isValid) {
      setToast(`⚠️ Заполните: ${missing.join(', ')}`);
      setTimeout(() => setToast(null), 3000);
      return;
    }
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

  const priceFormatted = new Intl.NumberFormat('ru-RU').format(displayPrice);
  const t = {
    add_to_cart: isRu ? 'В корзину' : 'Add to cart',
    price_prefix: isRu ? 'Итого:' : 'Total:',
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
          <textarea value={val as string || ''} onChange={e => handleSelectionChange(fieldId, e.target.value)} rows={4} required={field.required} className="w-full rounded-xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-main)] focus:border-[var(--neon-purple)] focus:outline-none" />
        </div>
      );
    }
    if (field.type === 'select' && field.options) {
      return (
        <div key={fieldId} className="space-y-1">
          {commonLabel}
          <select value={val as string || ''} onChange={e => handleSelectionChange(fieldId, e.target.value)} className="w-full rounded-xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-main)] focus:border-[var(--neon-purple)] focus:outline-none">
            {field.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label} {opt.price_modifier ? `(+${opt.price_modifier.toLocaleString('ru-RU')} ₽)` : ''}</option>
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
                <button key={opt.value} type="button" onClick={() => {
                  const next = isActive ? selected.filter(v => v !== opt.value) : [...selected, opt.value];
                  handleSelectionChange(fieldId, next);
                }} className={`px-3 py-1.5 text-xs rounded-lg border transition ${isActive ? 'border-[var(--neon-purple)] bg-[rgba(176,38,255,0.2)] text-[var(--neon-purple)]' : 'border-[rgba(176,38,255,0.2)] text-[var(--text-dim)] hover:border-[var(--neon-pink)]'}`}>
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
          <button type="button" onClick={() => handleSelectionChange(fieldId, !val)} className={`w-5 h-5 rounded border transition flex items-center justify-center ${val ? 'border-[var(--neon-purple)] bg-[var(--neon-purple)]' : 'border-[var(--text-dim)]'}`}>
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
            <input type="number" min={field.min} max={field.max} value={val as number || 0} onChange={e => handleSelectionChange(fieldId, Number(e.target.value))} className="w-24 rounded-xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface)] p-2 text-sm text-[var(--text-main)] text-center focus:border-[var(--neon-purple)] focus:outline-none" />
            {field.price_per_unit && <span className="text-xs text-[var(--text-dim)]">+{field.price_per_unit.toLocaleString('ru-RU')} ₽ / ед.</span>}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-xl bg-[var(--bg-surface-glass)] border border-[var(--neon-purple)] text-[var(--neon-purple)] text-sm font-medium backdrop-blur-md animate-pulse shadow-[0_0_20px_rgba(176,38,255,0.3)]">
          {toast}
        </div>
      )}

      <section className="mt-6 p-5 rounded-2xl border border-[rgba(176,38,255,0.2)] bg-[var(--bg-surface-glass)]">
        <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">⚙️ Настройка проекта</h3>
        <div className="space-y-4">
          {Object.entries(product.metadata.config_schema).map(([key, field]) => renderField(key, field))}
        </div>
      </section>

      <div className="h-24" />

      <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
        <div className="mx-auto max-w-md px-4 pb-2">
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-[rgba(176,38,255,0.4)] bg-[var(--bg-surface-glass)] backdrop-blur-xl shadow-[0_-4px_32px_rgba(0,0,0,0.4),var(--glow-purple)]">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">{t.price_prefix}</p>
              <p className="text-lg font-bold text-[var(--neon-purple)] truncate">{priceFormatted} ₽</p>
            </div>
            <button type="button" onClick={handleAddToCart} className="shrink-0 px-6 py-3 rounded-xl font-semibold bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))] text-white shadow-[var(--glow-purple)] transition hover:opacity-90 active:scale-[0.98]">
              {t.add_to_cart}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}