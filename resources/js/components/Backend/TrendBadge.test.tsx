import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TrendBadge } from './TrendBadge';

describe('TrendBadge', () => {
  it('shows trending up icon when trend is up', () => {
    render(<TrendBadge percent={25} trend="up" />);

    expect(screen.getByTestId('trend-up')).toBeInTheDocument();
    expect(screen.queryByTestId('trend-down')).not.toBeInTheDocument();
    expect(screen.queryByTestId('trend-neutral')).not.toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('shows trending down icon when trend is down', () => {
    render(<TrendBadge percent={-50} trend="down" />);

    expect(screen.getByTestId('trend-down')).toBeInTheDocument();
    expect(screen.getByText('-50%')).toBeInTheDocument();
  });

  it('shows neutral icon when trend is neutral', () => {
    render(<TrendBadge percent={0} trend="neutral" />);

    expect(screen.getByTestId('trend-neutral')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
