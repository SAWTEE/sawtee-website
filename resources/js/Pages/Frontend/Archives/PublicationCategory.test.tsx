import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { FrontendPublicationCategoryProps } from '@/types';

import PublicationCategory from './PublicationCategory';

vi.mock('@inertiajs/react', () => ({
  Head: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/Frontend/Head', () => ({
  default: () => null,
}));

vi.mock('@/components/Frontend/Pagination', () => ({
  default: () => <div data-testid="pagination" />,
}));

vi.mock('@/components/Frontend/subscriptionCard', () => ({
  default: () => <div data-testid="subscription-card" />,
}));

vi.mock('@/components/Frontend/sidebarWidget', () => ({
  default: ({ title }: { title?: string }) => (
    <div data-testid="sidebar-widget">{title}</div>
  ),
}));

vi.mock('@/lib/page-layouts', () => ({
  mainWithPageLayout: () => () => null,
}));

const props = {
  category: {
    id: 1,
    name: 'Books',
    slug: 'books',
    meta_title: null,
    meta_description: null,
  },
  publications: {
    data: [
      {
        id: 1,
        title: 'Trade and industrial policy environment in Nepal',
        file: { name: 'trade-policy.pdf' },
        media: [{ original_url: '/covers/one.webp' }],
      },
      {
        id: 2,
        title: 'Road to Cancun',
        file: { name: 'cancun.pdf' },
        media: [{ original_url: '/covers/two.webp' }],
      },
    ],
    links: [],
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null,
  },
  infocus: [
    {
      id: 9,
      title: 'In focus item',
      slug: 'in-focus-item',
      published_at: '2026-07-30T00:00:00.000Z',
      category: { id: 2, name: 'In Focus', slug: 'in-focus' },
    },
  ],
  sawteeInMedia: null,
  featured_image: null,
  showSubscriptionBox: false,
  seo: null,
} as unknown as FrontendPublicationCategoryProps;

describe('PublicationCategory', () => {
  it('matches the publications archive sidebar order with subscription last', () => {
    const { container } = render(
      <PublicationCategory {...props} showSubscriptionBox />
    );

    const aside = container.querySelector('aside.sidebar');
    expect(aside).not.toBeNull();
    expect(aside).toHaveClass('sticky', 'top-32', 'self-start');

    const children = [...(aside?.children ?? [])];
    expect(children).toHaveLength(2);
    expect(children[0]).toHaveAttribute('data-testid', 'sidebar-widget');
    expect(children[0]).toHaveTextContent('Infocus');
    expect(
      children[1]?.querySelector('[data-testid="subscription-card"]')
    ).not.toBeNull();
  });

  it('uses a responsive publication grid from one to four columns', () => {
    render(<PublicationCategory {...props} />);

    const grid = screen.getByTestId('publication-grid');
    expect(grid).toHaveClass(
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      '2xl:grid-cols-4'
    );
    expect(
      screen.getByText('Trade and industrial policy environment in Nepal')
    ).toBeInTheDocument();
    expect(screen.getByText('Road to Cancun')).toBeInTheDocument();
  });
});
