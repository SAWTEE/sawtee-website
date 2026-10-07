import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import FullWidthCarousel from './FullWidthCarousel';

vi.mock('./responsive-image', () => ({
  default: (props: {
    alt?: string;
    className?: string;
    loading?: string;
    priority?: boolean;
  }) => (
    <img
      alt={props.alt}
      className={props.className}
      loading={props.loading}
      data-priority={props.priority ? 'true' : 'false'}
    />
  ),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
});

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockObserver,
});
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockObserver,
});

const slides = [
  {
    id: 1,
    title: 'Hero slide',
    subtitle: 'Subtitle',
    media: [{ id: 1, original_url: '/hero.webp' }],
  },
];

describe('FullWidthCarousel', () => {
  it('keeps its own aspect ratio when it is the only hero column', () => {
    const { container } = render(<FullWidthCarousel slides={slides} />);

    expect(
      screen.getByRole('region', { name: 'Featured homepage slides' })
    ).not.toHaveClass('lg:h-full');
    expect(container.querySelector('.aspect-video')).toHaveClass(
      'lg:aspect-2/1'
    );
  });

  it('treats the first slide as the LCP image', () => {
    render(<FullWidthCarousel slides={slides} />);

    expect(screen.getByAltText('Hero slide')).toHaveAttribute(
      'data-priority',
      'true'
    );
  });

  it('fills the sibling column height on large screens', () => {
    const { container } = render(
      <FullWidthCarousel slides={slides} matchSiblingHeight />
    );

    expect(
      screen.getByRole('region', { name: 'Featured homepage slides' })
    ).toHaveClass('lg:h-full');
    expect(container.querySelector('.lg\\:aspect-auto')).toBeInTheDocument();
    expect(container.querySelector('.lg\\:h-full')).toBeInTheDocument();
  });
});
