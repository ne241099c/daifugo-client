import type { Room } from '../../../types';
import styles from '../room.module.css';

interface RoomListProps {
  rooms: Room[];
  onJoin: (roomID: string) => void;
  onRefresh: () => void;
}

export const RoomList = ({ rooms, onJoin, onRefresh }: RoomListProps) => {
  return (
    <section>
      <div className={styles.roomListHeader}>
        <h3 className={styles.sectionTitle}>ROOMS</h3>
        <button onClick={onRefresh} className={styles.refreshButton}>
          更新
        </button>
      </div>

      <div className={styles.roomList}>
        {rooms.length === 0 ? (
          <p className={styles.emptyText}>部屋がありません。作成してください。</p>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className={styles.roomCard} onClick={() => onJoin(room.id)}>
              <div className={styles.roomName}>{room.name}</div>
              <div className={styles.roomStatus}>メンバー: {room.memberIDs.length}人</div>
              <div className={styles.roomId}>ID: {room.id}</div>
              <div className={styles.joinHint}>クリックして参加</div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
