import styles from './GameHeader.module.css';

interface GameHeaderProps {
    roomID: string;
    username: string;
    isActive: boolean | undefined;
    isMyTurn: boolean | undefined;
    isRevolution: boolean | undefined;
    onStart: () => void;
    onPass: () => void;
    logout: () => void;
}

export const GameHeader = ({ roomID, username, isActive, isMyTurn, isRevolution, onStart, onPass, logout }: GameHeaderProps) => {
    return (
        <header className={styles.header}>
            <div className={styles.roomInfo}>
                <h1>Room: {roomID}</h1>
                <span className={styles.playerInfo}>Player: {username}</span>
            </div>

            {isRevolution && (
                <div className={styles.revolutionBadge}>
                    ⚠️ 革命中 ⚠️
                </div>
            )}

            <div className={styles.actionArea}>
                {/* 開始ボタン */}
                {!isActive && (
                    <button
                        className={`${styles.button} ${styles.startButton}`}
                        onClick={onStart}
                    >
                        ▶ ゲーム開始
                    </button>
                )}

                {/* パスボタン */}
                {isActive && (
                    <button
                        onClick={onPass}
                        disabled={!isMyTurn}
                        className={`
                            ${styles.button}
                            ${isMyTurn ? styles.passButton : styles.passButtonDisabled}
                        `}
                    >
                        パス
                    </button>
                )}

                {/* 退出ボタン */}
                <button
                    className={`${styles.button} ${styles.logoutButton}`}
                    onClick={logout}
                >
                    退出
                </button>
            </div>
        </header>
    );
};
