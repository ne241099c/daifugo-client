// src/features/auth/routes/Login.tsx
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { Link } from 'react-router-dom';
import styles from '../auth.module.css';

export const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // ロビー画面へ遷移
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>LOGIN</h2>
      <LoginForm onSuccess={handleSuccess} />
      <div className={styles.footer}>
        <Link to="/signup">アカウントをお持ちでない方はこちら</Link>
      </div>
    </div>
  );
};