import type { Player } from '../../../types';

interface Props {
  players: Player[];
  turnUserID?: string;
}

export const OpponentArea = ({ players, turnUserID }: Props) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
      {players.map((p) => {
        const isTurn = p.userID === turnUserID;
        return (
          <div 
            key={p.userID} 
            style={{ 
              border: isTurn ? '2px solid #2196F3' : '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              minWidth: '120px',
              backgroundColor: isTurn ? '#e3f2fd' : 'white',
              textAlign: 'center'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{p.user?.name || 'Unknown'}</div>
            <div style={{ fontSize: '0.9rem' }}>手札: {p.hand?.length ?? '?'}枚</div>
            <div style={{ fontSize: '0.9rem' }}>順位: {p.rank > 0 ? `${p.rank}位` : '-'}</div>
          </div>
        );
      })}
    </div>
  );
};