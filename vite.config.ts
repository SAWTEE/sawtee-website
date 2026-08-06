import inertia from '@inertiajs/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.tsx'],
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),
    react(),
    // Dev SSR via Vite `/__inertia_ssr` (no separate Node process).
    // Production/staging still need `npm run build:ssr` + `php artisan inertia:start-ssr`.
    inertia({
      ssr: {
        entry: 'resources/js/ssr.tsx',
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'resources/js'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@inertiajs/react'],
  },
  ssr: {
    noExternal: ['laravel-vite-plugin', '@inertiajs/server'],
  },
  server: {
    cors: {
      origin:
        /^https?:\/\/(?:(?:[^:]+\.)?localhost|sawtee\.test|127\.0\.0\.1|\[::1])(?::\d+)?$/,
    },
  },
});
