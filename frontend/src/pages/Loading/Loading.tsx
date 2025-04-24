import WebApp from '@twa-dev/sdk';
import { useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { useLocation } from 'wouter';

import { PageLayout } from '~/layouts';
import { GET } from '~/shared/api';
import { gameAtom } from '~/shared/atoms/game';
import { tasksAtom, TasksState } from '~/shared/atoms/tasks';
import { userAtom } from '~/shared/atoms/user';
import { Routes } from '~/shared/routes';
import { Spinner } from '~/shared/ui';

import styles from './Loading.module.css';

import LogoImg from '/logo-word.svg';

export const Loading: FC = () => {
  const [, setLocation] = useLocation();
  const setUser = useSetAtom(userAtom);
  const setGame = useSetAtom(gameAtom);
  const setTasks = useSetAtom(tasksAtom);

  useEffect(() => {
    const startParam = Number(WebApp.initDataUnsafe.start_param!);

    GET('/api/profiles/init', {
      params: {
        query: { ref_id: Number.isNaN(startParam) ? null : startParam },
      },
    }).then((response) => {
      if (response.data) {
        const data = response.data;

        setUser(data);

        if (response.data.next_game) {
          const data = response.data.next_game;

          setGame((prev) => ({
            ...prev,
            nextGame: new Date(data.date),
            gameId: data.id,
            course: data.course,
            stats: {
              ...prev.stats,
              basic: {
                YES: data.stats.WORDS.YES.total_rate,
                NO: data.stats.WORDS.NO.total_rate,
              },
              premium: {
                YES: data.stats.USDT.YES.total_rate,
                NO: data.stats.USDT.NO.total_rate,
              },
            },
            userBet: {
              ...prev.userBet,
              basic: {
                YES: data.user_bet.WORDS.YES.total_rate,
                NO: data.user_bet.WORDS.NO.total_rate,
              },
              premium: {
                YES: data.user_bet.USDT.YES.total_rate,
                NO: data.user_bet.USDT.NO.total_rate,
              },
            },
          }));
        }

        setTasks(response.data.tasks as unknown as TasksState);
        setLocation(Routes.Word);
      }
    });
  }, []);

  return (
    <PageLayout isTabbarVisible={false}>
      <div className={styles.base}>
        <div>
          <p className={styles.logo__text}>Spread the</p>
          <img src={LogoImg} alt="Logo" />
        </div>
        <Spinner />
      </div>
    </PageLayout>
  );
};
