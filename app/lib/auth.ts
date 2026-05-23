export function setUser(user: any) {
  localStorage.setItem('telegram_user', JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem('telegram_user');
  return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
  localStorage.removeItem('telegram_user');
}