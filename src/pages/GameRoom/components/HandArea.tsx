import type { Card as CardType } from '../../../types';
import { Card } from '../../../components/Card/Card';
import styles from './HandArea.module.css';

interface Props {
  hand: CardType[];
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
            ? "★ あなたの番です (ドラッグ＆ドロップで出す)" 
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
        {hand.map((c) => (
          <Card 
            key={c.id}
            card={c}
            isSelected={selectedCardIds.includes(c.id)}
            onClick={() => onToggleSelection(c.id)}
            onDragStart={isMyTurn ? (e) => handleDragStart(e, c.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
};