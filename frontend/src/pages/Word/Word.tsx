import WebApp from '@twa-dev/sdk';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { FC, useLayoutEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { Redirect, useLocation } from 'wouter';

import { PageLayout } from '~/layouts';
import { GET } from '~/shared/api';
import { Appearance, appearanceAtom } from '~/shared/atoms/appearance';
import { gameAtom, GameType, previousGameAtom } from '~/shared/atoms/game';
import { modalAtom } from '~/shared/atoms/modalAtom';
import { userAtom } from '~/shared/atoms/user';
import { Routes } from '~/shared/routes';
import { Button, DepositButton, Icon } from '~/shared/ui';

import styles from './Word.module.css';

export const Word: FC = () => {
  const [user, setUser] = useAtom(userAtom);
  const [game, setGame] = useAtom(gameAtom);
  const [, setPreviousGame] = useAtom(previousGameAtom);
  const [appearance, setAppearance] = useAtom(appearanceAtom);
  const [, setModal] = useAtom(modalAtom);
  const [inputValue, setInputValue] = useState(0);
  const [, setLocation] = useLocation();

  useLayoutEffect(() => {
    updateAppearance(game.type);

    return () => {
      setAppearance('light');
    };
  }, []);

  if (!user) {
    return <Redirect to={Routes.Loading} />;
  }

  const balance = game.type === 'basic' ? user.balance : user.balance_usdt;
  const currency = game.type === 'basic' ? 'WORD Coins' : 'USDT';
  const isShowGameButton = game.type === 'basic' || appearance === 'light';

  const calcWinning = (value: number, choice: 'YES' | 'NO') => {
    if (value <= 0) {
      return null;
    }

    const oppositeChoice = choice === 'YES' ? 'NO' : 'YES';

    if (game.stats[game.type][oppositeChoice] === 0) {
      return null;
    }

    const winning =
      ((value + game.userBet[game.type][choice]) /
        (value + game.stats[game.type][choice])) *
      game.stats[game.type][oppositeChoice];

    return winning.toFixed(2);
  };

  const updateAppearance = (gameType: GameType) => {
    setAppearance({ basic: 'light', premium: 'dark' }[gameType] as Appearance);
  };

  const handlePartButtonClick = (value: number) => () => {
    WebApp.HapticFeedback.impactOccurred('light');
    setInputValue((prev) => Math.min(prev + value, balance));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;

    if (rawValue.length > 1 && rawValue.startsWith('0')) {
      setInputValue(Number(rawValue.slice(1)));
    } else {
      setInputValue(Number(rawValue));
    }
  };

  const handleChangeModeButtonClick = () => {
    const type = game.type === 'basic' ? 'premium' : 'basic';

    setGame((prev) => ({ ...prev, type }));
    updateAppearance(type);
  };

  const handleStartButtonClick = () => {
    setLocation(Routes.Game);
  };

  const handleBetButtonClick = (choice: 'YES' | 'NO') => () => {
    const oppositeChoice = choice === 'YES' ? 'NO' : 'YES';
    if (game.userBet[game.type][oppositeChoice] > 0) {
      setModal((prev) => ({
        ...prev,
        openedModal: 'betError',
        options: {
          type: 'opposite',
        },
      }));

      return;
    }

    setModal((prev) => ({
      ...prev,
      openedModal: 'confirmBet',
      options: {
        amount: inputValue,
        currency: game.type === 'basic' ? 'WORDS' : 'USDT',
        choice,
        game_id: game.gameId,
      },
    }));
  };

  const handleInputBlur = () => {
    if (inputValue > balance) {
      setInputValue(balance);
    }
  };

  const handleCountdownComplete = () => {
    GET('/api/profiles/init').then(({ data }) => {
      if (data) {
        setUser(data);

        if (data.next_game) {
          const nextGame = data.next_game;

          setGame((prev) => ({
            ...prev,
            nextGame: new Date(nextGame.date),
            gameId: nextGame.id,
            course: nextGame.course,
            stats: {
              ...prev.stats,
              basic: {
                YES: nextGame.stats.WORDS.YES.total_rate,
                NO: nextGame.stats.WORDS.NO.total_rate,
              },
              premium: {
                YES: nextGame.stats.USDT.YES.total_rate,
                NO: nextGame.stats.USDT.NO.total_rate,
              },
            },
          }));
        }

        if (data.previous_game_results) {
          setPreviousGame((prev) => ({
            ...prev,
            winning: {
              basic: data.previous_game_results.WORDS,
              premium: data.previous_game_results.USDT,
            },
          }));

          if (
            data.previous_game_results.WORDS ||
            data.previous_game_results.USDT
          ) {
            setModal((prev) => ({
              ...prev,
              openedModal: 'gameResult',
              options: {
                type: data.previous_game_results.WORDS ? 'basic' : 'premium',
              },
            }));
          }
        }
      }
    });
  };

  return (
    <PageLayout>
      <div className={styles.base}>
        <div className={styles.title__container}>
          <p className={styles.title}>
            BTC price higher than <br />
            {game.course}
            <br />
            USDT in the next 10 minutes
          </p>
          <p className={styles.description}>
            Current price: {user.current_token_price}
          </p>
        </div>
        <div className={styles.content}>
          <div className={styles.content__wrapper}>
            <div className={styles.clock__wrapper}>
              <div className={styles.clock__container}>
                <div
                  className={clsx(
                    styles.clock__icon,
                    game.type === 'premium' && styles.yellow,
                  )}
                >
                  <Icon glyph="Alarm" width="100%" height="100%" />
                </div>
                <span
                  className={clsx(
                    styles.clock__title,
                    game.type === 'premium' && styles.yellow,
                  )}
                >
                  Timer
                </span>
              </div>

              <Countdown
                autoStart
                date={new Date(game.nextGame)}
                renderer={({ formatted: { hours, minutes, seconds } }) => (
                  <div
                    className={clsx(
                      styles.clock__value,
                      game.type === 'premium' && styles.yellow,
                    )}
                  >
                    {hours}h:{minutes}m:{seconds}s
                  </div>
                )}
                onComplete={handleCountdownComplete}
              />
            </div>

            <div
              className={clsx(
                styles.balance__container,
                game.type === 'premium' && styles.yellow,
              )}
            >
              <span className={styles.balance__title}>BALANCE</span>
              <span className={styles.balance__value}>
                {balance} {currency}{' '}
                {game.type === 'premium' && (
                  <DepositButton className={styles.yellow} />
                )}
              </span>
            </div>

            <div className={styles['bet-buttons__container']}>
              {game.type === 'basic' ? (
                <>
                  <div
                    className={styles['bet-button']}
                    onClick={handlePartButtonClick(1)}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 56 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="28" cy="28" r="28" fill="#F9E160" />
                      <g filter="url(#filter0_i_346_751)">
                        <circle
                          cx="27.9997"
                          cy="28"
                          r="23.2542"
                          fill="#FE881C"
                          fillOpacity="0.72"
                        />
                      </g>
                      <g filter="url(#filter1_d_346_751)">
                        <path
                          d="M27.08 35V25.32H23.44V23.08H24.04C25.94 23.08 27.1 22.08 27.24 20.58H30.02V35H27.08Z"
                          fill="#FFEA7C"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_i_346_751"
                          x="4.74548"
                          y="4.74577"
                          width="46.5084"
                          height="47.2203"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feMorphology
                            radius="0.711864"
                            operator="erode"
                            in="SourceAlpha"
                            result="effect1_innerShadow_346_751"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="shape"
                            result="effect1_innerShadow_346_751"
                          />
                        </filter>
                        <filter
                          id="filter1_d_346_751"
                          x="23.4399"
                          y="20.58"
                          width="6.58008"
                          height="15.1319"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_346_751"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_346_751"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className={styles['bet-button']}
                    onClick={handlePartButtonClick(10)}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 57 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="28.75" cy="28" r="28" fill="#F9E160" />
                      <g filter="url(#filter0_i_346_756)">
                        <circle
                          cx="28.7497"
                          cy="28"
                          r="23.2542"
                          fill="#FE881C"
                          fillOpacity="0.72"
                        />
                      </g>
                      <g filter="url(#filter1_d_346_756)">
                        <path
                          d="M21.83 35V25.32H18.19V23.08H18.79C20.69 23.08 21.85 22.08 21.99 20.58H24.77V35H21.83ZM32.6586 35.14C29.2386 35.14 27.1986 32.32 27.1986 27.74C27.1986 23.02 29.3986 20.4 32.7186 20.4C36.1186 20.4 38.1386 23.22 38.1386 27.78C38.1386 32.54 35.9386 35.14 32.6586 35.14ZM32.6786 32.66C34.1586 32.66 35.2186 31.56 35.2186 27.76C35.2186 23.96 34.1586 22.88 32.6786 22.88C31.1786 22.88 30.1386 23.96 30.1386 27.76C30.1386 31.56 31.1786 32.66 32.6786 32.66Z"
                          fill="#FFEA7C"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_i_346_756"
                          x="5.49548"
                          y="4.74577"
                          width="46.5085"
                          height="47.2203"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feMorphology
                            radius="0.711864"
                            operator="erode"
                            in="SourceAlpha"
                            result="effect1_innerShadow_346_756"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="shape"
                            result="effect1_innerShadow_346_756"
                          />
                        </filter>
                        <filter
                          id="filter1_d_346_756"
                          x="18.1899"
                          y="20.4"
                          width="19.9486"
                          height="15.4519"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_346_756"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_346_756"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className={styles['bet-button']}
                    onClick={handlePartButtonClick(100)}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 57 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="28.5" cy="28" r="28" fill="#F9E160" />
                      <g filter="url(#filter0_i_346_761)">
                        <circle
                          cx="28.4997"
                          cy="28"
                          r="23.2542"
                          fill="#FE881C"
                          fillOpacity="0.72"
                        />
                      </g>
                      <g filter="url(#filter1_d_346_761)">
                        <path
                          d="M17.9915 20.1989V34.7443H14.9162V23.1179H14.831L11.5 25.206V22.4787L15.1009 20.1989H17.9915Z"
                          fill="#FFEA7C"
                        />
                        <path
                          d="M26.6516 35.0639C25.43 35.0592 24.3789 34.7585 23.4982 34.1619C22.6223 33.5653 21.9476 32.7012 21.4741 31.5696C21.0053 30.438 20.7733 29.0767 20.7781 27.4858C20.7781 25.8996 21.0124 24.5478 21.4812 23.4304C21.9547 22.313 22.6294 21.4631 23.5053 20.8807C24.386 20.2936 25.4348 20 26.6516 20C27.8685 20 28.9149 20.2936 29.7908 20.8807C30.6715 21.4678 31.3486 22.3201 31.8221 23.4375C32.2956 24.5502 32.5299 25.8996 32.5252 27.4858C32.5252 29.0814 32.2885 30.4451 31.815 31.5767C31.3462 32.7083 30.6739 33.5724 29.7979 34.169C28.922 34.7656 27.8732 35.0639 26.6516 35.0639ZM26.6516 32.5142C27.485 32.5142 28.1502 32.0952 28.6474 31.2571C29.1445 30.419 29.3907 29.1619 29.386 27.4858C29.386 26.3826 29.2724 25.464 29.0451 24.7301C28.8226 23.9962 28.5053 23.4446 28.0934 23.0753C27.6862 22.706 27.2056 22.5213 26.6516 22.5213C25.823 22.5213 25.1602 22.9356 24.663 23.7642C24.1658 24.5928 23.9149 25.8333 23.9102 27.4858C23.9102 28.6032 24.0214 29.536 24.244 30.2841C24.4712 31.0275 24.7908 31.5862 25.2028 31.9602C25.6147 32.3295 26.0977 32.5142 26.6516 32.5142Z"
                          fill="#FFEA7C"
                        />
                        <path
                          d="M39.9212 35.0639C38.6996 35.0592 37.6484 34.7585 36.7678 34.1619C35.8918 33.5653 35.2171 32.7012 34.7436 31.5696C34.2749 30.438 34.0429 29.0767 34.0476 27.4858C34.0476 25.8996 34.282 24.5478 34.7507 23.4304C35.2242 22.313 35.8989 21.4631 36.7749 20.8807C37.6555 20.2936 38.7043 20 39.9212 20C41.138 20 42.1844 20.2936 43.0604 20.8807C43.9411 21.4678 44.6181 22.3201 45.0916 23.4375C45.5651 24.5502 45.7995 25.8996 45.7947 27.4858C45.7947 29.0814 45.558 30.4451 45.0845 31.5767C44.6158 32.7083 43.9434 33.5724 43.0675 34.169C42.1915 34.7656 41.1428 35.0639 39.9212 35.0639ZM39.9212 32.5142C40.7545 32.5142 41.4197 32.0952 41.9169 31.2571C42.4141 30.419 42.6603 29.1619 42.6555 27.4858C42.6555 26.3826 42.5419 25.464 42.3146 24.7301C42.0921 23.9962 41.7749 23.4446 41.3629 23.0753C40.9557 22.706 40.4751 22.5213 39.9212 22.5213C39.0926 22.5213 38.4297 22.9356 37.9325 23.7642C37.4354 24.5928 37.1844 25.8333 37.1797 27.4858C37.1797 28.6032 37.291 29.536 37.5135 30.2841C37.7408 31.0275 38.0604 31.5862 38.4723 31.9602C38.8842 32.3295 39.3672 32.5142 39.9212 32.5142Z"
                          fill="#FFEA7C"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_i_346_761"
                          x="5.24542"
                          y="4.74577"
                          width="46.5085"
                          height="47.2203"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feMorphology
                            radius="0.711864"
                            operator="erode"
                            in="SourceAlpha"
                            result="effect1_innerShadow_346_761"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="shape"
                            result="effect1_innerShadow_346_761"
                          />
                        </filter>
                        <filter
                          id="filter1_d_346_761"
                          x="11.5"
                          y="20"
                          width="34.2948"
                          height="15.7758"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_346_761"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_346_761"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className={styles['bet-button']}
                    onClick={handlePartButtonClick(1000)}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 57 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="28.25" cy="28" r="28" fill="#F9E160" />
                      <g filter="url(#filter0_i_346_771)">
                        <circle
                          cx="28.2497"
                          cy="28"
                          r="23.2542"
                          fill="#FE881C"
                          fillOpacity="0.72"
                        />
                      </g>
                      <g filter="url(#filter1_d_346_771)">
                        <path
                          d="M23.7415 21V35.5455H20.6662V23.919H20.581L17.25 26.0071V23.2798L20.8509 21H23.7415Z"
                          fill="#FFEA7C"
                        />
                        <path
                          d="M26.7837 35.5455V21H29.859V27.4134H30.0508L35.2852 21H38.9712L33.5735 27.5128L39.0352 35.5455H35.3562L31.3718 29.5653L29.859 31.4119V35.5455H26.7837Z"
                          fill="#FFEA7C"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_i_346_771"
                          x="4.99542"
                          y="4.74577"
                          width="46.5085"
                          height="47.2203"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feMorphology
                            radius="0.711864"
                            operator="erode"
                            in="SourceAlpha"
                            result="effect1_innerShadow_346_771"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="shape"
                            result="effect1_innerShadow_346_771"
                          />
                        </filter>
                        <filter
                          id="filter1_d_346_771"
                          x="17.25"
                          y="21"
                          width="21.7852"
                          height="15.2573"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_346_771"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_346_771"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className={styles['bet-button']}
                    onClick={handlePartButtonClick(5000)}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 56 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="28" cy="28" r="28" fill="#F9E160" />
                      <g filter="url(#filter0_i_349_996)">
                        <circle
                          cx="27.9997"
                          cy="28"
                          r="23.2542"
                          fill="#FE881C"
                          fillOpacity="0.72"
                        />
                      </g>
                      <g filter="url(#filter1_d_349_996)">
                        <path
                          d="M21.2 34.18C18.04 34.18 16 32.34 15.94 29.62H18.92C18.96 30.82 19.86 31.62 21.22 31.62C22.7 31.62 23.6 30.62 23.6 29.22C23.6 27.74 22.68 26.74 21.2 26.74C20.06 26.74 19.32 27.32 19.02 28.12H16.22L16.6 19.58H25.72V22.14H19.2L19.06 25.16L19.18 25.2C19.72 24.66 20.76 24.3 21.84 24.3C24.78 24.3 26.58 26.32 26.58 29.14C26.58 32.16 24.52 34.18 21.2 34.18ZM40.94 34H37.5L32.32 26.76V34H29.3V19.72H32.32V26.64L37.44 19.72H40.66L35.46 26.58L40.94 34Z"
                          fill="#FFEA7C"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_i_349_996"
                          x="4.74542"
                          y="4.74577"
                          width="46.5085"
                          height="47.2203"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feMorphology
                            radius="0.711864"
                            operator="erode"
                            in="SourceAlpha"
                            result="effect1_innerShadow_349_996"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="shape"
                            result="effect1_innerShadow_349_996"
                          />
                        </filter>
                        <filter
                          id="filter1_d_349_996"
                          x="15.94"
                          y="19.58"
                          width="25"
                          height="15.3119"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_349_996"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_349_996"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={styles['bet-button']}
                    onClick={handlePartButtonClick(1)}
                  >
                    <svg
                      width="100%"
                      height="56"
                      viewBox="0 0 56 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="28" cy="28" r="28" fill="#28A497" />
                      <g filter="url(#filter0_i_346_779)">
                        <circle
                          cx="27.9997"
                          cy="28"
                          r="23.2542"
                          fill="#50AF95"
                        />
                      </g>
                      <g filter="url(#filter1_d_346_779)">
                        <path
                          d="M27.08 35V25.32H23.44V23.08H24.04C25.94 23.08 27.1 22.08 27.24 20.58H30.02V35H27.08Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_i_346_779"
                          x="4.74542"
                          y="4.74576"
                          width="46.5085"
                          height="47.2203"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feMorphology
                            radius="0.711864"
                            operator="erode"
                            in="SourceAlpha"
                            result="effect1_innerShadow_346_779"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="shape"
                            result="effect1_innerShadow_346_779"
                          />
                        </filter>
                        <filter
                          id="filter1_d_346_779"
                          x="23.44"
                          y="20.58"
                          width="6.58002"
                          height="15.1319"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_346_779"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_346_779"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className={styles['bet-button']}
                    onClick={handlePartButtonClick(10)}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 56 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="28" cy="28" r="28" fill="#28A497" />
                      <g filter="url(#filter0_i_349_1164)">
                        <circle
                          cx="27.9997"
                          cy="28"
                          r="23.2542"
                          fill="#50AF95"
                        />
                      </g>
                      <g filter="url(#filter1_d_349_1164)">
                        <path
                          d="M21.08 34V24.32H17.44V22.08H18.04C19.94 22.08 21.1 21.08 21.24 19.58H24.02V34H21.08ZM31.9086 34.14C28.4886 34.14 26.4486 31.32 26.4486 26.74C26.4486 22.02 28.6486 19.4 31.9686 19.4C35.3686 19.4 37.3886 22.22 37.3886 26.78C37.3886 31.54 35.1886 34.14 31.9086 34.14ZM31.9286 31.66C33.4086 31.66 34.4686 30.56 34.4686 26.76C34.4686 22.96 33.4086 21.88 31.9286 21.88C30.4286 21.88 29.3886 22.96 29.3886 26.76C29.3886 30.56 30.4286 31.66 31.9286 31.66Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_i_349_1164"
                          x="4.74542"
                          y="4.74576"
                          width="46.5085"
                          height="47.2203"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feMorphology
                            radius="0.711864"
                            operator="erode"
                            in="SourceAlpha"
                            result="effect1_innerShadow_349_1164"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="shape"
                            result="effect1_innerShadow_349_1164"
                          />
                        </filter>
                        <filter
                          id="filter1_d_349_1164"
                          x="17.44"
                          y="19.4"
                          width="19.9486"
                          height="15.4519"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_349_1164"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_349_1164"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className={styles['bet-button']}
                    onClick={handlePartButtonClick(100)}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 56 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="28" cy="28" r="28" fill="#28A497" />
                      <g filter="url(#filter0_i_349_1170)">
                        <circle
                          cx="27.9997"
                          cy="28"
                          r="23.2542"
                          fill="#50AF95"
                        />
                      </g>
                      <g filter="url(#filter1_d_349_1170)">
                        <path
                          d="M15.08 34V24.32H11.44V22.08H12.04C13.94 22.08 15.1 21.08 15.24 19.58H18.02V34H15.08ZM25.9086 34.14C22.4886 34.14 20.4486 31.32 20.4486 26.74C20.4486 22.02 22.6486 19.4 25.9686 19.4C29.3686 19.4 31.3886 22.22 31.3886 26.78C31.3886 31.54 29.1886 34.14 25.9086 34.14ZM25.9286 31.66C27.4086 31.66 28.4686 30.56 28.4686 26.76C28.4686 22.96 27.4086 21.88 25.9286 21.88C24.4286 21.88 23.3886 22.96 23.3886 26.76C23.3886 30.56 24.4286 31.66 25.9286 31.66ZM38.1156 34.14C34.6956 34.14 32.6556 31.32 32.6556 26.74C32.6556 22.02 34.8556 19.4 38.1756 19.4C41.5756 19.4 43.5956 22.22 43.5956 26.78C43.5956 31.54 41.3956 34.14 38.1156 34.14ZM38.1356 31.66C39.6156 31.66 40.6756 30.56 40.6756 26.76C40.6756 22.96 39.6156 21.88 38.1356 21.88C36.6356 21.88 35.5956 22.96 35.5956 26.76C35.5956 30.56 36.6356 31.66 38.1356 31.66Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_i_349_1170"
                          x="4.74542"
                          y="4.74576"
                          width="46.5085"
                          height="47.2203"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feMorphology
                            radius="0.711864"
                            operator="erode"
                            in="SourceAlpha"
                            result="effect1_innerShadow_349_1170"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="shape"
                            result="effect1_innerShadow_349_1170"
                          />
                        </filter>
                        <filter
                          id="filter1_d_349_1170"
                          x="11.44"
                          y="19.4"
                          width="32.1556"
                          height="15.4519"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_349_1170"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_349_1170"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className={styles['bet-button']}
                    onClick={handlePartButtonClick(1000)}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 56 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="28" cy="28" r="28" fill="#28A497" />
                      <g filter="url(#filter0_i_349_1176)">
                        <circle
                          cx="27.9997"
                          cy="28"
                          r="23.2542"
                          fill="#50AF95"
                        />
                      </g>
                      <g filter="url(#filter1_d_349_1176)">
                        <path
                          d="M21.08 34V24.32H17.44V22.08H18.04C19.94 22.08 21.1 21.08 21.24 19.58H24.02V34H21.08ZM39.2486 34H35.8086L30.6286 26.76V34H27.6086V19.72H30.6286V26.64L35.7486 19.72H38.9686L33.7686 26.58L39.2486 34Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_i_349_1176"
                          x="4.74542"
                          y="4.74576"
                          width="46.5085"
                          height="47.2203"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feMorphology
                            radius="0.711864"
                            operator="erode"
                            in="SourceAlpha"
                            result="effect1_innerShadow_349_1176"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="shape"
                            result="effect1_innerShadow_349_1176"
                          />
                        </filter>
                        <filter
                          id="filter1_d_349_1176"
                          x="17.44"
                          y="19.58"
                          width="21.8086"
                          height="15.1319"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="0.711864" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_349_1176"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_349_1176"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                </>
              )}
            </div>

            <div className={styles.input__container}>
              <div className={styles['input-title__container']}>
                <p className={styles.input__title}>Your bet</p>
              </div>

              <input
                className={styles.input}
                type="number"
                min={0}
                value={String(inputValue)}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
            </div>

            <div className={styles.stats__container}>
              <p className={styles.stats__title}>Total bets</p>
              <div className={styles.progress__wrapper}>
                <div className={styles.progress}>
                  <div
                    className={clsx(styles.progress__bar, styles.green)}
                    style={{
                      width: `${(game.stats[game.type].YES / game.stats[game.type].NO) * 100}%`,
                    }}
                  ></div>
                  <div className={clsx(styles.progress__bar, styles.red)} />
                </div>
                <div className={styles.values__wrapper}>
                  <span className={clsx(styles.stats__value, styles.green)}>
                    {game.stats[game.type].YES} {currency}
                  </span>
                  <span className={clsx(styles.stats__value, styles.red)}>
                    {game.stats[game.type].NO} {currency}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.buttons__container}>
              <Button
                color="green"
                size="m"
                chip={calcWinning(inputValue, 'YES')}
                onClick={handleBetButtonClick('YES')}
                isDisabled={inputValue <= 0}
                isStretched
              >
                Yes
              </Button>
              <Button
                color="red"
                size="m"
                chip={calcWinning(inputValue, 'NO')}
                onClick={handleBetButtonClick('NO')}
                isDisabled={inputValue <= 0}
                isStretched
              >
                No
              </Button>
            </div>

            <div className={styles['button--premium']}>
              <Button
                color="blue"
                size="m"
                onClick={handleChangeModeButtonClick}
                isStretched
              >
                Play on {game.type === 'basic' ? 'USDT' : 'WORD Coins'}
              </Button>
              {isShowGameButton && (
                <button
                  onClick={handleStartButtonClick}
                  className={styles['button--game']}
                >
                  <Icon glyph="GameButton" />
                  Game
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
