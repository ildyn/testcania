import { useAtom } from 'jotai';
import { FC } from 'react';
import { toast } from 'sonner';

import { POST } from '~/shared/api';
import { dailyTaskAtom } from '~/shared/atoms/dailyTask';
import { tasksAtom, TasksState } from '~/shared/atoms/tasks';
import { userAtom } from '~/shared/atoms/user';
import { Button, CloseModalButton } from '~/shared/ui';

import styles from './DailyTask.module.css';
import { DailyTaskProps } from './DailyTask.props';
import { Day } from './Day/Day';

import dailyImg from '/daily-image.png';

const DAILY_TASKS = [
  {
    number: 1,
    reward: 500,
  },
  {
    number: 2,
    reward: 1000,
  },
  {
    number: 3,
    reward: 2500,
  },
  {
    number: 4,
    reward: 5000,
  },
  {
    number: 5,
    reward: 15000,
  },
  {
    number: 6,
    reward: 25000,
  },
  {
    number: 7,
    reward: 100000,
  },
  {
    number: 8,
    reward: 500000,
  },
];

export const DailyTask: FC<DailyTaskProps> = (props) => {
  const { taskId, currentDay } = props;

  const [, setDailyTask] = useAtom(dailyTaskAtom);
  const [, setTasks] = useAtom(tasksAtom);
  const [, setUser] = useAtom(userAtom);

  const handleCloseClick = () => {
    setDailyTask((prev) => ({ ...prev, isOpened: false }));
  };

  const handleButtonClick = () => {
    const currentTask = DAILY_TASKS.find(({ number }) => number === currentDay);

    POST('/api/profiles/task', {
      body: { id: taskId },
    }).then((response) => {
      if (response.data) {
        setUser((prev) => {
          if (!prev) {
            return prev;
          }

          return { ...response.data };
        });
        setTasks(response.data.tasks as unknown as TasksState);

        if (currentTask) {
          toast.success(`+${currentTask.reward} WORD Coins`);
        }

        setDailyTask((prev) => ({ ...prev, isOpened: false }));
      }
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.base}>
        <CloseModalButton className={styles.close} onClick={handleCloseClick} />
        <div className={styles.image__wrapper}>
          <img className={styles.image} src={dailyImg} alt="Prize" />
        </div>

        <p className={styles.title}>Daily Reward</p>
        <p className={styles.description}>
          Get your everyday prize and press <br />
          special button for take everyday reward
        </p>

        <div className={styles.days__wrapper}>
          <div className={styles.days__container}>
            {DAILY_TASKS.slice(0, 4).map(({ number, reward }) => (
              <Day
                key={number}
                isActive={currentDay >= number}
                number={number}
                reward={reward}
                onClick={handleButtonClick}
              />
            ))}
          </div>
          <div className={styles.days__container}>
            {DAILY_TASKS.slice(4, 8).map(({ number, reward }) => (
              <Day
                key={number}
                isActive={currentDay >= number}
                number={number}
                reward={reward}
                onClick={handleButtonClick}
              />
            ))}
          </div>
        </div>

        <Button color="orange" size="m" isStretched onClick={handleButtonClick}>
          Take
        </Button>
      </div>
    </div>
  );
};
