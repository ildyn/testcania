import { StylesConfig } from 'react-select';

export const inputStyles: StylesConfig = {
  control: (base) => ({
    ...base,
    border: 'none',
    background: '#F8F8FA',
    fontSize: '15px',
    fontWeight: '600',
    padding: '5px 13px 9px',
  }),
  indicatorSeparator: () => ({
    width: '0',
  }),
};
