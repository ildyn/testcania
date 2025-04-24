import { useAtom } from 'jotai';
import { FC } from 'react';
import { useLocation } from 'wouter';

import { PageLayout } from '~/layouts';
import { modalAtom } from '~/shared/atoms/modalAtom';
import { userAtom } from '~/shared/atoms/user';
import { Plus } from '~/shared/icons';
import { Routes } from '~/shared/routes';
import { Button, Icon } from '~/shared/ui';

import styles from './Wallet.module.css';

export const Wallet: FC = () => {
  const [user] = useAtom(userAtom);
  const [, setModal] = useAtom(modalAtom);
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation(Routes.Loading);

    return <></>;
  }

  const handleWithdrawButtonClick = () => {
    setModal((prev) => ({ ...prev, openedModal: 'withdraw', options: null }));
  };

  const handleAddButtonClick = () => {
    setModal((prev) => ({ ...prev, openedModal: 'deposit', options: null }));
  };

  return (
    <PageLayout>
      <div className={styles.base}>
        <div className={styles.content}>
          <span className={styles.title}>Balance</span>
          <span className={styles.balance}>$ {user.balance_usdt}</span>
          <span className={styles.currency}>USDT</span>

          <div className={styles.buttons__container}>
            <Button
              isStretched
              size="m"
              color="green"
              onClick={handleAddButtonClick}
              icon={<Plus />}
            >
              Add
            </Button>
            <Button
              isStretched
              isOutlined
              size="m"
              color="green"
              onClick={handleWithdrawButtonClick}
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.8016 8.98743C15.521 9.28674 15.0465 9.30587 14.7419 9.03015L10.75 5.41744L10.75 16.2632C10.75 16.6701 10.4142 17 10 17C9.58579 17 9.25 16.6701 9.25 16.2632L9.25 5.41744L5.25815 9.03015C4.95349 9.30587 4.47902 9.28674 4.19838 8.98743C3.91774 8.68813 3.9372 8.22198 4.24186 7.94626L9.49185 3.1949C9.77899 2.93503 10.221 2.93503 10.5081 3.1949L15.7581 7.94626C16.0628 8.22198 16.0823 8.68813 15.8016 8.98743Z"
                    fill="#A4D49C"
                  />
                </svg>
              }
            >
              Withdraw
            </Button>
          </div>

          <div className={styles.rows__container}>
            <div className={styles.row}>
              <div className={styles.row__icon}>
                <Icon glyph="Tether" width="100%" height="100%" />
              </div>
              <div className={styles.row__content}>
                <p className={styles.row__title}>USDT locked</p>
                <p className={styles.row__value}>0</p>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.row__icon}>
                <Icon glyph="Word" width="100%" height="100%" />
              </div>
              <div className={styles.row__content}>
                <p className={styles.row__title}>WORD Coin</p>
                <p className={styles.row__value}>{user.balance}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
