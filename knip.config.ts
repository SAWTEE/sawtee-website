import type { KnipConfig } from 'knip';

/**
 * Find unused frontend files, exports, and dependencies.
 *
 * Run: `npm run find-unused` (or `npx knip`)
 *
 * Notes for this Laravel + Inertia + Vite layout:
 * - `resources/js/Pages/**` are entry points (Inertia resolves them dynamically)
 *   so they are not reported as unused files, but their imports are still traced.
 * - `app.tsx` / `ssr.tsx` are Vite/Inertia entry points.
 * - PHP, public assets, vendor, and docs are out of scope.
 * - Review unused *exports* carefully; only delete high-confidence unused
 *   components after grepping for dynamic/string imports. Never delete Pages.
 */
const config: KnipConfig = {
  entry: [
    'resources/js/app.tsx',
    'resources/js/ssr.tsx',
    'resources/js/Pages/**/*.{ts,tsx}',
    'vite.config.ts',
    'vitest.config.*',
    'resources/js/**/*.{test,spec}.{ts,tsx}',
  ],
  project: ['resources/js/**/*.{ts,tsx,js,jsx}', 'vite.config.ts'],
  ignore: [
    'app/**',
    'bootstrap/**',
    'config/**',
    'database/**',
    'public/**',
    'routes/**',
    'storage/**',
    'vendor/**',
    'docs/**',
    'lang/**',
    'resources/views/**',
    'resources/css/**',
    '**/*.d.ts',
  ],
  ignoreDependencies: [
    // Used by Tailwind/Vite CSS pipeline / tooling, not always imported in JS
    'tailwindcss',
    'tailwindcss-animate',
    '@tailwindcss/forms',
    '@tailwindcss/typography',
    '@tailwindcss/vite',
    'prettier-plugin-tailwindcss',
    // Commit / lint staging tooling
    'commitizen',
    'cz-conventional-changelog',
    'lint-staged',
    'pretty-quick',
  ],
  ignoreBinaries: ['php', 'composer', 'pint'],
  paths: {
    '@/*': ['resources/js/*'],
  },
  vite: true,
};

export default config;
