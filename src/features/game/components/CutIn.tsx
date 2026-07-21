import { motion } from 'framer-motion';
import styles from './CutIn.module.css';

export type CutInType = 'eight_cut' | 'revolution' | 'eleven_back';

interface Props {
  type: CutInType;
}

const CONFIG: Record<CutInType, { label: string; sub: string; className: string }> = {
  eight_cut: { label: '8 切り', sub: 'EIGHT CUT', className: styles.eightCut },
  revolution: { label: '革 命', sub: 'REVOLUTION', className: styles.revolution },
  eleven_back: { label: '11 バック', sub: 'ELEVEN BACK', className: styles.elevenBack },
};

/**
 * 8切り・革命の演出カットイン。画面中央に帯が走り抜ける。
 * 表示/非表示の制御は呼び出し側（一定時間で unmount）。
 */
export const CutIn = ({ type }: Props) => {
  const { label, sub, className } = CONFIG[type];

  return (
    <div className={styles.overlay}>
      <motion.div
        className={`${styles.band} ${className}`}
        initial={{ x: '-120%', skewX: -12 }}
        animate={{ x: '0%', skewX: -12 }}
        exit={{ x: '120%' }}
        transition={{ type: 'spring', damping: 18, stiffness: 220 }}
      >
        <motion.div
          className={styles.textWrap}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12, type: 'spring', damping: 12, stiffness: 260 }}
        >
          <span className={styles.label}>{label}</span>
          <span className={styles.sub}>{sub}</span>
        </motion.div>
      </motion.div>
    </div>
  );
};
