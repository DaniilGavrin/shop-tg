import { useState } from 'react';

import type { TelegramUser } from '../types/telegram';
import { ScreenTitle } from './ScreenTitle';

type ProfilePanelProps = {
  user: TelegramUser;
};

function getFullName(user: TelegramUser) {
  return [user.first_name, user.last_name].filter(Boolean).join(' ');
}

export function ProfilePanel({ user }: ProfilePanelProps) {
  const fullName = getFullName(user);

  const [copied, setCopied] = useState(false);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(String(user.id));

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
      <ScreenTitle>Профиль</ScreenTitle>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_28px_rgba(176,38,255,0.18)]">
        <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />

        <div className="flex gap-4 px-5 py-5">
          <div className="avatar-neon h-[76px] w-[76px] shrink-0">
            <div className="h-full w-full overflow-hidden rounded-full bg-[var(--bg-surface)]">
              {user.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
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
              Аккаунт
            </p>

            <h2 className="truncate text-lg font-bold text-[var(--text-main)]">
              {fullName}
            </h2>

            <button
              type="button"
              onClick={copyId}
              className="mt-2 flex flex-col items-start text-sm text-[var(--text-dim)] transition hover:text-[var(--neon-blue)]"
            >
              <span>ID: {user.id}</span>

              <span className="text-xs opacity-70">
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
          </div>
        </div>
      </section>
    </>
  );
}