import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/index.css', 'resources/js/app.jsx'],
      ssr: 'resources/js/ssr.jsx',
      refresh: true,
    }),
    react(),
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@inertiajs/react',
      // Add other dependencies you're using
    ],
  },
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
