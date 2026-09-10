import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Post } from '@/types';

import DefaultArchive from './DefaultArchive';

vi.mock('@inertiajs/react', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/shared/InertiaLink', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: 1,
    title: 'Example media story',
    slug: 'example-media-story',
    excerpt: '<p>A short summary of the coverage.</p>',
    published_at: '2026-07-27T00:00:00.000Z',
    media: [],
    category: {
      id: 2,
      name: 'SAWTEE in Media',
      slug: 'sawtee-in-media',
    },
    ...overrides,
  } as Post;
}

describe('DefaultArchive', () => {
  it('keeps date and read more aligned when an excerpt is missing', () => {
    const { container } = render(
      <DefaultArchive
        posts={[
          makePost({ id: 1, title: 'With excerpt' }),
          makePost({
            id: 2,
            title: 'Without excerpt',
            excerpt: null,
          }),
        ]}
      />
    );

    const cards = container.querySelectorAll('.flex.h-full.flex-col');
    expect(cards).toHaveLength(2);

    const excerptSlots = container.querySelectorAll('.mt-5.min-h-16.flex-1');
    expect(excerptSlots).toHaveLength(2);
    expect(excerptSlots[0]?.textContent).toContain(
      'A short summary of the coverage.'
    );
    expect(excerptSlots[1]?.textContent?.trim()).toBe('');

    const footers = container.querySelectorAll('.mt-auto');
    expect(footers).toHaveLength(2);
  });

  it('shows Read more without repeating the post title in the visible label', () => {
    render(
      <DefaultArchive
        posts={[makePost({ title: 'Long media headline that used to clutter' })]}
      />
    );

    const button = screen.getByRole('link', {
      name: 'Read more: Long media headline that used to clutter',
    });

    expect(button).toHaveTextContent(/^Read more$/);
    expect(button).toHaveAttribute(
      'title',
      'Read more: Long media headline that used to clutter'
    );
  });
});
