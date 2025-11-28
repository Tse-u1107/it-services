const TOKEN_KEY = "userToken";
const EXP_KEY = "tokenExpiresAt";

export function saveToken(token: string, ttlMs: number) {
  localStorage.setItem(TOKEN_KEY, token);
  const expiresAt = (Date.now() + ttlMs).toString();
  localStorage.setItem(EXP_KEY, Date.now() + expiresAt);
}

export function loadToken() {
  const exp = localStorage.getItem(EXP_KEY);
  const token = localStorage.getItem(TOKEN_KEY);

  if (!exp || !token) return null;

  // Remove expired token
  if (Date.now() > Number(exp)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXP_KEY);
    return null;
  }

  return token;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXP_KEY);
}