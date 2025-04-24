import WebApp from '@twa-dev/sdk';
import createClient from 'openapi-fetch';

import { backendBaseUrl } from '~/shared/config';

import type { paths } from './v1';

export const { GET, POST, PUT, DELETE } = createClient<paths>({
  baseUrl: backendBaseUrl,
  headers: {
    Authorization: WebApp.initData,
  },
});
