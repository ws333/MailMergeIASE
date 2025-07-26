import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { PATH_BASE, PORT_DEV_WEBAPP } from './src/constants/constants';

// https://vite.dev/config/
export default defineConfig({
  base: PATH_BASE,
  plugins: [react()],
  server: {
    port: PORT_DEV_WEBAPP,
    fs: {
      allow: [path.resolve(__dirname)],
    },
  },
  resolve: {
    alias: {
      '@lib/ui': path.resolve(__dirname, './node_modules/ui-kit/lib/ui'),
      '@lib/utils': path.resolve(__dirname, './node_modules/ui-kit/lib/utils'),
      '@lib/codegen': path.resolve(__dirname, './node_modules/ui-kit/lib/codegen'),
    },
  },
  build: {
    chunkSizeWarningLimit: 2048,
  },
});
