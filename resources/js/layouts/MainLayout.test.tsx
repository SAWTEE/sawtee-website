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
    <footer id="site-footer" data-testid="footer">
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

function mockFooterBounds({
  top,
  bottom,
}: {
  top: number;
  bottom: number;
}) {
  const footer = document.getElementById('site-footer');

  if (!footer) {
    throw new Error('Expected #site-footer to be rendered');
  }

  vi.spyOn(footer, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom,
    left: 0,
    right: 0,
    width: 0,
    height: bottom - top,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect);
}

describe('MainLayout', () => {
  afterEach(() => {
    mockDocumentScroll({ scrollTop: 0 });
    vi.restoreAllMocks();
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
    expect(button).not.toHaveClass('scroll-to-top--above-footer');
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
      mockFooterBounds({ top: 1200, bottom: 1800 });
      fireEvent.scroll(window);
    });

    expect(button).toHaveClass('scroll-to-top--visible');
    expect(button).not.toHaveClass('scroll-to-top--above-footer');
    expect(
      screen.getByRole('button', { name: 'Back to top' })
    ).toBeEnabled();
  });

  it('raises the back-to-top control above the footer when it is in view', () => {
    mockDocumentScroll({ scrollTop: 0 });

    const { container } = render(
      <MainLayout>
        <div>Page content</div>
      </MainLayout>
    );

    const button = container.querySelector('.scroll-to-top');

    act(() => {
      mockDocumentScroll({ scrollTop: 1400 });
      mockFooterBounds({ top: 600, bottom: 1200 });
      fireEvent.scroll(window);
    });

    expect(button).toHaveClass('scroll-to-top--visible');
    expect(button).toHaveClass('scroll-to-top--above-footer');
  });
});
