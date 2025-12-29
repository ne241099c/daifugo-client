import type { Room } from '../../../types';

interface RoomListProps {
  rooms: Room[];
  onJoin: (roomID: string) => void;
  onRefresh: () => void;
}

export const RoomList = ({ rooms, onJoin, onRefresh }: RoomListProps) => {
  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>部屋一覧</h3>
        <button 
          onClick={onRefresh} 
          style={{ background: 'transparent', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
        >
          更新
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {rooms.length === 0 ? (
          <p>部屋がありません。作成してください。</p>
        ) : (
          rooms.map((room) => (
            <div key={room.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
              <div>
                <strong>{room.name}</strong>
                <span style={{ marginLeft: '1rem', color: '#666', fontSize: '0.9em' }}>
                  メンバー: {room.memberIDs.length}人
                </span>
                <span style={{ marginLeft: '0.5rem', color: '#999', fontSize: '0.8em' }}>
                  (ID: {room.id})
                </span>
              </div>
              <button 
                onClick={() => onJoin(room.id)} 
                style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
              >
                参加する
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};