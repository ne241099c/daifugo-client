import { useState } from 'react';
import type { Card as CardType } from '../../../types';
import { Card } from '../../../components/Card/Card';
import styles from './TableArea.module.css';

interface Props {
  cards: CardType[];
  onDropCards: () => void;
  isMyTurn: boolean;
}

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

  return (
    <div 
      className={`${styles.tableArea} ${isDragOver ? styles.tableAreaActive : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {cards.length === 0 ? (
        <div className={styles.noCards}>カードはありません</div>
      ) : (
        cards.map((c) => (
          <Card key={c.id} card={c} />
        ))
      )}
    </div>
  );
};