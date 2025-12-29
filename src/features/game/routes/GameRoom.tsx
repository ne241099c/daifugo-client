// src/features/game/routes/GameRoom.tsx
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoom, startGame } from '../api/game';
import type { Room } from '../../../types';
import { STORAGE_KEY_TOKEN } from '../../../lib/graphql';

// 自分のIDをトークンから解析する簡易関数（本来はContextで持つべきですが簡易的に）
const getMyUserID = () => {
  const token = localStorage.getItem(STORAGE_KEY_TOKEN);
  if (!token) return null;
  // JWTのペイロード(2番目の部分)をデコード
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload.sub; // subject(userID)
  } catch (e) {
    return null;
  }
};

export const GameRoom = () => {
  const { roomID } = useParams<{ roomID: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const myUserID = getMyUserID();

  // 部屋情報を取得する関数
  const fetchRoom = useCallback(async () => {
    if (!roomID) return;
    try {
      const data = await getRoom(roomID);
      setRoom(data);
    } catch (error) {
      console.error('部屋情報取得エラー:', error);
    } finally {
      setLoading(false);
    }
  }, [roomID]);

  // 初回取得とポーリング（3秒ごとに更新）
  useEffect(() => {
    fetchRoom();
    const interval = setInterval(fetchRoom, 3000);
    return () => clearInterval(interval);
  }, [fetchRoom]);

  const handleStartGame = async () => {
    if (!roomID || !room) return;
    try {
      await startGame(roomID);
      fetchRoom(); // すぐに更新
    } catch (error) {
      console.error(error);
      alert('ゲーム開始に失敗しました');
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (!room) return <div>部屋が見つかりません</div>;

  const isOwner = myUserID === String(room.ownerID);
  const isGameStarted = !!room.game;

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
        <h1>部屋: {room.name}</h1>
        <p>参加者: {room.memberIDs.length}人</p>
        <button onClick={() => navigate('/')}>ロビーに戻る</button>
      </header>

      {/* ゲーム開始前の表示 */}
      {!isGameStarted ? (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h2>待機中...</h2>
          <p>メンバーが集まるのを待っています。</p>
          
          {isOwner && (
            <button 
              onClick={handleStartGame}
              disabled={room.memberIDs.length < 2} // 2人以上いないと開始できない
              style={{ 
                padding: '1rem 2rem', 
                fontSize: '1.2rem', 
                cursor: 'pointer', 
                marginTop: '1rem',
                backgroundColor: room.memberIDs.length < 2 ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              ゲームを開始する
            </button>
          )}
          {isOwner && room.memberIDs.length < 2 && <p style={{color: 'red'}}>開始するにはあと{2 - room.memberIDs.length}人必要です</p>}
        </div>
      ) : (
        /* ゲーム中の表示（仮） */
        <div>
          <h2>ゲーム進行中</h2>
          <p>ターン: {room.game?.turn}番目のプレイヤー</p>
          <p>革命状態: {room.game?.isRevolution ? 'あり' : 'なし'}</p>
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0' }}>
            <h3>場のカード</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {room.game?.fieldCards?.length === 0 ? (
                <p>カードはありません</p>
              ) : (
                room.game?.fieldCards?.map(c => (
                  <span key={c.id} style={{ border: '1px solid black', padding: '0.5rem', background: 'white' }}>
                    {c.suit} {c.rank}
                  </span>
                ))
              )}
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>あなたの手札</h3>
            {/* 自分の手札を探して表示 */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {room.game?.players.find(p => String(p.userID) === myUserID)?.hand.map(c => (
                <span key={c.id} style={{ border: '1px solid black', padding: '0.5rem', background: 'white', cursor: 'pointer' }}>
                  {c.suit} {c.rank}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};