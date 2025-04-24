import clsx from 'clsx';
import { FC } from 'react';

import styles from './Button.module.css';
import { ButtonProps } from './Button.props';

export const Button: FC<ButtonProps> = (props) => {
  const {
    children,
    icon,
    chip,
    color,
    isStretched,
    isOutlined,
    isDisabled,
    size,
    isOnlyIcon,
    onClick,
  } = props;

  return (
    <button
      className={clsx(styles.base, {
        [styles[`${color}`]]: color,
        [styles.stretched]: isStretched,
        [styles.outlined]: isOutlined,
        [styles[`size--${size}`]]: size,
      })}
      disabled={isDisabled}
      onClick={onClick}
    >
      {isOnlyIcon ? children : <span>{children}</span>}
      {icon && <div className={styles.icon}>{icon}</div>}
      {chip && <div className={styles.chip}>{chip}</div>}
    </button>
  );
};
