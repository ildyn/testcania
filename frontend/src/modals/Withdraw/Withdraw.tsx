import { useAtom } from 'jotai';
import { ChangeEvent, FC, useState } from 'react';
import Select from 'react-select';
import { BottomModal } from 'react-spring-modal';
import 'react-spring-modal/styles.css';
import { Redirect } from 'wouter';

import { POST } from '~/shared/api';
import { modalAtom } from '~/shared/atoms/modalAtom';
import { userAtom } from '~/shared/atoms/user';
import {
  currencyOptions,
  networkOptions,
  typeOptions,
} from '~/shared/constants/options.ts';
import { Routes } from '~/shared/routes';
import { inputStyles } from '~/shared/styles/styles.ts';
import { Currency, Network, Type } from '~/shared/types/types.ts';
import { Button, CloseModalButton } from '~/shared/ui';

import styles from './Withdraw.module.css';

export const Withdraw: FC = () => {
  const [modal, setModal] = useAtom(modalAtom);
  const [type, setType] = useState<Type>();
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [address, setAddress] = useState<string>();
  const [user] = useAtom(userAtom);
  const [amount, setAmount] = useState<string>();

  const handleModalClose = () => {
    setModal((prev) => ({ ...prev, openedModal: null, options: null }));
  };

  const handleAmountInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.currentTarget.value);
  };

  const handleAddressInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.currentTarget.value);
  };

  const handleButtonClick = () => {
    if (!currency || !amount || !network || !type || !address) {
      return;
    }

    const formatedType = type.toLowerCase();

    POST('/api/profiles/withdrawal', {
      body: {
        amount: Number(amount),
        currency,
        type: (formatedType.charAt(0).toUpperCase() +
          formatedType.slice(1)) as unknown as 'CRYPTO' | 'FIAT',
        network: type === 'Crypto' && network === 'TRON' ? network : null,
        payment_method: type === 'Fiat' && network !== 'TRON' ? network : null,
        address: type === 'Crypto' ? address : null,
        card_number: type === 'Fiat' ? address : null,
      },
    }).then(({ data }) => {
      if (data) {
        setModal((prev) => ({
          ...prev,
          openedModal: 'transactionCompleted',
          options: null,
        }));
      }
    });
  };

  const handleSelectChange =
    (inputType: 'type' | 'currency' | 'network') =>
    (newValue: { value: string; label: string } | null) => {
      if (!newValue) {
        return;
      }

      switch (inputType) {
        case 'type': {
          const value = newValue.value as Type;

          if (value !== type) {
            setCurrency(null);
            setNetwork(null);
            setAddress('');
            setAmount('');
          }

          setType(value);

          break;
        }
        case 'currency':
          setCurrency(newValue.value as Currency);

          break;
        case 'network':
          setNetwork(newValue.value as Network);

          break;
      }
    };

  if (!user) {
    return <Redirect to={Routes.Loading} />;
  }

  return (
    <BottomModal
      isOpen={modal.openedModal === 'withdraw'}
      onDismiss={handleModalClose}
    >
      <CloseModalButton className={styles.close} onClick={handleModalClose} />

      <p className={styles.title}>Withdraw</p>

      <div className={styles.select__wrapper}>
        <Select
          placeholder="Type"
          isSearchable={false}
          styles={inputStyles}
          options={typeOptions}
          // @ts-expect-error fuck react-select
          onChange={handleSelectChange('type')}
        />
      </div>

      <div className={styles.select__wrapper}>
        <Select
          styles={inputStyles}
          isSearchable={false}
          placeholder="Currency"
          options={type ? currencyOptions[type] : []}
          // @ts-expect-error fuck react-select
          onChange={handleSelectChange('currency')}
          value={currency && { label: currency, value: currency }}
        />
      </div>

      <div className={styles.select__wrapper}>
        <Select
          styles={inputStyles}
          isSearchable={false}
          placeholder="Network"
          options={currency ? networkOptions[currency] : []}
          // @ts-expect-error fuck react-select
          onChange={handleSelectChange('network')}
          value={network && { label: network, value: network }}
        />
      </div>

      <div className={styles.input__wrapper}>
        <p className={styles.input__title}>
          {type === 'Crypto' ? 'Address' : 'Card number'}
        </p>
        <input
          onChange={handleAddressInputChange}
          value={address}
          className={styles.input}
        />
      </div>

      <div className={styles.input__wrapper}>
        <p className={styles.input__title}>Amount</p>
        <input
          onChange={handleAmountInputChange}
          className={styles.input}
          type="number"
          max={user.balance_usdt}
          placeholder="0.00000001"
        />
      </div>

      <div className={styles.button__wrapper}>
        <Button onClick={handleButtonClick} color="orange" size="m" isStretched>
          Confirm
        </Button>
      </div>
    </BottomModal>
  );
};
