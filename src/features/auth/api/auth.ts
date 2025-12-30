// src/features/auth/api/auth.ts
import { request, STORAGE_KEY_TOKEN } from '../../../lib/graphql';
import type { AuthPayload, User } from '../../../types';

// GraphQLクエリ定義
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

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  const data = await request<{ login: AuthPayload }>(LOGIN_MUTATION, { email, password });
  const { token, user } = data.login;
  
  // トークンを保存
  localStorage.setItem(STORAGE_KEY_TOKEN, token);
  
  return user;
};

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

export const login = async (email: string, password: string): Promise<AuthPayload> => {
  const data = await request<{ login: AuthPayload }>(LOGIN_MUTATION, { email, password });
  return data.login;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY_TOKEN);
  window.location.reload(); // 簡易的にリロードして状態リセット
};

export const signUp = async (name: string, email: string, password: string): Promise<AuthPayload> => {
  await request<{ signUp: { id: string, name: string } }>(SIGN_UP_MUTATION, { name, email, password });
  
  return await login(email, password);
};

export const deleteAccount = async (): Promise<boolean> => {
  const data = await request<{ deleteUser: boolean }>(DELETE_USER_MUTATION, {});
  return data.deleteUser;
};