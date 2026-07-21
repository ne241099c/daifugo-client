// ログインを廃止し、匿名ゲストとして遊ぶための識別情報を localStorage に保持する。
// サーバーへは X-User-ID ヘッダーでこの id を送る（[[graphql]] 参照）。

const STORAGE_KEY_GUEST = 'daifugo_guest';

export interface Guest {
  id: string;
  name: string;
}

export const getGuest = (): Guest | null => {
  const raw = localStorage.getItem(STORAGE_KEY_GUEST);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Guest;
    if (!parsed?.id) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const setGuest = (guest: Guest): void => {
  localStorage.setItem(STORAGE_KEY_GUEST, JSON.stringify(guest));
};

/** サーバーへ送るゲストのユーザーID。未登録なら null。 */
export const getMyUserId = (): string | null => getGuest()?.id ?? null;

export const getGuestName = (): string | null => getGuest()?.name ?? null;
