import clsx from 'clsx';
import { FC } from 'react';

import { formatDate } from '~/pages/MyBets/TableItem/helpers/formatDate.ts';

import styles from './TableItem.module.css';
import { TableItemProps } from './TableItem.props';

export const TableItem: FC<TableItemProps> = (props) => {
  const { id, course, currency, date, rate, winRate } = props;
  const formattedDate: string = formatDate(date);

  return (
    <div className={styles.base}>
      <div className={styles.row}>
        <p className={styles.row__title}>Bet ID</p>
        <p className={styles.row__value}>{id}</p>
      </div>
      <div className={styles.row}>
        <p className={styles.row__title}>Word of the day</p>
        <p className={styles.row__value}>
          BTC price higher than {course} USDT in the next hour.
        </p>
      </div>
      <div className={styles.row}>
        <p className={styles.row__title}>Date</p>
        <p className={styles.row__value}>{formattedDate}</p>
      </div>
      <div className={styles.row}>
        <p className={styles.row__title}>Your bet</p>
        <p className={styles.row__value}>{rate}</p>
      </div>
      <div className={styles.row}>
        <p className={styles.row__title}>Currency</p>
        <p className={styles.row__value}>{currency}</p>
      </div>

      <div className={styles.row}>
        <p className={styles.row__title}>Total profit/loss</p>
        <p
          className={clsx(styles.row__value, styles['row__value--bold'], {
            [styles['row__value--positive']]: Number(winRate) > 0,
            [styles['row__value--negative']]: Number(winRate) < 0,
          })}
        >
          {Number(winRate) > 0 && '+'}
          {winRate === null ? 0 : winRate?.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
