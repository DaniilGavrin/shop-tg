'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ScreenTitle } from '../../../../components/ScreenTitle';
import type { TelegramUser } from '../../../../types/telegram';
import { getDisplayTelegramUser } from '../../../../lib/telegram';

type OrderDetail = {
  order_code: string;
  total_rub: number;
  status: string;
  payment_method: string;
  created_at: string;
  client_email: string;
  client_phone: string | null;
  client_comment: string | null;
  items: Array<{
    product_name: string;
    config: Record<string, any>;
    price_rub: number;
    delivery_days: number;
  }>;
};

const PAY_API_BASE = 'https://pay.bytewizard.ru';

export default function OrderDetailPage() {
  const router = useRouter();
  const { locale, orderId } = useParams<{ locale: string; orderId: string }>();
  const isRu = locale !== 'en';

  const [user, setUser] = useState<TelegramUser | null>(null);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const c = {
    back: isRu ? '← К списку заказов' : '← Back to orders',
    order_details: isRu ? 'Детали заказа' : 'Order Details',
    status: isRu ? 'Статус' : 'Status',
    items: isRu ? 'Состав заказа' : 'Order Items',
    contacts: isRu ? 'Контактные данные' : 'Contact Info',
    email: isRu ? 'Email' : 'Email',
    phone: isRu ? 'Телефон' : 'Phone',
    comment: isRu ? 'Комментарий' : 'Comment',
    total: isRu ? 'Итого' : 'Total',
    delivery: isRu ? 'Срок' : 'Delivery',
    days: isRu ? 'дн.' : 'days',
    pending: isRu ? 'Ожидает оплаты' : 'Pending payment',
    paid: isRu ? 'Оплачен' : 'Paid',
    failed: isRu ? 'Отклонён' : 'Failed',
    cancelled: isRu ? 'Отменён' : 'Cancelled',
    refunded: isRu ? 'Возвращён' : 'Refunded',
    in_progress: isRu ? 'В работе' : 'In progress',
    not_found: isRu ? 'Заказ не найден' : 'Order not found',
  };

  const getStatusInfo = (status: string) => {
    const map: Record<string, { label: string; color: string; bg: string; icon: string }> = {
      pending: { label: c.pending, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: '⏳' },
      paid: { label: c.paid, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: '✅' },
      failed: { label: c.failed, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: '❌' },
      cancelled: { label: c.cancelled, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30', icon: '🚫' },
      refunded: { label: c.refunded, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: '↩️' },
      in_progress: { label: c.in_progress, color: 'text-[var(--neon-purple)]', bg: 'bg-[rgba(176,38,255,0.1)] border-[rgba(176,38,255,0.4)]', icon: '⚙️' },
    };
    return map[status] || { label: status, color: 'text-[var(--text-dim)]', bg: 'bg-[rgba(176,38,255,0.1)] border-[rgba(176,38,255,0.2)]', icon: '📦' };
  };

  // Хелпер для красивого отображения конфига
  const renderConfigValue = (key: string, value: any) => {
    if (key === 'technical_task') return value ? '✓ Заполнено' : '—';
    if (typeof value === 'boolean') return value ? '✓ Да' : '✗ Нет';
    if (Array.isArray(value)) return value.join(', ');
    if (value === null || value === undefined || value === '') return '—';
    return String(value);
  };

  const formatLabel = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()).replace('Technical Task', 'ТЗ');
  };

  useEffect(() => {
    const currentUser = getDisplayTelegramUser();
    if (!currentUser || currentUser.id === 0) {
      setLoading(false);
      return;
    }
    setUser(currentUser);

    const loadOrder = async () => {
      try {
        const res = await fetch(`${PAY_API_BASE}/orders/${orderId}?tg_id=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        } else {
          setOrder(null); // 404 или ошибка
        }
      } catch (e) {
        console.error('Ошибка загрузки заказа:', e);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) return <div className="min-h-[60vh] grid place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--neon-purple)] border-t-transparent" /></div>;

  if (!order) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-center px-6">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">{c.not_found}</h2>
        <button onClick={() => router.push(`/${locale}/profile/orders`)} className="px-6 py-3 rounded-xl font-semibold bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))] text-white">
          {c.back}
        </button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <>
      <ScreenTitle>{c.order_details}</ScreenTitle>

      <button onClick={() => router.push(`/${locale}/profile/orders`)} className="mt-4 flex items-center gap-2 text-sm text-[var(--neon-purple)] hover:text-[var(--neon-pink)] transition">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        {c.back}
      </button>

      <div className="mt-4 space-y-4 pb-8">
        {/* Заголовок заказа */}
        <div className="rounded-2xl border border-[rgba(176,38,255,0.3)] bg-[var(--bg-surface-glass)] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-1">ID Заказа</p>
              <p className="text-lg font-mono font-bold text-[var(--text-main)]">{order.order_code}</p>
              <p className="text-xs text-[var(--text-dim)] mt-1">
                {new Date(order.created_at).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border flex items-center gap-2 ${statusInfo.bg} ${statusInfo.color}`}>
              <span className="text-lg">{statusInfo.icon}</span>
              <span>{statusInfo.label}</span>
            </span>
          </div>
        </div>

        {/* Состав заказа */}
        <div className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-4">{c.items}</h3>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="pb-4 border-b border-[rgba(176,38,255,0.15)] last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-[var(--text-main)]">{item.product_name}</h4>
                  <span className="font-bold text-[var(--neon-purple)]">{item.price_rub.toLocaleString('ru-RU')} ₽</span>
                </div>
                <p className="text-xs text-[var(--neon-blue)] mb-3">{c.delivery}: {item.delivery_days} {c.days}</p>
                
                {/* Сетка конфигурации */}
                {Object.keys(item.config).length > 0 && (
                  <div className="grid grid-cols-1 gap-2 bg-[rgba(0,0,0,0.2)] rounded-xl p-3">
                    {Object.entries(item.config).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-[var(--text-dim)]">{formatLabel(key)}:</span>
                        <span className="text-[var(--text-main)] font-medium text-right max-w-[60%] break-words">
                          {renderConfigValue(key, value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Итого и Контакты */}
        <div className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5 space-y-4">
          <div className="flex justify-between items-center pt-2 border-t border-[rgba(176,38,255,0.15)]">
            <span className="text-sm font-bold text-[var(--text-dim)] uppercase tracking-[0.1em]">{c.total}</span>
            <span className="text-2xl font-bold text-[var(--neon-purple)]">{order.total_rub.toLocaleString('ru-RU')} ₽</span>
          </div>

          <div className="pt-4 border-t border-[rgba(176,38,255,0.15)]">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-3">{c.contacts}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-dim)]">{c.email}:</span>
                <span className="text-[var(--text-main)]">{order.client_email}</span>
              </div>
              {order.client_phone && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-dim)]">{c.phone}:</span>
                  <span className="text-[var(--text-main)]">{order.client_phone}</span>
              </div>
              )}
              {order.client_comment && (
                <div className="mt-3 pt-3 border-t border-[rgba(176,38,255,0.1)]">
                  <p className="text-[var(--text-dim)] text-xs mb-1">{c.comment}:</p>
                  <p className="text-[var(--text-main)] bg-[rgba(176,38,255,0.1)] p-3 rounded-xl text-sm italic">
                    "{order.client_comment}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}