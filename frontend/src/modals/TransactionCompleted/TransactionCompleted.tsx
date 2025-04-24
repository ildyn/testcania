import { useAtom } from 'jotai';
import { FC } from 'react';
import { BottomModal } from 'react-spring-modal';

import { modalAtom } from '~/shared/atoms/modalAtom';
import { Button, CloseModalButton } from '~/shared/ui';

import styles from './TransactionCompleted.module.css';

import transactionCompletedImg from '/transaction-completed.gif';

export const TransactionCompleted: FC = () => {
  const [modal, setModal] = useAtom(modalAtom);

  const closeModal = () => {
    setModal((prev) => ({ ...prev, openedModal: null, options: null }));
  };

  const handleDismiss = () => {
    closeModal();
  };

  const handleButtonClick = () => {
    closeModal();
  };

  return (
    <BottomModal
      isOpen={modal.openedModal === 'transactionCompleted'}
      onDismiss={handleDismiss}
    >
      <CloseModalButton className={styles.close} onClick={handleDismiss} />
      <div className={styles.image__wrapper}>
        <img className={styles.image} src={transactionCompletedImg} alt="" />
      </div>
      <p className={styles.description}>
        Your transaction is being processed and will be completed soon
      </p>
      <Button onClick={handleButtonClick} color="orange" size="m" isStretched>
        Done
      </Button>
    </BottomModal>
  );
};
