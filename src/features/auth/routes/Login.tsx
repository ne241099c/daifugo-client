// src/features/auth/routes/Login.tsx
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { Link } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // ロビー画面へ遷移
    navigate('/');
  };

  return (
    <div className="container">
      <LoginForm onSuccess={handleSuccess} />
      <div style={{ marginTop: '1rem' }}>
        <Link to="/signup">アカウントをお持ちでない方はこちら</Link>
      </div>
    </div>
  );
};