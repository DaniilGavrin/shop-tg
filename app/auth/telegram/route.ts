function parseJwt(token: string) {
  try {
    const payload = token.split('.')[1];

    return JSON.parse(
      Buffer.from(payload, 'base64')
        .toString('utf-8')
    );
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.id_token) {
      return Response.json(
        {
          ok: false,
          error: 'Missing id_token',
        },
        {
          status: 400,
        }
      );
    }

    const decoded = parseJwt(
      data.id_token
    );

    if (!decoded) {
      return Response.json(
        {
          ok: false,
          error: 'Invalid token',
        },
        {
          status: 401,
        }
      );
    }

    console.log(
      '[Telegram JWT]',
      decoded
    );

    return Response.json({
      ok: true,

      user: {
        id:
          decoded.id ||
          decoded.telegram_id,

        first_name:
          decoded.given_name ||
          decoded.name ||
          'User',

        last_name:
          decoded.family_name || '',

        username:
          decoded.preferred_username ||
          '',

        photo_url:
          decoded.picture || '',
      },
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        ok: false,
      },
      {
        status: 500,
      }
    );
  }
}