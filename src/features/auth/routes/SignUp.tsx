import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../api/auth';
import { STORAGE_KEY_TOKEN } from '../../../lib/graphql';
import styles from '../auth.module.css';

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
    <div className={styles.container}>
      <h2 className={styles.title}>SIGN UP</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
            <input 
            type="text" placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} required 
            />
        </div>
        <div className={styles.inputGroup}>
            <input 
            type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} required 
            />
        </div>
        <div className={styles.inputGroup}>
            <input 
            type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} required 
            />
        </div>
        <button type="submit" className={styles.buttonPrimary}>
          登録してログイン
        </button>
      </form>
      <div className={styles.footer}>
        <Link to="/login">すでにアカウントをお持ちの方はこちら</Link>
      </div>
    </div>
  );
};
