import { fireEvent, render, screen } from '@testing-library/react';
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

  it('uses MultiLevelMenu for parents with children', () => {
    render(<DesktopNavigation menu={publicationsMenu} />);

    expect(
      screen.getByRole('button', { name: /publications/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /publications/i })
    ).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('supports nested multilevel trees via MultiLevelMenu', () => {
    render(<DesktopNavigation menu={nestedPublicationsMenu} />);

    const trigger = screen.getByRole('button', { name: /publications/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded');
  });

  it('renders plain links for items without children', () => {
    render(
      <DesktopNavigation
        menu={[
          {
            id: 10,
            title: 'Events',
            name: 'Events',
            url: '/category/events',
            children: [],
          },
        ]}
      />
    );

    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute(
      'href',
      '/category/events'
    );
  });

  it('applies the same top-level typography to links, mega, and multilevel triggers', () => {
    render(
      <DesktopNavigation
        menu={[
          {
            id: 10,
            title: 'Home',
            name: 'Home',
            url: '/',
            children: [],
          },
          {
            id: 20,
            title: 'Our Work',
            name: 'Our Work',
            url: '/our-work',
            children: [
              {
                id: 21,
                title: 'Trade',
                name: 'Trade',
                url: '/our-work/trade',
                children: [],
              },
            ],
          },
          ...publicationsMenu,
        ]}
      />
    );

    const home = screen.getByRole('link', { name: 'Home' });
    const ourWorkTrigger = screen
      .getByRole('link', { name: /our work/i })
      .querySelector('[data-slot="navigation-menu-trigger"]');
    const publications = screen.getByRole('button', { name: /publications/i });

    expect(ourWorkTrigger).toBeTruthy();

    for (const el of [home, ourWorkTrigger!, publications]) {
      expect(el.className).toMatch(/text-sm/);
      expect(el.className).toMatch(/font-medium/);
      expect(el.className).toMatch(/tracking-normal/);
    }
  });

  it('closes multilevel menu when pointer moves to another top-level item', () => {
    render(
      <DesktopNavigation
        menu={[
          ...publicationsMenu,
          {
            id: 10,
            title: 'About',
            name: 'About',
            url: '/about',
            children: [],
          },
        ]}
      />
    );

    const publications = screen.getByRole('button', { name: /publications/i });
    fireEvent.pointerEnter(publications);
    expect(publications).toHaveAttribute('aria-expanded', 'true');

    fireEvent.pointerEnter(screen.getByRole('link', { name: 'About' }));
    expect(publications).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes multilevel menu when pointer moves to a mega-menu item', () => {
    render(
      <DesktopNavigation
        menu={[
          ...publicationsMenu,
          {
            id: 20,
            title: 'Our Work',
            name: 'Our Work',
            url: '/our-work',
            children: [
              {
                id: 21,
                title: 'Trade',
                name: 'Trade',
                url: '/our-work/trade',
                children: [],
              },
            ],
          },
        ]}
      />
    );

    const publications = screen.getByRole('button', { name: /publications/i });
    fireEvent.pointerEnter(publications);
    expect(publications).toHaveAttribute('aria-expanded', 'true');

    fireEvent.pointerEnter(screen.getByRole('link', { name: /our work/i }));
    expect(publications).toHaveAttribute('aria-expanded', 'false');
  });

  it('clears Publications open styles when pointer moves to a sibling', () => {
    render(
      <DesktopNavigation
        menu={[
          ...publicationsMenu,
          {
            id: 10,
            title: 'About',
            name: 'About',
            url: '/about',
            children: [],
          },
        ]}
      />
    );

    const publications = screen.getByRole('button', { name: /publications/i });
    fireEvent.pointerEnter(publications);
    expect(publications).toHaveAttribute('aria-expanded', 'true');
    expect(publications.className).toMatch(/bg-accent\/50/);

    fireEvent.pointerEnter(screen.getByRole('link', { name: 'About' }));
    expect(publications).toHaveAttribute('aria-expanded', 'false');
    expect(publications.className).not.toMatch(/bg-accent\/50/);
    expect(document.activeElement).not.toBe(publications);
  });
});
