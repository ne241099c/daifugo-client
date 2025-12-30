import type { Room } from '../../../types';

interface Props {
  room: Room;
  onRematch: () => void;
  isOwner: boolean;
}

export const GameResult = ({ room, onRematch, isOwner }: Props) => {
  const finishedPlayers = room.game?.finishedPlayers || [];

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.9)', color: 'white', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <h1>ゲーム終了！</h1>
      <div style={{ marginBottom: '2rem', width: '80%', maxWidth: '600px' }}>
        {finishedPlayers.map((p, index) => (
          <div key={p.userID} style={{ 
            display: 'flex', justifyContent: 'space-between', 
            padding: '1rem', borderBottom: '1px solid #555',
            fontSize: '1.5rem'
          }}>
            <span>{index + 1}位</span>
            <span>{p.user?.name}</span>
          </div>
        ))}
      </div>
      
      {isOwner ? (
        <button 
          onClick={onRematch}
          style={{ padding: '1rem 3rem', fontSize: '1.2rem', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          もう一度遊ぶ (再戦)
        </button>
      ) : (
        <p>ホストが再戦を開始するのを待っています...</p>
      )}
    </div>
  );
};