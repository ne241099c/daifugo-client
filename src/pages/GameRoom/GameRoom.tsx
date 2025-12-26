import { useState, useEffect } from 'react';
import styles from './GameRoom.module.css';

import { GameHeader } from './components/GameHeader';
import { GameResult } from './components/GameResult';
import { OpponentArea } from './components/OpponentArea';
import { TableArea } from './components/TableArea';
import { HandArea } from './components/HandArea';
import type { GameState, Card } from '../../types';

interface GameScreenProps {
    gameState: GameState | null;
    roomID: string;
    username: string;
    onStart: () => void;
    onPlay: (cards: Card[]) => void;
    onPass: () => void;
    logout: () => void;
}

// Helpers for robust property access
const getSuit = (c: Card) => c.Suit ?? c.suit;
const getRank = (c: Card) => c.Rank ?? c.rank;

export const GameScreen = ({ gameState, roomID, username, onStart, onPlay, onPass, logout }: GameScreenProps) => {
    const [selectedCards, setSelectedCards] = useState<Card[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const isActive = gameState?.is_active;
    const winnerName = gameState?.winner_name;

    useEffect(() => {
        if (!isActive && winnerName) {
            setShowResult(true);
        } else if (isActive) {
            setShowResult(false);
        }
    }, [isActive, winnerName, gameState]);

    if (!gameState) {
        return <div className={styles.container}>データ待機中...</div>;
    }

    const hand = gameState.hand || [];
    const tableCards = gameState.table_cards || [];
    const isMyTurn = !!gameState.is_my_turn;
    const allPlayers = gameState.all_players || [];
    const currentTurnID = gameState.current_turn_id;
    const isRevolution = gameState.is_revolution;

    const effectiveMyTurn = isActive && isMyTurn;

    const handleBackToLobby = () => {
        setShowResult(false);
    };

    const toggleCard = (card: Card) => {
        setSelectedCards(prev => {
            const isSelected = prev.some(c => getSuit(c) === getSuit(card) && getRank(c) === getRank(card));
            if (isSelected) {
                return prev.filter(c => !(getSuit(c) === getSuit(card) && getRank(c) === getRank(card)));
            } else {
                return [...prev, card];
            }
        });
    };

    const isSelected = (card: Card) => {
        return selectedCards.some(c => getSuit(c) === getSuit(card) && getRank(c) === getRank(card));
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: Card) => {
        // e is unused, but kept for interface consistency or future use if needed
        // to avoid TS unused var error, we can comment it out or use it
        // using it:
        e.dataTransfer.effectAllowed = 'move';
        
        if (!isSelected(card)) {
            setSelectedCards([card]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true); // 見た目を変える
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);

        // 何も選択していなければ無視
        if (selectedCards.length === 0) return;

        // カードを出す
        onPlay(selectedCards);
        setSelectedCards([]); // 選択解除
    };

    if (!isActive && winnerName && showResult) {
        return (
            <GameResult
                allPlayers={allPlayers}
                onReset={handleBackToLobby}
                logout={logout}
            />
        );
    }

    const containerClass = `
        ${styles.container} 
        ${isRevolution ? styles.revolution : ''}
        ${effectiveMyTurn ? styles.myTurn : ''}
    `;

    return (
        <div className={containerClass}>
            {/* ヘッダー: 部屋情報、ボタン類 */}
            <GameHeader
                roomID={roomID}
                username={username}
                isActive={isActive}
                isMyTurn={effectiveMyTurn}
                isRevolution={isRevolution}
                onStart={onStart}
                onPass={onPass}
                logout={logout}
            />
            <main>
                {/* 相手エリア: 画面上部に並ぶ */}
                <OpponentArea
                    allPlayers={allPlayers}
                    currentTurnID={currentTurnID}
                    username={username}
                    isActive={!!isActive}
                />

                {/* テーブルエリア: カードを出す場所 */}
                <TableArea
                    tableCards={tableCards}
                    isDragOver={isDragOver}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                />

                {/* 手札エリア: 自分のカード */}
                <HandArea
                    hand={hand}
                    username={username}
                    isMyTurn={!!effectiveMyTurn}
                    toggleCard={toggleCard}
                    isSelected={isSelected}
                    onDragStart={handleDragStart}
                />

                {/* デバッグ用 */}
                <details className={styles.debug}>
                    <summary>内部データを見る</summary>
                    <pre>{JSON.stringify(gameState, null, 2)}</pre>
                </details>
            </main>
        </div>
    );
};
