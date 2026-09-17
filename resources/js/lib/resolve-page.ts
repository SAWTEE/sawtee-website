import type { ResolvedComponent } from '@inertiajs/react';

type PageModule = {
  default: ResolvedComponent;
};

/**
 * Resolve an Inertia page module, excluding colocated Vitest files so they
 * are never shipped in the production client/SSR bundles.
 *
 * @see https://vite.dev/guide/features.html#glob-import-as
 */
const pages = import.meta.glob<PageModule>([
  '../Pages/**/*.tsx',
  '!../Pages/**/*.test.tsx',
  '!../Pages/**/*.spec.tsx',
]);

/**
 * Admin pages carry a second stylesheet so the utilities only they use stay out
 * of the entry CSS every public visitor downloads. Auth screens are excluded:
 * they render on `GuestLayout` and are covered by `index.css`.
 */
function needsAdminStyles(name: string): boolean {
  return name.startsWith('Backend/') && !name.startsWith('Backend/Auth/');
}

export async function resolvePage(name: string): Promise<ResolvedComponent> {
  const path = `../Pages/${name}.tsx`;
  const loader = pages[path];

  if (!loader) {
    throw new Error(`Page not found: ${name}`);
  }

  const [module] = await Promise.all([
    loader(),
    needsAdminStyles(name) && !import.meta.env.SSR
      ? import('../../css/admin.css')
      : Promise.resolve(),
  ]);

  return module.default;
}
