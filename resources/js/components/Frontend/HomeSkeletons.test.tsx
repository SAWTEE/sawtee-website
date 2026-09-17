import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  BelowTheFoldSkeleton,
  FeaturedPublicationsSkeleton,
  PublicationCoversSkeleton,
  VideoCarouselSkeleton,
} from './HomeSkeletons';

describe('home page loading skeletons', () => {
  it('exposes the featured publications placeholder as a labelled status', () => {
    render(<FeaturedPublicationsSkeleton />);

    expect(
      screen.getByRole('status', { name: 'Loading featured publications' })
    ).toBeInTheDocument();
  });

  it('reserves the aside height so arriving content does not shift the page', () => {
    render(<FeaturedPublicationsSkeleton />);

    const panel = screen.getByRole('status', {
      name: 'Loading featured publications',
    });

    expect(panel.className).toContain('min-h-112');
    expect(panel.className).toContain('sm:min-h-128');
  });

  it.each([
    [PublicationCoversSkeleton, 'Loading latest publications'],
    [VideoCarouselSkeleton, 'Loading recordings'],
  ])('labels the %# carousel placeholder', (Skeleton, label) => {
    render(<Skeleton />);

    expect(screen.getByRole('status', { name: label })).toBeInTheDocument();
  });

  it('animates every placeholder bar so the wait reads as loading, not empty', () => {
    const { container } = render(<VideoCarouselSkeleton />);

    expect(container.firstElementChild?.className).toContain('animate-pulse');
  });

  it('covers each deferred below-the-fold section', () => {
    render(<BelowTheFoldSkeleton />);

    // In focus, policy outreach, latest publications, then media + newsletters.
    expect(screen.getAllByRole('status').length).toBeGreaterThanOrEqual(3);
    expect(
      screen.getByRole('status', { name: 'Loading SAWTEE in media' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('status', { name: 'Loading newsletters' })
    ).toBeInTheDocument();
  });
});
