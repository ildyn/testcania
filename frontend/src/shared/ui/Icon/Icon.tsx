import { FC } from 'react';

import * as icons from '~/shared/icons';

import { IconProps } from './Icon.props';

export const Icon: FC<IconProps> = (props) => {
  const { glyph, height, width } = props;
  const Component = icons[glyph];

  return <Component width={width} height={height} />;
};
