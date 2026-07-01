export default function ProfileLoading() {
  return (
    <>
      <div className="text-center mb-6">
        <div className="h-10 w-48 mx-auto bg-[var(--secondary)] rounded-lg animate-pulse" />
      </div>

      {/* Skeleton для карточки профиля */}
      <section className="mt-6 h-48 bg-[var(--secondary)] rounded-2xl animate-pulse" />

      {/* Skeleton для ссылок */}
      <div className="mt-4 space-y-4">
        <div className="h-24 bg-[var(--secondary)] rounded-2xl animate-pulse" />
        <div className="h-24 bg-[var(--secondary)] rounded-2xl animate-pulse" />
      </div>
    </>
  );
}