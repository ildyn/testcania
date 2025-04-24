import { useAtom } from 'jotai';
import { FC } from 'react';

import { userAtom } from '~/shared/atoms/user';
import { DepositButton } from '~/shared/ui';

import styles from './Header.module.css';

export const Header: FC = () => {
  const [user] = useAtom(userAtom);

  return (
    <div className={styles.base}>
      <div>
        <span className={styles.title}>Balance: </span>
        <span className={styles.text}>{user!.balance} WORD coin</span>
      </div>
      <div className={styles.deposit}>
        <span className={styles.text}>{user!.balance_usdt} USDT</span>
        <DepositButton />
      </div>
    </div>
  );
};
