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

const SIGNUP_MUTATION = `
  mutation SignUp($name: String!, $email: String!, $password: String!) {
    signUp(name: $name, email: $email, password: $password) {
      id
      name
      email
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

export const registerWithEmail = async (name: string, email: string, password: string): Promise<User> => {
  const data = await request<{ signUp: User }>(SIGNUP_MUTATION, { name, email, password });
  return data.signUp;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY_TOKEN);
  window.location.reload(); // 簡易的にリロードして状態リセット
};