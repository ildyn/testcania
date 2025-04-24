import { atom } from 'jotai';

import { User } from '../api';

export const userAtom = atom<User | null>(null);
