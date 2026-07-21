import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoom, startGame, playCard, pass, restartGame, leaveRoom } from '../../features/game/api/game';
import type { Room } from '../../types';
import { STORAGE_KEY_TOKEN } from '../../lib/graphql';

import { GameHeader } from './components/GameHeader';
import { OpponentArea } from './components/OpponentArea';
import { TableArea } from './components/TableArea';
import { HandArea } from './components/HandArea';
import { GameResult } from './components/GameResult';
import { SpectatorArea } from './components/SpectatorArea';


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
  const [showResult, setShowResult] = useState(false);

  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  const myUserId = getMyUserId();

  // メッセージ表示ヘルパー
  const showMessage = (msg: string) => {
    setSystemMessage(msg);
    setTimeout(() => setSystemMessage(null), 3000);
  };

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

  useEffect(() => {
    if (room?.game?.isFinished) {
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  }, [room?.game?.isFinished]);


  const handleRematch = async () => {
    if (!roomId) return;
    try {
      await restartGame(roomId);
      setShowResult(false);
      fetchRoom();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLeave = async () => {
    if (!roomId) return;
    if (!window.confirm("本当に退出しますか？")) return;

    try {
      await leaveRoom(roomId);
      navigate('/'); // ロビー一覧へ戻る
    } catch (err: any) {
      alert("退出に失敗しました: " + err.message);
      navigate('/'); // 失敗してもとりあえずロビーに戻す
    }
  };

  const toggleCardSelection = (cardId: number) => {
    setSelectedCardIds(prev =>
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    );
  };

  const handleStartGame = async () => {
    if (!roomId) return;
    try { await startGame(roomId); fetchRoom(); }
    catch (err: any) { showMessage('開始エラー: ' + err.message); }
  };

  const handleDropCards = async () => {
    if (!roomId || selectedCardIds.length === 0) {
      showMessage("カードを選択してからドロップしてください");
      return;
    }
    try {
      await playCard(roomId, selectedCardIds);
      setSelectedCardIds([]);
      fetchRoom();
    } catch (err: any) {
      showMessage('出せません: ' + err.message);
    }
  };

  const handlePass = async () => {
    if (!roomId) return;
    try {
      await pass(roomId);
      fetchRoom();
      showMessage("パスしました");
    }
    catch (err: any) {
      showMessage('パスエラー: ' + err.message);
    }
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
  const isSpectator = isGameStarted && !myPlayer;
  const opponents = room.game?.players.filter(p => String(p.userID) !== myUserId) || [];
  const turnPlayer = room.game?.players[room.game.turn];

  const isMyTurn = isGameStarted && String(turnPlayer?.userID) === String(myUserId);
  const isRevolutionDB = !!room.game?.isRevolution;
  const is11Back = room.game?.fieldCards.some(c => c.rank === 11) ?? false;
  const isEffectiveRevolution = isRevolutionDB !== is11Back;

  if (isSpectator) {
    return (
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <GameHeader room={room} isRevolution={!!room.game?.isRevolution} />
        </div>

        <div className={styles.leftColumn}>
          <div className={styles.tableSection}>
            <TableArea
              cards={room.game?.fieldCards || []}
              onDropCards={() => { }}
              isMyTurn={false}
            />
            <div className={styles.discardPilePlaceholder}>
              捨て札<br />(準備中)
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <SpectatorArea players={room.game?.players || []} />
        </div>

        {showResult && (
          <GameResult
            room={room}
            onRematch={() => { }}
            onLeave={handleLeave}
            isOwner={false}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <GameHeader room={room} isRevolution={isEffectiveRevolution} />
      </div>

      {showResult && (
        <GameResult
          room={room}
          onRematch={handleRematch}
          onLeave={handleLeave} // ★追加: 退出処理を渡す
          isOwner={isOwner}
        />
      )}

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
          <div className={styles.rightColumn}>
            {systemMessage && <div className={styles.systemMessageArea}>{systemMessage}</div>}
            <HandArea
              hand={myPlayer?.hand || []}
              selectedCardIds={selectedCardIds}
              onToggleSelection={toggleCardSelection}
              isMyTurn={isMyTurn}
              onPass={handlePass}
              turnPlayerName={turnPlayer?.user?.name}
            />
          </div>

          <div className={styles.leftColumn}>
            <OpponentArea
              players={opponents}
              turnUserID={turnPlayer?.userID}
            />
            <div className={styles.tableSection}>
              <TableArea
                cards={room.game?.fieldCards || []}
                onDropCards={handleDropCards}
                isMyTurn={isMyTurn}
              />
              <div className={styles.discardPilePlaceholder}>
                捨て札<br />(準備中)
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};