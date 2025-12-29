// src/features/room/api/room.ts
import { request } from '../../../lib/graphql';
import type { Room } from '../../../types';

const LIST_ROOMS_QUERY = `
  query GetRooms {
    rooms {
      id
      name
      ownerID 
      memberIDs
      createdAt
    }
  }
`;

const CREATE_ROOM_MUTATION = `
  mutation CreateRoom($name: String!) {
    createRoom(name: $name) {
      id
      name
      ownerID
      memberIDs
    }
  }
`;

const JOIN_ROOM_MUTATION = `
  mutation JoinRoom($roomID: ID!) {
    joinRoom(roomID: $roomID) {
      id
      name
      memberIDs
    }
  }
`;

export const getRooms = async (): Promise<Room[]> => {
  const data = await request<{ rooms: Room[] }>(LIST_ROOMS_QUERY);
  return data.rooms;
};

export const createRoom = async (name: string): Promise<Room> => {
  const data = await request<{ createRoom: Room }>(CREATE_ROOM_MUTATION, { name });
  return data.createRoom;
};

export const joinRoom = async (roomID: string): Promise<Room> => {
  const data = await request<{ joinRoom: Room }>(JOIN_ROOM_MUTATION, { roomID });
  return data.joinRoom;
};