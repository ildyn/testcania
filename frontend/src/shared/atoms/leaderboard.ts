import { atom } from 'jotai';

import { Leaderboard } from '../api';

export const leaderboardAtom = atom<Leaderboard | null>(null);
