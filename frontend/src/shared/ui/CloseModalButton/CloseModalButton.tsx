import clsx from 'clsx';
import { FC } from 'react';

import { Close } from '~/shared/icons/Close/Close.tsx';

import styles from './CloseModalButton.module.css';
import { CloseModalButtonProps } from './CloseModalButton.props';

export const CloseModalButton: FC<CloseModalButtonProps> = (props) => {
  const { className, onClick } = props;

  return (
    <button
      className={clsx(styles.close, className)}
      type="button"
      onClick={onClick}
    >
      <Close />
    </button>
  );
};
