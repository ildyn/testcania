import { ReactNode } from 'react';

export type ButtonProps = {
  children: ReactNode;
  onClick: VoidFunction;
  color: 'orange' | 'green' | 'red' | 'blue';
  size: 's' | 'm';
  isStretched?: boolean;
  isOutlined?: boolean;
  isOnlyIcon?: boolean;
  isDisabled?: boolean;
  icon?: ReactNode;
  chip?: ReactNode;
};
