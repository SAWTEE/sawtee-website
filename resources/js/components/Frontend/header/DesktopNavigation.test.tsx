import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DesktopNavigation from './DesktopNavigation';

vi.mock('@inertiajs/react', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePage: () => ({
    url: '/',
    props: { experts: [] },
  }),
}));

describe('DesktopNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not crash with an empty menu', () => {
    const { container } = render(<DesktopNavigation menu={[]} />);
    expect(container.querySelector('nav') || container.firstChild).toBeTruthy();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('defaults menu to an empty list when omitted', () => {
    expect(() => render(<DesktopNavigation />)).not.toThrow();
  });
});
