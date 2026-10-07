import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  armStaticLcpFallback,
  dismissStaticLcpFallback,
} from './dismiss-lcp-fallback';

describe('dismiss-lcp-fallback', () => {
  beforeEach(() => {
    document.body.className = '';
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('marks the document ready immediately when there is no fallback', () => {
    armStaticLcpFallback();

    expect(document.body).toHaveClass('inertia-lcp-ready');
  });

  it('keeps the fallback until dismiss or the safety timeout', () => {
    document.body.innerHTML = '<div id="inertia-lcp-fallback"></div>';

    armStaticLcpFallback();

    expect(document.body).not.toHaveClass('inertia-lcp-ready');

    vi.advanceTimersByTime(2499);
    expect(document.body).not.toHaveClass('inertia-lcp-ready');

    vi.advanceTimersByTime(1);
    expect(document.body).toHaveClass('inertia-lcp-ready');
  });

  it('dismisses as soon as the React hero has loaded', () => {
    document.body.innerHTML = '<div id="inertia-lcp-fallback"></div>';

    armStaticLcpFallback();
    dismissStaticLcpFallback();

    expect(document.body).toHaveClass('inertia-lcp-ready');
  });
});
