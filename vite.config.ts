import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@service': path.resolve(__dirname, './src/lib/services'),
      '@utils': path.resolve(__dirname, './src/lib/utils'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
});
