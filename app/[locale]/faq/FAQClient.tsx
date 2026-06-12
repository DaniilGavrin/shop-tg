// [locale]/faq/FAQClient.tsx (НОВЫЙ ФАЙЛ)
'use client';
import { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export function FAQClient({ items, locale }: { items: FAQItem[]; locale: string }) {
  const [openId, setOpenId] = useState<number | null>(null);

  function toggleItem(id: number) {
    setOpenId(openId === id ? null : id);
  }

  return (
    <div className="mt-6 space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_20px_rgba(176,38,255,0.12)] transition hover:border-[rgba(0,240,255,0.4)] hover:shadow-[0_0_28px_rgba(0,240,255,0.18)]"
        >
          <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />
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
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openId === item.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
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
      
      <div className="mt-6 overflow-hidden rounded-2xl border border-[rgba(0,240,255,0.26)] bg-[linear-gradient(145deg,rgba(9,24,45,0.92),rgba(3,7,16,0.94))] shadow-[0_0_20px_rgba(0,240,255,0.12)]">
        <div className="h-1 bg-[linear-gradient(90deg,var(--neon-blue),var(--neon-purple),var(--neon-pink))]" />
        <div className="px-5 py-4 text-center">
          <p className="text-sm text-[var(--text-dim)]">Не нашли ответ на свой вопрос?</p>
          <a
            href={`/${locale}/contact`}
            className="mt-2 inline-block text-sm font-semibold text-[var(--neon-blue)] transition hover:text-[var(--neon-pink)] hover:underline"
          >
            Связаться с поддержкой →
          </a>
        </div>
      </div>
    </div>
  );
}