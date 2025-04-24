import clsx from 'clsx';
import { FC } from 'react';
import { useLocation } from 'wouter';

import styles from './Item.module.css';
import { ItemProps } from './Item.props';

export const Item: FC<ItemProps> = (props) => {
  const { title, children, isActive, to } = props;
  const [location, setLocation] = useLocation();

  const handleClick = () => {
    setLocation(to ?? location);
  };

  return (
    <div
      className={clsx(styles.wrapper, {
        [styles.active]: isActive,
      })}
      onClick={handleClick}
    >
      <div className={styles.base}>
        <div>{children}</div>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
};
