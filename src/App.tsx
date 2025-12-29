// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './features/auth/routes/Login';
import { Lobby } from './features/room/routes/Lobby';
import { GameRoom } from './features/game/routes/GameRoom';
import { STORAGE_KEY_TOKEN } from './lib/graphql';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem(STORAGE_KEY_TOKEN);
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Lobby />
          </PrivateRoute>
        } />
        {/* ★修正: GameRoomコンポーネントを使用 */}
        <Route path="/room/:roomID" element={
          <PrivateRoute>
            <GameRoom />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;