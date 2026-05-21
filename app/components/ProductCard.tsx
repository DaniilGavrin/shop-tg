import Link from 'next/link';
import type { CatalogItem } from '../types/catalog';

type Props = {
  item: CatalogItem;
};

export function ProductCard({ item }: Props) {
  return (
    <Link href={`/ru/catalog/${item.id}`}>
      <article
        className="
          group overflow-hidden rounded-3xl
          border border-[rgba(176,38,255,0.18)]
          bg-[linear-gradient(145deg,rgba(24,9,45,0.92),rgba(7,3,16,0.98))]
          transition-all duration-300
          hover:-translate-y-1
          hover:border-[rgba(0,240,255,0.35)]
          hover:shadow-[0_0_35px_rgba(176,38,255,0.28)]
        "
      >
        {/* IMAGE */}
        <div
          className="
            aspect-square
            bg-[radial-gradient(circle_at_top,rgba(176,38,255,0.18),transparent_70%)]
            group-hover:scale-[1.02]
            transition-transform duration-300
          "
        />

        {/* INFO */}
        <div className="p-3">
          <p className="text-sm font-bold text-[var(--neon-purple)]">
            ОТ {item.base_price_rub.toLocaleString('ru-RU')} ₽
          </p>

          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-[var(--text-main)] min-h-[40px]">
            {item.name}
          </h3>

          {/* subtle badge space (на будущее category) */}
          <div className="mt-2 h-4" />
        </div>
      </article>
    </Link>
  );
}