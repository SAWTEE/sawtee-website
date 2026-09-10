import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import CarouselIndicators from './CarouselIndicators';

describe('CarouselIndicators', () => {
  it('renders pill-shaped active and dot inactive bullets', () => {
    render(
      <CarouselIndicators count={3} current={1} onSelect={vi.fn()} />
    );

    const group = screen.getByRole('group', { name: 'Slide indicators' });
    expect(group).toBeInTheDocument();

    const bullets = group.querySelectorAll('[data-active]');
    expect(bullets).toHaveLength(3);
    expect(bullets[1]).toHaveAttribute('data-active', 'true');
    expect(bullets[1]).toHaveClass('h-1.5', 'w-6');
    expect(bullets[0]).toHaveClass('h-1.5', 'w-1.5');
    expect(bullets[2]).toHaveClass('h-1.5', 'w-1.5');
  });

  it('calls onSelect when a bullet is clicked', () => {
    const onSelect = vi.fn();
    render(
      <CarouselIndicators count={2} current={0} onSelect={onSelect} />
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Go to slide 2 of 2' })
    );
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('uses onMedia colors for the hero slider variant', () => {
    const { container } = render(
      <CarouselIndicators
        count={2}
        current={0}
        onSelect={vi.fn()}
        variant="onMedia"
      />
    );

    const active = container.querySelector('[data-active="true"]');
    const inactive = container.querySelector('[data-active="false"]');
    expect(active).toHaveClass('bg-white');
    expect(inactive?.className).toMatch(/bg-white\/45/);
  });
});
