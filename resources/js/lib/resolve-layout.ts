import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import GuestLayout from '@/layouts/GuestLayout';
import MainLayout from '@/layouts/MainLayout';

/**
 * Default persistent layout by Inertia page name.
 *
 * - Backend/Auth/* → GuestLayout (login, passwords, …)
 * - Backend/*      → AuthenticatedLayout (admin shell)
 * - Frontend/*     → MainLayout (public header/footer)
 * - Errors/*       → null (page picks Guest vs Main from props)
 *
 * Pages that need nested chrome (PageLayout / PostLayout) set
 * `Component.layout` explicitly — that overrides this default.
 */
export function resolveDefaultLayout(name: string) {
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
