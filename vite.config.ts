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
      // Use Herd TLS certs so the Vite origin matches https://sawtee.test:5173
      detectTls: 'sawtee.test',
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
    // Prebundle cobe (and framer-motion) so lazy MegaMenu → globe chunks
    // do not hit a missing / broken /node_modules/.vite/deps/cobe.js URL.
    include: [
      'react',
      'react-dom',
      '@inertiajs/react',
      'cobe',
      'framer-motion',
    ],
  },
  ssr: {
    noExternal: ['laravel-vite-plugin', '@inertiajs/server'],
  },
  server: {
    // Allow the Herd site host when the browser requests the Vite origin.
    allowedHosts: ['sawtee.test', '.test'],
    cors: {
      origin:
        /^https?:\/\/(?:(?:[^:]+\.)?localhost|sawtee\.test|127\.0\.0\.1|\[::1])(?::\d+)?$/,
    },
    hmr: {
      host: 'sawtee.test',
    },
  },
});
