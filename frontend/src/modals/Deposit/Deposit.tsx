import WebApp from '@twa-dev/sdk';
import { useAtom } from 'jotai';
import { ChangeEvent, FC, useState } from 'react';
import { BottomModal } from 'react-spring-modal';
import 'react-spring-modal/styles.css';
import { Redirect } from 'wouter';

import { GET, POST } from '~/shared/api';
import { modalAtom } from '~/shared/atoms/modalAtom';
import { userAtom } from '~/shared/atoms/user';
import { STAR_TO_USDT } from '~/shared/constants/stars';
import { Routes } from '~/shared/routes';
import { Button, CloseModalButton } from '~/shared/ui';

import styles from './Deposit.module.css';

export const Deposit: FC = () => {
  const [modal, setModal] = useAtom(modalAtom);

  const [user, setUser] = useAtom(userAtom);
  const [amount, setAmount] = useState<number>(25);

  const handleModalClose = () => {
    setModal((prev) => ({ ...prev, openedModal: null, options: null }));
  };

  const handleAmountInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(Math.floor(e.currentTarget.valueAsNumber));
  };

  const handleButtonClick = async () => {
    const { data } = await POST('/api/profiles/stars', {
      body: { amount_stars: amount },
    });

    if (data) {
      WebApp.openInvoice(data.payment_url, (status) => {
        setModal((prev) => ({
          ...prev,
          openedModal: 'depositResult',
          options: { success: status === 'paid' },
        }));

        GET('/api/profiles/init').then(({ data }) => {
          if (data) {
            setUser(data);
          }
        });
      });
    }
  };

  if (!user) {
    return <Redirect to={Routes.Loading} />;
  }

  const amountUsdt = Number.isNaN(amount)
    ? 0
    : Math.trunc(amount * STAR_TO_USDT * 1000) / 1000;

  return (
    <BottomModal
      isOpen={modal.openedModal === 'deposit'}
      onDismiss={handleModalClose}
    >
      <CloseModalButton className={styles.close} onClick={handleModalClose} />

      <p className={styles.title}>Top Up Your Balance</p>
      <p className={styles.subtitle}>
        Please enter the amount of Telegram <br />
        Stars you wish to convert to USDT <br />
        balance in the game
      </p>

      <div className={styles.input__wrapper}>
        <p className={styles.input__title}>Stars Amount</p>
        <input
          onChange={handleAmountInputChange}
          value={amount}
          className={styles.input}
          type="number"
          step={1}
          placeholder="25"
        />
      </div>

      <div className={styles.input__wrapper}>
        <p className={styles.input__title}>USDT Balance</p>
        <input value={`$${amountUsdt}`} className={styles.input} disabled />
      </div>

      <div className={styles.button__wrapper}>
        <Button
          isDisabled={Number.isNaN(amount) || amount <= 0}
          onClick={handleButtonClick}
          color="orange"
          size="m"
          isStretched
        >
          Confirm
        </Button>
      </div>
    </BottomModal>
  );
};
