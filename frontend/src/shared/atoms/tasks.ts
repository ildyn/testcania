import { atom } from 'jotai';

type LinkTask = {
  type: 'link';
  link: string;
};

type ChannelTask = {
  type: 'channel';
  channel: string;
};

type DailyTask = {
  type: 'daily';
};

export type Task = {
  id: number;
  icon: string;
  title: string;
  status: 'waiting' | 'inProgress' | 'done';
  value: number;
} & (LinkTask | ChannelTask | DailyTask);

export type TasksState = Record<string, Task[]>;

export const tasksAtom = atom<TasksState>({
  'Daily tasks': [
    {
      id: 1,
      icon: 'https://i.imgur.com/kl9M2yA.png',
      title: 'Daily reward',
      status: 'waiting',
      type: 'daily',
      value: 10,
    },
  ],
  'Tasks list': [
    {
      id: 2,
      icon: 'https://i.imgur.com/kl9M2yA.png',
      title: 'Daily reward',
      status: 'waiting',
      type: 'daily',
      value: 10,
    },
    {
      id: 3,
      icon: 'https://i.imgur.com/kl9M2yA.png',
      title: 'Daily reward',
      status: 'waiting',
      type: 'daily',
      value: 10,
    },
    {
      id: 4,
      icon: 'https://i.imgur.com/kl9M2yA.png',
      title: 'Daily reward',
      status: 'waiting',
      type: 'daily',
      value: 10,
    },
    {
      id: 5,
      icon: 'https://i.imgur.com/kl9M2yA.png',
      title: 'Daily reward',
      status: 'waiting',
      type: 'daily',
      value: 10,
    },
    {
      id: 6,
      icon: 'https://i.imgur.com/kl9M2yA.png',
      title: 'Daily reward',
      status: 'waiting',
      type: 'daily',
      value: 10,
    },
  ],
});
