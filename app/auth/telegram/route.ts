import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // куда возвращаем пользователя (универсально)
  const fallbackRedirect = '/ru/profile';

  const redirectTo = state
    ? decodeURIComponent(state)
    : fallbackRedirect;

  if (!code) {
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  // 🔐 обмен кода на токен Telegram OAuth
  const tokenRes = await fetch('https://oauth.telegram.org/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.TG_CLIENT_ID}:${process.env.TG_CLIENT_SECRET}`
        ).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.APP_URL}/auth/telegram`,
      client_id: process.env.TG_CLIENT_ID!,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData?.id_token) {
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  // 🍪 сохраняем сессию
  const res = NextResponse.redirect(new URL(redirectTo, req.url));

  res.cookies.set('tg_auth', tokenData.id_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}