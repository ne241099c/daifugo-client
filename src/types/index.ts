export interface User {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  id: number;
  suit: string;
  rank: number;
}

export interface Player {
  userID: string;
  user: User;
  hand: Card[];
  handCount: number;
  rank: number;
}

export interface Game {
  turn: number;
  fieldCards: Card[];
  discardPile: Card[];
  isRevolution: boolean;
  players: Player[];
  finishedPlayers?: Player[];
  passCount: number;
  lastEvent: string;
  eventSeq: number;
  isFinished: boolean;
}

export interface Room {
  id: string;
  name: string;
  ownerID: string;
  memberIDs: string[];
  botIDs?: string[];
  owner: User;
  members: User[];
  game?: Game;
  createdAt: string;
  updatedAt: string;
}