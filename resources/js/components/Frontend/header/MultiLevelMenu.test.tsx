import { forwardRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { MenuItem } from '@/types';
import MultiLevelMenu, { isExternalUrl } from './MultiLevelMenu';

vi.mock('@inertiajs/react', () => ({
  Link: forwardRef<HTMLAnchorElement, any>(function MockLink(
    { href, children, ...props },
    ref
  ) {
    return (
      <a ref={ref} href={href} {...props}>
        {children}
      </a>
    );
  }),
}));

const publicationsItem: MenuItem = {
  id: 1,
  title: 'Publications',
  name: 'Publications',
  url: '/category/publications',
  children: [
    {
      id: 2,
      title: 'Trade Insight',
      name: 'Trade Insight',
      url: '/category/publications/trade-insight',
      children: [],
    },
    {
      id: 3,
      title: 'Publications in Nepali',
      name: 'Publications in Nepali',
      url: '/category/publications/publication-in-nepali',
      children: [
        {
          id: 4,
          title: 'Nepali Briefing Paper',
          name: 'Nepali Briefing Paper',
          url: '/category/publications/publications-in-nepali/nepali-briefing-paper',
          children: [],
        },
      ],
    },
  ],
};

describe('isExternalUrl', () => {
  it('detects http(s) and protocol-relative URLs', () => {
    expect(isExternalUrl('https://example.com')).toBe(true);
    expect(isExternalUrl('http://example.com')).toBe(true);
    expect(isExternalUrl('//cdn.example.com/x')).toBe(true);
  });

  it('treats site paths as internal', () => {
    expect(isExternalUrl('/category/publications')).toBe(false);
    expect(isExternalUrl('category/publications')).toBe(false);
  });
});

describe('MultiLevelMenu', () => {
  it('renders a trigger from the parent item title', () => {
    render(<MultiLevelMenu item={publicationsItem} openOnHover={false} />);
    expect(
      screen.getByRole('button', { name: /publications/i })
    ).toBeInTheDocument();
  });

  it('opens nested items for arbitrary menu trees', () => {
    render(
      <MultiLevelMenu item={publicationsItem} openOnHover={false} defaultOpen />
    );

    const menu = screen.getByRole('menu');
    const parent = within(menu).getByRole('menuitem', { name: 'Publications' });
    expect(parent).toHaveAttribute('href', '/category/publications');

    const tradeInsight = within(menu).getByRole('menuitem', {
      name: 'Trade Insight',
    });
    expect(tradeInsight).toHaveAttribute(
      'href',
      '/category/publications/trade-insight'
    );

    const nestedTrigger = within(menu).getByRole('menuitem', {
      name: 'Publications in Nepali',
    });
    expect(nestedTrigger).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('exposes nested submenu triggers for branch nodes', () => {
    render(
      <MultiLevelMenu item={publicationsItem} openOnHover={false} defaultOpen />
    );

    expect(
      screen.getByRole('menuitem', { name: 'Publications in Nepali' })
    ).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('renders external URLs as anchors with target blank', () => {
    render(
      <MultiLevelMenu
        openOnHover={false}
        defaultOpen
        item={{
          title: 'Resources',
          url: '/resources',
          children: [
            {
              title: 'External Report',
              url: 'https://example.com/report',
            },
          ],
        }}
      />
    );

    const external = screen.getByRole('menuitem', { name: 'External Report' });
    expect(external).toHaveAttribute('href', 'https://example.com/report');
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <MultiLevelMenu
        item={publicationsItem}
        open={false}
        onOpenChange={onOpenChange}
        openOnHover={false}
      />
    );

    const trigger = screen.getByRole('button', { name: /publications/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <MultiLevelMenu
        item={publicationsItem}
        open
        onOpenChange={onOpenChange}
        openOnHover={false}
      />
    );
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('clears open styles and blurs trigger when forced closed', () => {
    const { rerender } = render(
      <MultiLevelMenu
        item={publicationsItem}
        open
        onOpenChange={() => {}}
        openOnHover={false}
      />
    );

    const trigger = screen.getByRole('button', { name: /publications/i });
    trigger.focus();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger.className).toMatch(/bg-accent\/50/);

    rerender(
      <MultiLevelMenu
        item={publicationsItem}
        open={false}
        onOpenChange={() => {}}
        openOnHover={false}
      />
    );

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger.className).not.toMatch(/bg-accent\/50/);
    expect(document.activeElement).not.toBe(trigger);
  });
});
