import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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

describe('Header responsiveness', () => {
  it('exposes a mobile menu toggle that is hidden on large screens via lg:hidden', () => {
    render(
      <Header
        menu={[]}
        showMobileMenu={false}
        setShowMobileMenu={vi.fn()}
      />
    );

    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle.parentElement?.className).toMatch(/lg:hidden/);
  });

  it('keeps the header overflow visible so desktop dropdowns are not clipped', () => {
    const { container } = render(<Header menu={[]} />);
    const header = container.querySelector('header');
    expect(header?.className).toMatch(/overflow-visible/);
  });
});
