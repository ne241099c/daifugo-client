import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { getRoom, startGame, addBot, playCard, pass, restartGame, leaveRoom } from '../api/game';
import type { Card, Room } from '../../../types';
import { getMyUserId } from '../../../lib/auth';
import { getErrorMessage } from '../../../lib/errors';
import { subscribeRoomEvents } from '../../../lib/sse';

import { GameHeader } from '../components/GameHeader';
import { OpponentArea } from '../components/OpponentArea';
import { TableArea } from '../components/TableArea';
import { DiscardPile } from '../components/DiscardPile';
import { HandArea } from '../components/HandArea';
import { GameResult } from '../components/GameResult';
import { SpectatorArea } from '../components/SpectatorArea';
import { CutIn, type CutInType } from '../components/CutIn';

import styles from './GameRoom.module.css';

const CUT_IN_DURATION_MS = 1800;
const CUT_IN_EVENTS = ['eight_cut', 'revolution', 'eleven_back'] as const satisfies readonly CutInType[];

const isCutInType = (event: string | undefined): event is CutInType =>
  CUT_IN_EVENTS.includes(event as CutInType);

const getCutInTypeForPlayedCards = (cards: Card[]): CutInType | null => {
  if (cards.length === 0) return null;

  const isRevolution = cards.length >= 4 && cards.every((card) => card.rank === cards[0].rank);
  if (isRevolution) return 'revolution';
  if (cards.some((card) => card.rank === 8)) return 'eight_cut';
  if (cards.some((card) => card.rank === 11)) return 'eleven_back';

  return null;
};

export const GameRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  // カットイン演出（8切り・革命）
  const [cutIn, setCutIn] = useState<CutInType | null>(null);
  const cutInTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSeenEventSeq = useRef<number | null>(null);
  const recentLocalCutIn = useRef<{ type: CutInType; shownAt: number } | null>(null);

  const myUserId = getMyUserId();

  // メッセージ表示ヘルパー
  const showMessage = (msg: string) => {
    setSystemMessage(msg);
    setTimeout(() => setSystemMessage(null), 3000);
  };

  const showCutIn = useCallback((type: CutInType, source: 'local' | 'server' = 'server') => {
    if (source === 'local') {
      recentLocalCutIn.current = { type, shownAt: Date.now() };
    }

    if (cutInTimer.current) {
      clearTimeout(cutInTimer.current);
    }

    setCutIn(type);
    cutInTimer.current = setTimeout(() => setCutIn(null), CUT_IN_DURATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (cutInTimer.current) {
        clearTimeout(cutInTimer.current);
      }
    };
  }, []);

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
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, '情報の取得に失敗しました'));
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // 部屋の状態は SSE(/events) でサーバーの変化をほぼ即時に受け取って再取得する。
  // ポーリングはやめ、SSE が切れた時の保険として低頻度(15秒)のフォールバックのみ残す。
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 非同期フェッチの完了後に更新するため同期的なカスケードは発生しない
    fetchRoom(); // 初回取得
    const unsubscribe = subscribeRoomEvents(() => fetchRoom());
    const fallback = setInterval(fetchRoom, 15000); // SSE 切断時の保険
    return () => {
      unsubscribe();
      clearInterval(fallback);
    };
  }, [fetchRoom]);

  // 8切り・革命のカットイン検出。eventSeq が増えた時だけ発火させる。
  useEffect(() => {
    const seq = room?.game?.eventSeq;
    const ev = room?.game?.lastEvent;
    if (seq == null) return;

    // 初回（マウント時やゲーム途中参加時）は演出させず、基準値だけ記録する
    if (lastSeenEventSeq.current === null) {
      lastSeenEventSeq.current = seq;
      return;
    }
    if (seq <= lastSeenEventSeq.current) return;
    lastSeenEventSeq.current = seq;

    if (isCutInType(ev)) {
      const local = recentLocalCutIn.current;
      const justShownLocally =
        local?.type === ev && Date.now() - local.shownAt < CUT_IN_DURATION_MS + 500;

      if (!justShownLocally) {
        showCutIn(ev);
      }
    }
  }, [room?.game?.eventSeq, room?.game?.lastEvent, showCutIn]);

  const handleRematch = async () => {
    if (!roomId) return;
    try {
      await restartGame(roomId);
      fetchRoom();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleLeave = async () => {
    if (!roomId) return;
    if (!window.confirm("本当に退出しますか？")) return;

    try {
      await leaveRoom(roomId);
      navigate('/'); // ロビー一覧へ戻る
    } catch (err) {
      alert('退出に失敗しました: ' + getErrorMessage(err));
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
    catch (err) { showMessage('開始エラー: ' + getErrorMessage(err)); }
  };

  const handleAddBot = async () => {
    if (!roomId) return;
    try { await addBot(roomId); fetchRoom(); }
    catch (err) { showMessage('CPU追加エラー: ' + getErrorMessage(err)); }
  };

  const handleDropCards = async () => {
    if (!roomId || selectedCardIds.length === 0) {
      showMessage("カードを選択してからドロップしてください");
      return;
    }
    try {
      const selectedCards = myPlayer?.hand.filter((card) => selectedCardIds.includes(card.id)) ?? [];
      const localCutIn = getCutInTypeForPlayedCards(selectedCards);

      await playCard(roomId, selectedCardIds);
      if (localCutIn) {
        showCutIn(localCutIn, 'local');
      }
      setSelectedCardIds([]);
      fetchRoom();
    } catch (err) {
      showMessage('出せません: ' + getErrorMessage(err));
    }
  };

  const handlePass = async () => {
    if (!roomId) return;
    try {
      await pass(roomId);
      fetchRoom();
      showMessage("パスしました");
    }
    catch (err) {
      showMessage('パスエラー: ' + getErrorMessage(err));
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

  const showResult = !!room.game?.isFinished;
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
        <AnimatePresence>{cutIn && <CutIn type={cutIn} />}</AnimatePresence>

        <div className={styles.headerArea}>
          <GameHeader room={room} isRevolution={!!room.game?.isRevolution} onLeave={handleLeave} />
        </div>

        <div className={styles.leftColumn}>
          <div className={styles.tableSection}>
            <TableArea
              cards={room.game?.fieldCards || []}
              onDropCards={() => { }}
              isMyTurn={false}
            />
            <DiscardPile cards={room.game?.discardPile || []} />
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
      <AnimatePresence>{cutIn && <CutIn type={cutIn} />}</AnimatePresence>

      <div className={styles.headerArea}>
        <GameHeader room={room} isRevolution={isEffectiveRevolution} onLeave={handleLeave} />
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

          {room.members && room.members.length > 0 && (
            <ul className={styles.memberList}>
              {room.members.map((m) => (
                <li key={m.id} className={styles.memberItem}>
                  <span>{m.name}</span>
                  {room.botIDs?.includes(m.id) && <span className={styles.botBadge}>CPU</span>}
                </li>
              ))}
            </ul>
          )}

          {isOwner ? (
            <div className={styles.waitingActions}>
              <button
                onClick={handleAddBot}
                disabled={room.memberIDs.length >= 4}
                className={styles.addBotButton}
              >
                ＋ CPUを追加
              </button>
              <button
                onClick={handleStartGame}
                disabled={room.memberIDs.length < 2}
                className={styles.startButton}
              >
                ゲーム開始
              </button>
            </div>
          ) : (
            <p>ホストが開始するのを待っています...</p>
          )}
          {room.memberIDs.length < 2 && <p className={styles.warning}>開始するには2人以上必要です（CPUを追加できます）</p>}
          {room.memberIDs.length >= 4 && <p className={styles.warning}>満員です（最大4人）</p>}
        </div>
      ) : (
        <>
          <div className={styles.rightColumn}>
            {systemMessage && (
              <div className={styles.systemMessageArea}>{systemMessage}</div>
            )}
            <div className={styles.rightBody}>
              <HandArea
                hand={myPlayer?.hand || []}
                selectedCardIds={selectedCardIds}
                onToggleSelection={toggleCardSelection}
                isMyTurn={isMyTurn}
                onPass={handlePass}
                turnPlayerName={turnPlayer?.user?.name}
              />
            </div>
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
              <DiscardPile cards={room.game?.discardPile || []} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
