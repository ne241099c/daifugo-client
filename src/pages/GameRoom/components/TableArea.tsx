import { useState } from 'react';
import type { Card } from '../../../types';
import styles from './TableArea.module.css';

interface Props {
  cards: Card[];
  isRevolution: boolean;
  onDropCards: () => void;
  isMyTurn: boolean;
}

export const TableArea = ({ cards, isRevolution, onDropCards, isMyTurn }: Props) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isMyTurn) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isMyTurn) {
      onDropCards();
    }
  };

  return (
    <div 
      className={`${styles.table} ${isDragOver ? styles.dragOver : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className={styles.title}>
        場のカード 
        {isRevolution && <span className={styles.revolution}>【革命中】</span>}
      </h3>
      
      <div className={styles.cardsContainer}>
        {cards.length === 0 ? (
          <p style={{ opacity: 0.5 }}>カードはありません</p>
        ) : (
          cards.map((c) => (
            <div key={c.id} className={styles.card}>
              <div className={styles.suit}>{c.suit}</div>
              <div className={styles.rank}>{c.rank}</div>
            </div>
          ))
        )}
      </div>

      {isDragOver && <div className={styles.dropMessage}>ここにドロップしてカードを出す</div>}
    </div>
  );
};