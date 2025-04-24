import { FC } from 'react';

import { Spinner } from '../Spinner/Spinner';
import styles from './PageSpinner.module.css';

export const PageSpinner: FC = () => {
  return (
    <div className={styles.base}>
      <Spinner />
    </div>
  );
};
