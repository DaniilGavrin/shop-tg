export default function CatalogLoading() {
  return (
    <>
      <div className="text-center mb-6">
        <div className="h-10 w-48 mx-auto bg-[var(--secondary)] rounded-lg animate-pulse" />
      </div>

      <section className="mt-6 grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,240px))] justify-center">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-64 bg-[var(--secondary)] rounded-xl animate-pulse"
          />
        ))}
      </section>
    </>
  );
}