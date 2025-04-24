export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hours}h:${minutes}m:${secs}s`;
};
