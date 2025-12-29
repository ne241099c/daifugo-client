import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, getRooms, joinRoom } from '../api/room';
import type { Room } from '../../../types';
import { logout } from '../../auth/api/auth';
import { CreateRoomForm } from '../components/CreateRoomForm';
import { RoomList } from '../components/RoomList';

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

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>大富豪Lobby</h1>
        <button onClick={logout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>ログアウト</button>
      </header>

      <CreateRoomForm onSubmit={handleCreateRoom} loading={loading} />
      
      <RoomList 
        rooms={rooms} 
        onJoin={handleJoinRoom} 
        onRefresh={fetchRooms} 
      />
    </div>
  );
};