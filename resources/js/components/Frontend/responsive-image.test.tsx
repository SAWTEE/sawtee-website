import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/connection', () => ({
  isSlowConnection: () => false,
}));

import ResponsiveImage from './responsive-image';

describe('ResponsiveImage', function () {
  it('lazy-loads a full image on a fast connection', function () {
    render(
      <ResponsiveImage
        src="/hero.webp"
        srcSet="/hero-400.webp 400w, /hero-800.webp 800w"
        placeholder="data:image/svg+xml;base64,abc"
        alt="Hero"
      />
    );

    const image = screen.getByAltText('Hero');

    expect(image).toHaveAttribute('src', '/hero.webp');
    expect(image).toHaveAttribute(
      'srcset',
      '/hero-400.webp 400w, /hero-800.webp 800w'
    );
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
  });

  it('loads LCP candidates eagerly', function () {
    render(<ResponsiveImage src="/hero.webp" alt="Lead" priority />);

    const image = screen.getByAltText('Lead');

    expect(image).toHaveAttribute('loading', 'eager');
    expect(image).toHaveAttribute('fetchpriority', 'high');
  });

  it('clears the placeholder background after the full image loads', function () {
    const { container } = render(
      <ResponsiveImage
        src="/hero.webp"
        placeholder="data:image/svg+xml;base64,abc"
        alt="Swap"
      />
    );

    const image = screen.getByAltText('Swap');

    expect(image).toHaveClass('image-placeholder');

    fireEvent.load(image);

    expect(container.querySelector('.image-placeholder')).toBeNull();
  });
});
