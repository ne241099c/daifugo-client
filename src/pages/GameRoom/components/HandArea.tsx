import type { Card } from '../../../types';

interface Props {
  hand: Card[];
  selectedCardIds: number[];
  onToggleSelection: (cardId: number) => void;
  isMyTurn: boolean;
  onPlay: () => void;
  onPass: () => void;
  turnPlayerName?: string;
}

export const HandArea = ({ 
  hand, 
  selectedCardIds, 
  onToggleSelection, 
  isMyTurn, 
  onPlay, 
  onPass,
  turnPlayerName 
}: Props) => {
  return (
    <div>
      {/* 操作パネル */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem',
        padding: '0.5rem',
        background: isMyTurn ? '#e3f2fd' : '#f5f5f5',
        borderRadius: '4px'
      }}>
        <h3 style={{ margin: 0, color: isMyTurn ? '#1976d2' : '#333' }}>
          {isMyTurn ? "★ あなたの番です" : `待機中 (${turnPlayerName}の番)`}
        </h3>
        <div>
          <button 
            onClick={onPass}
            disabled={!isMyTurn}
            style={{ 
              marginRight: '1rem', 
              padding: '0.5rem 1.5rem',
              cursor: isMyTurn ? 'pointer' : 'not-allowed',
              backgroundColor: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            パス
          </button>
          <button 
            onClick={onPlay}
            disabled={!isMyTurn || selectedCardIds.length === 0}
            style={{ 
              padding: '0.5rem 1.5rem', 
              backgroundColor: (isMyTurn && selectedCardIds.length > 0) ? '#2196F3' : '#ccc', 
              color: 'white',
              cursor: (isMyTurn && selectedCardIds.length > 0) ? 'pointer' : 'not-allowed',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            出す
          </button>
        </div>
      </div>

      {/* 手札リスト */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {hand.map((c) => {
          const isSelected = selectedCardIds.includes(c.id);
          return (
            <div 
              key={c.id} 
              onClick={() => onToggleSelection(c.id)}
              style={{ 
                border: isSelected ? '3px solid #2196F3' : '1px solid #ccc',
                background: isSelected ? '#E3F2FD' : 'white',
                padding: '0.8rem', 
                borderRadius: '6px',
                cursor: 'pointer',
                transform: isSelected ? 'translateY(-12px)' : 'none',
                transition: 'transform 0.2s',
                minWidth: '45px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#555' }}>{c.suit}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{c.rank}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};