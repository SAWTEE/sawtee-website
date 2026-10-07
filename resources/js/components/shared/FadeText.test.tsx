import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FadeText } from './FadeText';

describe('FadeText', () => {
  it('uses the theme fade-up animation instead of an arbitrary value', () => {
    render(<FadeText text="Featured publications" />);

    expect(screen.getByText('Featured publications')).toHaveClass(
      'motion-safe:animate-fade-up'
    );
  });
});
