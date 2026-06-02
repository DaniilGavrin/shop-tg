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
  { id: 'card', name: 'Банковская карта', icon: '💳', desc: 'Visa, MC, МИР' },
  { id: 'sbp', name: 'СБП', icon: '🏦', desc: 'Система быстрых платежей' },
  { id: 'crypto', name: 'Крипто', icon: '₿', desc: 'USDT, TON, BTC' },
  { id: 'stars', name: 'Telegram Stars', icon: '⭐', desc: 'Оплата звёздами' },
  { id: 'invoice', name: 'Для юр. лиц', icon: '📄', desc: 'Безнал с НДС' },
];

const PAY_API_BASE = 'https://pay.bytewizard.ru';

export default function CreateOrderPage() {
  const router = useRouter();
  const { locale, orderId } = useParams<{ locale: string; orderId: string }>();
  const { t } = useTranslation();
  const isRu = locale !== 'en';

  const [order, setOrder] = useState<TempOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState({ phone: '', email: '', comment: '' });
  const [selectedPayment, setSelectedPayment] = useState<string>(PAYMENT_METHODS[0].id);
  
  // 🔹 Новые состояния для процесса оплаты
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

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
    
    // 1. Валидация EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contact.email.trim() || !emailRegex.test(contact.email.trim())) {
      setError(isRu ? 'Укажите корректный Email для связи' : 'Valid email is required for contact');
      return;
    }

    setError(null);
    setSubmitting(true);
    setPaymentUrl(null);

    // 2. 🔹 Забираем данные пользователя из localStorage
    let telegramData = {};
    try {
      const rawUser = localStorage.getItem('telegram_user');
      if (rawUser) {
        const user = JSON.parse(rawUser);
        telegramData = {
          telegram_id: user.id ? String(user.id) : null,
          telegram_username: user.username || null,
          telegram_first_name: user.first_name || null,
          telegram_last_name: user.last_name || null,
        };
      }
    } catch (e) {
      console.error('Ошибка парсинга telegram_user:', e);
    }

    try {
      // 3. Формируем payload с новыми полями
      const payload = {
        order_id: order.id,
        items: order.items.map(i => ({
          product_id: i.productId,
          product_name: i.name,
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
        // 🔹 Добавляем данные Telegram
        ...telegramData,
      };

      const res = await fetch(`${PAY_API_BASE}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const url = data.payment_url || data.link || data.redirect_url || data.data?.payment_url;
        
        if (url) {
          localStorage.removeItem('bw_pending_order');
          setPaymentUrl(url);
          window.location.href = url;
        } else {
          throw new Error(isRu ? 'Не получен адрес для оплаты' : 'No payment link received');
        }
      } else {
        const errData = await res.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errData.message || (isRu ? 'Ошибка сервера оплаты' : 'Payment server error'));
      }
    } catch (e: any) {
      setError(e.message || (isRu ? 'Нет соединения с сетью' : 'Network error'));
      setSubmitting(false);
    }
  };

  // 🔹 ЭКРАН ЗАГРУЗКИ
  if (submitting) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--bg-deep)] text-center px-6">
        <div className="space-y-4">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[var(--neon-purple)] border-t-transparent shadow-[0_0_30px_rgba(176,38,255,0.5)]" />
          <h2 className="text-xl font-bold text-gradient-neon">Создание заказа и оплата...</h2>
          <p className="text-sm text-[var(--text-dim)]">{isRu ? 'Перенаправляем на безопасную страницу' : 'Redirecting to secure payment'}</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-[60vh] grid place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--neon-purple)] border-t-transparent" /></div>;
  if (!order) return null;

  // 🔹 FALLBACK ЕСЛИ АВТО-РЕДИРЕКТ НЕ СРАБОТАЛ
  if (paymentUrl) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--bg-deep)] text-center px-6">
        <div className="rounded-2xl border border-[var(--neon-purple)] bg-[var(--bg-surface-glass)] p-6 space-y-4 max-w-sm">
          <div className="text-4xl">💳</div>
          <h2 className="text-lg font-bold text-[var(--text-main)]">{isRu ? 'Страница оплаты не открылась автоматически' : 'Payment page did not open'}</h2>
          <p className="text-xs text-[var(--text-dim)]">{isRu ? 'Нажмите кнопку ниже для перехода' : 'Tap the button below to proceed'}</p>
          <button
            onClick={() => window.open(paymentUrl, '_blank')}
            className="w-full py-3 rounded-xl bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))] text-white font-bold shadow-[var(--glow-purple)]"
          >
            {isRu ? 'Открыть оплату вручную' : 'Open Payment Manually'}
          </button>
        </div>
      </div>
    );
  }

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

      <div className="mt-4 rounded-2xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface-glass)] p-4 flex items-center justify-between text-sm">
        <span className="text-[var(--text-dim)]">{c.items_count} <span className="text-[var(--neon-purple)] font-bold">{order.items.length}</span></span>
        <span className="text-[var(--text-dim)]">{c.expires} <span className="text-[var(--neon-blue)] font-medium">{expireTime}</span></span>
      </div>

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
                <div className="text-3xl mb-2 text-center">{method.icon}</div>
                <div className="text-center">
                  <p className={`text-xs font-bold leading-tight mb-1 ${isActive ? 'text-[var(--neon-purple)]' : 'text-[var(--text-main)]'}`}>{method.name}</p>
                  <p className="text-[10px] text-[var(--text-dim)] leading-tight">{method.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
        <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">📝 Контакты</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-dim)] mb-1">{c.email} <span className="text-[var(--neon-pink)]">{c.required}</span></label>
            <input type="email" value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))} placeholder="name@example.com" className="w-full rounded-xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-main)] focus:border-[var(--neon-purple)] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-dim)] mb-1">{c.phone}</label>
            <input type="tel" value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))} placeholder="+7 (___) ___-__-__" className="w-full rounded-xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-main)] focus:border-[var(--neon-purple)] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-dim)] mb-1">{c.comment}</label>
            <textarea value={contact.comment} onChange={e => setContact(p => ({ ...p, comment: e.target.value }))} rows={3} className="w-full rounded-xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-main)] focus:border-[var(--neon-purple)] focus:outline-none" />
          </div>
          {error && <p className="text-sm text-[var(--neon-pink)] bg-[rgba(255,0,127,0.1)] px-3 py-2 rounded-lg">{error}</p>}
        </div>
      </div>

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
            className={`flex-[2] py-4 rounded-xl font-bold text-white shadow-[var(--glow-purple)] transition active:scale-[0.98] ${submitting ? 'opacity-50 cursor-wait' : 'bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))] hover:opacity-95'}`}
          >
            {c.confirm}
          </button>
        </div>
      </div>
    </>
  );
}