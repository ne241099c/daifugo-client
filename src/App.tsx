import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Login } from './features/auth/routes/Login';
import { SignUp } from './features/auth/routes/SignUp';
import { Lobby } from './features/room/routes/Lobby';
import { GameRoom } from './features/game/routes/GameRoom';
import { isAuthenticated } from './lib/auth';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={
          <PrivateRoute>
            <Lobby />
          </PrivateRoute>
        } />
        <Route path="/room/:roomId" element={
          <PrivateRoute>
            <GameRoom />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;