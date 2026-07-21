// カードのスート/ランクに関する表示・並び替えの共通ロジック。
// スートはインデックス 0..4 = ♠ ♥ ♦ ♣ Joker の順で扱う。

export const SUIT_SYMBOLS = ['♠', '♥', '♦', '♣', 'Joker'] as const;

export const RANK_LABELS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

const JOKER_INDEX = 4;

// サーバーは記号(♠)と英名(Spade)のどちらでも返しうるため両方を受ける。
const SUIT_INDEX: Record<string, number> = {
  Spade: 0, '♠': 0,
  Heart: 1, '♥': 1,
  Diamond: 2, '♦': 2,
  Club: 3, '♣': 3,
  Joker: JOKER_INDEX,
};

/** 表示用スートインデックス（未知のスートは ♠ 扱い）。 */
export const getSuitIndex = (suit: string): number => SUIT_INDEX[suit] ?? 0;

/** 並び替え用の優先度（未知のスートは末尾）。 */
export const getSuitPriority = (suit: string): number => SUIT_INDEX[suit] ?? SUIT_SYMBOLS.length;

export const isRedSuit = (suit: string): boolean => {
  const index = getSuitIndex(suit);
  return index === 1 || index === 2;
};

export const isJoker = (suit: string): boolean => getSuitIndex(suit) === JOKER_INDEX;

export const getSuitSymbol = (suit: string): string => SUIT_SYMBOLS[getSuitIndex(suit)];

export const getRankLabel = (rank: number): string => RANK_LABELS[rank] ?? '';
