import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, getRooms, joinRoom } from '../api/room';
import type { Room } from '../../../types';
import { logout } from '../../auth/api/auth';
import { CreateRoomForm } from '../components/CreateRoomForm';
import { RoomList } from '../components/RoomList';
import { deleteAccount } from '../../auth/api/auth';
import { STORAGE_KEY_TOKEN } from '../../../lib/graphql';
import styles from '../room.module.css';

export const Lobby = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      console.error('部屋一覧取得エラー:', error);
      alert('部屋一覧の取得に失敗しました');
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
    } catch (error: any) {
      console.error('部屋参加エラー詳細:', error);
      alert(`部屋への参加に失敗しました: ${error.message || '不明なエラー'}`);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("本当に退会しますか？\nこの操作は取り消せません。")) return;
    try {
      await deleteAccount();
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      navigate('/login');
    } catch (err: any) {
      alert("退会に失敗しました: " + (err.message || "不明なエラー"));
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>大富豪 Lobby</h1>
        <button onClick={logout} className={styles.logoutButton}>LOGOUT</button>
      </header>

      <div className={styles.createRoomSection}>
        <CreateRoomForm onSubmit={handleCreateRoom} loading={loading} />
      </div>

      <RoomList
        rooms={rooms}
        onJoin={handleJoinRoom}
        onRefresh={fetchRooms}
      />

      <div style={{textAlign: 'center'}}>
        <button
            onClick={handleDeleteAccount}
            className={styles.deleteAccountButton}
        >
            退会する
        </button>
      </div>
    </div>
  );
};