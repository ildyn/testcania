
import { FC, useState } from 'react';
import { BottomModal } from 'react-spring-modal';
import { toast } from 'sonner';
import { useAtom } from 'jotai';

import { POST } from '~/shared/api';
import { gameAtom } from '~/shared/atoms/game';
import { modalAtom } from '~/shared/atoms/modalAtom';
import { userAtom } from '~/shared/atoms/user';
import { Button, CloseModalButton } from '~/shared/ui';

import styles from './ConfirmBet.module.css';

import tabletEmojiImg from '/tablet-emoji.png';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ConfirmBet: FC<Props> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user] = useAtom(userAtom);
  const [game] = useAtom(gameAtom);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await POST('/bet', {
        gameId: game?.id,
        amount: game?.rate,
        side: game?.side,
      });
      toast.success('Ставка сделана');
      onClose();
    } catch (err) {
      toast.error('Ошибка при ставке');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomModal isOpen={isOpen} onDismiss={onClose}>
      <div className={styles.wrapper}>
        <CloseModalButton onClick={onClose} />
        <img src={tabletEmojiImg} alt="Emoji" className={styles.image} />
        <h2>Подтвердите ставку</h2>
        <p>Вы уверены, что хотите сделать ставку?</p>
        <Button onClick={handleConfirm} loading={isSubmitting}>
          Подтвердить
        </Button>
      </div>
    </BottomModal>
  );
};
