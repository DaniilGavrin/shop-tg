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
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:border-[var(--border)] hover:shadow-sm"
          >
            <div className="h-1 bg-[var(--primary)]" />
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="text-2xl">{doc.icon}</span>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[var(--foreground)]">{doc.label}</h3>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{t.legal.open_in_cloud}</p>
              </div>
              <svg className="h-5 w-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
        {t.legal.updated} {new Date().toLocaleDateString('ru-RU')}
      </p>
    </>
  );
}