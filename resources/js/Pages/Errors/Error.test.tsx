import { render, screen } from '@testing-library/react';
import type { ComponentType, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import GuestLayout from '@/layouts/GuestLayout';
import MainLayout from '@/layouts/MainLayout';

import ErrorPage from './Error';

vi.mock('@inertiajs/react', () => ({
  Head: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children?: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  router: { reload: vi.fn(), visit: vi.fn() },
  usePage: () => ({
    props: {
      primaryMenu: [],
      footerMenu: [],
    },
  }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
    } & Record<string, unknown>) => <div {...props}>{children}</div>,
    p: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
    } & Record<string, unknown>) => <p {...props}>{children}</p>,
    nav: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
    } & Record<string, unknown>) => <nav {...props}>{children}</nav>,
  },
  useReducedMotion: () => true,
}));

vi.mock('@/layouts/MainLayout', () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

vi.mock('@/layouts/GuestLayout', () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="guest-layout">{children}</div>
  ),
}));

vi.mock('@/components/Frontend/Head', () => ({
  default: ({ title }: { title?: string }) => <title>{title}</title>,
}));

vi.mock('@/components/Frontend/SvgBackground', () => ({
  default: () => <div data-testid="svg-background" />,
}));

type ErrorPageProps = {
  status?: number;
  message?: string;
  admin?: boolean;
};

type PageWithLayout = typeof ErrorPage & {
  layout: (
    props: ErrorPageProps
  ) =>
    | ComponentType<{ children?: ReactNode }>
    | [ComponentType<{ children?: ReactNode }>, Record<string, unknown>];
};

function renderWithPageLayout(props: ErrorPageProps = {}) {
  const layoutDef = (ErrorPage as PageWithLayout).layout(props);
  const Layout = (
    Array.isArray(layoutDef) ? layoutDef[0] : layoutDef
  ) as ComponentType<{ children?: ReactNode } & Record<string, unknown>>;
  const layoutProps = Array.isArray(layoutDef) ? layoutDef[1] : {};

  return render(
    <Layout {...layoutProps}>
      <ErrorPage {...props} />
    </Layout>
  );
}

describe('ErrorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders branded 404 copy for visitors', () => {
    renderWithPageLayout({ status: 404 });

    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /page not found/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /go to homepage/i })
    ).toHaveAttribute('href', '/');
    expect(
      screen.getByRole('link', { name: /search the site/i })
    ).toHaveAttribute('href', '/search');
    expect(screen.getByRole('link', { name: /sawtee home/i })).toHaveAttribute(
      'href',
      '/'
    );
    expect(
      screen.getByText(/south asia watch on trade, economics and environment/i)
    ).toBeInTheDocument();
  });

  it('offers helpful public navigation links', () => {
    renderWithPageLayout({ status: 404 });

    expect(screen.getByRole('navigation', { name: /helpful links/i }));
    expect(
      screen.getByRole('link', { name: /^publications$/i })
    ).toHaveAttribute('href', '/category/publications');
    expect(screen.getByRole('link', { name: /^contact$/i })).toHaveAttribute(
      'href',
      '/contact'
    );
  });

  it('renders distinct copy for service unavailable', () => {
    renderWithPageLayout({ status: 503 });

    expect(
      screen.getByRole('heading', { name: /service unavailable/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/temporarily unavailable for maintenance/i)
    ).toBeInTheDocument();
  });

  it('renders admin shell for admin errors', () => {
    renderWithPageLayout({ status: 403, admin: true });

    expect(screen.getByTestId('guest-layout')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /access denied/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back to dashboard/i })
    ).toHaveAttribute('href', '/admin/dashboard');
    expect(
      screen.getByRole('link', { name: /view public site/i })
    ).toHaveAttribute('href', '/');
  });

  it('offers reload for expired sessions', () => {
    renderWithPageLayout({ status: 419 });

    expect(
      screen.getByRole('button', { name: /reload page/i })
    ).toBeInTheDocument();
  });

  it('chooses MainLayout with full-bleed class for public errors', () => {
    const layout = (ErrorPage as PageWithLayout).layout({ admin: false });

    expect(layout).toEqual([MainLayout, { className: 'px-0!' }]);
  });

  it('chooses GuestLayout for admin errors', () => {
    const layout = (ErrorPage as PageWithLayout).layout({ admin: true });

    expect(layout).toBe(GuestLayout);
  });
});
