'use client';

import { useTranslation } from '../../lib/i18n/useTranslation';
import { ScreenTitle } from '../../components/ScreenTitle';

export default function ContactPage() {
  const { t } = useTranslation();

  // Замените на ваши реальные контакты
  const CONTACT_EMAIL = 'daniilgavrin@bytewizard.ru';
  const CONTACT_TELEGRAM = '@danya_gavrin';

  return (
    <>
      <ScreenTitle>{t.nav.contact}</ScreenTitle>

      {/* Email Card */}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="block mt-6 overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_20px_rgba(176,38,255,0.12)] transition hover:border-[rgba(0,240,255,0.4)] hover:shadow-[0_0_28px_rgba(0,240,255,0.18)]"
      >
        <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />

        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-dim)]">
              {t.contact.email_label}
            </p>
            <h3 className="mt-1 text-base font-semibold text-[var(--text-main)]">
              {CONTACT_EMAIL}
            </h3>
          </div>

          {/* Иконка стрелки */}
          <svg
            className="h-5 w-5 text-[var(--neon-purple)] transition group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </a>

      {/* Telegram Card */}
      <a
        href={`https://t.me/${CONTACT_TELEGRAM.replace('@', '')}`}
        target="_blank"
        rel="noreferrer"
        className="block mt-4 overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_20px_rgba(176,38,255,0.12)] transition hover:border-[rgba(0,240,255,0.4)] hover:shadow-[0_0_28px_rgba(0,240,255,0.18)]"
      >
        <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />

        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-dim)]">
              {t.contact.telegram_label}
            </p>
            <h3 className="mt-1 text-base font-semibold text-[var(--text-main)]">
              {CONTACT_TELEGRAM}
            </h3>
          </div>

          {/* Иконка стрелки */}
          <svg
            className="h-5 w-5 text-[var(--neon-purple)] transition group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </a>

      {/* Опционально: подсказка внизу */}
      <p className="mt-6 text-center text-xs text-[var(--text-dim)]">
        {t.contact.hint}
      </p>
    </>
  );
}