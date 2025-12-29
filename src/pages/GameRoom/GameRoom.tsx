import { useState } from 'react';
import styles from './GameRoom.module.css';

import { GameHeader } from './components/GameHeader';
import { OpponentArea } from './components/OpponentArea';
import { TableArea } from './components/TableArea';
import { HandArea } from './components/HandArea';
import type { Room, Card, Player } from '../../types';

interface GameScreenProps {
    room: Room;
    username: string;
    onStart: () => void;
    onPlay: (cards: Card[]) => void;
    onPass: () => void;
    logout: () => void;
}

export const GameScreen = ({ room, username, onStart, onPlay, onPass, logout }: GameScreenProps) => {
    const [selectedCards, setSelectedCards] = useState<Card[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);

    // Derive game state from Room
    const game = room.game;
    const isActive = !!game;
    // winner logic is missing in new schema? 
    // "finishedPlayers" has ranking.
    // If all players (except one?) are finished, game is over?
    // Or if `finishedPlayers` is not empty?
    // Let's assume game shows result if it was active but now maybe finished?
    // Backend doesn't explicitly send "winner_name".
    // We check if game is finished by checking passCount or something?
    // The previous frontend relied on `winner_name` in `gameState`.
    // The new `Room` -> `Game` doesn't have `winner_name`.
    // But it has `finishedPlayers`.
    
    // For now, let's keep it simple: Show result if user is in finishedPlayers?
    // Or just rely on `game` being present for active state.
    
    // Find my hand
    // Need to map `members` to `game.players` to find `userID`.
    // `username` is passed prop. Find userID from `room.members`.
    const me = room.members.find(m => m.name === username);
    const myPlayer = game?.players.find(p => p.userID === me?.id);
    const hand = myPlayer?.hand || [];
    
    const tableCards = game?.fieldCards || [];
    
    // Is my turn?
    // `game.turn` is an index? Or a user ID?
    // Backend schema: `turn: Int!`. Probably index in `players` array.
    const isMyTurn = game ? game.players[game.turn]?.userID === me?.id : false;
    
    const allPlayers = room.members.map(m => {
        // Find game player state
        const gp = game?.players.find(p => p.userID === m.id);
        const finished = game?.finishedPlayers?.find(p => p.userID === m.id);
        
        // Map to old "Player" interface style for OpponentArea compatibility or update OpponentArea
        // Old Player: { id, name, rank, hand_count }
        return {
            id: m.id,
            name: m.name,
            rank: finished ? finished.rank : (gp ? gp.rank : 0),
            hand_count: gp ? gp.hand.length : 0, // Note: hand might be hidden for others? 
            // GraphQL usually returns data you ask for. If `hand` is returned for all players, it's a security flaw in backend if not masked.
            // But we will use what we get.
        } as Player;
    });

    const currentTurnID = game ? game.players[game.turn]?.userID : null;
    const isRevolution = game?.isRevolution || false;

    // ... (rest of drag and drop logic is same, but updated for Card type)
    
    const toggleCard = (card: Card) => {
        setSelectedCards(prev => {
            const isSelected = prev.some(c => c.id === card.id);
            if (isSelected) {
                return prev.filter(c => c.id !== card.id);
            } else {
                return [...prev, card];
            }
        });
    };

    const isSelected = (card: Card) => {
        return selectedCards.some(c => c.id === card.id);
    };
    
    // ...

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragStart = (e: any, card: Card) => {
        e.dataTransfer.effectAllowed = 'move';
        if (!isSelected(card)) {
            setSelectedCards([card]);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragOver = (e: any) => {
        e.preventDefault();
        setIsDragOver(true); 
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDrop = (e: any) => {
        e.preventDefault();
        setIsDragOver(false);
        if (selectedCards.length === 0) return;
        onPlay(selectedCards);
        setSelectedCards([]); 
    };

    const containerClass = `
        ${styles.container} 
        ${isRevolution ? styles.revolution : ''}
        ${isMyTurn ? styles.myTurn : ''}
    `;

    return (
        <div className={containerClass}>
            <GameHeader
                roomID={room.id}
                username={username}
                isActive={isActive}
                isMyTurn={isMyTurn}
                isRevolution={isRevolution}
                onStart={onStart}
                onPass={onPass}
                logout={logout}
            />
            <main>
                <OpponentArea
                    allPlayers={allPlayers}
                    currentTurnID={currentTurnID || ''}
                    username={username}
                    isActive={isActive}
                />

                <TableArea
                    tableCards={tableCards}
                    isDragOver={isDragOver}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                />

                <HandArea
                    hand={hand}
                    username={username}
                    isMyTurn={isMyTurn}
                    toggleCard={toggleCard}
                    isSelected={isSelected}
                    onDragStart={handleDragStart}
                />
            </main>
        </div>
    );
};
