import { useAtom } from 'jotai';
import { FC, useEffect, useState } from 'react';
import { BottomModal } from 'react-spring-modal';
import { useLocation } from 'wouter';

import { GET } from '~/shared/api';
import { modalAtom } from '~/shared/atoms/modalAtom';
import { userAtom } from '~/shared/atoms/user';
import { Routes } from '~/shared/routes.ts';
import { Button } from '~/shared/ui';
import { CloseModalButton } from '~/shared/ui/CloseModalButton/CloseModalButton.tsx';

import styles from './GameSuccess.module.css';

import successEmojiImg from '/success-emoji.png';

export const GameSuccess: FC = () => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [modal, setModal] = useAtom(modalAtom);
  const [, setUser] = useAtom(userAtom);
  const [, setLocation] = useLocation();

  const closeModal = () => {
    if (isWaiting) {
      return;
    }

    setModal((prev) => ({ ...prev, openedModal: null, options: null }));
  };

  const stopGame =
    modal.openedModal === 'gameSuccess' ? modal.options?.stopGame : null;
  const restartGame =
    modal.openedModal === 'gameSuccess' ? modal.options?.restartGame : null;
  const coins = modal.openedModal === 'gameSuccess' ? modal.options?.coins : 0;

  const handleDismiss = () => {
    closeModal();
    if (stopGame) {
      stopGame();
    }
    handleBackToStartPage();
  };

  useEffect(() => {
    if (!(modal.openedModal === 'gameSuccess')) {
      return;
    }

    setIsWaiting(true);

    GET('/api/profiles/init')
      .then(({ data }) => {
        if (data) {
          setUser(data);
        }
      })
      .finally(() => {
        setIsWaiting(false);
      });
  }, [modal.openedModal]);

  const handleBackToStartPage = () => {
    setLocation(Routes.Word);
  };

  return (
    <BottomModal
      isOpen={modal.openedModal === 'gameSuccess'}
      onDismiss={handleDismiss}
    >
      <CloseModalButton className={styles.close} onClick={handleDismiss} />
      <div className={styles.image__wrapper}>
        <img className={styles.image} src={successEmojiImg} alt="" />
      </div>
      <p className={styles.title}>Success!</p>
      <p className={styles.description}>
        {'Keep it going, bro'} <br />{' '}
        <span className={styles.text__color}>{`+${coins} Word Coins`}</span>
      </p>
      <Button
        onClick={() => {
          closeModal();
          if (restartGame) {
            restartGame();
          }
        }}
        isDisabled={isWaiting}
        color="orange"
        size="m"
        isStretched
      >
        Keep playing
      </Button>
    </BottomModal>
  );
};
