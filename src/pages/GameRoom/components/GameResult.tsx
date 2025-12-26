import styles from './GameResult.module.css';
import type { Player } from '../../../types';

interface GameResultProps {
    allPlayers: Player[];
    onReset: () => void;
    logout: () => void;
}

export const GameResult = ({ allPlayers, onReset, logout }: GameResultProps) => {
    const ranking = [...(allPlayers || [])].sort((a, b) => {
        const rankA = a.rank ?? a.Rank ?? 0;
        const rankB = b.rank ?? b.Rank ?? 0;
        
        if (rankA === 0) return 1;
        if (rankB === 0) return -1;
        return rankA - rankB;
    });

    return (
        <div className={styles.container}>
            <div className={styles.gameSet}>
                <h1 style={{ color: '#E91E63', fontSize: '3rem' }}>🏆 GAME SET!</h1>
                <div style={{ margin: '20px 0', textAlign: 'left' }}>
                    {ranking.map((p, i) => {
                        const rank = p.rank ?? p.Rank ?? 0;
                        const rankDisplay = rank === 0 ? '-' : `${rank}位`;
                        return (
                            <div key={i} className={styles.playerResult}>
                                <span>{rankDisplay}</span>
                                <span style={{ fontWeight: 'bold' }}>{p.name}</span>
                            </div>
                        )
                    })}
                </div>
                <br />
                <button
                    className={styles.button}
                    onClick={onReset}
                    style={{ fontSize: '1.2em', padding: '15px 30px' }}
                >
                    ロビーへ戻る
                </button>
                <br /><br />
                <button onClick={logout}>退出する</button>
            </div>
        </div>
    );
};
