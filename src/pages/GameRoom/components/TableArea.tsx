import styles from './TableArea.module.css';
import { Card } from '../../../components/Card/Card';
import type { Card as CardType } from '../../../types';

interface TableAreaProps {
    tableCards: CardType[];
    isDragOver: boolean;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const TableArea = ({ tableCards, isDragOver, onDragOver, onDragLeave, onDrop }: TableAreaProps) => {
    return (
        <div>
            <h3>テーブル</h3>
            <div
                className={`${styles.tableArea} ${isDragOver ? styles.tableAreaActive : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {tableCards.length > 0 ? (
                    tableCards.map((card, i) => (
                        <Card key={`table-${i}`} card={card} isSelected={false} />
                    ))
                ) : (
                    <span className={styles.noCards}>No Cards</span>
                )}
            </div>
        </div>
    );
};
