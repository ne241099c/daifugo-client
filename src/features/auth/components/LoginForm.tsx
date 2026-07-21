import { useState } from 'react';
import type { FormEvent } from 'react';
import { login } from '../api/auth';
import styles from '../auth.module.css';

// 成功時に実行するコールバックをPropsで受け取る
interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      onSuccess(); // ログイン成功
    } catch (err) {
      console.error(err);
      setError('ログインに失敗しました。メールアドレスかパスワードを確認してください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className={styles.buttonPrimary}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </>
  );
};
