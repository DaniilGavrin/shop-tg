'use client';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { ScreenTitle } from '../../components/ScreenTitle';
import { TelegramLoginButton } from '../../components/TelegramLoginButton';
import { useUser } from '../../lib/UserContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from '../../components/ThemeToggle';

function getFullName(user: { first_name: string; last_name?: string }) {
  return [user.first_name, user.last_name].filter(Boolean).join(' ');
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useUser();
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'ru';
  const currentUser = user;
  const isGuest = currentUser.id === 0;
  const fullName = getFullName(currentUser);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(String(currentUser.id));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Ошибка копирования ID', error);
    }
  }

  return (
    <>
      <ScreenTitle>{t.nav.profile}</ScreenTitle>

      {/* Карточка профиля */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="h-1 bg-[var(--primary)]" />
        <div className="px-5 py-5">
          <div className="flex gap-4">
            {/* Убрал rounded-full border-2 border-[var(--primary)] p-0.5, теперь просто чистый бордер */}
            <div className="h-[76px] w-[76px] shrink-0 rounded-full border-2 border-[var(--primary)] overflow-hidden bg-[var(--secondary)]">
              {user.photo_url ? (
                <img src={user.photo_url} alt={fullName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="grid h-full w-full place-items-center text-2xl font-bold text-[var(--foreground)]">
                  {user.first_name?.[0] ?? '?'}
                </div>
              )}
            </div>
            <div className="flex min-w-0 flex-col justify-center text-left">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                {t.profile.account || 'Аккаунт'}
              </p>
              <h2 className="truncate text-lg font-bold text-[var(--foreground)]">{fullName}</h2>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-start">
            {isGuest ? (
              <TelegramLoginButton />
            ) : (
              <>
                <button type="button" onClick={copyId} className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--primary)]">
                  <span>ID: {user.id}</span>
                  <span className="ml-2 text-xs opacity-70">{copied ? 'Скопировано ✓' : 'Нажми чтобы скопировать'}</span>
                </button>
                {user.username && (
                  <a href={`https://t.me/${user.username}`} target="_blank" rel="noreferrer" className="mt-2 text-sm text-[var(--primary)] transition hover:underline">
                    @{user.username}
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Переключатель темы */}
      <section className="mt-4">
        <ThemeToggle />
      </section>

      {/* ПЛАШКА: ЗАКАЗЫ */}
      {!isGuest && (
        <Link href={`/${locale}/profile/orders`} className="mt-4 block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:border-[var(--primary)]">
          <div className="h-1 bg-[var(--primary)]" />
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">История</p>
              <h3 className="mt-1 text-base font-semibold text-[var(--foreground)]">Все ваши заказы и их статусы</h3>
            </div>
            <svg className="h-5 w-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>
      )}

      {/* Плашка: Контакты */}
      <Link href={`/${locale}/contact`} className="mt-4 block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:border-[var(--primary)]">
        <div className="h-1 bg-[var(--primary)]" />
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">{t.nav.contact || 'Контакты'}</p>
            <h3 className="mt-1 text-base font-semibold text-[var(--foreground)]">{t.profile.contacts_hint || 'Связаться с поддержкой'}</h3>
          </div>
          <svg className="h-5 w-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </Link>

      {/* Плашка: Юридическая информация */}
      <Link href={`/${locale}/legal`} className="mt-4 block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:border-[var(--primary)]">
        <div className="h-1 bg-[var(--primary)]" />
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">{t.profile.legal || 'Документы'}</p>
            <h3 className="mt-1 text-base font-semibold text-[var(--foreground)]">{t.profile.legal_hint || 'Политика, оферта и реквизиты'}</h3>
          </div>
          <svg className="h-5 w-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </Link>

      {/* Плашка: FAQ */}
      <Link href={`/${locale}/faq`} className="mt-4 block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:border-[var(--primary)]">
        <div className="h-1 bg-[var(--primary)]" />
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">{t.profile.faq || 'FAQ'}</p>
            <h3 className="mt-1 text-base font-semibold text-[var(--foreground)]">{t.profile.faq_hint || 'Самые частые вопросы и ответы'}</h3>
          </div>
          <svg className="h-5 w-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </Link>
    </>
  );
}