import { afterEach, describe, expect, it, vi } from 'vitest';

import { isSlowConnection } from './connection';

describe('isSlowConnection', function () {
  afterEach(function () {
    vi.unstubAllGlobals();
  });

  it('treats missing network information as a fast connection', function () {
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('window', { matchMedia: undefined });

    expect(isSlowConnection()).toBe(false);
  });

  it('treats save-data and 2g as slow', function () {
    vi.stubGlobal('navigator', { connection: { saveData: true } });

    expect(isSlowConnection()).toBe(true);

    vi.stubGlobal('navigator', { connection: { effectiveType: '2g' } });

    expect(isSlowConnection()).toBe(true);
  });

  it('honours prefers-reduced-data', function () {
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('window', {
      matchMedia: (query: string) => ({
        matches: query === '(prefers-reduced-data: reduce)',
      }),
    });

    expect(isSlowConnection()).toBe(true);
  });
});
