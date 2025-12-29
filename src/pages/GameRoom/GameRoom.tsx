import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoom, startGame, playCard, pass } from '../../features/game/api/game';
import type { Room } from '../../types';
import { STORAGE_KEY_TOKEN } from '../../lib/graphql';

// コンポーネントのインポート
import { GameHeader } from './components/GameHeader';
import { OpponentArea } from './components/OpponentArea';
import { TableArea } from './components/TableArea';
import { HandArea } from './components/HandArea';

// ID取得ヘルパー
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

  // 部屋情報の取得
  const fetchRoom = useCallback(async () => {
    // ★ここを修正: roomIdがない場合もローディングを解除してエラーにする
    if (!roomId) {
      console.error("Room ID not found in URL parameters.");
      setError("URLが無効です（部屋IDが見つかりません）");
      setLoading(false);
      return;
    }

    try {
      console.log(`Fetching room data for ID: ${roomId}...`); // デバッグログ
      const data = await getRoom(roomId);
      console.log("Fetched Room Data:", data); // デバッグログ
      setRoom(data);
      setError(null);
    } catch (err: any) {
      console.error("Fetch Error Details:", err);
      // エラーメッセージを表示
      setError(err.message || "情報の取得に失敗しました");
    } finally {
      // ★必ずローディングを解除
      setLoading(false);
    }
  }, [roomId]);

  // ポーリング
  useEffect(() => {
    fetchRoom();
    const interval = setInterval(fetchRoom, 2000);
    return () => clearInterval(interval);
  }, [fetchRoom]);

  // カード選択ロジック
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

  const handlePlayCard = async () => {
    if (!roomId || selectedCardIds.length === 0) return;
    try {
      await playCard(roomId, selectedCardIds);
      setSelectedCardIds([]);
      fetchRoom();
    } catch (err: any) { alert('カードを出せません: ' + err.message); }
  };

  const handlePass = async () => {
    if (!roomId || !confirm("パスしますか？")) return;
    try { await pass(roomId); fetchRoom(); } 
    catch (err: any) { alert('パスエラー: ' + err.message); }
  };

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>読み込み中...</h2>
      <p>部屋ID: {roomId || '不明'}</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>
      <h2>エラーが発生しました</h2>
      <p>{error}</p>
      <button onClick={() => navigate('/')}>ロビーに戻る</button>
    </div>
  );

  if (!room) return <div style={{ padding: '2rem' }}>部屋データがありません</div>;

  const isOwner = myUserId === String(room.ownerID);
  const isGameStarted = !!room.game;

  // プレイヤー情報の抽出
  const myPlayer = room.game?.players.find(p => String(p.userID) === myUserId);
  const opponents = room.game?.players.filter(p => String(p.userID) !== myUserId) || [];
  const turnPlayer = room.game?.players[room.game.turn];
  const isMyTurn = isGameStarted && turnPlayer?.userID === myUserId;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <GameHeader room={room} />

      {!isGameStarted ? (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h2>待機中... ({room.memberIDs.length}人参加中)</h2>
          {isOwner ? (
            <button 
              onClick={handleStartGame}
              disabled={room.memberIDs.length < 2}
              style={{ 
                padding: '1rem 2rem', 
                fontSize: '1.2rem', 
                cursor: room.memberIDs.length < 2 ? 'not-allowed' : 'pointer', 
                backgroundColor: room.memberIDs.length < 2 ? '#ccc' : '#4CAF50', 
                color: 'white', border: 'none', borderRadius: '4px' 
              }}
            >
              ゲーム開始
            </button>
          ) : (
            <p>ホストが開始するのを待っています...</p>
          )}
          {room.memberIDs.length < 2 && <p style={{color:'red'}}>開始するには2人以上必要です</p>}
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
          />
          
          <HandArea 
            hand={myPlayer?.hand || []}
            selectedCardIds={selectedCardIds}
            onToggleSelection={toggleCardSelection}
            isMyTurn={isMyTurn || false}
            onPlay={handlePlayCard}
            onPass={handlePass}
            turnPlayerName={turnPlayer?.user?.name}
          />
        </>
      )}
    </div>
  );
};