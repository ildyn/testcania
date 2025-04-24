import clsx from 'clsx';
import { useAtom } from 'jotai';
import { FC } from 'react';

import { modalAtom } from '~/shared/atoms/modalAtom';
import { Plus } from '~/shared/icons';

import styles from './DepositButton.module.css';
import { DepositButtonProps } from './DepositButton.props';

export const DepositButton: FC<DepositButtonProps> = (props) => {
  const { className } = props;
  const [, setModal] = useAtom(modalAtom);

  const handleAddButtonClick = () => {
    setModal((prev) => ({ ...prev, openedModal: 'deposit', options: null }));
  };

  return (
    <button
      className={clsx(styles.button, className)}
      type="button"
      onClick={handleAddButtonClick}
    >
      <Plus />
    </button>
  );
};
