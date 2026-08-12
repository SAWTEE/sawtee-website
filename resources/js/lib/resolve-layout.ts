import { lazy, type ComponentType, type ReactNode } from 'react';

const GuestLayout = lazy(() => import('@/layouts/GuestLayout'));
const AuthenticatedLayout = lazy(() => import('@/layouts/AuthenticatedLayout'));
const MainLayout = lazy(() => import('@/layouts/MainLayout'));

type LayoutComponent = ComponentType<{ children?: ReactNode }>;

/**
 * Default persistent layout by Inertia page name.
 *
 * Layouts are lazy-loaded so the public home page does not download the admin shell.
 *
 * - Backend/Auth/* → GuestLayout (login, passwords, …)
 * - Backend/*      → AuthenticatedLayout (admin shell)
 * - Frontend/*     → MainLayout (public header/footer)
 * - Errors/*       → null (page picks Guest vs Main from props)
 *
 * Pages that need nested chrome (PageLayout / PostLayout) set
 * `Component.layout` explicitly — that overrides this default.
 */
export function resolveDefaultLayout(name: string): LayoutComponent | null {
  if (name.startsWith('Backend/Auth/')) {
    return GuestLayout;
  }

  if (name.startsWith('Backend/')) {
    return AuthenticatedLayout;
  }

  if (name.startsWith('Frontend/')) {
    return MainLayout;
  }

  return null;
}
