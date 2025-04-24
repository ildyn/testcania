import { FC } from 'react';
import Lottie from 'react-lottie';

import { PageLayout } from '~/layouts';

import logoLottieJson from '../logo.json';
import styles from './Loading.module.css';

export const StartGameLoading: FC = () => {
  return (
    <PageLayout>
      <div className={styles.base}>
        <div className={styles.content}>
          <div className={styles.title__container}>
            <span className={styles.title}>Please wait a moment</span>
            <span className={styles.subtitle}>
              Disconnecting the halves to get you started...
            </span>
          </div>
          <div className={styles['spinner__container']}>
            <div className={styles.spinner}>
              <Lottie options={{ animationData: logoLottieJson }} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
