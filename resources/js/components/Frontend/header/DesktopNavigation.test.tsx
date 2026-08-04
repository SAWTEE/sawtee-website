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

/** Nested tree: Publications → Publications in Nepali → Nepali Briefing Paper */
const nestedPublicationsMenu: MenuItem[] = [
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
        title: 'Publications in Nepali',
        name: 'Publications in Nepali',
        url: '/category/publications/publication-in-nepali',
        parent_id: 1,
        order: 2,
        children: [
          {
            id: 4,
            title: 'Nepali Briefing Paper',
            name: 'Nepali Briefing Paper',
            url: '/category/publications/publications-in-nepali/nepali-briefing-paper',
            parent_id: 3,
            order: 1,
            children: [],
          },
        ],
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

    const submenu =
      container.querySelector('.dropdown > .dropdown-menu') ??
      container.querySelector('.dropdown-menu');
    expect(submenu).toBeTruthy();
    // Hover bridge: padding (not margin) so the pointer can travel into the panel
    expect(submenu?.className).toMatch(/\bpt-/);
    expect(submenu?.className).not.toMatch(/\bmt-/);
  });

  it('scopes nested submenus so ancestor hover does not open grandchildren', () => {
    const { container } = render(
      <DesktopNavigation menu={nestedPublicationsMenu} />
    );

    const rootDropdown = container.querySelector('.dropdown');
    expect(rootDropdown).toBeTruthy();

    // Direct child submenu of the top-level Publications item
    const topMenu = rootDropdown?.querySelector(':scope > .dropdown-menu');
    expect(topMenu).toBeTruthy();
    expect(topMenu?.classList.contains('hidden')).toBe(true);
    // Must NOT use cascading named-group hover (opens every nested level)
    expect(topMenu?.className).not.toMatch(/group-hover\/dropdown/);
    expect(topMenu?.className).not.toMatch(/group-focus-within\/dropdown/);

    // Nested parent (Publications in Nepali) is itself a .dropdown
    const nestedParents = Array.from(
      topMenu?.querySelectorAll(':scope .dropdown') ?? []
    );
    expect(nestedParents.length).toBeGreaterThanOrEqual(1);

    const nestedParent = nestedParents.find(el =>
      el.textContent?.includes('Publications in Nepali')
    );
    expect(nestedParent).toBeTruthy();

    // Nested submenu must be a *direct* child of its own .dropdown trigger
    const nestedMenu = nestedParent?.querySelector(':scope > .dropdown-menu');
    expect(nestedMenu).toBeTruthy();
    expect(nestedMenu?.classList.contains('hidden')).toBe(true);
    expect(nestedMenu?.className).not.toMatch(/group-hover\/dropdown/);
    expect(nestedMenu?.textContent).toContain('Nepali Briefing Paper');

    // Top-level open must not imply nested open: both stay `hidden` in markup;
    // CSS `.dropdown:hover > .dropdown-menu` reveals only the direct child.
    expect(topMenu).not.toBe(nestedMenu);
  });
});
