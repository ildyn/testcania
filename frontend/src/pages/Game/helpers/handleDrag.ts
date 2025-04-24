import React from 'react';

import { constrainPosition } from '~/pages/Game/helpers/constrainPosition.ts';

export const handleDrag =
  (
    eleRef: React.RefObject<HTMLDivElement>,
    position: { dx: number; dy: number },
    setPosition: React.Dispatch<
      React.SetStateAction<{ dx: number; dy: number }>
    >,
    containerSelector: string,
  ) =>
  (e: React.MouseEvent | React.TouchEvent) => {
    const container = document.querySelector(containerSelector) as HTMLElement;
    const element = eleRef.current;
    if (!container || !element) return;

    const startPos = {
      x:
        'clientX' in e
          ? e.clientX - position.dx
          : e.touches[0].clientX - position.dx,
      y:
        'clientY' in e
          ? e.clientY - position.dy
          : e.touches[0].clientY - position.dy,
    };

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const dx =
        'clientX' in moveEvent
          ? moveEvent.clientX - startPos.x
          : moveEvent.touches[0].clientX - startPos.x;
      const dy =
        'clientY' in moveEvent
          ? moveEvent.clientY - startPos.y
          : moveEvent.touches[0].clientY - startPos.y;

      const { constrainedX, constrainedY } = constrainPosition(
        container,
        element,
        dx,
        dy,
      );
      element.style.transform = `translate(${constrainedX}px, ${constrainedY}px)`;
      setPosition({ dx: constrainedX, dy: constrainedY });
    };

    const handleEnd = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  };
