import clsx from 'clsx';
import { useAtom } from 'jotai/index';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { areElementsAligned } from '~/pages/Game/helpers/areElementsAligned.ts';
import {
  endGameApiCall,
  EndGameDataType,
} from '~/pages/Game/helpers/endGameApiCall.ts';
import { formatTime } from '~/pages/Game/helpers/formatTime.ts';
import { handleDrag } from '~/pages/Game/helpers/handleDrag.ts';
import { initializePosition } from '~/pages/Game/helpers/initializePosition.ts';
import { ResultGameLoading } from '~/pages/Game/Loadings/ResultGameLoading.tsx';
import { modalAtom } from '~/shared/atoms/modalAtom.ts';
import { userAtom } from '~/shared/atoms/user.ts';
import { GameLogo } from '~/shared/icons/Game/Game.tsx';
import { Button, Icon } from '~/shared/ui';

import styles from './GameContent.module.css';

type GameContentProps = {
  stopGame: () => void;
  startGame: () => void;
};

type ElementPosition = {
  dx: number;
  dy: number;
};

export const GameContent = (props: GameContentProps) => {
  const { stopGame: handleStopGame, startGame } = props;
  const eleRef1 = useRef<HTMLDivElement | null>(null);
  const eleRef2 = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [user] = useAtom(userAtom);
  const [, setModal] = useAtom(modalAtom);

  const balance = user?.balance;
  const currency = 'WORD Coins';

  const [time, setTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [position1, setPosition1] = useState<ElementPosition>({ dx: 0, dy: 0 });
  const [position2, setPosition2] = useState<ElementPosition>({ dx: 0, dy: 0 });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useLayoutEffect(() => {
    initializePosition(`.${styles.left_container}`, eleRef1, setPosition1);
    initializePosition(`.${styles.right_container}`, eleRef2, setPosition2);

    const handleResize = () => {
      initializePosition(`.${styles.left_container}`, eleRef1, setPosition1);
      initializePosition(`.${styles.right_container}`, eleRef2, setPosition2);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (isTimerRunning) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [isTimerRunning]);

  const checkElementAlignment = (
    position1: { dx: number; dy: number },
    position2: { dx: number; dy: number },
    containerRef: RefObject<HTMLDivElement>,
  ) => {
    if (!containerRef.current) return false;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    return areElementsAligned(
      position1,
      position2,
      containerWidth,
      containerHeight,
    );
  };

  const restartGame = () => {
    handleStopGame();
    startGame();
  };

  const updateModal = (
    isAligned: boolean,
    data: EndGameDataType,
    handleStopGame: () => void,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
  ) => {
    setModal((prev) => ({
      ...prev,
      openedModal: isAligned && data?.words_reward ? 'gameSuccess' : 'gameFail',
      options: {
        stopGame: handleStopGame,
        restartGame: restartGame,
        coins: data?.words_reward ? data?.words_reward : 0,
        setIsLoading,
      },
    }));
  };

  const stopGame = async () => {
    setIsLoading(true);
    setIsTimerRunning(false);

    const isAligned = checkElementAlignment(position1, position2, containerRef);
    const data = await endGameApiCall();

    updateModal(isAligned, data, handleStopGame, setIsLoading);

    setIsLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header_container}>
        <div className={styles.header}>
          <div className={styles.clock_wrapper}>
            <Icon glyph="Alarm" />
            <span className={styles.clock_title}>Timer</span>
            <span className={styles.clock_value}>{formatTime(time)}</span>
          </div>
          <div className={styles.balance_container}>
            <span className={styles.balance_title}>BALANCE</span>
            <span
              className={styles.balance_value}
            >{`${balance} ${currency}`}</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className={styles.game_container}>
        <div className={clsx(styles.container, styles.left_container)}>
          <div
            ref={eleRef1}
            className={styles.draggable}
            onMouseDown={handleDrag(
              eleRef1,
              position1,
              setPosition1,
              `.${styles.left_container}`,
            )}
            onTouchStart={handleDrag(
              eleRef1,
              position1,
              setPosition1,
              `.${styles.left_container}`,
            )}
          >
            <GameLogo />
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={clsx(styles.container, styles.right_container)}>
          <div
            ref={eleRef2}
            className={styles.draggable}
            onMouseDown={handleDrag(
              eleRef2,
              position2,
              setPosition2,
              `.${styles.right_container}`,
            )}
            onTouchStart={handleDrag(
              eleRef2,
              position2,
              setPosition2,
              `.${styles.right_container}`,
            )}
          >
            <GameLogo className={styles.mirrored} />
          </div>
        </div>
      </div>

      <div className={styles.button_container}>
        <Button color="red" size="m" onClick={stopGame} isStretched>
          Done
        </Button>
      </div>
      {isLoading && (
        <div className={styles.loading}>
          <ResultGameLoading />
        </div>
      )}
    </div>
  );
};
