export const backendBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (location.href.includes('production')
    ? 'https://current-tma-go-invest-backend-production.jago.agency'
    : 'https://current-tma-go-invest-backend-staging.jago.agency');

export const errorPercentage = import.meta.env.VITE_ERROR_PERCENTAGE || 10;
