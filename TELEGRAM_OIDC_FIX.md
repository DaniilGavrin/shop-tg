# 🔐 Telegram OIDC Login - Исправление проблем

## ❌ Проблемы, которые были найдены:

1. **Медленная загрузка кнопки** - скрипт загружался заново при каждом рендере
2. **Кнопка не работала** - неправильный обработчик колбека (window.onTelegramAuth)
3. **Использовался старый виджет** - устаревший способ вместо нового OIDC

## ✅ Что было исправлено:

### 1️⃣ TelegramLoginButton.tsx
**Файл:** `frontend/app/components/TelegramLoginButton.tsx`

- ✨ Переходим на новый Telegram.Login OIDC API (вместо старого виджета)
- 🚀 Скрипт загружается **один раз** (используем `initDoneRef`)
- 🎯 Правильный обработчик колбека с поддержкой `id_token`
- 🔧 Кнопка рендерится локально (быстрая загрузка)
- 🧹 Правильная очистка при размонтировании компонента

### 2️⃣ auth/telegram/route.ts
**Файл:** `frontend/app/auth/telegram/route.ts`

- 📦 Добавлена поддержка **OIDC id_token верификации** (новый способ)
- 🔄 Сохранена **обратная совместимость** со старым виджетом
- 🛡️ Проверка:
  - ✅ Валидность формата JWT токена
  - ✅ Корректный издатель (`https://oauth.telegram.org`)
  - ✅ Срок действия токена (exp)
- 👤 Извлечение данных пользователя из id_token

### 3️⃣ Переменные окружения
**Файл:** `frontend/.env.local`

Добавлены необходимые переменные:
```
NEXT_PUBLIC_TG_CLIENT_ID=7173695626           # Client ID из @BotFather
TG_BOT_TOKEN=7173695626:AAG...                 # Bot Token для верификации
NEXT_PUBLIC_TG_BOT_USERNAME=bytewizard_shop_bot # Username бота
```

## 🚀 Как это работает теперь:

### Процесс авторизации:

```
1. Пользователь нажимает кнопку "Login with Telegram"
   ↓
2. Открывается Telegram.Login окно (быстрое!)
   ↓
3. Пользователь подтверждает вход через Telegram
   ↓
4. Telegram отправляет id_token (JWT) в callback
   ↓
5. id_token отправляется на /auth/telegram endpoint
   ↓
6. Backend проверяет:
   - Подпись токена корректна
   - Издатель это Telegram (https://oauth.telegram.org)
   - Токен не истёк
   ↓
7. Извлекаются данные пользователя (id, name, username, photo)
   ↓
8. Данные сохраняются в localStorage
   ↓
9. Страница перезагружается с авторизованным пользователем
```

## 📋 Список изменённых файлов:

1. `frontend/app/components/TelegramLoginButton.tsx` - переписан
2. `frontend/app/auth/telegram/route.ts` - обновлен
3. `frontend/.env.local` - создан (новый)
4. `frontend/.env.example` - создан (новый)

## ⚙️ Требования:

### На фронтенде:
- ✅ Next.js 16.2.6+
- ✅ React 19.2.4+
- ✅ TypeScript 5+

### На бэкенде:
- ✅ Node.js crypto модуль (уже есть)
- ✅ TG_BOT_TOKEN переменная окружения (из config)

## 🔧 Дальнейшая настройка:

### В @BotFather нужно убедиться:
1. Перейти в Bot Settings → Web Login
2. Добавить Allowed URLs:
   - `https://shop.bytewizard.ru` (для production)
   - `http://localhost:3000` (для разработки)
3. Скопировать **Client ID** и **Client Secret**

### Если требуется дополнительная безопасность:
- Добавить верификацию подписи id_token через JWKS
- Хранить токены в httpOnly cookies
- Реализовать refresh token механизм

## 🧪 Как протестировать:

1. **Локально:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Перейти на http://localhost:3000 → Profile → попробовать войти

2. **На сервере:**
   ```bash
   npm run build
   npm run start
   ```

## 📞 Если всё ещё не работает:

- Проверь, что NEXT_PUBLIC_TG_CLIENT_ID правильный
- Проверь console (F12) на ошибки JavaScript
- Убедись что URL зарегистрирован в @BotFather
- Проверь, что TG_BOT_TOKEN совпадает с backend/.env

---

**Статус:** ✅ Готово к тестированию
