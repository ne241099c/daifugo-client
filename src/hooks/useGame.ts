// import { useState, useEffect, useRef } from "react";
// import type { Room, User, Card } from "../types";
// import { SSE_URL } from "../lib/config";
// import { request } from "../lib/graphql";

// // GraphQL queries/mutations
// const SIGN_UP_MUTATION = `
//   mutation SignUp($name: String!, $email: String!, $password: String!) {
//     signUp(in: {name: $name, email: $email, password: $password}) {
//       id
//       name
//       email
//     }
//   }
// `;

// const JOIN_ROOM_MUTATION = `
//   mutation JoinRoom($roomId: ID!) {
//     joinRoom(roomId: $roomId) {
//       id
//       name
//       memberIds
//     }
//   }
// `;

// const START_GAME_MUTATION = `
//   mutation StartGame($roomId: ID!) {
//     startGame(roomId: $roomId) {
//       id
//       game {
//         turn
//         fieldCards { id suit rank }
//         isRevolution
//         passCount
//       }
//     }
//   }
// `;

// const PLAY_CARD_MUTATION = `
//   mutation PlayCard($roomId: ID!, $cardIds: [Int!]!) {
//     playCard(roomId: $roomId, cardIds: $cardIds) {
//       id
//     }
//   }
// `;

// const PASS_MUTATION = `
//   mutation Pass($roomId: ID!) {
//     pass(roomId: $roomId) {
//       id
//     }
//   }
// `;

// const GET_ROOM_QUERY = `
//   query GetRoom($id: ID!) {
//     room(id: $id) {
//       id
//       name
//       ownerId
//       memberIds
//       owner { id name }
//       members { id name }
//       game {
//         turn
//         fieldCards { id suit rank }
//         isRevolution
//         players {
//           userId
//           hand { id suit rank }
//           rank
//         }
//         finishedPlayers { userId rank }
//         passCount
//       }
//     }
//   }
// `;

// export const useGame = () => {
//     // State
//     const [token, setToken] = useState<string | null>(sessionStorage.getItem("daifugo_token"));
//     const [user, setUser] = useState<User | null>(null);
//     const [room, setRoom] = useState<Room | null>(null);
//     const [isConnected, setIsConnected] = useState<boolean>(false);

//     const eventSourceRef = useRef<EventSource | null>(null);

//     // Initial connection to SSE
//     useEffect(() => {
//         if (!eventSourceRef.current) {
//             console.log("Connecting to SSE...", SSE_URL);
//             const es = new EventSource(SSE_URL);
            
//             es.onopen = () => {
//                 console.log("✅ SSE Connected");
//                 setIsConnected(true);
//             };

//             es.onerror = (err) => {
//                 console.error("❌ SSE Error", err);
//                 setIsConnected(false);
//             };

//             // Custom event listeners
//             es.addEventListener("room_created", (e: MessageEvent) => {
//                 console.log("Room Created Event:", e.data);
//             });

//             es.addEventListener("room_updated", () => {
//                 // Should re-fetch room if we are in it
//                 if (room) {
//                      fetchRoom(room.id);
//                 }
//             });

//             es.addEventListener("game_started", () => {
//                 if (room) fetchRoom(room.id);
//             });

//             es.addEventListener("game_update", () => {
//                 if (room) fetchRoom(room.id);
//             });

//             eventSourceRef.current = es;
//         }

//         return () => {
//             if (eventSourceRef.current) {
//                 eventSourceRef.current.close();
//                 eventSourceRef.current = null;
//             }
//         };
//     }, [room]);

//     const fetchRoom = async (roomId: string) => {
//         try {
//             const data = await request<{ room: Room }>(GET_ROOM_QUERY, { id: roomId }, token || undefined);
//             if (data.room) {
//                 setRoom(data.room);
//             }
//         } catch (e) {
//             console.error("Failed to fetch room", e);
//         }
//     };

//     const signUp = async (name: string, email: string, pass: string) => {
//         try {
//             const data = await request<{ signUp: User }>(SIGN_UP_MUTATION, { name, email, password: pass });
//             // Assume we can get a token somehow, or user ID is enough for now?
//             // Since backend is strict, we really need a token.
//             // For now, we store the user.
//             setUser(data.signUp);
//             console.log("Signed Up:", data.signUp);
//             return data.signUp;
//         } catch (e) {
//             console.error("SignUp Failed", e);
//             throw e;
//         }
//     };

//     // Helper to manually set token (for dev/testing or if we implement a hack)
//     const setAuthToken = (t: string) => {
//         sessionStorage.setItem("daifugo_token", t);
//         setToken(t);
//     };

//     const joinRoom = async (roomId: string) => {
//         if (!token) throw new Error("No token");
//         try {
//             const data = await request<{ joinRoom: Room }>(JOIN_ROOM_MUTATION, { roomId }, token);
//             setRoom(data.joinRoom);
//             // Fetch full details
//             await fetchRoom(data.joinRoom.id);
//         } catch (e) {
//             console.error("Join Room Failed", e);
//             throw e;
//         }
//     };

//     const startGame = async () => {
//         if (!token || !room) return;
//         try {
//             await request(START_GAME_MUTATION, { roomId: room.id }, token);
//         } catch (e) {
//             console.error("Start Game Failed", e);
//         }
//     };

//     const playCards = async (cards: Card[]) => {
//         if (!token || !room) return;
//         const cardIds = cards.map(c => c.id);
//         try {
//             await request(PLAY_CARD_MUTATION, { roomId: room.id, cardIds }, token);
//         } catch (e) {
//             console.error("Play Cards Failed", e);
//         }
//     };

//     const passTurn = async () => {
//         if (!token || !room) return;
//         try {
//             await request(PASS_MUTATION, { roomId: room.id }, token);
//         } catch (e) {
//             console.error("Pass Failed", e);
//         }
//     };

//     const logout = () => {
//         sessionStorage.removeItem("daifugo_token");
//         setToken(null);
//         setUser(null);
//         setRoom(null);
//     };

//     return {
//         isConnected,
//         token,
//         user,
//         room,
//         signUp,
//         setAuthToken,
//         joinRoom,
//         startGame,
//         playCards,
//         passTurn,
//         logout
//     };
// };
