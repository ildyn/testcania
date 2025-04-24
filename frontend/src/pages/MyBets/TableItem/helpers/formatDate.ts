export const formatDate = (date: Date | string | number) => {
  return new Date(date)
    .toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/,/g, '');
};
