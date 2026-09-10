import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

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

function mockDocumentScroll({
  scrollTop,
  clientHeight = 800,
}: {
  scrollTop: number;
  clientHeight?: number;
}) {
  Object.defineProperty(document.documentElement, 'scrollTop', {
    configurable: true,
    value: scrollTop,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: clientHeight,
  });
}

describe('MainLayout', () => {
  afterEach(() => {
    mockDocumentScroll({ scrollTop: 0 });
  });

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

  it('keeps the back-to-top control hidden until the page is scrolled', () => {
    mockDocumentScroll({ scrollTop: 0 });

    const { container } = render(
      <MainLayout>
        <div>Page content</div>
      </MainLayout>
    );

    const button = container.querySelector('.scroll-to-top');

    expect(button).not.toBeNull();
    expect(button).toHaveTextContent('Back to top');
    expect(button).not.toHaveClass('scroll-to-top--visible');
    expect(button).toHaveAttribute('aria-hidden', 'true');
    expect(button).toBeDisabled();
    expect(container.querySelector('.scroll-to-top__ring')).toBeNull();
    expect(container.querySelector('#progress')).toBeNull();
  });

  it('fades in the back-to-top control after scrolling', () => {
    mockDocumentScroll({ scrollTop: 0 });

    const { container } = render(
      <MainLayout>
        <div>Page content</div>
      </MainLayout>
    );

    const button = container.querySelector('.scroll-to-top');
    expect(button).not.toHaveClass('scroll-to-top--visible');

    act(() => {
      mockDocumentScroll({ scrollTop: 500 });
      fireEvent.scroll(window);
    });

    expect(button).toHaveClass('scroll-to-top--visible');
    expect(
      screen.getByRole('button', { name: 'Back to top' })
    ).toBeEnabled();
  });
});
