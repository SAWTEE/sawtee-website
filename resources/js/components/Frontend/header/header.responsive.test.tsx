import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Header from './header';

vi.mock('@inertiajs/react', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePage: () => ({
    url: '/',
    props: { experts: [] },
  }),
}));

vi.mock('./mode-toggle', () => ({
  ModeToggle: () => <div data-testid="mode-toggle" />,
}));

vi.mock('./searchModal', () => ({
  default: () => <div data-testid="search-modal" />,
}));

vi.mock('./DesktopNavigation', () => ({
  default: ({ menu }: { menu: Array<{ title: string }> }) => (
    <nav data-testid="desktop-navigation">
      {menu.map(item => (
        <span key={item.title}>{item.title}</span>
      ))}
    </nav>
  ),
}));

function stubMatchMedia(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

describe('Header responsiveness', () => {
  afterEach(() => {
    stubMatchMedia(false);
  });

  it('does not mount desktop navigation on small viewports', () => {
    stubMatchMedia(false);

    render(
      <Header menu={[{ id: 1, title: 'About', url: '/about', children: [] }]} />
    );

    expect(screen.queryByText('About')).not.toBeInTheDocument();
    expect(screen.queryByTestId('desktop-navigation')).not.toBeInTheDocument();
  });

  it('exposes a mobile menu toggle on small viewports because desktop nav is not mounted', () => {
    stubMatchMedia(false);
    render(
      <Header menu={[]} showMobileMenu={false} setShowMobileMenu={vi.fn()} />
    );

    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle.parentElement?.className).toMatch(/lg:hidden/);
    const mobileThemeToggle = screen
      .getAllByTestId('mode-toggle')
      .find(el => el.parentElement === toggle.parentElement);
    expect(mobileThemeToggle).toBeTruthy();
  });

  it('does not render the mobile menu toggle on large viewports', async () => {
    stubMatchMedia(true);
    render(
      <Header
        menu={[{ id: 1, title: 'About', url: '/about', children: [] }]}
        showMobileMenu={false}
        setShowMobileMenu={vi.fn()}
      />
    );

    expect(
      screen.queryByRole('button', { name: /open menu/i })
    ).not.toBeInTheDocument();
    expect(await screen.findByTestId('desktop-navigation')).toBeInTheDocument();
  });

  it('loads a compact header logo after the LCP image', () => {
    render(<Header menu={[]} />);

    const logo = screen.getByAltText('SAWTEE');

    expect(logo).toHaveAttribute('src', '/assets/logo-sawtee-header.webp');
    expect(logo).toHaveAttribute('fetchpriority', 'low');
  });

  it('keeps the header overflow visible so desktop dropdowns are not clipped', () => {
    const { container } = render(<Header menu={[]} />);
    const header = container.querySelector('header');
    expect(header?.className).toMatch(/overflow-visible/);
  });
});
