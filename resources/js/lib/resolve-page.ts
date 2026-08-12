import type { ComponentType, ReactNode } from 'react';

type PageModule = {
  default: ComponentType<Record<string, unknown>> & {
    layout?:
      | ((page: ReactNode) => ReactNode)
      | ComponentType<{ children?: ReactNode }>;
  };
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

export async function resolvePage(
  name: string,
): Promise<PageModule['default']> {
  const path = `../Pages/${name}.tsx`;
  const loader = pages[path];

  if (!loader) {
    throw new Error(`Page not found: ${name}`);
  }

  const module = await loader();

  return module.default;
}
