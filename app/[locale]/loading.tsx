export default function Loading() {
  return (
    <main className="app-shell">
      <section className="app-content">
        {/* Skeleton для заголовка */}
        <div className="text-center mb-6">
          <div className="h-10 w-64 mx-auto bg-[var(--secondary)] rounded-lg animate-pulse" />
        </div>

        {/* Skeleton для контента */}
        <div className="space-y-4">
          <div className="h-32 bg-[var(--secondary)] rounded-2xl animate-pulse" />
          <div className="h-32 bg-[var(--secondary)] rounded-2xl animate-pulse" />
          <div className="h-32 bg-[var(--secondary)] rounded-2xl animate-pulse" />
        </div>
      </section>
    </main>
  );
}