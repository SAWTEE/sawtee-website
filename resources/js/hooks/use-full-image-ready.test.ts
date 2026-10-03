import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const isSlowConnection = vi.fn(() => false);

vi.mock('@/lib/connection', () => ({
  isSlowConnection: () => isSlowConnection(),
}));

import useFullImageReady from './use-full-image-ready';

describe('useFullImageReady', function () {
  it('is ready immediately on a fast connection', function () {
    isSlowConnection.mockReturnValue(false);

    const { result } = renderHook(() => useFullImageReady());

    expect(result.current).toBe(true);
  });

  it('defers on a slow connection until the page is idle', function () {
    isSlowConnection.mockReturnValue(true);

    const { result } = renderHook(() => useFullImageReady());

    expect(result.current).toBe(false);
  });

  it('never defers priority images', function () {
    isSlowConnection.mockReturnValue(true);

    const { result } = renderHook(() => useFullImageReady(true));

    expect(result.current).toBe(true);
  });
});
