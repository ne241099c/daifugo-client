import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoom, startGame, playCard, pass } from '../../features/game/api/game';
import type { Room } from '../../types';
import { STORAGE_KEY_TOKEN } from '../../lib/graphql';

import { GameHeader } from './components/GameHeader';
import { OpponentArea } from './components/OpponentArea';
import { TableArea } from './components/TableArea';
import { HandArea } from './components/HandArea';

import styles from './GameRoom.module.css';

const getMyUserId = () => {
  const token = localStorage.getItem(STORAGE_KEY_TOKEN);
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload.sub;
  } catch (e) {
    return null;
  }
};

export const GameRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);

  const myUserId = getMyUserId();

  const fetchRoom = useCallback(async () => {
    if (!roomId) {
      setError("URLが無効です（部屋IDが見つかりません）");
      setLoading(false);
      return;
    }

    try {
      const data = await getRoom(roomId);
      setRoom(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "情報の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchRoom();
    const interval = setInterval(fetchRoom, 2000);
    return () => clearInterval(interval);
  }, [fetchRoom]);

  const toggleCardSelection = (cardId: number) => {
    setSelectedCardIds(prev => 
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    );
  };

  const handleStartGame = async () => {
    if (!roomId) return;
    try { await startGame(roomId); fetchRoom(); } 
    catch (err: any) { alert('開始エラー: ' + err.message); }
  };

  // ドロップされたときに呼ばれる
  const handleDropCards = async () => {
    if (!roomId || selectedCardIds.length === 0) {
      alert("カードを選択してからドロップしてください");
      return;
    }
    try {
      await playCard(roomId, selectedCardIds);
      setSelectedCardIds([]);
      fetchRoom();
    } catch (err: any) { 
      alert('カードを出せません: ' + err.message); 
    }
  };

  const handlePass = async () => {
    if (!roomId || !confirm("パスしますか？")) return;
    try { await pass(roomId); fetchRoom(); } 
    catch (err: any) { alert('パスエラー: ' + err.message); }
  };

  if (loading) return <div className={styles.loading}>読み込み中... (ID: {roomId})</div>;
  
  if (error) return (
    <div className={styles.error}>
      <h2>エラーが発生しました</h2>
      <p>{error}</p>
      <button onClick={() => navigate('/')}>ロビーに戻る</button>
    </div>
  );

  if (!room) return <div className={styles.loading}>部屋データがありません</div>;

  const isOwner = myUserId === String(room.ownerID);
  const isGameStarted = !!room.game;

  const myPlayer = room.game?.players.find(p => String(p.userID) === myUserId);
  const opponents = room.game?.players.filter(p => String(p.userID) !== myUserId) || [];
  const turnPlayer = room.game?.players[room.game.turn];
  
  const isMyTurn = isGameStarted && String(turnPlayer?.userID) === String(myUserId);

  return (
    <div className={styles.container}>
      <GameHeader room={room} />

      {!isGameStarted ? (
        <div className={styles.waiting}>
          <h2>待機中... ({room.memberIDs.length}人参加中)</h2>
          {isOwner ? (
            <button 
              onClick={handleStartGame}
              disabled={room.memberIDs.length < 2}
              className={styles.startButton}
            >
              ゲーム開始
            </button>
          ) : (
            <p>ホストが開始するのを待っています...</p>
          )}
          {room.memberIDs.length < 2 && <p className={styles.warning}>開始するには2人以上必要です</p>}
        </div>
      ) : (
        <>
          <OpponentArea 
            players={opponents} 
            turnUserID={turnPlayer?.userID} 
          />
          
          <TableArea 
            cards={room.game?.fieldCards || []} 
            isRevolution={!!room.game?.isRevolution} 
            onDropCards={handleDropCards}
            isMyTurn={isMyTurn}
          />
          
          <HandArea 
            hand={myPlayer?.hand || []}
            selectedCardIds={selectedCardIds}
            onToggleSelection={toggleCardSelection}
            isMyTurn={isMyTurn}
            onPass={handlePass}
            turnPlayerName={turnPlayer?.user?.name}
          />
        </>
      )}
    </div>
  );
};