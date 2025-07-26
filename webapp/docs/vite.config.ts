import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { PATH_BASE, PORT_DEV_DOCS } from '../frontend/src/constants/constants';

export default defineConfig({
  base: PATH_BASE + '/docs',
  server: {
    port: PORT_DEV_DOCS,
  },
  plugins: [react()],
});
