export const getRandomPosition = (
  container: HTMLElement,
  element: HTMLElement,
) => {
  const containerWidth = container.clientWidth - element.clientWidth;
  const containerHeight = container.clientHeight - element.clientHeight;
  return {
    randomX: Math.floor(Math.random() * containerWidth),
    randomY: Math.floor(Math.random() * containerHeight),
  };
};
