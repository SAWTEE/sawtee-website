import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SubscribeForm } from './NewsletterCallout';

vi.mock('@/components/shared/theme-provider', () => ({
  useTheme: () => ({ resolvedTheme: 'light', theme: 'light' }),
}));

describe('SubscribeForm', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'readyState', {
      configurable: true,
      value: 'loading',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defers the Substack iframe until the window load event', () => {
    const { container } = render(<SubscribeForm />);

    expect(container.querySelector('iframe')).toBeNull();
    expect(
      screen.getByRole('status', { name: 'Loading newsletter signup form' }),
    ).toBeInTheDocument();

    act(() => {
      Object.defineProperty(document, 'readyState', {
        configurable: true,
        value: 'complete',
      });
      window.dispatchEvent(new Event('load'));
    });

    expect(container.querySelector('iframe')).not.toBeNull();
    expect(container.querySelector('iframe')?.getAttribute('src')).toBe(
      'https://sawteenp.substack.com/embed',
    );
  });

  it('loads the iframe immediately when the document is already complete', () => {
    Object.defineProperty(document, 'readyState', {
      configurable: true,
      value: 'complete',
    });

    const { container } = render(<SubscribeForm />);

    expect(container.querySelector('iframe')).not.toBeNull();
  });
});
