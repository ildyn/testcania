import { FC } from 'react';

import styles from './TableItem.module.css';
import { TableItemProps } from './TableItem.props';

import userAvatarDefault from '/user-avatar.svg';

export const TableItem: FC<TableItemProps> = (props) => {
  const { avatar, name, points, place } = props;

  return (
    <div className={styles.base}>
      <div className={styles.data}>
        <div className={styles.avatar__wrapper}>
          <img
            className={styles.avatar}
            src={avatar || userAvatarDefault}
            alt=""
          />
          <div className={styles.place}>{place}</div>
        </div>
        <p className={styles.name}>{name}</p>
      </div>

      <div className={styles.points}>{points}</div>
    </div>
  );
};
