import { useNavigate } from 'react-router-dom';
import type { Room } from '../../../types';
import styles from './GameHeader.module.css';

interface Props {
  room: Room;
}

export const GameHeader = ({ room }: Props) => {
  const navigate = useNavigate();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>部屋: {room.name}</h1>
        <p style={{ margin: 0, color: '#666' }}>ID: {room.id} / 参加者: {room.memberIDs.length}人</p>
      </div>
      <button onClick={() => navigate('/')} style={{ height: 'fit-content', padding: '0.5rem 1rem' }}>
        ロビーへ戻る
      </button>
    </header>
  );
};