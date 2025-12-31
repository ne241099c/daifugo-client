import type { Player } from '../../../types';
import styles from './OpponentArea.module.css';

interface Props {
  players: Player[];
  turnUserID?: string;
}

export const OpponentArea = ({ players, turnUserID }: Props) => {
  return (
    <div className={styles.container}>
      {players.map((p) => {
        const isTurn = p.userID === turnUserID;
        return (
          <div 
            key={p.userID} 
            className={`${styles.card} ${isTurn ? styles.active : ''}`}
          >
            <div className={styles.name}>{p.user?.name || 'Unknown'}</div>
            <div className={styles.cardCount}>
                {p.hand?.length ?? '?'}
                <span style={{fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)'}}> 枚</span>
            </div>
            <div className={styles.info}>Rank: {p.rank > 0 ? `${p.rank}位` : '-'}</div>
          </div>
        );
      })}
    </div>
  );
};