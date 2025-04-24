import { useAtom } from 'jotai';
import { FC, Fragment } from 'react';

import { PageLayout } from '~/layouts';
import { tasksAtom } from '~/shared/atoms/tasks';
import { Coin } from '~/shared/icons';
import { Header } from '~/shared/layout';

import styles from './Earn.module.css';
import { Task } from './Task/Task';

export const Earn: FC = () => {
  const [tasks] = useAtom(tasksAtom);

  return (
    <PageLayout>
      <div className={styles.base}>
        <Header />
        <div className={styles.title__container}>
          <Coin />
          <span className={styles.title}>Earn more WORDS</span>
        </div>

        <div className={styles.content}>
          <div className={styles.content__wrapper}>
            {Object.keys(tasks).map((group) => {
              return (
                <Fragment key={group}>
                  <p className={styles.group__title}>{group}</p>

                  {tasks[group].map((task) => {
                    return <Task key={task.id} task={task} />;
                  })}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
