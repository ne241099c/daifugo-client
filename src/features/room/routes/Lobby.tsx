import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, getRooms, joinRoom } from '../api/room';
import type { Room } from '../../../types';
import { getGuestName } from '../../../lib/auth';
import { renameUser } from '../../../features/user/api/user';
import { getErrorMessage } from '../../../lib/errors';
import { CreateRoomForm } from '../components/CreateRoomForm';
import { RoomList } from '../components/RoomList';
import styles from '../room.module.css';

export const Lobby = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(getGuestName() ?? '');

  const fetchRooms = useCallback(async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      console.error('部屋一覧取得エラー:', error);
      alert('部屋一覧の取得に失敗しました');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 非同期フェッチの完了後に更新するため同期的なカスケードは発生しない
    fetchRooms();
  }, [fetchRooms]);

  const handleRename = async () => {
    const next = window.prompt('プレイヤー名を入力', name);
    if (next === null) return;
    const trimmed = next.trim();
    if (!trimmed || trimmed === name) return;
    try {
      const guest = await renameUser(trimmed);
      setName(guest.name);
    } catch (err) {
      alert('名前の変更に失敗しました: ' + getErrorMessage(err));
    }
  };

  const handleCreateRoom = async (name: string) => {
    setLoading(true);
    try {
      const room = await createRoom(name);
      console.log('部屋作成成功:', room);
      navigate(`/room/${room.id}`);
    } catch (error) {
      console.error('部屋作成エラー:', error);
      alert('部屋の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomID: string) => {
    if (!window.confirm(`部屋ID: ${roomID} に参加しますか？`)) return;

    try {
      console.log(`Joining room ${roomID}...`);
      const room = await joinRoom(roomID);
      console.log('参加成功:', room);
      navigate(`/room/${room.id}`);
    } catch (error) {
      console.error('部屋参加エラー詳細:', error);
      alert(`部屋への参加に失敗しました: ${getErrorMessage(error)}`);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>大富豪 Lobby</h1>
        <button onClick={handleRename} className={styles.playerNameButton}>
          {name || 'ゲスト'} <span className={styles.editHint}>✎ 名前変更</span>
        </button>
      </header>

      <div className={styles.createRoomSection}>
        <CreateRoomForm onSubmit={handleCreateRoom} loading={loading} />
      </div>

      <RoomList
        rooms={rooms}
        onJoin={handleJoinRoom}
        onRefresh={fetchRooms}
      />
    </div>
  );
};
