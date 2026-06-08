const API_BASE = 'https://api.bytewizard.ru';

async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Обязательно: отправляем куку refresh_token
    });
    
    if (res.ok) {
      console.log('[AUTH] Token refreshed successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('[AUTH] Refresh token request failed:', error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    // 1. Пробуем получить данные с текущим токеном
    let res = await fetch(`${API_BASE}/me`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });

    // 2. Если токен истёк (401), пытаемся его обновить
    if (res.status === 401) {
      console.log('[AUTH] Access token expired, attempting refresh...');
      const isRefreshed = await refreshToken();
      
      if (isRefreshed) {
        // 3. Если успешно обновили, повторяем запрос на /me 
        // (браузер автоматически подставит новую куку access_token)
        res = await fetch(`${API_BASE}/me`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
      } else {
        // Рефреш не удался (например, истёк и refresh token, или его отозвали)
        console.log('[AUTH] Refresh failed, user is logged out');
        return null;
      }
    }

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