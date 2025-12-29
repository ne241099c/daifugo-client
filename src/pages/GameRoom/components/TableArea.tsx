import type { Card } from '../../../types';

interface Props {
  cards: Card[];
  isRevolution: boolean;
}

export const TableArea = ({ cards, isRevolution }: Props) => {
  return (
    <div style={{ 
      padding: '2rem', 
      background: '#2e7d32', // 緑色のマット風
      minHeight: '160px', 
      borderRadius: '8px', 
      marginBottom: '2rem', 
      textAlign: 'center',
      color: 'white',
      position: 'relative'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', opacity: 0.8 }}>場のカード {isRevolution && <span style={{color: '#ffeb3b'}}>【革命中】</span>}</h3>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {cards.length === 0 ? (
          <p style={{ opacity: 0.5 }}>カードはありません</p>
        ) : (
          cards.map((c) => (
            <div 
              key={c.id} 
              style={{ 
                border: '1px solid #999', 
                background: 'white', 
                color: 'black',
                padding: '1rem', 
                borderRadius: '4px', 
                minWidth: '50px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ fontSize: '0.8rem' }}>{c.suit}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{c.rank}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};