import inertia from '@inertiajs/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const pwaIconEntries = [
  '/offline.html',
  '/favicon.ico',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/assets/logo-sawtee.svg',
].map(url => ({ url, revision: `${Date.now()}` }));

export default defineConfig(({ isSsrBuild }) => ({
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
    // Staging/production on cPanel are client-only (`INERTIA_SSR_ENABLED=false`).
    inertia({
      ssr: {
        entry: 'resources/js/ssr.tsx',
        port: 13714,
        host: '127.0.0.1',
        cluster: true,
      },
    }),
    tailwindcss(),
    ...(!isSsrBuild
      ? [
          VitePWA({
            // Align with laravel-vite-plugin output under public/build.
            buildBase: '/build/',
            scope: '/',
            base: '/',
            registerType: 'prompt',
            injectRegister: false,
            // Avoid scanning all of public/ (Telescope, uploads, etc.).
            includeAssets: [],
            devOptions: {
              enabled: false,
            },
            manifest: {
              id: '/',
              name: 'South Asia Watch on Trade, Economics and Environment',
              short_name: 'SAWTEE',
              description:
                'Research, advocacy, and capacity building on trade, economics, and environment in South Asia.',
              start_url: '/',
              scope: '/',
              display: 'standalone',
              orientation: 'any',
              lang: 'en',
              background_color: '#ffffff',
              theme_color: '#006181',
              categories: ['news', 'education', 'government'],
              icons: [
                {
                  src: '/pwa-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'any',
                },
                {
                  src: '/pwa-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any',
                },
                {
                  src: '/pwa-maskable-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'maskable',
                },
              ],
            },
            workbox: {
              // App shell + static media only. Other /build/assets/* use runtime CacheFirst.
              // Avoids precaching large admin-only chunks (e.g. ContentEditor).
              globPatterns: ['**/app-*.{js,css}', '**/*.{ico,png,svg,webp,woff2}'],
              globIgnores: ['**/*.{test,spec}-*.js', '**/Error.test-*.js'],
              // Avoid Workbox's terser pass (flaky under some CI/sandbox environments).
              mode: 'development',
              navigateFallback: '/offline.html',
              navigateFallbackDenylist: [
                /^\/admin/,
                /^\/sanctum/,
                /\/login/,
              ],
              additionalManifestEntries: pwaIconEntries,
              maximumFileSizeToCacheInBytes: 3_000_000,
              runtimeCaching: [
                {
                  urlPattern: ({ request, url }) => {
                    if (request.method !== 'GET') {
                      return false;
                    }

                    if (url.pathname.startsWith('/admin')) {
                      return false;
                    }

                    if (request.headers.get('X-Inertia')) {
                      return false;
                    }

                    return url.pathname.startsWith('/build/assets/');
                  },
                  handler: 'CacheFirst',
                  options: {
                    cacheName: 'sawtee-build-assets',
                    expiration: {
                      maxEntries: 64,
                      maxAgeSeconds: 60 * 60 * 24 * 365,
                    },
                    cacheableResponse: {
                      statuses: [0, 200],
                    },
                  },
                },
                {
                  urlPattern: ({ request, url }) => {
                    if (request.method !== 'GET') {
                      return false;
                    }

                    return (
                      url.pathname.startsWith('/pwa-') ||
                      url.pathname === '/favicon.ico' ||
                      url.pathname === '/favicon.svg' ||
                      url.pathname === '/apple-touch-icon.png'
                    );
                  },
                  handler: 'CacheFirst',
                  options: {
                    cacheName: 'sawtee-pwa-icons',
                    expiration: {
                      maxEntries: 16,
                      maxAgeSeconds: 60 * 60 * 24 * 30,
                    },
                    cacheableResponse: {
                      statuses: [0, 200],
                    },
                  },
                },
              ],
            },
          }),
        ]
      : []),
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
    // Prefer the React SSR adapter package; legacy `@inertiajs/server` is unused.
    noExternal: ['laravel-vite-plugin', '@inertiajs/react'],
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
}));
