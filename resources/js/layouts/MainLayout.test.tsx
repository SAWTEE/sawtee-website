import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import MainLayout from './MainLayout';

vi.mock('@inertiajs/react', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePage: () => ({
    url: '/',
    props: {
      primaryMenu: undefined,
      footerMenu: undefined,
    },
  }),
}));

vi.mock('@/components/shared/theme-provider', () => ({
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock('@/components/Frontend/header/header', () => ({
  default: ({ menu }: any) => (
    <header data-testid="header">
      menu:{Array.isArray(menu) ? menu.length : 'missing'}
    </header>
  ),
}));

vi.mock('@/components/Frontend/footer/footer', () => ({
  default: ({ menu }: any) => (
    <footer data-testid="footer">
      menu:{Array.isArray(menu) ? menu.length : 'missing'}
    </footer>
  ),
}));

vi.mock('@/components/Frontend/header/searchModal', () => ({
  default: () => <div data-testid="search-modal" />,
}));

vi.mock('@/components/Frontend/mobileMenu', () => ({
  default: () => <div data-testid="mobile-menu" />,
}));

describe('MainLayout', () => {
  it('renders with empty menus without crashing', () => {
    render(
      <MainLayout>
        <div>Page content</div>
      </MainLayout>
    );

    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toHaveTextContent('menu:0');
    expect(screen.getByTestId('footer')).toHaveTextContent('menu:0');
  });

  it('renders a floating go-to-top control with progress ring from page load', () => {
    const { container } = render(
      <MainLayout>
        <div>Page content</div>
      </MainLayout>
    );

    const button = screen.getByRole('button', {
      name: /scroll to top\. reading progress/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('scroll-to-top');
    expect(button).not.toHaveClass('opacity-0');
    expect(container.querySelector('.scroll-to-top__track')).not.toBeNull();
    expect(container.querySelector('.scroll-to-top__ring')).not.toBeNull();
    expect(container.querySelector('.scroll-to-top__face')).not.toBeNull();
  });
});
