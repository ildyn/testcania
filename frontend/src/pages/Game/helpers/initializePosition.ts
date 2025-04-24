import { Dispatch, RefObject, SetStateAction } from 'react';

import { getRandomPosition } from '~/pages/Game/helpers/getRandomPosition.ts';

export const initializePosition = (
  containerSelector: string,
  ref: RefObject<HTMLDivElement>,
  setPosition: Dispatch<SetStateAction<{ dx: number; dy: number }>>,
) => {
  const container = document.querySelector(containerSelector) as HTMLElement;
  if (container && ref.current) {
    const { randomX, randomY } = getRandomPosition(container, ref.current);
    ref.current.style.transform = `translate(${randomX}px, ${randomY}px)`;
    setPosition({ dx: randomX, dy: randomY });
  }
};
