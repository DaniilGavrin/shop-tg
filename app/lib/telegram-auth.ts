import crypto from 'crypto';

/**
 * Валидирует данные от Telegram Login Widget
 * @param data - объект с параметрами: id, first_name, hash, auth_date и т.д.
 * @param botToken - токен бота из @BotFather (начинается с цифр, например 123456:AAH...)
 * @returns true если подпись верна и данные не просрочены
 */
export function validateTelegramAuth(
  data: Record<string, string>,
  botToken: string
): boolean {
  const { hash, auth_date, ...checkData } = data;

  // 1. Проверяем, что есть hash и auth_date
  if (!hash || !auth_date) return false;

  // 2. Проверяем, что данные не старше 24 часов (защита от replay-атак)
  const authTime = parseInt(auth_date, 10) * 1000;
  if (Date.now() - authTime > 24 * 60 * 60 * 1000) {
    console.warn('[Telegram] Auth data expired');
    return false;
  }

  // 3. Формируем строку для проверки: ключ=значение, отсортированные по ключу
  const dataCheckString = Object.entries(checkData)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // 4. Создаём секрет: SHA256 от токена бота
  const secret = crypto.createHash('sha256').update(botToken).digest();

  // 5. Вычисляем HMAC-SHA256
  const computedHash = crypto
    .createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');

  // 6. Сравниваем
  return computedHash === hash;
}

/**
 * Парсит параметры из URL (для GET-редиректа от Telegram)
 */
export function parseTelegramRedirectParams(url: string): Record<string, string> {
  const parsed = new URL(url);
  const params: Record<string, string> = {};
  
  for (const [key, value] of parsed.searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
}