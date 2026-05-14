import type { TelegramUser } from '../types/telegram';

type ProfilePanelProps = {
  user: TelegramUser;
};

function getFullName(user: TelegramUser) {
  return [user.first_name, user.last_name].filter(Boolean).join(' ');
}

export function ProfilePanel({ user }: ProfilePanelProps) {
  const fullName = getFullName(user);
  const username = user.username ? `@${user.username}` : 'Telegram профиль';

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.94))] shadow-[0_0_28px_rgba(176,38,255,0.18)]">
      <div className="h-1 bg-[linear-gradient(90deg,var(--neon-purple),var(--neon-blue),var(--neon-pink))]" />
      <div className="flex items-center gap-4 px-5 py-5">
        <div className="avatar-neon h-[76px] w-[76px] shrink-0">
          <div className="h-full w-full overflow-hidden rounded-full bg-[var(--bg-surface)]">
            {user.photo_url ? (
              // Telegram can return avatar URLs from different hosts, so a plain image is safer here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photo_url}
                alt={fullName}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-2xl font-bold text-[var(--text-main)]">
                {user.first_name[0]}
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 text-left">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-dim)]">
            Профиль
          </p>
          <h2 className="truncate text-lg font-bold text-[var(--text-main)]">{fullName}</h2>
          <p className="mt-1 truncate text-sm font-semibold text-[var(--neon-blue)]">{username}</p>
        </div>
      </div>
    </section>
  );
}
