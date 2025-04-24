import WebApp from '@twa-dev/sdk';
import { useAtom, useAtomValue } from 'jotai';
import { FC, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Route, Switch } from 'wouter';

import {
  Admin,
  Earn,
  Friends,
  MyBets,
  Loading,
  Wallet,
  Word,
  Leaderboard,
} from '~/pages';
import { Game } from '~/pages/Game/Game.tsx';
import { Routes } from '~/shared/routes';

import {
  BetError,
  ConfirmBet,
  DailyTask,
  TransactionCompleted,
  Withdraw,
  Deposit,
  GameResult,
  DepositResult,
  GameSuccess,
  GameFail,
} from './modals';
import { appearanceAtom } from './shared/atoms/appearance';
import { dailyTaskAtom } from './shared/atoms/dailyTask';

export const App: FC = () => {
  const appearance = useAtomValue(appearanceAtom);
  const [dailyTask] = useAtom(dailyTaskAtom);

  useEffect(() => {
    WebApp.expand();
    WebApp.disableVerticalSwipes();

    const onBackButtonClick = () => {
      history.back();
    };

    WebApp.BackButton.onClick(onBackButtonClick);

    return () => {
      WebApp.BackButton.offClick(onBackButtonClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-appearance', appearance);
  }, [appearance]);

  return (
    <>
      <Switch>
        <Route path={Routes.Loading}>
          <Loading />
        </Route>
        <Route path={Routes.Earn}>
          <Earn />
        </Route>
        <Route path={Routes.Friends}>
          <Friends />
        </Route>
        <Route path={Routes.MyBets}>
          <MyBets />
        </Route>
        <Route path={Routes.Leaderboard}>
          <Leaderboard />
        </Route>
        <Route path={Routes.Wallet}>
          <Wallet />
        </Route>
        <Route path={Routes.Word}>
          <Word />
        </Route>
        <Route path={Routes.Game}>
          <Game />
        </Route>
        <Route path={Routes.Admin}>
          <Admin />
        </Route>
        <Route path="/test">
          <DailyTask taskId={1} currentDay={1} />
        </Route>
      </Switch>
      {dailyTask.isOpened && (
        <DailyTask
          taskId={dailyTask.taskId}
          currentDay={dailyTask.currentDay}
        />
      )}
      <Withdraw />
      <BetError />
      <GameSuccess />
      <GameFail />
      <TransactionCompleted />
      <ConfirmBet />
      <Deposit />
      <DepositResult />
      <GameResult />
      <Toaster
        position="top-center"
        icons={{ success: '☑️' }}
        toastOptions={{ unstyled: true }}
        visibleToasts={1}
      />
    </>
  );
};
