// ログインを廃止し、匿名ゲストとして遊ぶための識別情報を sessionStorage に保持する。
// サーバーへは X-User-ID ヘッダーでこの id を送る（[[graphql]] 参照）。
//
// localStorage ではなく sessionStorage を使う理由:
// localStorage はタブ間で共有されるため、同一ブラウザの別タブを開いても
// 同じゲストID になり「別プレイヤーとして参加」できなかった。
// sessionStorage はタブ（ウィンドウ）ごとに独立するので、別タブ＝別プレイヤーになり
// 1台のブラウザでも複数人プレイ/テストができる。
// （その代わりタブを閉じるとゲストは失われ、次回は新しいゲストが作られる）

const STORAGE_KEY_GUEST = 'daifugo_guest';

export interface Guest {
  id: string;
  name: string;
}

export const getGuest = (): Guest | null => {
  const raw = sessionStorage.getItem(STORAGE_KEY_GUEST);
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
  sessionStorage.setItem(STORAGE_KEY_GUEST, JSON.stringify(guest));
};

/** サーバーへ送るゲストのユーザーID。未登録なら null。 */
export const getMyUserId = (): string | null => getGuest()?.id ?? null;

export const getGuestName = (): string | null => getGuest()?.name ?? null;
