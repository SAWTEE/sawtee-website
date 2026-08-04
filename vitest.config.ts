import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'resources/js'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./resources/js/test/setup.ts'],
    include: ['resources/js/**/*.{test,spec}.{ts,tsx}'],
  },
});
