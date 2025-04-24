import { useAtom } from 'jotai';
import { FC, useState } from 'react';
import { useLocation } from 'wouter';

import { PageLayout } from '~/layouts';
import { GameContent } from '~/pages/Game/GameContent/GameContent.tsx';
import { GameStartScreen } from '~/pages/Game/GameStartScreen/GameStartScreen.tsx';
import { endGameApiCall } from '~/pages/Game/helpers/endGameApiCall.ts';
import { StartGameLoading } from '~/pages/Game/Loadings/StartGameLoading.tsx';
import { POST } from '~/shared/api';
import { userAtom } from '~/shared/atoms/user';
import { Routes } from '~/shared/routes';

import styles from './Game.module.css';

export const Game: FC = () => {
  const [user] = useAtom(userAtom);
  const [, setLocation] = useLocation();
  const [isWaiting, setIsWaiting] = useState(false);
  const [game, setGame] = useState(false);

  if (!user) {
    setLocation(Routes.Loading);
    return <></>;
  }

  const handleStopGame = () => {
    setGame(false);
  };

  if (isWaiting) {
    return <StartGameLoading />;
  }

  const startGame = async (retryCount = 1) => {
    try {
      const response = await POST('/api/profiles/logo-game/start');
      const { data } = response;

      if (data && data['start_time']) {
        setGame(true);
      } else {
        await endGameApiCall();
        if (retryCount > 0) {
          await startGame(retryCount - 1);
        }
      }
    } catch (e) {
      console.error('Failed to start the game', e);
    } finally {
      setIsWaiting(false);
    }
  };

  const handleButtonClick = async () => {
    setIsWaiting(true);
    await startGame();
  };

  if (!game) {
    return <GameStartScreen onClick={handleButtonClick} />;
  }

  return (
    <PageLayout>
      <div className={styles.base}>
        {game && (
          <GameContent stopGame={handleStopGame} startGame={startGame} />
        )}
      </div>
    </PageLayout>
  );
};
