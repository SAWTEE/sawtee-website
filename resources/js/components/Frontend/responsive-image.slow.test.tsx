import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/connection', () => ({
  isSlowConnection: () => true,
}));

import ResponsiveImage from './responsive-image';

describe('ResponsiveImage on a slow connection', function () {
  it('shows the tiny placeholder first and withholds the srcset', function () {
    render(
      <ResponsiveImage
        src="/hero.webp"
        srcSet="/hero-800.webp 800w"
        placeholder="data:image/svg+xml;base64,abc"
        alt="Deferred"
      />
    );

    const image = screen.getByAltText('Deferred');

    expect(image).toHaveAttribute('src', 'data:image/svg+xml;base64,abc');
    expect(image).not.toHaveAttribute('srcset');
    expect(image).toHaveClass('image-placeholder');
  });
});
