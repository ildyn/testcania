import WebApp from '@twa-dev/sdk';
import { useEffect } from 'react';

export const useBackButton = () => {
  useEffect(() => {
    WebApp.BackButton.show();

    return () => {
      WebApp.BackButton.hide();
    };
  }, []);
};
