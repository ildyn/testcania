import { useAtom } from 'jotai';
import { FC } from 'react';
import { BottomModal } from 'react-spring-modal';

import { modalAtom } from '~/shared/atoms/modalAtom';
import { Button, CloseModalButton } from '~/shared/ui';

import styles from './BetError.module.css';

import sorryEmojiImg from '/sorry-emoji.png';

export const BetError: FC = () => {
  const [modal, setModal] = useAtom(modalAtom);

  const modalClose = () => {
    setModal((prev) => ({ ...prev, openedModal: null, options: null }));
  };

  const handleDismiss = () => {
    modalClose();
  };

  const handleButtonClick = () => {
    modalClose();
  };

  return (
    <BottomModal
      isOpen={modal.openedModal === 'betError'}
      onDismiss={handleDismiss}
    >
      <CloseModalButton className={styles.close} onClick={handleDismiss} />
      <div className={styles.image__wrapper}>
        <img className={styles.image} src={sorryEmojiImg} alt="" />
      </div>

      <p className={styles.title}>Sorry</p>
      <p className={styles.description}>
        {modal.openedModal === 'betError' && (
          <>
            {modal.options?.type === 'opposite' &&
              'You can place a bet only on 1 outcome'}
            {modal.options?.type === 'timeout' && (
              <>
                You aren't able to place a bet in
                <br />
                last 3 minutes
              </>
            )}
          </>
        )}
      </p>

      <div className={styles.button__wrapper}>
        <Button color="orange" size="m" isStretched onClick={handleButtonClick}>
          Okay
        </Button>
      </div>
    </BottomModal>
  );
};
