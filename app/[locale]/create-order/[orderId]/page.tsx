'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from '../../../lib/i18n/useTranslation';
import { ScreenTitle } from '../../../components/ScreenTitle';

type TempOrder = {
  id: string;
  items: Array<{ productId: number; name: string; price: number; selections: Record<string, any>; deliveryDays: number }>;
  total: number;
  createdAt: number;
  ttl: number;
};

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  desc: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', name: 'Банковская карта', icon: '💳', desc: 'Visa, MasterCard, МИР' },
  { id: 'crypto', name: 'Крипто', icon: '₿', desc: 'USDT, TON, BTC' },
  { id: 'invoice', name: 'Для юр. лиц', icon: '📄', desc: 'Безнал с НДС' },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.shop.bytewizard.ru';

export default function CreateOrderPage() {
  const router = useRouter();
  const { locale, orderId } = useParams<{ locale: string; orderId: string }>();
  const { t } = useTranslation();
  const isRu = locale !== 'en';

  const [order, setOrder] = useState<TempOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState({ phone: '', email: '', comment: '' });
  const [selectedPayment, setSelectedPayment] = useState<string>(PAYMENT_METHODS[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('bw_pending_order');
      if (!raw) throw new Error('No order');
      const parsed: TempOrder = JSON.parse(raw);
      
      if (parsed.id !== orderId || (Date.now() - parsed.createdAt > parsed.ttl)) {
        throw new Error('Expired');
      }
      setOrder(parsed);
    } catch {
      router.replace(`/${locale}/cart`);
    } finally {
      setLoading(false);
    }
  }, [orderId, locale, router]);

  const handleCancel = () => {
    localStorage.removeItem('bw_pending_order');
    router.push(`/${locale}/cart`);
  };

  const handleSubmit = async () => {
    if (!order) return;
    
    // 🔹 Валидация EMAIL (строго обязательно)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contact.email.trim() || !emailRegex.test(contact.email.trim())) {
      setError(isRu ? 'Укажите корректный Email для связи' : 'Valid email is required for contact');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        order_id: order.id,
        items: order.items.map(i => ({
          product_id: i.productId,
          config: i.selections,
          price_rub: i.price,
          delivery_days: i.deliveryDays,
        })),
        total_rub: order.total,
        contact_phone: contact.phone.trim() || null,
        contact_email: contact.email.trim(),
        client_comment: contact.comment.trim() || null,
        payment_method: selectedPayment,
        locale,
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        localStorage.removeItem('bw_pending_order');
        router.push(`/${locale}/profile?order=success`);
      } else {
        setError(isRu ? 'Ошибка сервера. Попробуйте позже.' : 'Server error. Try again later.');
      }
    } catch {
      setError(isRu ? 'Нет соединения с сетью' : 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] grid place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--neon-purple)] border-t-transparent" /></div>;
  if (!order) return null;

  const c = {
    title: isRu ? 'Оформление заказа' : 'Checkout',
    cancel: isRu ? 'Отменить' : 'Cancel',
    phone: isRu ? 'Телефон (необязательно)' : 'Phone (optional)',
    email: isRu ? 'Email для связи' : 'Contact Email',
    comment: isRu ? 'Комментарий к заказу' : 'Order comment',
    confirm: isRu ? 'Подтвердить заказ' : 'Confirm Order',
    total: isRu ? 'Итого к оплате:' : 'Total to pay:',
    items_count: isRu ? 'Позиций:' : 'Items:',
    expires: isRu ? 'Заказ зарезервирован до:' : 'Order reserved until:',
    payment: isRu ? 'Способ оплаты' : 'Payment method',
    required: isRu ? '* обязательно' : '* required',
  };

  const expireTime = new Date(order.createdAt + order.ttl).toLocaleTimeString(isRu ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <ScreenTitle>{c.title}</ScreenTitle>

      {/* 1. Инфо о заказе */}
      <div className="mt-4 rounded-2xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface-glass)] p-4 flex items-center justify-between text-sm">
        <span className="text-[var(--text-dim)]">{c.items_count} <span className="text-[var(--neon-purple)] font-bold">{order.items.length}</span></span>
        <span className="text-[var(--text-dim)]">{c.expires} <span className="text-[var(--neon-blue)] font-medium">{expireTime}</span></span>
      </div>

      {/* 2. Список товаров */}
      <div className="mt-4 space-y-3">
        {order.items.map((item, i) => (
          <div key={i} className="rounded-2xl border border-[rgba(176,38,255,0.2)] bg-[var(--bg-surface)] p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--text-main)]">{item.name}</p>
              <p className="text-xs text-[var(--text-dim)] mt-0.5">{item.deliveryDays} {isRu ? 'дн.' : 'days'}</p>
            </div>
            <span className="font-bold text-[var(--neon-purple)]">{item.price.toLocaleString('ru-RU')} ₽</span>
          </div>
        ))}
      </div>

      {/* 3. 🔹 БЛОК ОПЛАТЫ */}
      <div className="mt-6 rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
        <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">{c.payment}</h3>
        
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar -mx-2 px-2">
          {PAYMENT_METHODS.map((method) => {
            const isActive = selectedPayment === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedPayment(method.id)}
                className={`
                  shrink-0 w-[150px] flex flex-col p-3 rounded-xl border transition-all duration-200
                  ${isActive 
                    ? 'border-[var(--neon-purple)] bg-[rgba(176,38,255,0.15)] shadow-[0_0_16px_rgba(176,38,255,0.3)]' 
                    : 'border-[rgba(176,38,255,0.2)] bg-[var(--bg-surface)] hover:border-[rgba(176,38,255,0.5)]'
                  }
                `}
              >
                {/* Иконка */}
                <div className="text-3xl mb-2 text-center">{method.icon}</div>
                
                {/* Название + Описание */}
                <div className="text-center">
                  <p className={`text-xs font-bold leading-tight mb-1 ${isActive ? 'text-[var(--neon-purple)]' : 'text-[var(--text-main)]'}`}>
                    {method.name}
                  </p>
                  <p className="text-[10px] text-[var(--text-dim)] leading-tight">
                    {method.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. 🔹 КОНТАКТНЫЕ ДАННЫЕ */}
      <div className="mt-6 rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
        <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">📝 Контакты</h3>
        <div className="space-y-4">
          {/* Email — ОБЯЗАТЕЛЬНО */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-dim)] mb-1">
              {c.email} <span className="text-[var(--neon-pink)]">{c.required}</span>
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-main)] focus:border-[var(--neon-purple)] focus:outline-none"
            />
          </div>
          {/* Телефон — ОПЦИОНАЛЬНО */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-dim)] mb-1">{c.phone}</label>
            <input
              type="tel"
              value={contact.phone}
              onChange={e => setContact(p => ({ ...p, phone: e.target.value }))}
              placeholder="+7 (___) ___-__-__"
              className="w-full rounded-xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-main)] focus:border-[var(--neon-purple)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-dim)] mb-1">{c.comment}</label>
            <textarea
              value={contact.comment}
              onChange={e => setContact(p => ({ ...p, comment: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-main)] focus:border-[var(--neon-purple)] focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-[var(--neon-pink)] bg-[rgba(255,0,127,0.1)] px-3 py-2 rounded-lg">{error}</p>}
        </div>
      </div>

      {/* 5. Итого + Кнопки */}
      <div className="mt-8 pb-8 space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm text-[var(--text-dim)]">{c.total}</span>
          <span className="text-2xl font-bold text-[var(--neon-purple)]">{order.total.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={handleCancel} className="flex-1 py-4 rounded-xl border border-[rgba(176,38,255,0.3)] text-[var(--text-main)] font-medium hover:bg-[rgba(176,38,255,0.1)] transition">{c.cancel}</button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className={`flex-[2] py-4 rounded-xl font-bold text-white shadow-[var(--glow-purple)] transition active:scale-[0.98] ${
              submitting ? 'opacity-50 cursor-wait' : 'bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))] hover:opacity-95'
            }`}
          >
            {submitting ? (isRu ? 'Обработка...' : 'Processing...') : c.confirm}
          </button>
        </div>
      </div>
    </>
  );
}