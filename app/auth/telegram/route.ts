import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_token, init_data } = body;

    // Определяем, куда стучаться на бэкенде
    const apiUrl = init_data
      ? 'https://api.shop.bytewizard.ru/auth/telegram/webapp'
      : 'https://api.shop.bytewizard.ru/auth/telegram/oidc';

    // Отправляем запрос на наш защищенный бэкенд
    const backendRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(init_data ? { init_data } : { id_token }),
    });

    const data = await backendRes.json();
    
    // Создаем ответ для фронтенда
    const response = NextResponse.json(data, { status: backendRes.status });

    // 🔑 КРИТИЧЕСКИ ВАЖНО: Переносим куки (Set-Cookie) с бэкенда на домен shop.bytewizard.ru
    const setCookieHeaders = backendRes.headers.getSetCookie();
    setCookieHeaders.forEach((cookie) => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error) {
    console.error('[AUTH PROXY ERROR]', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}