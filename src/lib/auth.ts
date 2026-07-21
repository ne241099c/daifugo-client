export const STORAGE_KEY_TOKEN = 'daifugo_token';

export const getToken = (): string | null => localStorage.getItem(STORAGE_KEY_TOKEN);

export const setToken = (token: string): void => localStorage.setItem(STORAGE_KEY_TOKEN, token);

export const clearToken = (): void => localStorage.removeItem(STORAGE_KEY_TOKEN);

export const isAuthenticated = (): boolean => !!getToken();

/**
 * JWT のペイロード（`sub` クレーム）からログイン中ユーザーのIDを取り出す。
 * トークンが無い/不正な場合は null を返す。
 */
export const getMyUserId = (): string | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64)) as { sub?: string };
    return payload.sub ?? null;
  } catch {
    return null;
  }
};
