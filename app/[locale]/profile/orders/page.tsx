'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ScreenTitle } from '../../../components/ScreenTitle';
import { useUser } from '../../../lib/UserContext';
import Link from 'next/link';
import { authFetch } from '../../../lib/auth';

type Order = {
  order_code: string;
  total_rub: number;
  status: string;
  payment_method: string;
  created_at: string;
};

const PAY_API_BASE = 'https://pay.bytewizard.ru';

export default function OrdersPage() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const isRu = locale !== 'en';

  const user = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const c = {
    title: isRu ? 'Мои заказы' : 'My Orders',
    no_orders: isRu ? 'У вас пока нет заказов' : 'No orders yet',
    no_orders_sub: isRu ? 'Посетите каталог, чтобы сделать первый заказ' : 'Visit catalog to make your first order',
    to_catalog: isRu ? 'Перейти в каталог' : 'Go to catalog',
    login_required: isRu ? 'Войдите через Telegram' : 'Login via Telegram',
    order_label: isRu ? 'Заказ' : 'Order',
    sum: isRu ? 'Сумма' : 'Total',
    date: isRu ? 'Дата' : 'Date',
    pending: isRu ? 'Ожидает оплаты' : 'Pending payment',
    paid: isRu ? 'Оплачен' : 'Paid',
    failed: isRu ? 'Отклонён' : 'Failed',
    cancelled: isRu ? 'Отменён' : 'Cancelled',
    refunded: isRu ? 'Возвращён' : 'Refunded',
    in_progress: isRu ? 'В работе' : 'In progress',
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  useEffect(() => {
    if (!user || user.id === 0) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
    try {
      const res = await authFetch(`${PAY_API_BASE}/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else if (res.status === 401) {
        console.log('[ORDERS] Unauthorized, user not logged in');
        setOrders([]);
      }
    } catch (e) {
      console.error('Ошибка загрузки заказов:', e);
    } finally {
      setLoading(false);
    }
  };

    loadOrders();
  }, [user]);

  if (loading) return <div className="min-h-[60vh] grid place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--neon-purple)] border-t-transparent" /></div>;

  if (!user || user.id === 0) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-center px-6">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-[var(--text-main)] mb-2">{c.login_required}</h2>
        <button onClick={() => router.push(`/${locale}/`)} className="mt-4 px-6 py-3 rounded-xl font-semibold bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))] text-white">
          {c.to_catalog}
        </button>
      </div>
    );
  }

  return (
    <>
      <ScreenTitle>{c.title}</ScreenTitle>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[rgba(176,38,255,0.2)] bg-[var(--bg-surface-glass)] p-8 text-center">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-[var(--text-main)] font-medium mb-1">{c.no_orders}</p>
          <p className="text-xs text-[var(--text-dim)] mb-4">{c.no_orders_sub}</p>
          <button onClick={() => router.push(`/${locale}/catalog`)} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))] text-white shadow-[var(--glow-purple)]">
            {c.to_catalog}
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-4 pb-8">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <Link 
                key={order.order_code} 
                href={`/${locale}/profile/orders/${order.order_code}`}
                className="group block rounded-2xl border border-[rgba(176,38,255,0.2)] bg-[var(--bg-surface-glass)] p-4 transition-all duration-300 hover:border-[var(--neon-purple)] hover:shadow-[0_0_24px_rgba(176,38,255,0.15)] hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-0.5">{c.order_label}</p>
                    <p className="text-sm font-mono text-[var(--text-main)] truncate group-hover:text-[var(--neon-purple)] transition-colors">
                      {order.order_code}
                    </p>
                  </div>
                  <span className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.color}`}>
                    <span>{statusInfo.icon}</span>
                    <span>{statusInfo.label}</span>
                  </span>
                </div>

                <div className="flex items-end justify-between pt-3 border-t border-[rgba(176,38,255,0.15)]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-0.5">{c.sum}</p>
                    <p className="text-lg font-bold text-[var(--neon-purple)]">{order.total_rub.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-0.5">{c.date}</p>
                    <p className="text-xs text-[var(--text-dim)]">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--neon-purple)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}