// src/features/game/api/game.ts
import { request } from '../../../lib/graphql';
import type { Room } from '../../../types';

// room(id: ID!) なので引数は $id のまま
// 取得フィールドは ownerID, memberIDs, userID に変更
const GET_ROOM_QUERY = `
  query GetRoom($id: ID!) {
    room(id: $id) {
      id
      name
      ownerID
      memberIDs
      game {
        turn
        isRevolution
        isFinished
        fieldCards {
          id
          suit
          rank
        }
        players {
          userID
          hand {
            id
            suit
            rank
          }
          rank
          user {
            name
          }
        }
      }
    }
  }
`;

const START_GAME_MUTATION = `
  mutation StartGame($roomID: ID!) {
    startGame(roomID: $roomID) {
      id
    }
  }
`;

const PLAY_CARD_MUTATION = `
  mutation PlayCard($roomID: ID!, $cardIDs: [Int!]!) {
    playCard(roomID: $roomID, cardIDs: $cardIDs) {
      id
    }
  }
`;

const PASS_MUTATION = `
  mutation Pass($roomID: ID!) {
    pass(roomID: $roomID) {
      id
    }
  }
`;

const LEAVE_ROOM_MUTATION = `
  mutation LeaveRoom($roomID: ID!) {
    leaveRoom(roomID: $roomID)
  }
`;

export const getRoom = async (id: string): Promise<Room> => {
  const data = await request<{ room: Room }>(GET_ROOM_QUERY, { id });
  return data.room;
};

export const startGame = async (roomID: string): Promise<Room> => {
  const data = await request<{ startGame: Room }>(START_GAME_MUTATION, { roomID });
  return data.startGame;
};

export const playCard = async (roomID: string, cardIDs: number[]): Promise<Room> => {
  const data = await request<{ playCard: Room }>(PLAY_CARD_MUTATION, { roomID, cardIDs });
  return data.playCard;
};

export const pass = async (roomID: string): Promise<Room> => {
  const data = await request<{ pass: Room }>(PASS_MUTATION, { roomID });
  return data.pass;
};

export const leaveRoom = async (roomID: string): Promise<boolean> => {
  const data = await request<{ leaveRoom: boolean }>(LEAVE_ROOM_MUTATION, { roomID });
  return data.leaveRoom;
};