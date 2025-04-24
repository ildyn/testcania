import { atom } from 'jotai';

export type GameType = 'basic' | 'premium';
type GameState = {
  type: GameType;
  nextGame: Date;
  gameId: number;
  course: number;
  stats: Record<
    GameType,
    {
      YES: number;
      NO: number;
    }
  >;
  userBet: Record<
    GameType,
    {
      YES: number;
      NO: number;
    }
  >;
};

type PreviousGameState = {
  winning: Record<GameType, number>;
};

export const gameAtom = atom<GameState>({
  type: 'basic',
  nextGame: new Date(),
  gameId: 0,
  course: 0,
  stats: {
    basic: {
      YES: 0,
      NO: 0,
    },
    premium: {
      YES: 0,
      NO: 0,
    },
  },
  userBet: {
    basic: {
      YES: 0,
      NO: 0,
    },
    premium: {
      YES: 0,
      NO: 0,
    },
  },
});

export const previousGameAtom = atom<PreviousGameState>({
  winning: {
    basic: 0,
    premium: 0,
  },
});
