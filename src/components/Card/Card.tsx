import styles from './Card.module.css';
import type { Card as CardType } from '../../types';

interface CardProps {
    card: CardType;
    onClick?: () => void;
    isSelected?: boolean;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const Card = ({ card, onClick, isSelected, onDragStart }: CardProps) => {
    const suits = ["♠", "♥", "♦", "♣", "Joker"];
    const ranks = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const suitVal = card.Suit !== undefined ? card.Suit : card.suit;
    const rankVal = card.Rank !== undefined ? card.Rank : card.rank;
    
    if (suitVal === undefined || rankVal === undefined) {
        return <div className={styles.card}>?</div>;
    }

    const isRed = suitVal === 1 || suitVal === 2; // Hearts or Diamonds
    const suitStr = suits[suitVal];
    const rankStr = suitVal === 4 ? "" : ranks[rankVal];

    const classList = [
        styles.card,                        // 基本スタイル
        isRed ? styles.red : styles.black,  // 赤か黒か
        isSelected ? styles.selected : ''   // 選択中か
    ].join(' ');

    return (
        <div
            onClick={onClick}
            className={classList}
            draggable={!!onDragStart}
            onDragStart={onDragStart}
            style={{ cursor: 'grab' }}
        >
            <div>{suitStr}</div>
            <div>{rankStr}</div>
        </div>
    );
};
