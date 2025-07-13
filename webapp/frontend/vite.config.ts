import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { PORT_DEV } from './src/constants/constants';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: PORT_DEV,
  },
  define: {
    // Define project type at build time
    __PROJECT_TYPE__: JSON.stringify('webapp'),
  },
  resolve: {
    alias: {
      '@lib/ui': path.resolve(__dirname, './node_modules/ui-kit/lib/ui'),
      '@lib/utils': path.resolve(__dirname, './node_modules/ui-kit/lib/utils'),
      '@lib/codegen': path.resolve(__dirname, './node_modules/ui-kit/lib/codegen'),
      // Force resolve styled-components to a single instance to avoid multiple instances warning
      'styled-components': path.resolve(__dirname, 'node_modules/styled-components'),
    },
  },
});
