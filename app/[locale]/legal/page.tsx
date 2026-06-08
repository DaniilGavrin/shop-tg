'use client';

import { useTranslation } from '../../lib/i18n/useTranslation';
import { ScreenTitle } from '../../components/ScreenTitle';
import Link from 'next/link';

export default function LegalPage() {
  const { t } = useTranslation();
  const { locale } = useTranslation();

  const docs = [
    {
      label: t.legal.privacy,
      href: `/${locale}/legal/privacy`,
      icon: '🛡️',
    },
    {
      label: t.legal.terms,
      href: `/${locale}/legal/terms`,
      icon: '📜',
    },
    {
      label: t.legal.license,
      href: `/${locale}/legal/license`,
      icon: '⚙️',
    },
    {
      label: t.legal.requisites,
      href: `/${locale}/legal/requisites`,
      icon: '🏦',
    },
    {
      label: t.legal.refund,
      href: `/${locale}/legal/refund`,
      icon: '↩️',
    },
  ];

  return (
    <>
      <ScreenTitle>{t.legal.title}</ScreenTitle>

      <div className="mt-6 flex flex-col gap-4">
        {docs.map((doc) => (
          <Link
            key={doc.label}
            href={doc.href}
            className="overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_20px_rgba(176,38,255,0.12)] transition hover:border-[rgba(0,240,255,0.4)] hover:shadow-[0_0_28px_rgba(0,240,255,0.18)]"
          >
            <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="text-2xl">{doc.icon}</span>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[var(--text-main)]">{doc.label}</h3>
                <p className="mt-0.5 text-xs text-[var(--text-dim)]">{t.legal.open_in_cloud}</p>
              </div>
              <svg className="h-5 w-5 text-[var(--neon-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-[var(--text-dim)]">
        {t.legal.updated} {new Date().toLocaleDateString('ru-RU')}
      </p>
    </>
  );
}