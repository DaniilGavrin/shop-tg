import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isRu = params.locale !== 'en';
  return {
    title: {
      default: 'ByteWizard Shop',
      template: '%s | ByteWizard Shop',
    },
    description: isRu 
      ? 'Магазин цифровых услуг'
      : 'Marketplace for digital services',
    openGraph: {
      title: 'ByteWizard Shop',
      description: isRu 
        ? 'Разработка ПО, сайтов и мобильных приложений'
        : 'Software, website and mobile app development',
      locale: params.locale === 'ru' ? 'ru_RU' : 'en_US',
    },
    alternates: {
      canonical: `https://shop.bytewizard.ru/${params.locale}`,
      languages: {
        'ru': '/ru',
        'en': '/en',
      },
    },
  };
}

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}