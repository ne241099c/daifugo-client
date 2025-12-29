import styles from './Card.module.css';
import type { Card as CardType } from '../../types';

interface CardProps {
    card: CardType;
    onClick?: () => void;
    isSelected?: boolean;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const suitMap: Record<string, number> = {
    "Spade": 0, "♠": 0,
    "Heart": 1, "♥": 1,
    "Diamond": 2, "♦": 2,
    "Club": 3, "♣": 3,
    "Joker": 4
};

const suits = ["♠", "♥", "♦", "♣", "Joker"];
const ranks = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export const Card = ({ card, onClick, isSelected, onDragStart }: CardProps) => {
    let suitVal = suitMap[card.suit];
    if (suitVal === undefined) {
        suitVal = 0;
    }

    const rankVal = card.rank;

    const isRed = suitVal === 1 || suitVal === 2;
    const suitStr = suits[suitVal];
    const rankStr = suitVal === 4 ? "" : ranks[rankVal];
    const isInteractive = !!onClick || !!onDragStart;

    const classList = [
        styles.card,
        isRed ? styles.red : styles.black,
        isSelected ? styles.selected : '',
        isInteractive ? styles.interactive : ''
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