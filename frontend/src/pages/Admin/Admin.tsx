import { useAtom } from 'jotai';
import { FC, useState } from 'react';
import { Redirect } from 'wouter';

import { POST } from '~/shared/api';
import { userAtom } from '~/shared/atoms/user';
import { useBackButton } from '~/shared/hooks';
import { Routes } from '~/shared/routes';
import { Icon } from '~/shared/ui';

import styles from './Admin.module.css';

export const Admin: FC = () => {
  const [user] = useAtom(userAtom);
  const [currentDate, setCurrentDate] = useState<string>();
  const [times, setTimes] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  useBackButton();

  if (!user?.is_admin) {
    return <Redirect to={Routes.Loading} />;
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(e.currentTarget.value);
  };

  const handleTimeChange = (index: number, value: string) => {
    setTimes((prev) => {
      const next = [...prev];

      next[index] = Number(value);

      return next;
    });
  };

  const handleButtonClick = () => {
    const time = [...times].map((value, index) => ({
      date: new Date(
        `${currentDate}, ${String(index).padStart(2, '0')}:00`,
      ).toISOString(),
      exchange_rate: value,
    }));

    POST('/api/admin/set-dates', { body: time });
  };

  return (
    <div className={styles.base}>
      <div className={styles.datepicker__container}>
        <div className={styles['datepicker-title__wrapper']}>
          <Icon glyph="Calendar" />
          <span className={styles['datepicker-title']}>Дата</span>
        </div>

        <input type="date" onChange={handleDateChange} />
      </div>

      <div className={styles.rows__container}>
        {Array.from({ length: 24 }).map((_, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.time}>
              {String(index).padStart(2, '0')}:00
            </div>

            <input
              className={styles.row__input}
              placeholder="..."
              onChange={(e) => handleTimeChange(index, e.currentTarget.value)}
            />
          </div>
        ))}
      </div>

      <div className={styles.button__container}>
        <button
          disabled={!currentDate}
          onClick={handleButtonClick}
          className={styles.button}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};
