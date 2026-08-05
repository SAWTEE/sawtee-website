import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  router: { reload: vi.fn() },
  usePage: () => ({
    props: {
      primaryMenu: [],
      footerMenu: [],
    },
  }),
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

describe('ErrorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders branded 404 copy for visitors', () => {
    render(<ErrorPage status={404} />);

    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to homepage/i })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it('renders admin shell for admin errors', () => {
    render(<ErrorPage status={403} admin />);

    expect(screen.getByTestId('guest-layout')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /access denied/i })).toBeInTheDocument();
  });

  it('offers reload for expired sessions', () => {
    render(<ErrorPage status={419} />);

    expect(
      screen.getByRole('button', { name: /reload page/i })
    ).toBeInTheDocument();
  });
});
