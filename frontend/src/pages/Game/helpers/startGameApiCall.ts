import { endGameApiCall } from '~/pages/Game/helpers/endGameApiCall.ts';
import { POST } from '~/shared/api';

const startGameApiCall = async (
  setIsWaiting: (value: boolean) => void,
  setGame: (value: boolean) => void,
  retryCount = 1,
) => {
  try {
    const response = await POST('/api/profiles/logo-game/start');
    const { data } = response;

    if (data && data['start_time']) {
      setGame(true);
    } else {
      await endGameApiCall();
      if (retryCount > 0) {
        await startGameApiCall(setIsWaiting, setGame, retryCount - 1);
      }
    }
  } catch (e) {
    console.error('Failed to start the game', e);
  } finally {
    setIsWaiting(false);
  }
};
