
import react from '@vitejs/plugin-react';
import path from 'path';
import pxtorem from 'postcss-pxtorem';
import { defineConfig } from 'vite';

const pxtoremPlugin = pxtorem({
  rootValue: 16,
  propList: ['*'],
  selectorBlackList: ['html'],
});

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [pxtoremPlugin],
    },
  },
});
