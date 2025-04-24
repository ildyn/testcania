import { useAtom } from 'jotai';
import { FC } from 'react';
import { BottomModal } from 'react-spring-modal';

import { modalAtom } from '~/shared/atoms/modalAtom';
import { Button } from '~/shared/ui';

import styles from './DepositResult.module.css';

import failEmojiImg from '/fail-emoji.png';
import successEmojiImg from '/success-emoji.png';

export const DepositResult: FC = () => {
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
      isOpen={modal.openedModal === 'depositResult'}
      onDismiss={handleDismiss}
    >
      {modal.openedModal === 'depositResult' && (
        <>
          <div className={styles.image__wrapper}>
            <img
              className={styles.image}
              src={modal.options.success ? successEmojiImg : failEmojiImg}
              alt=""
            />
          </div>
          <p className={styles.description}>
            {modal.options.success ? (
              <>
                Your balance has been successfully topped up <br />
                Enjoy your experience with real profits!
              </>
            ) : (
              <>
                You cancelled the payment <br />
                Please check your balance and try again
              </>
            )}
          </p>
        </>
      )}

      <div className={styles.button__wrapper}>
        <Button color="orange" size="m" isStretched onClick={handleButtonClick}>
          Done
        </Button>
      </div>
    </BottomModal>
  );
};
