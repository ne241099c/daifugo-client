import styles from './OpponentArea.module.css';
import type { Player } from '../../../types';

interface OpponentAreaProps {
    allPlayers: Player[];
    currentTurnID: string | number;
    username: string;
    isActive: boolean;
}

export const OpponentArea = ({ allPlayers, currentTurnID, username, isActive }: OpponentAreaProps) => {
    const players = allPlayers;
    return (
        <div className={styles.container}>
            {players.map((p, i) => {
                const isTurn = isActive && (p.id === currentTurnID);
                const isMe = p.name === username;

                const rank = p.rank ?? p.Rank ?? 0;

                const cardClass = `
                    ${styles.opponentCard} 
                    ${isTurn ? styles.activeTurn : ''}
                    ${rank > 0 ? styles.finished : ''}
                `;

                return (
                    <div key={i} className={cardClass}>
                        <div style={{ textAlign: 'center', marginTop: '5px' }}>
                            <div className={styles.handCount}>
                                🂠 {p.hand_count}
                            </div>
                            <div className={isTurn ? styles.nameActive : styles.name}>
                                {isMe ? `You (${p.name})` : p.name}
                            </div>
                        </div>

                        {isTurn && (
                            <div className={styles.thinking}>Thinking...</div>
                        )}

                        {rank > 0 && (
                            <div className={styles.rankBadge}>
                                {rank}位
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
