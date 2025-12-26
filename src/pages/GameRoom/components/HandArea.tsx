import styles from './HandArea.module.css';
import { Card } from '../../../components/Card/Card';
import type { Card as CardType } from '../../../types';

interface HandAreaProps {
    hand: CardType[];
    username: string;
    isMyTurn: boolean;
    toggleCard: (card: CardType) => void;
    isSelected: (card: CardType) => boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, card: CardType) => void;
}

export const HandArea = ({ hand, username, isMyTurn, toggleCard, isSelected, onDragStart }: HandAreaProps) => {
    return (
        <div>
            <div className={styles.playerBadge}>
                <span className={isMyTurn ? styles.nameTagActive : styles.nameTag}>
                    あなた: {username}
                </span>
                <span style={{ marginLeft: '10px' }}>手札: {hand.length}枚</span>
            </div>

            <div className={`${styles.handArea} ${!isMyTurn ? styles.handAreaDisabled : ''}`}>
                {hand.length > 0 ? (
                    hand.map((card, i) => (
                        <Card
                            key={`${card.Suit ?? card.suit}-${card.Rank ?? card.rank}-${i}`}
                            card={card}
                            onClick={() => toggleCard(card)}
                            isSelected={isSelected(card)}
                            onDragStart={(e) => onDragStart(e, card)}
                        />
                    ))
                ) : (
                    <p className={styles.message}>手札がありません</p>
                )}
            </div>
        </div>
    );
};
