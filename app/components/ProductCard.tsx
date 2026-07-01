'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { CatalogItem } from '../types/catalog';

export function ProductCard({ item }: { item: CatalogItem }) {
  if (!item || !item.id) return null;
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'ru';
  const hasImage = item.preview_image && item.preview_image.trim() !== '';

  return (
    <Link href={`/${locale}/catalog/${item.id}`}>
      <article className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="aspect-square bg-secondary relative overflow-hidden rounded-lg">
          {hasImage ? (
            <Image
              src={`/images/products/${item.preview_image}`}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
              📦
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
            ОТ {item.base_price_rub.toLocaleString('ru-RU')} ₽
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-medium min-h-[40px]"
              style={{ color: 'var(--foreground)' }}>
            {item.name}
          </h3>
          <div className="mt-2 h-4" />
        </div>
      </article>
    </Link>
  );
}