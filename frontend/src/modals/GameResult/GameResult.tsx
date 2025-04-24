import { useAtom } from 'jotai';
import { FC } from 'react';
import { BottomModal } from 'react-spring-modal';

import { previousGameAtom } from '~/shared/atoms/game';
import { modalAtom } from '~/shared/atoms/modalAtom';
import { Button, CloseModalButton } from '~/shared/ui';

import styles from './GameResult.module.css';

import failEmojiImg from '/fail-emoji.png';
import successEmojiImg from '/success-emoji.png';

export const GameResult: FC = () => {
  const [modal, setModal] = useAtom(modalAtom);
  const [previousGame, setPreviousGame] = useAtom(previousGameAtom);

  const modalClose = () => {
    if (modal.openedModal === 'gameResult') {
      delete previousGame.winning[modal.options.type];
    }

    setPreviousGame({ ...previousGame });

    setModal((prev) => ({ ...prev, openedModal: null, options: null }));

    if (previousGame.winning.basic) {
      setModal((prev) => ({
        ...prev,
        openedModal: 'gameResult',
        options: { type: 'basic' },
      }));

      return;
    }

    if (previousGame.winning.premium) {
      setModal((prev) => ({
        ...prev,
        openedModal: 'gameResult',
        options: { type: 'premium' },
      }));

      return;
    }
  };

  const handleDismiss = () => {
    modalClose();
  };

  const handleButtonClick = () => {
    modalClose();
  };

  return (
    <BottomModal
      isOpen={modal.openedModal === 'gameResult'}
      onDismiss={handleDismiss}
    >
      <CloseModalButton className={styles.close} onClick={handleDismiss} />
      {modal.openedModal === 'gameResult' && (
        <>
          <div className={styles.image__wrapper}>
            <img
              className={styles.image}
              src={
                previousGame.winning[modal.options.type] > 0
                  ? successEmojiImg
                  : failEmojiImg
              }
              alt=""
            />
          </div>

          <p className={styles.title}>
            {previousGame.winning[modal.options.type] > 0 ? (
              <>
                Congratulations- you were <br /> correct!
              </>
            ) : (
              <>
                Oops- you missed this <br /> time:(
              </>
            )}
          </p>

          <p className={styles.description}>
            {previousGame.winning[modal.options.type] > 0 ? (
              <>
                Successful bet! Keep it going, bro 😎 <br />{' '}
                <span className={styles.green}>
                  +{previousGame.winning[modal.options.type]}{' '}
                  {{ basic: 'WORDS', premium: 'USDT' }[modal.options.type]}
                </span>
              </>
            ) : (
              <>
                Bet failed. Keep it going, bro 😎 <br />{' '}
                <span className={styles.red}>
                  -{Math.abs(previousGame.winning[modal.options.type])}{' '}
                  {{ basic: 'WORDS', premium: 'USDT' }[modal.options.type]}
                </span>
              </>
            )}
          </p>
        </>
      )}

      <div className={styles.button__wrapper}>
        <Button color="orange" size="m" isStretched onClick={handleButtonClick}>
          Okay
        </Button>
      </div>
    </BottomModal>
  );
};
