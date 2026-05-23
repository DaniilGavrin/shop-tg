import crypto from 'crypto';

export async function POST(req: Request) {
  const data = await req.json();

  const botToken = process.env.TG_BOT_TOKEN!;
  const secret = crypto.createHash('sha256').update(botToken).digest();

  const { hash, ...rest } = data;

  const dataCheckString = Object.keys(rest)
  .sort()
  .map((k) => `${k}=${rest[k]}`)
  .join('\n');

  const computed = crypto
    .createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');

  if (!crypto.timingSafeEqual(
    Buffer.from(computed, 'hex'),
    Buffer.from(hash, 'hex')
    )) {
    return Response.json({ ok: false }, { status: 401 });
    }

  // ✅ тут создаёшь сессию / JWT
  return Response.json({
    ok: true,
    user: rest,
  });
}