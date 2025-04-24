import { atom } from 'jotai';

export const dailyTaskAtom = atom({
  currentDay: 0,
  isOpened: false,
  taskId: 0,
});
