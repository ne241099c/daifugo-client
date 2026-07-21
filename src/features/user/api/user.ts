import { request } from '../../../lib/graphql';
import { getGuest, setGuest, type Guest } from '../../../lib/auth';

const CREATE_GUEST_MUTATION = `
  mutation CreateGuest($name: String!) {
    createGuest(name: $name) {
      id
      name
    }
  }
`;

const RENAME_USER_MUTATION = `
  mutation RenameUser($name: String!) {
    renameUser(name: $name) {
      id
      name
    }
  }
`;

const randomGuestName = (): string => `ゲスト${Math.floor(1000 + Math.random() * 9000)}`;

/** ゲストを新規作成し、保存して返す。 */
export const createGuest = async (name: string): Promise<Guest> => {
  const data = await request<{ createGuest: Guest }>(CREATE_GUEST_MUTATION, { name });
  setGuest(data.createGuest);
  return data.createGuest;
};

/** 表示名を変更し、保存して返す。 */
export const renameUser = async (name: string): Promise<Guest> => {
  const data = await request<{ renameUser: Guest }>(RENAME_USER_MUTATION, { name });
  setGuest(data.renameUser);
  return data.renameUser;
};

/**
 * ゲストを保証する。既に保持していればそれを返し、無ければ自動生成した名前で作成する。
 * ログイン画面の代わりにアプリ起動時に一度だけ呼ぶ。
 */
export const ensureGuest = async (): Promise<Guest> => {
  const existing = getGuest();
  if (existing) return existing;
  return createGuest(randomGuestName());
};
