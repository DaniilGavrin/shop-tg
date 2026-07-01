import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_token, init_data } = body;

    const apiUrl = init_data
      ? 'https://api.bytewizard.ru/auth/telegram/webapp'
      : 'https://api.bytewizard.ru/auth/telegram/oidc';

    const backendRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(init_data ? { init_data } : { id_token }),
    });

    const data = await backendRes.json();
    const response = NextResponse.json(data, { status: backendRes.status });

    const setCookieHeader = backendRes.headers.get('set-cookie');
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(/,(?=\s*[a-zA-Z0-9-_]+=)/);
      
      for (const cookie of cookies) {
        const [nameValue, ...attributes] = cookie.split(';').map(s => s.trim());
        const [name, value] = nameValue.split('=');
        
        if (name === 'access_token' || name === 'refresh_token') {
          response.cookies.set(name, value, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            domain: '.bytewizard.ru',
            maxAge: name === 'access_token' ? 15 * 60 : 30 * 24 * 60 * 60,
          });
        }
      }
    }

    return response;
  } catch (error) {
    console.error('[AUTH PROXY ERROR]', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}