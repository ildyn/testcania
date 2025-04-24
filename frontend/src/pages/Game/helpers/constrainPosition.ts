export const constrainPosition = (
  container: HTMLElement,
  element: HTMLElement,
  dx: number,
  dy: number,
) => {
  const maxX = container.clientWidth - element.clientWidth;
  const maxY = container.clientHeight - element.clientHeight;
  return {
    constrainedX: Math.min(Math.max(0, dx), maxX),
    constrainedY: Math.min(Math.max(0, dy), maxY),
  };
};
