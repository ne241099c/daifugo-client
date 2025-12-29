import { useNavigate } from 'react-router-dom';
import type { Room } from '../../../types';
import { leaveRoom } from '../../../features/game/api/game';
import styles from './GameHeader.module.css';

interface Props {
  room: Room;
}

export const GameHeader = ({ room }: Props) => {
  const navigate = useNavigate();

  const handleLeave = async () => {
    if (!confirm('本当に退出しますか？')) return;
    try {
      await leaveRoom(room.id);
      navigate('/');
    } catch (error) {
      alert('退出に失敗しました');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <h1>部屋: {room.name}</h1>
        <p>ID: {room.id} / 参加者: {room.memberIDs.length}人</p>
      </div>
      <div className={styles.actions}>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          ロビーへ戻る
        </button>
        <button onClick={handleLeave} className={styles.leaveButton}>
          退出する
        </button>
      </div>
    </header>
  );
};