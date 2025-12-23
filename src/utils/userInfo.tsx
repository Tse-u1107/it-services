const USER_KEY = "auth_user";
const EXPIRES_KEY = "auth_expires_at";

export function saveAuthUser(user: any, expiresInSec: number) {
  const expiresAt = Date.now() + expiresInSec * 1000;

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(EXPIRES_KEY, expiresAt.toString());
}

export function loadAuthUser() {
  const userStr = localStorage.getItem(USER_KEY);
  const expStr = localStorage.getItem(EXPIRES_KEY);

  if (!userStr || !expStr) return null;

  const expiresAt = Number(expStr);

  if (Date.now() > expiresAt) {
    clearAuthUser();
    return null;
  }

  return JSON.parse(userStr);
}

export function clearAuthUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}
