import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/app.jsx',
      ssr: 'resources/js/ssr.jsx',
      refresh: true,
    }),
    react(),
  ],
  ssr: {
    noExternal: ['laravel-vite-plugin', '@inertiajs/server'],
  },
  server: {
    cors: {
      origin:
        /^https?:\/\/(?:(?:[^:]+\.)?localhost|sawtee\.test|127\.0\.0\.1|\[::1\])(?::\d+)?$/,
    },
  },
});
