export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  token: string;
  user: User;
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
  rank: number;
}

export interface Game {
  turn: number;
  fieldCards: Card[];
  isRevolution: boolean;
  players: Player[];
  finishedPlayers?: Player[];
  passCount: number;
  isFinished: boolean;
}

export interface Room {
  id: string;
  name: string;
  ownerID: string;
  memberIDs: string[];
  owner: User;
  members: User[];
  game?: Game;
  createdAt: string;
  updatedAt: string;
}