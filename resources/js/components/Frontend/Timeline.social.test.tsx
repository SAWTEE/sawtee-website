import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SocialShare from '@/components/Frontend/SocialShare';
import VerticalTimeline from '@/components/Frontend/Timeline';
import type { Post } from '@/types';

describe('SocialShare', () => {
  it('renders share controls', () => {
    render(
      <SocialShare
        url="https://sawtee.org/example"
        title="Example"
        platforms={['twitter', 'facebook', 'linkedin', 'copy']}
      />
    );

    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on X')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Copy link')).toBeInTheDocument();
  });
});

describe('VerticalTimeline', () => {
  it('renders empty state and items', () => {
    const { rerender } = render(<VerticalTimeline items={[]} />);
    expect(screen.getByText('No items found.')).toBeInTheDocument();

    const posts = [
      {
        id: 1,
        title: 'July Monitor',
        excerpt: '<p>Trade update</p>',
        published_at: '2026-07-01T00:00:00.000Z',
        media: [
          {
            id: 9,
            collection_name: 'post-files',
            original_url: 'https://example.com/monitor.pdf',
          },
        ],
      },
    ] as unknown as Post[];

    rerender(<VerticalTimeline items={posts} />);

    expect(screen.getByText('July Monitor')).toBeInTheDocument();
    expect(screen.getByText('Trade update')).toBeInTheDocument();
    expect(screen.getByText(/Open PDF/i)).toBeInTheDocument();
  });
});
