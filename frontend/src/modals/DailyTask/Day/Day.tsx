import clsx from 'clsx';
import { FC } from 'react';

import { Coin } from '~/shared/icons';

import styles from './Day.module.css';
import { DayProps } from './Day.props';

export const Day: FC<DayProps> = (props) => {
  const { number, reward, isActive, onClick } = props;

  const handleClick = () => {
    if (!isActive) {
      onClick?.();
    }
  };

  return (
    <div
      className={clsx(styles.base, {
        [styles.isActive]: isActive,
      })}
      onClick={handleClick}
    >
      <p className={styles.title}>Day {number}</p>

      <div className={styles.icon__wrapper}>
        <Coin width={28} height={28} />
      </div>

      <p className={styles.reward}>
        {reward >= 1000 ? `${reward / 1000}K`.replace('.', ',') : reward}
      </p>
    </div>
  );
};
