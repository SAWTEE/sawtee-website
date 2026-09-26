import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { FrontendCategoryProps } from '@/types';

import Category from './Category';

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

vi.mock('@/components/Frontend/SubstackFeedWidget', () => ({
  default: () => <div data-testid="substack-feed" />,
}));

vi.mock('@/components/Frontend/NewsletterCallout', () => ({
  SubscribeForm: () => <div data-testid="subscribe-form" />,
}));

vi.mock('./Archives/NewsletterArchive', () => ({
  default: () => <div data-testid="newsletter-archive" />,
}));

vi.mock('./Archives/CovidArchive', () => ({
  default: () => <div data-testid="covid-archive" />,
}));

vi.mock('./Archives/DefaultArchive', () => ({
  default: () => <div data-testid="default-archive" />,
}));

vi.mock('./Archives/LDCArchive', () => ({
  default: () => <div data-testid="ldc-archive" />,
}));

vi.mock('./Archives/EventsArchive', () => ({
  default: () => <div data-testid="events-archive" />,
}));

vi.mock('@/lib/page-layouts', () => ({
  mainWithPageLayout: () => () => null,
}));

const baseProps = {
  category: {
    id: 1,
    name: 'Newsletters',
    slug: 'newsletters',
    meta_title: null,
    meta_description: null,
  },
  posts: {
    data: [],
    links: [],
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null,
  },
  infocus: [
    {
      id: 2,
      title: 'In focus',
      slug: 'in-focus',
      published_at: '2026-07-30T00:00:00.000Z',
      category: { id: 3, name: 'In Focus', slug: 'in-focus' },
    },
  ],
  events: [
    {
      id: 4,
      title: 'Featured event',
      slug: 'featured-event',
      published_at: '2026-04-01T00:00:00.000Z',
      category: { id: 5, name: 'Featured Events', slug: 'featured-events' },
    },
  ],
  sawteeInMedia: [
    {
      id: 6,
      title: 'Media item',
      slug: 'media-item',
      published_at: '2026-03-01T00:00:00.000Z',
      category: { id: 7, name: 'SAWTEE in Media', slug: 'sawtee-in-media' },
    },
  ],
  substackFeed: [],
  featured_image: null,
  seo: null,
} as unknown as FrontendCategoryProps;

describe('Category newsletters layout', () => {
  it('keeps the subscribe CTA outside the sticky sidebar grid', () => {
    const { container } = render(<Category {...baseProps} />);

    const aside = container.querySelector('aside.sidebar');
    const cta = screen.getByTestId('newsletter-subscribe-cta');
    const grid = aside?.parentElement;

    expect(aside).toHaveClass('sticky', 'top-32', 'self-start');
    expect(grid).not.toBeNull();
    expect(grid?.contains(cta)).toBe(false);
    expect(
      (aside as Node).compareDocumentPosition(cta) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.getByTestId('subscribe-form')).toBeInTheDocument();
    expect(screen.getByTestId('newsletter-archive')).toBeInTheDocument();
  });

  it('keeps only featured events beside the substack feed on newsletters', () => {
    render(<Category {...baseProps} />);

    expect(screen.getByTestId('substack-feed')).toBeInTheDocument();
    expect(screen.getByText('Featured Events')).toBeInTheDocument();
    expect(screen.queryByText('Sawtee in Media')).not.toBeInTheDocument();
    expect(screen.queryByText('In Focus')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('sidebar-widget')).toHaveLength(1);
  });

  it('keeps featured events and in focus on opinion in lead', () => {
    render(
      <Category
        {...baseProps}
        category={{
          ...baseProps.category,
          id: 8,
          name: 'Opinion in Lead',
          slug: 'opinion-in-lead',
        }}
      />
    );

    expect(screen.getByText('Featured Events')).toBeInTheDocument();
    expect(screen.getByText('In Focus')).toBeInTheDocument();
    expect(screen.queryByText('Sawtee in Media')).not.toBeInTheDocument();
    expect(screen.getByTestId('subscription-card')).toBeInTheDocument();
    expect(screen.getAllByTestId('sidebar-widget')).toHaveLength(2);
    expect(
      screen.queryByTestId('newsletter-subscribe-cta')
    ).not.toBeInTheDocument();
  });

  it('keeps featured events and in focus on LDC interest', () => {
    render(
      <Category
        {...baseProps}
        category={{
          ...baseProps.category,
          id: 11,
          name: 'LDCs Interests',
          slug: 'ldcs-interests',
        }}
      />
    );

    expect(screen.getByTestId('ldc-archive')).toBeInTheDocument();
    expect(screen.getByTestId('subscription-card')).toBeInTheDocument();
    expect(screen.getByText('Featured Events')).toBeInTheDocument();
    expect(screen.getByText('In Focus')).toBeInTheDocument();
    expect(screen.queryByText('Sawtee in Media')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('sidebar-widget')).toHaveLength(2);
  });

  it('uses featured events in place of the current category on media and in focus', () => {
    const { unmount } = render(
      <Category
        {...baseProps}
        category={{
          ...baseProps.category,
          id: 12,
          name: 'SAWTEE in Media',
          slug: 'sawtee-in-media',
        }}
      />
    );

    expect(screen.getByText('Featured Events')).toBeInTheDocument();
    expect(screen.getByText('In Focus')).toBeInTheDocument();
    expect(screen.queryByText('Sawtee in Media')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('sidebar-widget')).toHaveLength(2);

    unmount();

    render(
      <Category
        {...baseProps}
        category={{
          ...baseProps.category,
          id: 13,
          name: 'In Focus',
          slug: 'in-focus',
        }}
      />
    );

    expect(screen.getByText('Sawtee in Media')).toBeInTheDocument();
    expect(screen.getByText('Featured Events')).toBeInTheDocument();
    expect(screen.queryByText('In Focus')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('sidebar-widget')).toHaveLength(2);
  });

  it('drops featured events on policy outreach and keeps both other lists', () => {
    render(
      <Category
        {...baseProps}
        category={{
          ...baseProps.category,
          id: 14,
          name: 'Featured Events',
          slug: 'featured-events',
        }}
      />
    );

    expect(screen.getByTestId('events-archive')).toBeInTheDocument();
    expect(screen.getByText('Sawtee in Media')).toBeInTheDocument();
    expect(screen.getByText('In Focus')).toBeInTheDocument();
    expect(screen.queryByText('Featured Events')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('sidebar-widget')).toHaveLength(2);
  });

  it('keeps featured events and in focus on covid resources', () => {
    render(
      <Category
        {...baseProps}
        category={{
          ...baseProps.category,
          id: 9,
          name: 'COVID-19 Resources',
          slug: 'covid-19',
        }}
      />
    );

    expect(screen.getByTestId('covid-archive')).toBeInTheDocument();
    expect(screen.getByText('Featured Events')).toBeInTheDocument();
    expect(screen.getByText('In Focus')).toBeInTheDocument();
    expect(screen.queryByText('Sawtee in Media')).not.toBeInTheDocument();
  });
});
