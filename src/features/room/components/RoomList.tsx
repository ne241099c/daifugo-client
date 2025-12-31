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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{color: 'var(--accent-gold)'}}>ROOMS</h3>
        <button 
          onClick={onRefresh} 
          style={{ background: 'transparent', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          更新
        </button>
      </div>

      <div className={styles.roomList}>
        {rooms.length === 0 ? (
          <p style={{color: 'var(--text-secondary)'}}>部屋がありません。作成してください。</p>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className={styles.roomCard} onClick={() => onJoin(room.id)}>
              <div className={styles.roomName}>{room.name}</div>
              <div className={styles.roomStatus}>
                  メンバー: {room.memberIDs.length}人
              </div>
              <div style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem'}}>
                  ID: {room.id}
              </div>
              <div style={{marginTop: '1rem', textAlign: 'right', fontSize: '0.8rem', color: 'var(--accent-gold)'}}>
                  クリックして参加
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};