import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AuthenticatedLayout from './AuthenticatedLayout';

vi.mock('@inertiajs/react', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePage: () => ({
    url: '/admin/dashboard',
    props: {},
  }),
}));

vi.mock('@/components/shared/theme-provider', () => ({
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => null,
}));

vi.mock('@/components/Frontend/header/mode-toggle', () => ({
  ModeToggle: () => <button type="button">Theme</button>,
}));

vi.mock('@/components/Backend/app-sidebar', () => ({
  AppSidebar: () => <aside data-testid="app-sidebar">Sidebar</aside>,
}));

vi.mock('@/hooks/use-mobile', () => ({
  default: () => false,
}));

describe('AuthenticatedLayout', () => {
  it('renders the sidebar toggle trigger in the admin header', () => {
    render(
      <AuthenticatedLayout
        user={{ id: 1, name: 'Admin', email: 'a@b.c' } as any}
      >
        <div>Admin page content</div>
      </AuthenticatedLayout>
    );

    expect(
      screen.getByRole('button', { name: /toggle sidebar/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
    expect(screen.getByText('Admin page content')).toBeInTheDocument();
  });
});
