import { useMemo } from 'react';
import type { DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Card as CardType } from '../../../types';
import { Card } from '../../../components/Card/Card';
import { getSuitPriority } from '../../../lib/cards';
import styles from './HandArea.module.css';

interface Props {
  hand: CardType[];
  selectedCardIds: number[];
  onToggleSelection: (cardId: number) => void;
  isMyTurn: boolean;
  onPass: () => void;
  turnPlayerName?: string;
}

export const HandArea = ({
  hand,
  selectedCardIds,
  onToggleSelection,
  isMyTurn,
  onPass,
  turnPlayerName
}: Props) => {

  const sortedHand = useMemo(() => {
    return [...hand].sort((a, b) => {
      if (a.rank !== b.rank) {
        return a.rank - b.rank;
      }
      return getSuitPriority(a.suit) - getSuitPriority(b.suit);
    });
  }, [hand]);

  const handleDragStart = (e: DragEvent, cardId: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(cardId));

    if (!selectedCardIds.includes(cardId)) {
      requestAnimationFrame(() => {
        onToggleSelection(cardId);
      });
    }
  };



  return (
    <div className={styles.container}>
      {/* 操作パネル */}
      <div className={`${styles.controls} ${isMyTurn ? styles.myTurn : styles.notMyTurn}`}>
        <h3 className={`${styles.statusText} ${isMyTurn ? styles.active : ''}`}>
          {isMyTurn
            ? "★ あなたの番です (ドラッグ＆ドロップで出す)"
            : `待機中 (${turnPlayerName}の番)`}
        </h3>

        <button
          onClick={onPass}
          disabled={!isMyTurn}
          className={styles.passButton}
        >
          パス
        </button>
      </div>

      {/* 手札リスト */}
      <div className={styles.handList}>
        <AnimatePresence>
          {sortedHand.map((c) => (
            <motion.div
              key={c.id} // key
              layout // 位置が変更されたときのアニメーションが自動で付く
              initial={{ opacity: 0, scale: 0.8 }} // 出現時のアニメーション
              animate={{ opacity: 1, scale: 1 }}   // 表示中の状態
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }} // 消えるときのアニメーション
              transition={{ type: "spring", damping: 25, stiffness: 300 }} // バネのような動き
              className={styles.cardWrapper}
            >
              <Card
                key={c.id}
                card={c}
                isSelected={selectedCardIds.includes(c.id)}
                onClick={() => onToggleSelection(c.id)}
                onDragStart={isMyTurn ? (e) => handleDragStart(e, c.id) : undefined}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};