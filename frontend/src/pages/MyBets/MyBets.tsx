import { useAtom } from 'jotai';
import { FC, useEffect, useState } from 'react';

import { PageLayout } from '~/layouts';
import { GET } from '~/shared/api';
import { myBetsAtom } from '~/shared/atoms/mybets';
import { PageSpinner } from '~/shared/ui';

import styles from './MyBets.module.css';
import { TableItem } from './TableItem/TableItem';

import sorryEmojiImg from '/sorry-emoji.png';

export const MyBets: FC = () => {
  const [bets, setBets] = useAtom(myBetsAtom);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!bets.length) {
      GET('/api/profiles/bets').then((response) => {
        if (response.data) {
          setBets(
            response.data.sort(
              (a, b) =>
                new Date(b.time_created).getTime() -
                new Date(a.time_created).getTime(),
            ),
          );
          setIsLoaded(true);
        }
      });
    } else {
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return (
      <PageLayout>
        <PageSpinner />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className={styles.base}>
        <p className={styles.title}>My bets</p>
        {bets.length ? (
          <div className={styles.content}>
            <div className={styles.table}>
              {bets.map((bet) => (
                <TableItem
                  key={bet.id}
                  id={bet.id}
                  rate={bet.total_rate}
                  winRate={bet.win_total_rate}
                  date={bet.time_created}
                  currency={bet.currency}
                  course={bet.game.course}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <img
              className={styles.placeholder__image}
              src={sorryEmojiImg}
              alt=""
            />
            <p className={styles.placeholder__title}>Sorry Bro</p>
            <p className={styles.placeholder__description}>
              No bets yet.
              <br /> Bet in the WORD, come back and check your bets placed here.
              <br /> Good luck. WORD makes the difference.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
