import { atom } from 'jotai';

type Modal =
  | 'withdraw'
  | 'betError'
  | 'transactionCompleted'
  | 'deposit'
  | 'gameSuccess'
  | 'gameFail';

type ModalState =
  | {
      openedModal: Modal | null;
      options: null;
    }
  | {
      openedModal: 'betError';
      options: {
        type: 'opposite' | 'timeout';
      };
    }
  | {
      openedModal: 'confirmBet';
      options: {
        amount: number;
        currency: 'WORDS' | 'USDT';
        choice: 'YES' | 'NO';
        game_id: number;
      };
    }
  | {
      openedModal: 'gameResult';
      options: {
        type: 'basic' | 'premium';
      };
    }
  | {
      openedModal: 'gameSuccess';
      options: {
        stopGame: () => void;
        restartGame: () => void;
        coins: number;
      };
    }
  | {
      openedModal: 'gameFail';
      options: {
        stopGame: () => void;
        restartGame: () => void;
        coins: number;
      };
    }
  | {
      openedModal: 'depositResult';
      options: {
        success: boolean;
      };
    };

export const modalAtom = atom<ModalState>({
  openedModal: null,
  options: null,
});
