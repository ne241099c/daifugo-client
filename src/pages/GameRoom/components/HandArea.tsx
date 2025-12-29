import type { Card } from '../../../types';
import styles from './HandArea.module.css';

interface Props {
  hand: Card[];
  selectedCardIds: number[];
  onToggleSelection: (cardId: number) => void;
  isMyTurn: boolean;
  onPass: () => void;
  turnPlayerName?: string;
}

export const HandArea = ({ 
  hand, 
  selectedCardIds, 
  onToggleSelection, 
  isMyTurn, 
  onPass,
  turnPlayerName 
}: Props) => {

  const handleDragStart = (e: React.DragEvent, cardId: number) => {
    if (!selectedCardIds.includes(cardId)) {
      onToggleSelection(cardId);
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(cardId));
  };

  return (
    <div className={styles.container}>
      {/* 操作パネル */}
      <div className={`${styles.controls} ${isMyTurn ? styles.myTurn : styles.notMyTurn}`}>
        <h3 className={`${styles.statusText} ${isMyTurn ? styles.active : ''}`}>
          {isMyTurn 
            ? "★ あなたの番です (カードを選んで場へドラッグ＆ドロップ)" 
            : `待機中 (${turnPlayerName}の番)`}
        </h3>
        
        <button 
          onClick={onPass}
          disabled={!isMyTurn}
          className={styles.passButton}
        >
          パス
        </button>
      </div>

      {/* 手札リスト */}
      <div className={styles.handList}>
        {hand.map((c) => {
          const isSelected = selectedCardIds.includes(c.id);
          return (
            <div 
              key={c.id} 
              onClick={() => onToggleSelection(c.id)}
              draggable={isMyTurn}
              onDragStart={(e) => handleDragStart(e, c.id)}
              className={`${styles.card} ${isSelected ? styles.selected : ''}`}
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