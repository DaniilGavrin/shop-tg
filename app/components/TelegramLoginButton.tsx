'use client';

export function TelegramLoginButton() {
  const login = () => {
    const tg = (window as any).Telegram?.Login;

    if (!tg) {
      console.warn('Telegram SDK not ready');
      return;
    }

    tg.open();
  };

  return (
    <button
      onClick={login}
      className="px-4 py-2 rounded-xl bg-purple-600 text-white"
    >
      Sign in with Telegram
    </button>
  );
}