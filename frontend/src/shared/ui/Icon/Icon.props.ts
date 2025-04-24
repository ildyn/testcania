import * as icons from '~/shared/icons';

export type IconProps = {
  glyph: keyof typeof icons;
  width?: number | string;
  height?: number | string;
};
