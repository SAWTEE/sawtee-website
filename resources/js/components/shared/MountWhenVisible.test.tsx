import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import MountWhenVisible from './MountWhenVisible';

type ObserverCallback = IntersectionObserverCallback;

let observerCallback: ObserverCallback | null = null;

class MockObserver {
  constructor(callback: ObserverCallback) {
    observerCallback = callback;
  }

  observe() {}

  unobserve() {}

  disconnect() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockObserver,
});

afterEach(() => {
  observerCallback = null;
});

describe('MountWhenVisible', () => {
  it('does not mount children until the sentinel intersects', () => {
    render(
      <MountWhenVisible fallback={<div>Waiting</div>}>
        <div>Heavy</div>
      </MountWhenVisible>
    );

    expect(screen.getByText('Waiting')).toBeInTheDocument();
    expect(screen.queryByText('Heavy')).not.toBeInTheDocument();

    act(() => {
      observerCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(screen.getByText('Heavy')).toBeInTheDocument();
    expect(screen.queryByText('Waiting')).not.toBeInTheDocument();
  });
});
