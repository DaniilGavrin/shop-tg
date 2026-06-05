export async function getCurrentUser() {
  try {
    const res = await fetch('https://api.shop.bytewizard.ru/me', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',      
    });
    
    if (res.ok) {
      return await res.json();
    }
    return null; // Не авторизован
  } catch (error) {
    console.error('[AUTH] Failed to fetch user:', error);
    return null;
  }
}

export async function logout() {
  try {
    await fetch('https://api.shop.bytewizard.ru/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('[AUTH] Logout failed:', error);
  }
}