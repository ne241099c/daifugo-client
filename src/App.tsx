import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Lobby } from './features/room/routes/Lobby';
import { GameRoom } from './features/game/routes/GameRoom';
import { ensureGuest } from './features/user/api/user';

function App() {
  // ログインの代わりに、起動時に一度だけゲストを用意する。
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureGuest()
      .then(() => setReady(true))
      .catch(() => setError('サーバーに接続できませんでした。サーバーが起動しているか確認してください。'));
  }, []);

  if (error) {
    return <div className="app-boot-message">{error}</div>;
  }

  if (!ready) {
    return <div className="app-boot-message">接続中...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomId" element={<GameRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
