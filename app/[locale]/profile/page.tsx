'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '../../lib/i18n/useTranslation';
import type { TelegramUser } from '../../types/telegram';
import { ScreenTitle } from '../../components/ScreenTitle';
import { getDisplayTelegramUser } from '../../lib/telegram';
import { TelegramLoginButton } from '../../components/TelegramLoginButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';



function getFullName(user: TelegramUser) {
  return [user.first_name, user.last_name].filter(Boolean).join(' ');
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [copied, setCopied] = useState(false);

  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'ru';

  useEffect(() => {
    setUser(getDisplayTelegramUser());
  }, []);

  if (!user) {
    return null;
  }

  const currentUser = user;
  const isGuest = currentUser.id === 0;

  const fullName = getFullName(currentUser);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(String(currentUser.id));

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Ошибка копирования ID', error);
    }
  }

  return (
    <>
      <ScreenTitle>{t.nav.profile}</ScreenTitle>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_28px_rgba(176,38,255,0.18)]">
        <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />

        <div className="px-5 py-5">
          <div className="flex gap-4">
            <div className="avatar-neon h-[76px] w-[76px] shrink-0">
              <div className="h-full w-full overflow-hidden rounded-full bg-[var(--bg-surface)]">
                {user.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt={fullName}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-2xl font-bold text-[var(--text-main)]">
                    {user.first_name?.[0] ?? '?'}
                  </div>
                )}
              </div>
            </div>

            <div className="flex min-w-0 flex-col justify-center text-left">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-dim)]">
                {t.profile.account}
              </p>

              <h2 className="truncate text-lg font-bold text-[var(--text-main)]">
                {fullName}
              </h2>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-start">
            {isGuest ? (
              <>
                <TelegramLoginButton />
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={copyId}
                  className="text-sm text-[var(--text-dim)] transition hover:text-[var(--neon-blue)]"
                >
                  <span>ID: {user.id}</span>

                  <span className="ml-2 text-xs opacity-70">
                    {copied ? 'Скопировано ✓' : 'Нажми чтобы скопировать'}
                  </span>
                </button>

                {user.username && (
                  <a
                    href={`https://t.me/${user.username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 text-sm text-[var(--neon-purple)] transition hover:text-[var(--neon-pink)] hover:underline"
                  >
                    @{user.username}
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Link
        href={`/${locale}/contact`}
        className="mt-4 block overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_20px_rgba(176,38,255,0.12)] transition hover:border-[rgba(0,240,255,0.4)] hover:shadow-[0_0_28px_rgba(0,240,255,0.18)]"
      >
        <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-dim)]">
              {t.nav.contact}
            </p>
            <h3 className="mt-1 text-base font-semibold text-[var(--text-main)]">
              {t.profile.contacts_hint}
            </h3>
          </div>
          <svg className="h-5 w-5 text-[var(--neon-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
      
      <Link
        href={`/${locale}/legal`}
        className="mt-4 block overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_20px_rgba(176,38,255,0.12)] transition hover:border-[rgba(0,240,255,0.4)] hover:shadow-[0_0_28px_rgba(0,240,255,0.18)]"
      >
        <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-dim)]">
              {t.profile.legal}
            </p>
            <h3 className="mt-1 text-base font-semibold text-[var(--text-main)]">
              {t.profile.legal_hint}
            </h3>
          </div>
          <svg className="h-5 w-5 text-[var(--neon-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </>
  );
}