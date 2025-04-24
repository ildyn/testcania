import { atom } from 'jotai';

import { Referals } from '../api';

export const referalsAtom = atom<Referals | null>();
