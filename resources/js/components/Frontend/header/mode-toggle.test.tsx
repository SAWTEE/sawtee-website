import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ModeToggle } from './mode-toggle';

const setTheme = vi.fn();

vi.mock('@/components/shared/theme-provider', () => ({
  useTheme: () => ({
    theme: 'system',
    setTheme,
    resolvedTheme: mockResolvedTheme,
    systemTheme: mockResolvedTheme,
  }),
}));

let mockResolvedTheme: 'dark' | 'light' = 'dark';

describe('ModeToggle', () => {
  beforeEach(() => {
    setTheme.mockClear();
    mockResolvedTheme = 'dark';
  });

  it('toggles from dark to light based on the resolved theme', () => {
    mockResolvedTheme = 'dark';

    render(<ModeToggle />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Switch to light mode' })
    );

    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('toggles from light to dark based on the resolved theme', () => {
    mockResolvedTheme = 'light';

    render(<ModeToggle />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Switch to dark mode' })
    );

    expect(setTheme).toHaveBeenCalledWith('dark');
  });
});
