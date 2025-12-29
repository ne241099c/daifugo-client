import { useState } from 'react';
import type { Card } from '../../../types';
import styles from './TableArea.module.css';

interface Props {
  cards: Card[];
  // isRevolution: boolean; // ← 削除
  onDropCards: () => void;
  isMyTurn: boolean;
}

// 引数からも isRevolution を削除
export const TableArea = ({ cards, onDropCards, isMyTurn }: Props) => {
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

  const getRankDisplay = (suit: string, rank: number) => {
    if (suit === 'Joker') return ''; 
    if (rank === 0) return '';
    if (rank === 1) return 'A';
    if (rank === 11) return 'J';
    if (rank === 12) return 'Q';
    if (rank === 13) return 'K';
    return String(rank);
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
      </h3>
      
      <div className={styles.cardsContainer}>
        {cards.length === 0 ? (
          <p style={{ opacity: 0.5 }}>カードはありません</p>
        ) : (
          cards.map((c) => (
            <div key={c.id} className={styles.card}>
              <div className={styles.suit}>{c.suit}</div>
              <div className={styles.rank}>{getRankDisplay(c.suit, c.rank)}</div>
            </div>
          ))
        )}
      </div>

      {isDragOver && <div className={styles.dropMessage}>ここにドロップしてカードを出す</div>}
    </div>
  );
};