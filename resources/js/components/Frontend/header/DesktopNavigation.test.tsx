import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MenuItem } from '@/types';
import DesktopNavigation from './DesktopNavigation';

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

const publicationsMenu: MenuItem[] = [
  {
    id: 1,
    title: 'Publications',
    name: 'Publications',
    url: '/category/publications',
    parent_id: null,
    order: 1,
    children: [
      {
        id: 2,
        title: 'Trade Insight',
        name: 'Trade Insight',
        url: '/category/publications/trade-insight',
        parent_id: 1,
        order: 1,
        children: [],
      },
      {
        id: 3,
        title: 'Policy Brief',
        name: 'Policy Brief',
        url: '/category/publications/policy-brief',
        parent_id: 1,
        order: 2,
        children: [],
      },
    ],
  },
];

describe('DesktopNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not crash with an empty menu', () => {
    const { container } = render(<DesktopNavigation menu={[]} />);
    expect(container.querySelector('nav') || container.firstChild).toBeTruthy();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('defaults menu to an empty list when omitted', () => {
    expect(() => render(<DesktopNavigation />)).not.toThrow();
  });

  it('renders a hoverable dropdown submenu for parents with children', () => {
    const { container } = render(
      <DesktopNavigation menu={publicationsMenu} />
    );

    expect(screen.getByText('Publications')).toBeInTheDocument();
    expect(screen.getByText('Trade Insight')).toBeInTheDocument();
    expect(screen.getByText('Policy Brief')).toBeInTheDocument();

    const dropdownRoot = container.querySelector('.dropdown');
    expect(dropdownRoot).toBeTruthy();

    const submenu = container.querySelector('.dropdown-menu');
    expect(submenu).toBeTruthy();
    // Tailwind v4: `hidden` must be overridable via group-hover/focus-within
    expect(submenu?.className).toMatch(/group-hover[/:]/);
    expect(submenu?.className).toMatch(/group-focus-within[/:]/);
  });
});
