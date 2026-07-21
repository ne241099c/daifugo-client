import type { Room } from '../../../types';
import styles from './GameHeader.module.css';

interface Props {
  room: Room;
  isRevolution: boolean;
  onLeave: () => void;
}

export const GameHeader = ({ room, isRevolution, onLeave }: Props) => {
  return (
    <header className={`${styles.header} ${isRevolution ? styles.revolution : ''}`}>
      <div className={styles.title}>
        <h1>
          部屋: {room.name}
          {isRevolution && <span className={styles.revolutionBadge}>（革命中！）</span>}
        </h1>
        <p>ID: {room.id} / 参加者: {room.memberIDs.length}人</p>
      </div>
      <div className={styles.actions}>
        <button onClick={onLeave} className={styles.leaveButton}>
          退出する
        </button>
      </div>
    </header>
  );
};
