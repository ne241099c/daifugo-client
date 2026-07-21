import { request } from '../../../lib/graphql';
import { clearToken, setToken } from '../../../lib/auth';
import type { AuthPayload } from '../../../types';

const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const SIGN_UP_MUTATION = `
  mutation SignUp($name: String!, $email: String!, $password: String!) {
    signUp(in: {name: $name, email: $email, password: $password}) {
      id
      name
    }
  }
`;

const DELETE_USER_MUTATION = `
  mutation DeleteUser {
    deleteUser
  }
`;

/** ログインし、取得したトークンを保存する。 */
export const login = async (email: string, password: string): Promise<AuthPayload> => {
  const data = await request<{ login: AuthPayload }>(LOGIN_MUTATION, { email, password });
  setToken(data.login.token);
  return data.login;
};

/** 登録後、そのままログインしてトークンを保存する。 */
export const signUp = async (name: string, email: string, password: string): Promise<AuthPayload> => {
  await request<{ signUp: { id: string; name: string } }>(SIGN_UP_MUTATION, { name, email, password });
  return login(email, password);
};

export const logout = (): void => {
  clearToken();
  window.location.reload(); // 簡易的にリロードして状態リセット
};

export const deleteAccount = async (): Promise<boolean> => {
  const data = await request<{ deleteUser: boolean }>(DELETE_USER_MUTATION);
  return data.deleteUser;
};
