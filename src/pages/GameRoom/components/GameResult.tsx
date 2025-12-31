import type { Room } from '../../../types';

interface Props {
    room: Room;
    onRematch: () => void;
    onLeave: () => void;
    isOwner: boolean;
}

export const GameResult = ({ room, onRematch, onLeave, isOwner }: Props) => {
    const finishedPlayers = room.game?.finishedPlayers || [];

    return (
        <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.9)', color: 'white', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <h1>ゲーム終了！</h1>
      
      {/* 順位表示エリア */}
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
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* 退出ボタン */}
        <button 
          onClick={onLeave}
          style={{ 
            padding: '1rem 2rem', fontSize: '1.2rem', 
            backgroundColor: '#F44336', color: 'white', 
            border: 'none', borderRadius: '4px', cursor: 'pointer' 
          }}
        >
          退出する
        </button>

        {/* ロビーに戻るボタン */}
        {isOwner ? (
          <button 
            onClick={onRematch}
            style={{ 
              padding: '1rem 2rem', fontSize: '1.2rem', 
              backgroundColor: '#2196F3', color: 'white', 
              border: 'none', borderRadius: '4px', cursor: 'pointer' 
            }}
          >
            ロビーに戻る
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', color: '#aaa' }}>
            <p>ホストがロビーに戻るのを待っています...</p>
          </div>
        )}
      </div>
    </div>
    );
};