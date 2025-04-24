import { useAtom } from 'jotai';
import { FC } from 'react';
import { BottomModal } from 'react-spring-modal';
import { useLocation } from 'wouter';

import { modalAtom } from '~/shared/atoms/modalAtom';
import { Routes } from '~/shared/routes.ts';
import { Button } from '~/shared/ui';
import { CloseModalButton } from '~/shared/ui/CloseModalButton/CloseModalButton.tsx';

import styles from './GameFail.module.css';

import failEmojiImg from '/fail-emoji.png';

export const GameFail: FC = () => {
  const [modal, setModal] = useAtom(modalAtom);
  const [_, setLocation] = useLocation();

  const modalClose = () => {
    setModal((prev) => ({ ...prev, openedModal: null, options: null }));
  };

  const stopGame =
    modal.openedModal === 'gameFail' ? modal.options?.stopGame : null;
  const restartGame =
    modal.openedModal === 'gameFail' ? modal.options?.restartGame : null;

  const handleDismiss = () => {
    modalClose();
    if (stopGame) {
      stopGame();
    }
    handleBackToStartPage();
  };

  const handleBackToStartPage = () => {
    setLocation(Routes.Word);
  };

  return (
    <BottomModal
      isOpen={modal.openedModal === 'gameFail'}
      onDismiss={handleDismiss}
    >
      {modal.openedModal === 'gameFail' && (
        <>
          <CloseModalButton className={styles.close} onClick={handleDismiss} />
          <div className={styles.image__wrapper}>
            <img className={styles.image} src={failEmojiImg} alt="" />
          </div>

          <p className={styles.title}>Oops!</p>
          <p className={styles.description}>Try to connect the parts</p>

          <div className={styles.button__wrapper}>
            <Button
              color="orange"
              size="m"
              isStretched
              onClick={() => {
                modalClose();
                if (restartGame) {
                  restartGame();
                }
              }}
            >
              Keep playing
            </Button>
          </div>
        </>
      )}
    </BottomModal>
  );
};
