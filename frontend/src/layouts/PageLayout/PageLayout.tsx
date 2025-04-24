import { useAtom } from 'jotai';
import { FC } from 'react';
import { useLocation } from 'wouter';

import { userAtom } from '~/shared/atoms/user';
import { Routes } from '~/shared/routes';
import { Icon, Tabbar } from '~/shared/ui';

import styles from './PageLayout.module.css';
import { PageLayoutProps } from './PageLayout.props';

export const PageLayout: FC<PageLayoutProps> = (props) => {
  const { children, isTabbarVisible = true } = props;
  const [user] = useAtom(userAtom);
  const [location] = useLocation();

  return (
    <div className={styles.base}>
      <div className={styles.page}>{children}</div>
      {isTabbarVisible && (
        <div className={styles.tabbar}>
          <Tabbar>
            {!window.location.href.includes('production') && (
              <Tabbar.Item
                title="Leaderboard"
                isActive={location === Routes.Leaderboard}
                to={Routes.Leaderboard}
              >
                <Icon glyph="Chart" />
              </Tabbar.Item>
            )}
            <Tabbar.Item
              title="My bets"
              isActive={location === Routes.MyBets}
              to={Routes.MyBets}
            >
              <Icon glyph="History" />
            </Tabbar.Item>
            <Tabbar.Item
              title="Earn"
              isActive={location === Routes.Earn}
              to={Routes.Earn}
            >
              <Icon glyph="Coins" />
            </Tabbar.Item>
            <Tabbar.Item
              title="WORD"
              isActive={location === Routes.Word}
              to={Routes.Word}
            >
              <Icon glyph="Word" />
            </Tabbar.Item>
            <Tabbar.Item
              title="Friends"
              isActive={location === Routes.Friends}
              to={Routes.Friends}
            >
              <Icon glyph="Users" />
            </Tabbar.Item>
            <Tabbar.Item
              title="Wallet"
              isActive={location === Routes.Wallet}
              to={Routes.Wallet}
            >
              <Icon glyph="Wallet" />
            </Tabbar.Item>

            {user?.is_admin && (
              <Tabbar.Item title="Admin" to={Routes.Admin}>
                <Icon glyph="Users" />
              </Tabbar.Item>
            )}
          </Tabbar>
        </div>
      )}
    </div>
  );
};
