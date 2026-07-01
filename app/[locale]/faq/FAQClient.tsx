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
          className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:border-[var(--border)] hover:shadow-sm"
        >
          <div className="h-1 bg-[var(--primary)]" />
          <button
            onClick={() => toggleItem(item.id)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[var(--muted)]"
          >
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              {item.question}
            </h3>
            <svg
              className={`h-5 w-5 shrink-0 text-[var(--primary)] transition-transform duration-300 ${
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
              <div className="border-t border-[var(--border)] px-5 py-4">
                <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="h-1 bg-[linear-gradient(90deg,var(--neon-blue),var(--neon-purple),var(--neon-pink))]" />
        <div className="px-5 py-4 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">Не нашли ответ на свой вопрос?</p>
          <a
            href={`/${locale}/contact`}
            className="mt-2 inline-block text-sm font-semibold text-[var(--primary)] transition hover:text-[var(--primary)] hover:underline"
          >
            Связаться с поддержкой →
          </a>
        </div>
      </div>
    </div>
  );
}