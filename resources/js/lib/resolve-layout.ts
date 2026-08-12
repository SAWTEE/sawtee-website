import type { ComponentType, ReactNode } from 'react';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import GuestLayout from '@/layouts/GuestLayout';
import MainLayout from '@/layouts/MainLayout';

/** Matches Inertia's LayoutComponent (`children` required). */
type LayoutComponent = ComponentType<{ children: ReactNode }>;

/**
 * Default persistent layout by Inertia page name.
 *
 * Layouts are eagerly imported. Lazy layouts + root `<Suspense fallback={null}>`
 * leave the tree suspended until the chunk loads, which delays Inertia's
 * `swap()` resolution and can stall deferred-prop reloads on first paint.
 * Page components remain code-split via `resolvePage` / import.meta.glob.
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
