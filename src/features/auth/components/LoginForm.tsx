// src/features/auth/components/LoginForm.tsx
import { useState } from 'react';
import { loginWithEmail } from '../api/auth';

// 成功時に実行するコールバックをPropsで受け取る
interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      onSuccess(); // ログイン成功
    } catch (err) {
      console.error(err);
      setError('ログインに失敗しました。メールアドレスかパスワードを確認してください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
      <h2>ログイン</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div>
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <button type="submit" disabled={loading} style={{ padding: '0.5rem', cursor: 'pointer' }}>
        {loading ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
};