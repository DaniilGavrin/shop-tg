import { NextRequest, NextResponse } from 'next/server';

const locales = ['ru', 'en'];
const defaultLocale = 'ru';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');

  if (!acceptLanguage) return defaultLocale;

  // парсим язык браузера
  const preferred = acceptLanguage
    .split(',')
    .map((l) => l.split(';')[0].trim().toLowerCase());

  for (const lang of preferred) {
    const base = lang.split('-')[0];
    if (locales.includes(base)) return base;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // пропускаем уже локализованные роуты
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  // редирект с "/" и других путей без locale
  const locale = getLocale(request);

  console.log('[middleware] detected locale:', locale);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

// важно: ограничиваем matcher
export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)'],
};