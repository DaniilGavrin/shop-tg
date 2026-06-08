import { Suspense } from 'react';
import { HomeIntro } from '../components/HomeIntro';
import { FeaturedProducts } from '../components/FeaturedProducts';

export default function HomePage() {
  return (
    <>
      {/* 🚀 Мгновенный рендер хедера */}
      <HomeIntro />
      
      {/* 🔄 Lazy-подгрузка featured-то
      
      <Suspense fallback={null}>
        <FeaturedProducts />
      </Suspense>
      
      варов */}
      
    </>
  );
}