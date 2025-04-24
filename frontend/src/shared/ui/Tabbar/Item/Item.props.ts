import { ReactNode } from 'react';

import { Routes } from '~/shared/routes';

export type ItemProps = {
  title: string;
  children?: ReactNode;
  isActive?: boolean;
  to?: Routes;
};
