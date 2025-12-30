import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../api/auth';
import { STORAGE_KEY_TOKEN } from '../../../lib/graphql';

export const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await signUp(name, email, password);
      localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '登録に失敗しました');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', textAlign: 'center' }}>
      <h2>新規登録</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} required 
          style={{ padding: '0.5rem' }}
        />
        <input 
          type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} required 
          style={{ padding: '0.5rem' }}
        />
        <input 
          type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} required 
          style={{ padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
          登録してログイン
        </button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/login">すでにアカウントをお持ちの方はこちら</Link>
      </div>
    </div>
  );
};