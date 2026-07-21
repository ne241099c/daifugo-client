import { useState } from 'react';
import type { Card as CardType } from '../../../types';
import { Card } from '../../../components/Card/Card';
import styles from './DiscardPile.module.css';

interface Props {
  cards: CardType[];
}

/**
 * 捨て札（場から流れたプレイ済みカードの山）を表示する。
 * 山をクリックすると、これまで捨てられた全カードを一覧（スクロール可）で確認できる。
 */
export const DiscardPile = ({ cards }: Props) => {
  const [open, setOpen] = useState(false);
  const count = cards.length;
  // 山の見た目用に最新数枚だけ重ねて描画する
  const topCards = cards.slice(-3);

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>捨て札</div>

      <button
        type="button"
        className={styles.pile}
        onClick={() => count > 0 && setOpen(true)}
        disabled={count === 0}
        title={count > 0 ? 'クリックで全ての捨て札を表示' : undefined}
      >
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
      </button>

      <div className={styles.count}>{count} 枚</div>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>捨て札 一覧（{count} 枚）</span>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* 古い順（左上）→ 新しい順（右下） */}
              {cards.map((c, i) => (
                <div key={`${c.id}-${i}`} className={styles.gridCard}>
                  <Card card={c} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
