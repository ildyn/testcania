import { atom } from 'jotai';

export type Appearance = 'light' | 'dark';

export const appearanceAtom = atom<Appearance>('light');
