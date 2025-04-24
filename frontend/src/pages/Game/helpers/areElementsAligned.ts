import { errorPercentage } from '~/shared/config';

export const areElementsAligned = (
  position1: { dx: number; dy: number },
  position2: { dx: number; dy: number },
  containerWidth: number,
  containerHeight: number,
) => {
  const distanceX = Math.abs(position1.dx - position2.dx - 99);
  const distanceY = Math.abs(position1.dy - position2.dy);

  const maxDistanceX = containerWidth;
  const maxDistanceY = containerHeight;

  const percentageX = (distanceX / maxDistanceX) * 100;
  const percentageY = (distanceY / maxDistanceY) * 100;

  return percentageX <= errorPercentage && percentageY <= errorPercentage;
};
