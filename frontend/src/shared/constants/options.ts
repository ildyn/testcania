import { Type, Currency, Network } from '../types/types.ts';

export const typeOptions = [
  { value: 'Crypto', label: 'Crypto' },
  { value: 'Fiat', label: 'Fiat' },
];

export const currencyOptions: Record<
  Type,
  { value: Currency; label: string }[]
> = {
  Crypto: [{ value: 'USDT', label: 'USDT' }],
  Fiat: [
    { value: 'RUB', label: 'RUB' },
    { value: 'UZS', label: 'UZS' },
  ],
};

export const networkOptions: Record<
  Currency,
  { value: Network; label: string }[]
> = {
  USDT: [{ value: 'TRON', label: 'TRON' }],
  RUB: [
    { value: 'Sber', label: 'Sber' },
    { value: 'T-Bank', label: 'T-Bank' },
  ],
  UZS: [
    { value: 'Humo', label: 'Humo' },
    { value: 'Uzcard', label: 'Uzcard' },
  ],
};
