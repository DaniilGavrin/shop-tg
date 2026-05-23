import { NextRequest, NextResponse } from 'next/server';
import { validateTelegramAuth, parseTelegramRedirectParams } from '../../lib/telegram-auth';

export async function GET(req: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      console.error('[Telegram] TELEGRAM_BOT_TOKEN not set');
      return NextResponse.redirect(new URL('/ru/profile?error=auth_config', req.url));
    }

    // Парсим параметры из редиректа
    const params = parseTelegramRedirectParams(req.url);
    
    // Если нет hash — значит, пользователь отменил вход
    if (!params.hash) {
      return NextResponse.redirect(new URL('/ru/profile?error=cancelled', req.url));
    }

    // 🔐 Валидируем подпись
    const isValid = validateTelegramAuth(params, botToken);
    
    if (!isValid) {
      console.error('[Telegram] Invalid auth hash', { params });
      return NextResponse.redirect(new URL('/ru/profile?error=invalid_signature', req.url));
    }

    // ✅ Валидация прошла — формируем объект пользователя
    const telegramUser = {
      id: parseInt(params.id, 10),
      first_name: params.first_name || '',
      last_name: params.last_name || '',
      username: params.username || '',
      photo_url: params.photo_url || '',
      phone: params.phone || '', // если запрашивали через data-request-access="phone"
    };

    // 🍪 Создаём сессию (куки)
    const response = NextResponse.redirect(
      new URL(
        params.state ? decodeURIComponent(params.state) : '/ru/profile',
        req.url
      )
    );

    // 🔒 Безопасная кука с токеном
    // В продакшене лучше использовать JWT или сессию в БД
    response.cookies.set('tg_user', JSON.stringify(telegramUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 дней
    });

    // 📦 Дополнительно: можно сохранить в localStorage через скрипт,
    // чтобы клиент сразу увидел данные (опционально)
    return response;
    
  } catch (error) {
    console.error('[Telegram] Auth error:', error);
    return NextResponse.redirect(new URL('/ru/profile?error=server_error', req.url));
  }
}