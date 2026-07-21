import type { Card as CardType } from '../../../types';
import { Card } from '../../../components/Card/Card';
import styles from './DiscardPile.module.css';

interface Props {
  cards: CardType[];
}

/**
 * 捨て札（場から流れたプレイ済みカードの山）を表示する。
 * 一番上に最後に捨てられたカードを重ねて見せ、総枚数をバッジで示す。
 */
export const DiscardPile = ({ cards }: Props) => {
  const count = cards.length;
  // 山の見た目用に最新数枚だけ重ねて描画する（多すぎると重いため）
  const topCards = cards.slice(-3);

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>捨て札</div>
      <div className={styles.pile}>
        {count === 0 ? (
          <div className={styles.empty}>なし</div>
        ) : (
          topCards.map((c, i) => (
            <div
              key={c.id}
              className={styles.stacked}
              style={{
                transform: `translate(${i * 3}px, ${i * -3}px) rotate(${(i - 1) * 4}deg)`,
                zIndex: i,
              }}
            >
              <Card card={c} />
            </div>
          ))
        )}
      </div>
      <div className={styles.count}>{count} 枚</div>
    </div>
  );
};
