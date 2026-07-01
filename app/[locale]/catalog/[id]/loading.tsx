export default function ProductLoading() {
  return (
    <>
      {/* Skeleton для header */}
      <header className="sticky top-0 z-40 relative flex items-center h-14 px-4 bg-transparent">
        <div className="w-10 h-10 rounded-xl bg-[var(--secondary)] animate-pulse" />
        <div className="mx-auto h-8 w-48 bg-[var(--secondary)] rounded-lg animate-pulse" />
      </header>

      <div className="mt-2 h-6 w-3/4 mx-auto bg-[var(--secondary)] rounded animate-pulse" />

      {/* Skeleton для карточки товара */}
      <section className="mt-4 h-64 bg-[var(--secondary)] rounded-2xl animate-pulse" />

      {/* Skeleton для конфигуратора */}
      <section className="mt-6 h-96 bg-[var(--secondary)] rounded-2xl animate-pulse" />
    </>
  );
}