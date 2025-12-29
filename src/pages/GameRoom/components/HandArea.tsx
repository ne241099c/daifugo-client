import { useMemo } from 'react';
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

const getSuitPriority = (suit: string): number => {
  if (suit === '♠' || suit === 'Spade') return 0;
  if (suit === '♥' || suit === 'Heart') return 1;
  if (suit === '♦' || suit === 'Diamond') return 2;
  if (suit === '♣' || suit === 'Club') return 3;
  if (suit === 'Joker') return 4;
  return 5;
};

export const HandArea = ({
  hand,
  selectedCardIds,
  onToggleSelection,
  isMyTurn,
  onPass,
  turnPlayerName
}: Props) => {

  const sortedHand = useMemo(() => {
    return [...hand].sort((a, b) => {
      if (a.rank !== b.rank) {
        return a.rank - b.rank;
      }
      const suitA = getSuitPriority(a.suit);
      const suitB = getSuitPriority(b.suit);
      return suitA - suitB;
    });
  }, [hand]);

  const handleDragStart = (e: React.DragEvent, cardId: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(cardId));

    if (!selectedCardIds.includes(cardId)) {
      requestAnimationFrame(() => {
        onToggleSelection(cardId);
      });
    }
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
        {sortedHand.map((c) => (
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