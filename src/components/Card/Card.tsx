import type { DragEvent } from 'react';
import styles from './Card.module.css';
import type { Card as CardType } from '../../types';
import { getRankLabel, getSuitSymbol, isJoker, isRedSuit } from '../../lib/cards';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isSelected?: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
}

export const Card = ({ card, onClick, isSelected, onDragStart }: CardProps) => {
  const suitStr = getSuitSymbol(card.suit);
  const rankStr = isJoker(card.suit) ? '' : getRankLabel(card.rank);
  const isInteractive = !!onClick || !!onDragStart;

  const classList = [
    styles.card,
    isRedSuit(card.suit) ? styles.red : styles.black,
    isSelected ? styles.selected : '',
    isInteractive ? styles.interactive : '',
  ].join(' ');

  return (
    <div
      onClick={onClick}
      className={classList}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
    >
      <div>{suitStr}</div>
      <div>{rankStr}</div>
    </div>
  );
};
