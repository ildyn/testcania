import WebApp from '@twa-dev/sdk';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';

import { PageLayout } from '~/layouts';
import { GET } from '~/shared/api';
import { referalsAtom } from '~/shared/atoms/referals';
import { TG_BOT_APP_URL } from '~/shared/config';
import { Header } from '~/shared/layout';
import { Button, Icon, PageSpinner } from '~/shared/ui';

import styles from './Friends.module.css';

const formatStat = (number: number) => {
  return number < 1000
    ? number
    : (number / 1000).toFixed(2).replace('.', ',') + ' K';
};

export const Friends: FC = () => {
  const [referals, setReferals] = useAtom(referalsAtom);

  const handleInviteButtonClick = () => {
    const text = encodeURIComponent(
      'Bro, join our WORD community! Place free bets and make profits on crypto-predictions, complete tasks and get rewarded, play on USDT, make profits and withdraw your fortune!',
    );

    const url = encodeURIComponent(
      TG_BOT_APP_URL + `?startapp=${WebApp.initDataUnsafe.user?.id}`,
    );

    WebApp.openTelegramLink(`https://t.me/share/url?text=${text}&url=${url}`);
  };

  const handleCopyButtonClick = () => {
    copy(TG_BOT_APP_URL + `?startapp=${WebApp.initDataUnsafe.user?.id}`);
  };

  useEffect(() => {
    GET('/api/profiles/referral').then((response) => {
      if (response.data) {
        setReferals(response.data);
      }
    });
  }, []);

  if (!referals) {
    return (
      <PageLayout>
        <PageSpinner />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className={styles.base}>
        <Header />

        <div className={styles.content}>
          <div className={styles.stats__container}>
            <div className={styles.stats}>
              <p className={styles.stats__count}>{referals.total_users}</p>
              <p className={styles.stats__title}>Friends invited</p>
            </div>
            <div className={styles.stats}>
              <p className={styles.stats__count}>{referals.total_words}</p>
              <p className={styles.stats__title}>WORD coin</p>
            </div>
            <div className={styles.stats}>
              <p className={styles.stats__count}>{referals.total_usdt}</p>
              <p className={styles.stats__title}>USDT earned</p>
            </div>
          </div>

          <p className={styles.title}>List of your friends</p>

          <div className={styles.table__header}>
            <p className={styles.table__title}>Name</p>
            <p className={styles.table__title}>WORDS earned</p>
            <p className={styles.table__title}>USDT earned</p>
          </div>

          <div
            className={clsx(
              styles.table,
              !referals.referrals.length && styles.background,
            )}
          >
            {referals.referrals.length ? (
              referals.referrals.map((referal) => (
                <div className={styles.table__row}>
                  <div className={styles['table__row-item']}>
                    {referal.full_name}
                  </div>
                  <div className={styles['table__row-item']}>
                    <div className={styles['table__row-icon']}>
                      <Icon glyph="Word" width="100%" height="100%" />
                    </div>
                    <span>{formatStat(referal.words)}</span>
                  </div>
                  <div className={styles['table__row-item']}>
                    <div className={styles['table__row-icon']}>
                      <Icon glyph="Tether" width="100%" height="100%" />
                    </div>
                    <span>{formatStat(referal.usdt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.placeholder}>
                <p className={styles.placeholder__title}>No friends invited?</p>
                <p className={styles.placeholder__description}>Invite now!</p>
              </div>
            )}
          </div>

          <div className={styles.buttons__container}>
            <Button
              color="orange"
              onClick={handleInviteButtonClick}
              size="m"
              isStretched
              icon={<Icon glyph="Users" width="100%" height="100%" />}
            >
              Invite friends
            </Button>

            <Button
              color="orange"
              onClick={handleCopyButtonClick}
              size="m"
              isOnlyIcon
            >
              <Icon glyph="Link" />
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
