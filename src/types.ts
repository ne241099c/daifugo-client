// Matching backend Graphql schema

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface Card {
    id: number;
    suit: string; // "Spade", "Heart", etc.
    rank: number;
}

export interface GamePlayer {
    userId: string;
    user: User;
    hand: Card[];
    rank: number;
}

export interface Game {
    turn: number;
    fieldCards: Card[];
    isRevolution: boolean;
    players: GamePlayer[];
    finishedPlayers: GamePlayer[];
    passCount: number;
}

export interface Room {
    id: string;
    name: string;
    ownerId: string;
    memberIds: string[];
    owner: User;
    members: User[];
    game: Game | null;
    createdAt: string;
    updatedAt: string;
}

export interface Player {
    id: string;
    name: string;
    rank: number;
    hand_count: number;
}

// Helper types for frontend state management
export interface AuthState {
    token: string | null;
    user: User | null;
}
