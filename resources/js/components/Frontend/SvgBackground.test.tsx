import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SvgBackground from './SvgBackground';

vi.mock('@/components/Frontend/Particles', () => ({
  default: () => <canvas data-testid="particles" />,
}));

function stubMatchMedia(matches: (query: string) => boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: matches(query),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

describe('SvgBackground', () => {
  afterEach(() => {
    stubMatchMedia(() => false);
  });

  it('does not mount the particle canvas on small screens', async () => {
    stubMatchMedia(query => query.includes('min-width: 768px') === false);

    const { queryByTestId } = render(<SvgBackground />);

    await Promise.resolve();

    expect(queryByTestId('particles')).not.toBeInTheDocument();
  });

  it('mounts the particle canvas on desktop when motion is allowed', async () => {
    stubMatchMedia(query => query.includes('min-width: 768px'));

    const { findByTestId } = render(<SvgBackground />);

    expect(await findByTestId('particles')).toBeInTheDocument();
  });
});
