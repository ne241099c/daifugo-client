import { API_URL } from './config';

// GraphQL エンドポイント (.../query) から SSE エンドポイント (.../events) を導出する。
const EVENTS_URL = API_URL.replace(/\/query$/, '/events');

// サーバーが送ってくる、部屋の状態が変わったことを示すイベント種別。
const REFETCH_EVENTS = ['game_update', 'game_started', 'room_updated', 'room_created'] as const;

/**
 * サーバーの SSE (/events) に接続し、部屋の更新イベントを受信するたびに onChange を呼ぶ。
 * ポーリングの代わりにこれでサーバー側の変化をほぼ即時に受け取る。
 * EventSource は接続が切れても自動再接続する。戻り値の関数で購読を解除する。
 */
export const subscribeRoomEvents = (onChange: (type: string) => void): (() => void) => {
  const es = new EventSource(EVENTS_URL);
  const handler = (e: Event) => onChange((e as MessageEvent).type);

  for (const type of REFETCH_EVENTS) {
    es.addEventListener(type, handler);
  }

  return () => {
    for (const type of REFETCH_EVENTS) {
      es.removeEventListener(type, handler);
    }
    es.close();
  };
};
