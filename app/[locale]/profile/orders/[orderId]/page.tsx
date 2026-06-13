'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ScreenTitle } from '../../../../components/ScreenTitle';
import { useUser } from '../../../../lib/UserContext';
import { authFetch } from '../../../../lib/auth';

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
  
  const user = useUser();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [showStatusHelp, setShowStatusHelp] = useState(false);

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
    cancel_btn: isRu ? 'Отменить заказ' : 'Cancel Order',
    cancel_confirm: isRu ? 'Вы уверены, что хотите отменить этот заказ? Это действие нельзя отменить.' : 'Are you sure you want to cancel this order? This action cannot be undone.',
    cancel_success: isRu ? 'Заказ успешно отменен' : 'Order successfully cancelled',
    cancel_error: isRu ? 'Ошибка при отмене заказа' : 'Error cancelling order',
    login_required: isRu ? 'Требуется вход' : 'Login required',
  };

  const statusDescriptions = [
    {
      status: 'pending',
      icon: '⏳',
      title: isRu ? 'Ожидает оплаты' : 'Pending payment',
      desc: isRu 
        ? 'Заказ создан, но оплата ещё не поступила. Вы можете оплатить его или отменить.' 
        : 'Order created, but payment has not been received yet. You can pay or cancel it.',
      color: 'text-yellow-400',
    },
    {
      status: 'paid',
      icon: '✅',
      title: isRu ? 'Оплачен' : 'Paid',
      desc: isRu 
        ? 'Оплата успешно получена. Мы уже начали работу над вашим заказом.' 
        : 'Payment successfully received. We have already started working on your order.',
      color: 'text-green-400',
    },
    {
      status: 'in_progress',
      icon: '⚙️',
      title: isRu ? 'В работе' : 'In progress',
      desc: isRu 
        ? 'Заказ оплачен и находится в активной разработке. Мы свяжемся с вами для уточнения деталей.' 
        : 'Order is paid and in active development. We will contact you to clarify details.',
      color: 'text-[var(--neon-purple)]',
    },
    {
      status: 'failed',
      icon: '❌',
      title: isRu ? 'Отклонён' : 'Failed',
      desc: isRu 
        ? 'Платёж был отклонён банком или платёжной системой. Средства не списаны. Попробуйте оплатить другим способом.' 
        : 'Payment was declined by the bank or payment system. Funds were not charged. Try another payment method.',
      color: 'text-red-400',
    },
    {
      status: 'cancelled',
      icon: '🚫',
      title: isRu ? 'Отменён' : 'Cancelled',
      desc: isRu 
        ? 'Заказ был отменён вами или администрацией. Если оплата поступила — средства будут возвращены.' 
        : 'Order was cancelled by you or administration. If payment was made — funds will be refunded.',
      color: 'text-gray-400',
    },
    {
      status: 'refunded',
      icon: '↩️',
      title: isRu ? 'Возвращён' : 'Refunded',
      desc: isRu 
        ? 'Средства по заказу были возвращены на ваш счёт. Возврат может занять до 10 рабочих дней.' 
        : 'Funds for the order have been returned to your account. Refund may take up to 10 business days.',
      color: 'text-blue-400',
    },
  ];

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

  const handleCancelOrder = async () => {
    if (!window.confirm(c.cancel_confirm)) return;
    setCanceling(true);
    try {
      const res = await authFetch(`${PAY_API_BASE}/orders/${orderId}/cancel`, { // <-- ЗАМЕНИ
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
        alert(c.cancel_success);
      } else {
        alert(c.cancel_error);
      }
    } catch (e) {
      console.error('Network error during cancellation:', e);
      alert(c.cancel_error);
    } finally {
      setCanceling(false);
    }
  };

  useEffect(() => {
    if (!user || user.id === 0) {
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
    try {
      const res = await authFetch(`${PAY_API_BASE}/orders/${orderId}`); // <-- ЗАМЕНИ
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      } else {
        console.error(`[ORDER DETAIL] Failed to load: ${res.status}`);
        setOrder(null);
      }
    } catch (e) {
      console.error('Ошибка загрузки заказа:', e);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };
    loadOrder();
  }, [orderId, user]);

  if (loading) return <div className="min-h-[60vh] grid place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--neon-purple)] border-t-transparent" /></div>;
  
  if (!user || user.id === 0) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-center px-6">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">{c.login_required}</h2>
        <button onClick={() => router.push(`/${locale}/profile`)} className="px-6 py-3 rounded-xl font-semibold bg-[linear-gradient(135deg,var(--neon-purple),var(--neon-pink))] text-white">
          {isRu ? 'Войти' : 'Login'}
        </button>
      </div>
    );
  }

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
  const canCancel = order.status === 'pending' && !canceling;

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

        {/* 🔥 Справочник статусов */}
        <div className="rounded-2xl border border-[rgba(0,240,255,0.26)] bg-[linear-gradient(145deg,rgba(9,24,45,0.92),rgba(3,7,16,0.94))] shadow-[0_0_20px_rgba(0,240,255,0.12)] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowStatusHelp(!showStatusHelp)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[rgba(0,240,255,0.05)]"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">ℹ️</span>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-main)]">
                  {isRu ? 'Что означают статусы заказа?' : 'What do order statuses mean?'}
                </h3>
                <p className="text-[11px] text-[var(--text-dim)] mt-0.5">
                  {isRu ? 'Нажмите, чтобы раскрыть' : 'Tap to expand'}
                </p>
              </div>
            </div>
            <svg
              className={`h-5 w-5 shrink-0 text-[var(--neon-blue)] transition-transform duration-300 ${
                showStatusHelp ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              showStatusHelp ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-t border-[rgba(0,240,255,0.15)] px-5 py-4 space-y-3">
                {statusDescriptions.map((item) => (
                  <div
                    key={item.status}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                      order.status === item.status
                        ? 'border-[rgba(0,240,255,0.5)] bg-[rgba(0,240,255,0.08)]'
                        : 'border-[rgba(176,38,255,0.15)] bg-[rgba(0,0,0,0.2)]'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-bold ${item.color}`}>{item.title}</span>
                        {order.status === item.status && (
                          <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-[rgba(0,240,255,0.2)] border border-[rgba(0,240,255,0.4)] text-[var(--neon-blue)]">
                            {isRu ? 'текущий' : 'current'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-dim)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                {Object.keys(item.config).length > 0 && (
                  <div className="grid grid-cols-1 gap-2 bg-[rgba(0,0,0,0.2)] rounded-xl p-3">
                    {(() => {
                      const parsedConfig = typeof item.config === 'string' ? JSON.parse(item.config) : item.config;
                      return Object.entries(parsedConfig).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-[var(--text-dim)]">{formatLabel(key)}:</span>
                          <span className="text-[var(--text-main)] font-medium text-right max-w-[60%] break-words">
                            {renderConfigValue(key, value)}
                          </span>
                        </div>
                      ));
                    })()}
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

        {/* Кнопка отмены заказа */}
        <button
          type="button"
          onClick={handleCancelOrder}
          disabled={!canCancel}
          className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 ${
            canCancel
              ? 'bg-[linear-gradient(135deg,var(--neon-pink),#ff4d4d)] hover:opacity-90 shadow-[0_0_20px_rgba(255,0,127,0.3)]'
              : 'bg-[var(--bg-surface)] border border-[rgba(176,38,255,0.2)] text-[var(--text-dim)] cursor-not-allowed opacity-60'
          }`}
        >
          {canceling ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {isRu ? 'Обработка...' : 'Processing...'}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {c.cancel_btn}
            </>
          )}
        </button>
        {!canCancel && order.status !== 'pending' && (
          <p className="text-center text-xs text-[var(--text-dim)]">
            {isRu ? 'Отмена невозможна: заказ уже обрабатывается или оплачен.' : 'Cancellation is not available: order is already processed or paid.'}
          </p>
        )}

      </div>
    </>
  );
}