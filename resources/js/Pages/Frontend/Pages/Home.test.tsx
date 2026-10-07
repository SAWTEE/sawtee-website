import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { Post } from '@/types';

import { PolicyOutreachSection } from './Home';

vi.mock('@inertiajs/react', () => ({
  Deferred: ({ children }: { children: ReactNode }) => children,
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/shared/InertiaLink', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function makeEvent(id: number, title: string): Post {
  return {
    id,
    title,
    slug: `event-${id}`,
    excerpt: '<p>Excerpt</p>',
    published_at: '2026-07-27T00:00:00.000Z',
    media: [
      {
        id,
        collection_name: 'post-featured-image',
        original_url: `/events/${id}.webp`,
        placeholder: 'data:image/svg+xml;base64,abc',
      },
    ],
    category: {
      id: 10,
      name: 'Featured Events',
      slug: 'featured-events',
    },
  } as Post;
}

describe('PolicyOutreachSection', () => {
  it('does not use transition-all on event images so placeholder backgrounds stay composited', () => {
    const { container } = render(
      <PolicyOutreachSection
        events={[
          makeEvent(1, 'Policy dialogue on trade'),
          makeEvent(2, 'Apparel value chain workshop'),
          makeEvent(3, 'LDC graduation programme'),
        ]}
      />
    );

    const images = container.querySelectorAll('img');

    expect(images.length).toBe(3);

    images.forEach(image => {
      expect(image.className).not.toMatch(/\btransition-all\b/);
      expect(image).toHaveClass('object-cover');
    });
  });
});
