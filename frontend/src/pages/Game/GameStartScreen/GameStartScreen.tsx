import styles from '~/pages/Game/Game.module.css';
import { GameLogo } from '~/shared/icons/Game/Game.tsx';
import { Button } from '~/shared/ui';

export const GameStartScreen = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={styles.content}>
      <div className={styles.title__container}>
        <span className={styles.title}>Play a mini game</span>
        <span className={styles.subtitle}>
          Manage to connect the two parts of the logo before they leave the
          screen and get a prize
        </span>
      </div>

      <div className={styles.game}>
        <div className={styles.game_image}>
          <GameLogo />
          <div className={styles.logo_right}>
            <GameLogo />
          </div>
        </div>
        <div className={styles.line}></div>
      </div>
      <div className={styles.button__container}>
        <Button color="red" size="m" onClick={onClick} isStretched>
          Play
        </Button>
      </div>
    </div>
  );
};
