import { Suspense } from 'react';
import { HomeIntro } from '../components/HomeIntro';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isRu = params.locale !== 'en';
  return {
    title: isRu ? 'ByteWizard Shop — Магазин цифровых услуг' : 'ByteWizard Shop — Digital Services Marketplace',
    description: isRu 
      ? 'Магазин цифровых услуг: разработка ПО, создание сайтов, мобильных приложений. Быстро, качественно, с гарантией.'
      : 'Marketplace for digital services: software development, websites, mobile apps. Fast, quality, guaranteed.',
    openGraph: {
      title: isRu ? 'ByteWizard Shop — Магазин цифровых услуг' : 'ByteWizard Shop — Digital Services Marketplace',
      description: isRu 
        ? 'Разработка программного обеспечения, сайтов и мобильных приложений'
        : 'Software development, websites and mobile apps via Telegram',
      type: 'website',
      locale: params.locale === 'ru' ? 'ru_RU' : 'en_US',
    },
  };
}

export default function HomePage() {
  return (
    <>
      {/* 🚀 Мгновенный рендер хедера */}
      <HomeIntro />
      
      {/* 🔄 Lazy-подгрузка featured-товаров */}
      <Suspense fallback={null}>
        <FeaturedProducts />
      </Suspense>
    </>
  );
}