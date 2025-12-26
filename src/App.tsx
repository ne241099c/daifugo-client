import { useState } from 'react'
import { useGame } from './hooks/useGame'
import { LoginScreen } from './pages/Login'
import { GameScreen } from './pages/GameRoom/GameRoom'
import './App.css'

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('debug') === 'true') {
      const mockRoom = {
          id: "123",
          name: "Debug Room",
          ownerId: "me",
          memberIds: ["me", "p2"],
          owner: { id: "me", name: "Me", email: "me@example.com", createdAt: "", updatedAt: "" },
          members: [
              { id: "me", name: "Me", email: "me@example.com", createdAt: "", updatedAt: "" },
              { id: "p2", name: "Player 2", email: "p2@example.com", createdAt: "", updatedAt: "" }
          ],
          game: {
              turn: 0,
              fieldCards: [{id: 1, suit: "Diamond", rank: 13}],
              isRevolution: false,
              players: [
                  { userId: "me", user: {id: "me", name: "Me", email: "", createdAt: "", updatedAt: ""}, hand: [{id: 2, suit: "Spade", rank: 1}], rank: 0 },
                  { userId: "p2", user: {id: "p2", name: "P2", email: "", createdAt: "", updatedAt: ""}, hand: [], rank: 1 }
              ],
              finishedPlayers: [{userId: "p2", rank: 1}], 
              passCount: 0
          },
          createdAt: "",
          updatedAt: ""
      };
      
      return (
        <GameScreen
            room={mockRoom as any}
            username="Me"
            onStart={() => {}}
            onPlay={() => {}}
            onPass={() => {}}
            logout={() => {}}
        />
      );
  }

  const {
    isConnected,
    token,
    user,
    room,
    signUp,
    setAuthToken,
    joinRoom,
    startGame,
    playCards,
    passTurn,
    logout
  } = useGame();
  
  const [roomIdInput, setRoomIdInput] = useState('');

  const handleSignUp = async (name: string, email: string, pass: string) => {
    try {
        await signUp(name, email, pass);
        alert("登録完了。トークンが発行されたか確認してください。(現状のバックエンド仕様ではトークン発行がない可能性があります)");
    } catch (e) {
        alert("登録エラー: " + e);
    }
  };

  const handleJoinRoom = async () => {
      if (!roomIdInput) return;
      try {
          await joinRoom(roomIdInput);
      } catch (e) {
          alert("入室エラー: " + e);
      }
  };

  if (!token) {
    return <LoginScreen onSignUp={handleSignUp} onSetToken={setAuthToken} />;
  }

  if (!room) {
      return (
          <div className="container">
              <h2>ようこそ {user?.name || 'ゲスト'} さん</h2>
              <p>JWT Token Set ✅</p>
              <p>SSE Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
              
              <div style={{ marginTop: '20px' }}>
                  <input 
                    type="text" 
                    placeholder="Room ID" 
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                  />
                  <button onClick={handleJoinRoom}>部屋に参加</button>
              </div>
              <button onClick={logout} style={{ marginTop: '20px' }}>ログアウト</button>
          </div>
      );
  }
  
  return (
    <GameScreen
      room={room}
      username={user?.name || ''}
      onStart={startGame}
      onPlay={playCards}
      onPass={passTurn}
      logout={logout}
    />
  );
}

export default App
