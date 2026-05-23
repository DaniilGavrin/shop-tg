import crypto from 'crypto';

// Parse JWT without verification to get the payload
function parseJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const decoded = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );

    return decoded;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  // Handle OIDC id_token verification (new flow)
  if (data.id_token) {
    try {
      const decoded = parseJwt(data.id_token);

      if (!decoded) {
        return Response.json(
          { ok: false, error: 'Invalid token format' },
          { status: 401 }
        );
      }

      // Verify essential claims
      if (decoded.iss !== 'https://oauth.telegram.org') {
        return Response.json(
          { ok: false, error: 'Invalid issuer' },
          { status: 401 }
        );
      }

      // Check expiration
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        return Response.json(
          { ok: false, error: 'Token expired' },
          { status: 401 }
        );
      }

      // Extract user data from token
      const user = {
        id: decoded.sub || decoded.id,
        first_name: decoded.name?.split(' ')[0] || 'User',
        last_name: decoded.name?.split(' ').slice(1).join(' ') || '',
        username: decoded.preferred_username || '',
        photo_url: decoded.picture || '',
      };

      return Response.json({
        ok: true,
        user,
      });
    } catch (error) {
      console.error('[Telegram] OIDC verification error:', error);
      return Response.json(
        { ok: false, error: 'Verification failed' },
        { status: 500 }
      );
    }
  }

  // Handle legacy widget verification (backward compatibility)
  const botToken = process.env.TG_BOT_TOKEN!;
  const secret = crypto.createHash('sha256').update(botToken).digest();

  const { hash, ...rest } = data;

  if (!hash) {
    return Response.json(
      { ok: false, error: 'hash is required' },
      { status: 400 }
    );
  }

  const dataCheckString = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join('\n');

  const computed = crypto
    .createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');

  if (
    !crypto.timingSafeEqual(
      Buffer.from(computed, 'hex'),
      Buffer.from(hash, 'hex')
    )
  ) {
    return Response.json({ ok: false, error: 'Invalid hash' }, { status: 401 });
  }

  // ✅ Legacy widget successful verification
  return Response.json({
    ok: true,
    user: rest,
  });
}