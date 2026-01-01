import type { Player } from '../../../types';
import { Card } from '../../../components/Card/Card';
import styles from './SpectatorArea.module.css';

interface Props {
  players: Player[];
}

export const SpectatorArea = ({ players }: Props) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>観戦モード</h2>
      <div className={styles.playerGrid}>
        {players.map((p) => (
          <div key={p.userID} className={styles.playerCard}>
            <div className={styles.playerHeader}>
              <span>{p.user?.name} ({p.hand?.length ?? 0}枚)</span>
              {p.rank > 0 && <span className={styles.rank}>{p.rank}位</span>}
            </div>
            <div className={styles.hand}>
              {p.hand?.map((c) => (
                <div key={c.id} className={styles.cardWrapper}>
                   <Card card={c} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
