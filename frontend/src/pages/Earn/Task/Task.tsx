import WebApp from '@twa-dev/sdk';
import { useAtom } from 'jotai';
import { FC } from 'react';

import { POST } from '~/shared/api';
import { dailyTaskAtom } from '~/shared/atoms/dailyTask';
import { tasksAtom, TasksState } from '~/shared/atoms/tasks';
import { userAtom } from '~/shared/atoms/user';
import { Icon } from '~/shared/ui';

import styles from './Task.module.css';
import { TaskProps } from './Task.props';

export const Task: FC<TaskProps> = (props) => {
  const { task } = props;
  const [, setDailyTask] = useAtom(dailyTaskAtom);
  const [, setTasks] = useAtom(tasksAtom);
  const [user, setUser] = useAtom(userAtom);

  const updateProfileTasks = () => {
    POST('/api/profiles/task', {
      body: { id: task.id },
    }).then((response) => {
      if (response.data) {
        setUser((prev) => {
          if (!prev) {
            return prev;
          }

          return { ...response.data };
        });
        setTasks(response.data.tasks as unknown as TasksState);
      }
    });
  };

  const handleClick = () => {
    if (task.status !== 'waiting') {
      return;
    }

    switch (task.type) {
      case 'channel':
        WebApp.openTelegramLink(task.channel);

        setTimeout(() => {
          updateProfileTasks();
        }, 5000);

        break;

      case 'daily':
        setDailyTask((prev) => ({
          ...prev,
          currentDay: user?.daily_task_day ?? 1,
          isOpened: true,
          taskId: task.id,
        }));

        break;

      case 'link':
        WebApp.openLink(task.link);

        updateProfileTasks();

        break;
    }
  };

  return (
    <div className={styles.base} key={task.id} onClick={handleClick}>
      <div className={styles.data__wrapper}>
        <img className={styles.icon} src={task.icon} alt="" />
        <div>
          <p className={styles.title}>{task.title}</p>
          <div className={styles.reward__wrapper}>
            <div className={styles.currency__icon}>
              <Icon glyph="Word" width="100%" height="100%" />
            </div>
            <p className={styles.reward}>+{task.value}</p>
          </div>
        </div>
      </div>

      <Icon glyph={task.status === 'done' ? 'Check' : 'ArrowRight'} />
    </div>
  );
};
