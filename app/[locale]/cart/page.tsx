'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { ScreenTitle } from '../../components/ScreenTitle';

type CartItem = {
  productId: number;
  name: string;
  selections: Record<string, string | string[] | number | boolean>;
  price: number;
  deliveryDays: number;
  addedAt: string;
};

const STORAGE_KEY = 'bw_cart';
const SELECTION_KEY = 'bw_cart_selections';
const AUTH_KEY = 'telegram_user';

function formatSelectionValue(key: string, value: any): string {
  if (value === true) return '✓';
  if (value === false || value === null || value === undefined) return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (key === 'technical_task') return 'Заполнено';
  return String(value);
}

function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace('Technical Task', 'ТЗ');
}

export default function CartPage() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const { t } = useTranslation();
  const isRu = locale !== 'en';

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null); // 🔹 Добавлено состояние для тостов

  const c = {
    empty: isRu ? 'Корзина пуста' : 'Cart is empty',
    back_to_catalog: isRu ? '← В каталог' : '← Back to catalog',
    select_all: isRu ? 'Выбрать все' : 'Select all',
    delivery: isRu ? 'Срок:' : 'Delivery:',
    days: isRu ? 'дн.' : 'days',
    options: isRu ? 'Опции:' : 'Options:',
    remove: isRu ? 'Удалить' : 'Remove',
    checkout_btn: isRu ? 'Оформить заказ' : 'Checkout',
    total: isRu ? 'Итого:' : 'Total:',
    selected_count: isRu ? 'выбрано' : 'selected',
    auth_required: isRu ? 'Пожалуйста, войдите в аккаунт перед оформлением заказа' : 'Please log in before placing an order',
  };

  useEffect(() => {
    try {
      const rawCart = localStorage.getItem(STORAGE_KEY);
      const rawSel = localStorage.getItem(SELECTION_KEY);
      const loadedCart: CartItem[] = rawCart ? JSON.parse(rawCart) : [];
      setCart(loadedCart);

      if (rawSel) {
        const saved = new Set(JSON.parse(rawSel));
        const productIds = new Set(loadedCart.map((i: CartItem) => i.productId));
        const valid = new Set<number>(
          Array.from(saved).map(Number).filter((id: number) => productIds.has(id))
        );
        setSelectedIds(valid);
      } else {
        setSelectedIds(new Set(loadedCart.map((i: CartItem) => i.productId)));
      }
    } catch {
      setCart([]);
      setSelectedIds(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(SELECTION_KEY, JSON.stringify(Array.from(selectedIds)));
    }
  }, [selectedIds, loading]);

  const selectedTotal = useMemo(() => 
    cart.filter(i => selectedIds.has(i.productId)).reduce((s, i) => s + i.price, 0),
    [cart, selectedIds]
  );

  const selectedCount = selectedIds.size;
  const allSelected = cart.length > 0 && selectedCount === cart.length;

  const toggleSelectAll = () => setSelectedIds(allSelected ? new Set() : new Set(cart.map(i => i.productId)));
  const toggleSelect = (id: number) => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const handleRemove = (id: number) => {
    const updated = cart.filter(i => i.productId !== id);
    setCart(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleCheckout = async () => {
    if (selectedCount === 0) return;

    try {
      const res = await fetch('https://api.shop.bytewizard.ru/me', {
        credentials: 'include',
        cache: 'no-store'
      });
      
      if (!res.ok) {
        setToast(c.auth_required);
        setTimeout(() => setToast(null), 3000);
        return;
      }
    } catch {
      setToast(c.auth_required);
      setTimeout(() => setToast(null), 3000);
      return;
    }

    
    const orderId = `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const tempOrder = {
      id: orderId,
      items: cart.filter(i => selectedIds.has(i.productId)),
      total: selectedTotal,
      createdAt: Date.now(),
      ttl: 3600000,
    };
    localStorage.setItem('bw_pending_order', JSON.stringify(tempOrder));
    router.push(`/${locale}/create-order/${orderId}`);
  };

  if (loading) return <div className="min-h-[50vh] grid place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--neon-purple)] border-t-transparent" /></div>;
  if (cart.length === 0) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-center px-6">
        <h2 className="text-xl font-bold text-[var(--text-dim)] mb-4">{c.empty}</h2>
        <button onClick={() => router.push(`/${locale}/catalog`)} className="text-[var(--neon-purple)] underline hover:text-[var(--neon-pink)] transition">{c.back_to_catalog}</button>
      </div>
    );
  }

  return (
    <>
      {/* 🔹 Toast уведомление */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-xl bg-[var(--bg-surface-glass)] border border-[var(--neon-pink)] text-[var(--neon-pink)] text-sm font-medium backdrop-blur-md shadow-[0_0_20px_rgba(255,0,127,0.3)] animate-pulse">
          {toast}
        </div>
      )}

      <ScreenTitle>{t.nav.cart}</ScreenTitle>
      <div className="mt-4 flex items-center justify-between px-2">
        <button type="button" onClick={toggleSelectAll} className="flex items-center gap-2 text-sm font-medium text-[var(--neon-purple)] hover:text-[var(--neon-pink)] transition">
          <span className={`w-5 h-5 rounded border flex items-center justify-center transition ${allSelected ? 'border-[var(--neon-purple)] bg-[var(--neon-purple)]' : 'border-[var(--text-dim)] hover:border-[var(--neon-purple)]'}`}>
            {allSelected && <span className="text-[10px] text-white">✓</span>}
          </span>
          {c.select_all}
        </button>
        {selectedCount > 0 && <span className="text-xs text-[var(--text-dim)]">{selectedCount} {c.selected_count}</span>}
      </div>

      <div className="mt-2 space-y-3 pb-6">
        {cart.map((item) => {
          const isSelected = selectedIds.has(item.productId);
          const priceFormatted = item.price.toLocaleString('ru-RU');
          const displayOptions = Object.entries(item.selections)
            .filter(([k, v]) => k !== 'technical_task' && v !== false && v !== '' && v !== null && !(Array.isArray(v) && v.length === 0))
            .map(([k, v]) => ({ label: formatLabel(k), value: formatSelectionValue(k, v) }));

          return (
            <div key={item.productId} className={`relative rounded-2xl border p-4 transition-all ${isSelected ? 'border-[var(--neon-purple)] bg-[rgba(176,38,255,0.08)]' : 'border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)]'}`}>
              <button type="button" onClick={() => toggleSelect(item.productId)} className={`absolute top-3 left-3 w-6 h-6 rounded-lg border flex items-center justify-center transition ${isSelected ? 'border-[var(--neon-purple)] bg-[var(--neon-purple)]' : 'border-[var(--text-dim)] bg-[var(--bg-surface)]'}`} aria-label="Select">
                {isSelected && <span className="text-white text-sm font-bold">✓</span>}
              </button>
              <button type="button" onClick={() => handleRemove(item.productId)} className="absolute top-3 right-3 p-2 rounded-lg text-[var(--text-dim)] hover:text-[var(--neon-pink)]" aria-label="Remove">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              <div className="pl-8 pr-8">
                <h3 className={`font-bold text-[var(--text-main)] text-lg ${!isSelected && 'opacity-70'}`}>{item.name}</h3>
                <p className="mt-1 text-xs text-[var(--neon-blue)]">{c.delivery} <span className="text-[var(--text-main)]">{item.deliveryDays}</span> {c.days}</p>
                {displayOptions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-1.5">{c.options}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {displayOptions.map((opt, i) => (
                        <span key={i} className="px-2 py-1 text-[11px] rounded-md border bg-[rgba(176,38,255,0.1)] text-[var(--text-main)] border-[rgba(176,38,255,0.25)]">
                          {opt.label}: <span className="text-[var(--neon-purple)]">{opt.value}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-[rgba(176,38,255,0.15)]">
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-[var(--bg-surface)] border-[rgba(176,38,255,0.2)]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">{c.total}</span>
                    <span className="text-xl font-bold text-[var(--neon-purple)]">{priceFormatted} ₽</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 🔹 Кнопка оформления под всеми блоками */}
        <div className="mt-6 pb-8">
          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={handleCheckout}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-[var(--glow-purple)] transition active:scale-[0.98] ${
              selectedCount > 0
                ? 'bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))] hover:opacity-95'
                : 'bg-[var(--bg-surface)] border border-[rgba(176,38,255,0.3)] text-[var(--text-dim)] cursor-not-allowed'
            }`}
          >
            {c.checkout_btn} ({selectedCount})
          </button>
          <p className="mt-2 text-center text-xs text-[var(--text-dim)]">
            {isRu ? 'Переход к оформлению • Заказ хранится 1 час' : 'Proceed to checkout • Order valid for 1 hour'}
          </p>
        </div>
      </div>
    </>
  );
}