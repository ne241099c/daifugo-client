import { useState } from 'react';

interface LoginScreenProps {
    onSignUp: (name: string, email: string, pass: string) => Promise<void>;
    onSetToken: (token: string) => void;
}

export const LoginScreen = ({ onSignUp, onSetToken }: LoginScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tokenInput, setTokenInput] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert("全項目を入力してください");
      return;
    }
    await onSignUp(name, email, password);
  };

  const handleSetToken = () => {
      if (!tokenInput) return;
      onSetToken(tokenInput);
  };

  return (
    <div className="container">
      <h1>🃏 大富豪 Online</h1>
      
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>新規登録 (Sign Up)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="ユーザー名" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignUp}>登録</button>
          </div>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h3>既存トークン入力 (Debug)</h3>
          <p style={{fontSize: '0.8em'}}>※ バックエンドがトークンを返さない場合、手動で入力してください</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="JWT Token" 
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <button onClick={handleSetToken}>トークン設定</button>
          </div>
      </div>
    </div>
  );
};
