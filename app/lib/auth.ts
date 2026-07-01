// lib/auth.ts
const API_BASE = 'https://api.bytewizard.ru';

// Глобальная блокировка: если true, значит, рефреш уже идет.
// Все новые запросы будут ждать завершения этого промиса.
let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  // Если рефреш уже идет, возвращаем существующий промис (защита от гонки)
  if (refreshPromise) {
    return refreshPromise;
  }

  console.log('[AUTH] Starting silent token refresh...');
  
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Важно: отправляем куку refresh_token
        cache: 'no-store',
      });
      
      if (res.ok) {
        console.log('[AUTH] Token refreshed successfully');
        return true;
      }
      console.warn('[AUTH] Refresh failed, status:', res.status);
      return false;
    } catch (error) {
      console.error('[AUTH] Refresh token request failed:', error);
      return false;
    } finally {
      // Обязательно снимаем блокировку после завершения (успешного или нет)
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Универсальная обертка. ИСПОЛЬЗУЙ ЕЕ ВМЕСТО ОБЫЧНОГО fetch В ЛЮБЫХ ЗАПРОСАХ К API
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // 1. Делаем исходный запрос
  let res = await fetch(url, {
    ...options,
    credentials: 'include',
    cache: options.cache || 'no-store',
  });

  // 2. Если токен протух (401)
  if (res.status === 401) {
    console.log('[AUTH] 401 detected. Queuing request for silent refresh...');
    
    // Ждем завершения рефреша. Если он уже идет, мы просто встанем в очередь.
    const isRefreshed = await refreshToken();
    
    if (isRefreshed) {
      // 3. Токен обновлен (браузер автоматически подставил новую куку access_token).
      // Тихо повторяем исходный запрос. Пользователь этого не заметит.
      console.log('[AUTH] Retrying original request with new token...');
      res = await fetch(url, {
        ...options,
        credentials: 'include',
        cache: options.cache || 'no-store',
      });
    } else {
      // 4. Рефреш не удался (протух и refresh_token, или его отозвали).
      // Возвращаем 401, чтобы компонент мог показать "Войдите в систему".
      console.warn('[AUTH] Silent refresh failed completely. Returning 401.');
    }
  }

  return res;
}

// Получение пользователя теперь тоже использует пуленепробиваемый authFetch
export async function getCurrentUser() {
  try {
    const res = await authFetch(`${API_BASE}/me`, { method: 'GET' });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (error) {
    console.error('[AUTH] Failed to fetch user:', error);
    return null;
  }
}

export async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('[AUTH] Logout failed:', error);
  }
}