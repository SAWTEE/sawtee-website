import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Post } from '@/types';

import CovidArchive, {
  AUTHOR_TOOLTIP_CLASSNAME,
  authorInitials,
  parseAuthors,
} from './CovidArchive';

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: 1,
    title: 'COVID resource title',
    slug: 'covid-resource',
    published_at: '2020-04-01T00:00:00.000Z',
    genre: 'Brief',
    author: 'Ada Lovelace and Grace Hopper',
    link: 'https://example.com/resource',
    media: [],
    category: {
      id: 3,
      name: 'COVID-19',
      slug: 'covid-19',
    },
    ...overrides,
  } as Post;
}

describe('parseAuthors', () => {
  it('splits comma and “and” separated names', () => {
    expect(parseAuthors('Ada Lovelace and Grace Hopper')).toEqual([
      'Ada Lovelace',
      'Grace Hopper',
    ]);
    expect(parseAuthors('Ada, Grace, and Margaret')).toEqual([
      'Ada',
      'Grace',
      'Margaret',
    ]);
  });
});

describe('authorInitials', () => {
  it('builds compact initials from a full name', () => {
    expect(authorInitials('Ada Lovelace')).toBe('AL');
  });
});

describe('CovidArchive', () => {
  it('expands stacked avatars smoothly when there are multiple authors', () => {
    const { container } = render(<CovidArchive posts={[makePost()]} />);

    const stack = container.querySelector('[data-avatar-stack="true"]');
    expect(stack).not.toBeNull();
    expect(stack).toHaveClass('group/authors');

    const avatars = screen.getAllByRole('button', {
      name: /Lovelace|Hopper/,
    });
    expect(avatars).toHaveLength(2);
    expect(avatars[1]).toHaveClass('-ml-3');
    expect(avatars[1]?.className).toMatch(/group-hover\/authors:ml-1\.5/);
    expect(avatars[1]?.className).toMatch(
      /duration-500.*ease-\[cubic-bezier/
    );
  });

  it('does not stack a single author avatar', () => {
    const { container } = render(
      <CovidArchive posts={[makePost({ author: 'Ada Lovelace' })]} />
    );

    expect(
      container.querySelector('[data-avatar-stack="false"]')
    ).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'Ada Lovelace' })
    ).not.toHaveClass('-ml-3');
  });

  it('styles author tooltips for light and dark mode', () => {
    expect(AUTHOR_TOOLTIP_CLASSNAME).toMatch(/dark:bg-\[#0b3a48]/);
    expect(AUTHOR_TOOLTIP_CLASSNAME).toMatch(/dark:text-\[#e8f6fb]/);
    expect(AUTHOR_TOOLTIP_CLASSNAME).toMatch(/bg-white/);

    render(<CovidArchive posts={[makePost({ author: 'Ada Lovelace' })]} />);
    expect(
      screen.getByRole('button', { name: 'Ada Lovelace' })
    ).toBeInTheDocument();
  });
});
