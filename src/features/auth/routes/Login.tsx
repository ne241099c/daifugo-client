// src/features/auth/routes/Login.tsx
import { useNavigate } from 'react-router-dom'; // コメントアウトを解除
import { LoginForm } from '../components/LoginForm';

export const Login = () => {
  const navigate = useNavigate(); // コメントアウトを解除

  const handleSuccess = () => {
    // アラートは邪魔なら消してもOK
    // alert('ログイン成功！');
    
    // ロビー画面へ遷移
    navigate('/'); 
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
};