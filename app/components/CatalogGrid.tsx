import type { CatalogItem } from '../types/catalog';
import { ProductCard } from './ProductCard';

type Props = {
  items: CatalogItem[];
};

export function CatalogGrid({ items }: Props) {
  return (
    <section className=" mt-6 grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,240px))] justify-center">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </section>
  );
}