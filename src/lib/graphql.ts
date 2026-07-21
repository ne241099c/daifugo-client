import { API_URL } from './config';
import { getMyUserId } from './auth';

interface GraphQLError {
  message: string;
}

interface GraphQLResponse<T> {
  data: T;
  errors?: GraphQLError[];
}

export const request = async <T>(query: string, variables?: Record<string, unknown>): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // ログインの代わりに、保持しているゲストIDを識別子として送る
  const userId = getMyUserId();
  if (userId) {
    headers['X-User-ID'] = userId;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const json = (await response.json()) as GraphQLResponse<T>;

    if (json.errors?.length) {
      throw new Error(json.errors.map((e) => e.message).join(', '));
    }

    return json.data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};
