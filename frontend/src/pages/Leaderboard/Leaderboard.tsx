import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';

import { PageLayout } from '~/layouts';
import { GET } from '~/shared/api';
import { leaderboardAtom } from '~/shared/atoms/leaderboard';
import { Header } from '~/shared/layout';
import { PageSpinner } from '~/shared/ui';

import styles from './Leaderboard.module.css';
import { TableItem } from './TableItem/TableItem';

import userAvatarDefault from '/user-avatar.svg';

export const Leaderboard: FC = () => {
  const [leaderboard, setLeaderboard] = useAtom(leaderboardAtom);

  useEffect(() => {
    if (!leaderboard) {
      GET('/api/profiles/rating').then((response) => {
        if (response.data) {
          setLeaderboard(response.data);
        }
      });
    }
  }, []);

  if (!leaderboard) {
    return (
      <PageLayout>
        <PageSpinner />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className={styles.base}>
        <Header />
        <div className={styles.title__container}>
          <p className={styles.title}>Prize pool</p>
          <p className={styles.prize}>will come soon</p>
        </div>
        <div className={styles.content}>
          <p className={styles.table__title}>Points</p>
          <div className={styles.table}>
            {leaderboard.users.map((user) => (
              <TableItem
                key={user.id}
                avatar={user.avatar || ''}
                name={user.full_name}
                place={user.place}
                points={user.points}
              />
            ))}
          </div>

          <div className={styles.me__container}>
            <p className={styles.me__place}>{leaderboard.user.place}</p>
            <img
              className={styles.me__img}
              src={leaderboard.user.avatar || userAvatarDefault}
              alt=""
            />
            <div>
              <p className={styles.me__name}>{leaderboard.user.full_name}</p>
              <p className={styles.me__points}>
                {leaderboard.user.points} points
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
