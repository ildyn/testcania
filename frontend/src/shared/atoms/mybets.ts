import { atom } from 'jotai';

import { MyBets } from '../api';

export const myBetsAtom = atom<MyBets[]>([]);
