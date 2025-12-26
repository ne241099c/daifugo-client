export interface Card {
    Suit?: number;
    suit?: number;
    Rank?: number;
    rank?: number;
}

export interface Player {
    id: string | number;
    name: string;
    rank?: number;
    Rank?: number;
    hand_count: number;
}

export interface GameState {
    is_active: boolean;
    winner_name?: string;
    hand: Card[];
    table_cards: Card[];
    is_my_turn: boolean;
    all_players: Player[];
    current_turn_id: string | number;
    is_revolution: boolean;
    Turn?: {
        UserID: string | number;
    };
}
