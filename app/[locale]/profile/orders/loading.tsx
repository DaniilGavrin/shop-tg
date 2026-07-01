export default function OrdersLoading() {
  return (
    <>
      <div className="text-center mb-6">
        <div className="h-10 w-48 mx-auto bg-[var(--secondary)] rounded-lg animate-pulse" />
      </div>

      <div className="mt-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-[var(--secondary)] rounded-2xl animate-pulse"
          />
        ))}
      </div>
    </>
  );
}