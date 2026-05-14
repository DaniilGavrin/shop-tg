export function LoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg-deep)] px-6 text-center">
      <div>
        <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-2 border-[var(--neon-purple)] border-t-transparent shadow-[0_0_22px_rgba(176,38,255,0.45)]" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-dim)]">
          Загрузка
        </p>
      </div>
    </main>
  );
}
