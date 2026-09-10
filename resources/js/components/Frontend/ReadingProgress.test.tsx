import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import ReadingProgress from './ReadingProgress';

function mockDocumentScroll({
  scrollTop,
  scrollHeight = 2000,
  clientHeight = 500,
}: {
  scrollTop: number;
  scrollHeight?: number;
  clientHeight?: number;
}) {
  Object.defineProperty(document.documentElement, 'scrollTop', {
    configurable: true,
    value: scrollTop,
  });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  });
  Object.defineProperty(document.documentElement, 'clientHeight', {
    configurable: true,
    value: clientHeight,
  });
}

describe('ReadingProgress', () => {
  afterEach(() => {
    mockDocumentScroll({ scrollTop: 0 });
  });

  it('renders a top progress bar and updates with scroll', () => {
    mockDocumentScroll({ scrollTop: 0 });

    render(<ReadingProgress />);

    const bar = screen.getByRole('progressbar', { name: 'Reading progress' });
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    expect(bar).toHaveClass('progress');

    mockDocumentScroll({ scrollTop: 750 });
    fireEvent.scroll(window);

    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar).toHaveStyle({ transform: 'scaleX(0.5)' });
  });
});
