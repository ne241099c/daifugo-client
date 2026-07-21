/** unknown 型のエラーから表示用メッセージを安全に取り出す。 */
export const getErrorMessage = (error: unknown, fallback = '不明なエラー'): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
};
