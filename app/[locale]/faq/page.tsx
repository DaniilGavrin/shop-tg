'use client';

import { useTranslation } from '../../lib/i18n/useTranslation';
import { ScreenTitle } from '../../components/ScreenTitle';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1] || 'ru';
  const [openId, setOpenId] = useState<number | null>(null);

  // Пример FAQ данных - потом можно вынести в переводы или базу
  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: 'Как оформить заказ?',
      answer: 'Выберите нужную услугу из каталога, нажмите "Заказать", заполните brief и оплатите. После этого мы свяжемся с вами в Telegram для уточнения деталей.'
    },
    {
      id: 2,
      question: 'Какие сроки разработки?',
      answer: 'Сроки зависят от сложности проекта. Лендинг — 3-5 дней, сайт-визитка — 5-7 дней, интернет-магазин — от 2 недель. Точные сроки обсуждаем после получения brief.'
    },
    {
      id: 3,
      question: 'Какие способы оплаты вы принимаете?',
      answer: 'Мы принимаем криптовалюту (USDT, TON, BTC), банковские переводы и электронные кошельки. Для международных клиентов предпочтительнее крипто-платежи.'
    },
    {
      id: 4,
      question: 'Можно ли внести правки после сдачи проекта?',
      answer: 'Да, в стоимость включено 2 раунда бесплатных правок. Дополнительные доработки оплачиваются отдельно по почасовой ставке.'
    },
    {
      id: 5,
      question: 'Предоставляете ли вы поддержку после запуска?',
      answer: 'Да, мы предоставляем 30 дней бесплатной технической поддержки после сдачи проекта. Далее можно оформить ежемесячную подписку на поддержку.'
    },
    {
      id: 6,
      question: 'Работаете ли вы с клиентами из других стран?',
      answer: 'Да, мы работаем с клиентами по всему миру. Все коммуникации ведутся на русском или английском языках через Telegram.'
    },
    {
        id: 7,
        question: 'Что делать если не нашёл нужный мне товар?',
        answer: 'Свяжитесь с нами и мы обсудим вашу задачу и соберем персонально под ваши требования товар.'
    }
  ];

  function toggleItem(id: number) {
    setOpenId(openId === id ? null : id);
  }

  return (
    <>
      {/* Кнопка назад */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-sm text-[var(--text-dim)] transition hover:text-[var(--neon-blue)]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </button>

      <ScreenTitle>{t.profile.faq || 'Часто задаваемые вопросы'}</ScreenTitle>

      <div className="mt-6 space-y-3">
        {faqItems.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_20px_rgba(176,38,255,0.12)] transition hover:border-[rgba(0,240,255,0.4)] hover:shadow-[0_0_28px_rgba(0,240,255,0.18)]"
          >
            {/* Градиентная полоска сверху */}
            <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />

            {/* Вопрос (кликабельный) */}
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[rgba(176,38,255,0.05)]"
            >
              <h3 className="text-base font-semibold text-[var(--text-main)]">
                {item.question}
              </h3>
              <svg
                className={`h-5 w-5 shrink-0 text-[var(--neon-purple)] transition-transform duration-300 ${
                  openId === item.id ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Ответ (раскрывается) */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                openId === item.id
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-[rgba(176,38,255,0.15)] px-5 py-4">
                  <p className="text-sm leading-relaxed text-[var(--text-dim)]">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Блок с предложением связаться, если не нашли ответ */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-[rgba(0,240,255,0.26)] bg-[linear-gradient(145deg,rgba(9,24,45,0.92),rgba(3,7,16,0.94))] shadow-[0_0_20px_rgba(0,240,255,0.12)]">
        <div className="h-1 bg-[linear-gradient(90deg,var(--neon-blue),var(--neon-purple),var(--neon-pink))]" />
        <div className="px-5 py-4 text-center">
          <p className="text-sm text-[var(--text-dim)]">
            Не нашли ответ на свой вопрос?
          </p>
          <a
            href={`/${locale}/contact`}
            className="mt-2 inline-block text-sm font-semibold text-[var(--neon-blue)] transition hover:text-[var(--neon-pink)] hover:underline"
          >
            Связаться с поддержкой →
          </a>
        </div>
      </div>
    </>
  );
}