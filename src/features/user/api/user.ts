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

const GET_USER_QUERY = `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }
`;

/** サーバー上に指定IDのユーザーが実在するか確認する。 */
const userExistsOnServer = async (id: string): Promise<boolean> => {
  try {
    const data = await request<{ user: Guest | null }>(GET_USER_QUERY, { id });
    return !!data.user;
  } catch {
    // 「user not found」などのエラーは存在しない扱いにする
    return false;
  }
};

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
 * ゲストを保証する。既に保持していてサーバー上にも存在すればそれを返す。
 * サーバーがインメモリ管理で再起動によりユーザーが消えている場合は作り直す。
 * ログイン画面の代わりにアプリ起動時に一度だけ呼ぶ。
 */
export const ensureGuest = async (): Promise<Guest> => {
  const existing = getGuest();
  if (existing && (await userExistsOnServer(existing.id))) {
    return existing;
  }
  // 未登録、またはサーバー側に存在しない（再起動でロスト）場合は作り直す
  return createGuest(existing?.name ?? randomGuestName());
};
