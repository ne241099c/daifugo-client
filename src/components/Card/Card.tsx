import styles from './Card.module.css';
import type { Card as CardType } from '../../types';

interface CardProps {
    card: CardType;
    onClick?: () => void;
    isSelected?: boolean;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const suitMap: Record<string, number> = {
    "Spade": 0,
    "Heart": 1,
    "Diamond": 2,
    "Club": 3,
    "Joker": 4
};

const suits = ["♠", "♥", "♦", "♣", "Joker"];
const ranks = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export const Card = ({ card, onClick, isSelected, onDragStart }: CardProps) => {
    // Map string suit to index
    let suitVal = suitMap[card.suit];
    if (suitVal === undefined) {
        // Fallback or assume backend might return 0-4 numbers as string or something?
        // Schema says "suit: String!". I assume "Spade", etc.
        // If unknown, default to Spade or ?
        suitVal = 0; 
    }
    
    const rankVal = card.rank;
    
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
