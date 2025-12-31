import type { Room } from '../../../types';
import styles from './GameResult.module.css';

interface Props {
    room: Room;
    onRematch: () => void;
    onLeave: () => void;
    isOwner: boolean;
}

export const GameResult = ({ room, onRematch, onLeave, isOwner }: Props) => {
    const finishedPlayers = room.game?.finishedPlayers || [];

    // Helper to get rank class
    const getRankClass = (index: number) => {
        if (index === 0) return styles.rank1;
        if (index === 1) return styles.rank2;
        if (index === 2) return styles.rank3;
        return '';
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <h1 className={styles.title}>GAME OVER</h1>
                
                <div className={styles.rankList}>
                    {finishedPlayers.map((p, index) => (
                        <div key={p.userID} className={`${styles.rankItem} ${getRankClass(index)}`}>
                            <div className={styles.rankBadge}>{index + 1}</div>
                            <span className={styles.playerName}>{p.user?.name}</span>
                        </div>
                    ))}
                </div>
                
                <div className={styles.actions}>
                    <button onClick={onLeave} className={`${styles.button} ${styles.leaveButton}`}>
                        退出する
                    </button>

                    {isOwner ? (
                        <button onClick={onRematch} className={`${styles.button} ${styles.rematchButton}`}>
                            ロビーに戻る
                        </button>
                    ) : (
                        <div className={styles.waitingText}>
                            ホストがロビーに戻るのを待っています...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
