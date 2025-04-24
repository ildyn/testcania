import { POST } from '~/shared/api';

export type EndGameDataType =
  | {
      end_time: string;
      words_reward: number;
    }
  | undefined;

export const endGameApiCall = async () => {
  try {
    const response = await POST('/api/profiles/logo-game/end');
    return response.data satisfies EndGameDataType;
  } catch (error) {
    console.error('Failed to end the game', error);
    return;
  }
};
