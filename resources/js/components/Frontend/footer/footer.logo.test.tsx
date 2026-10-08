import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Footer from './footer';

vi.mock('@inertiajs/react', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePage: () => ({
    url: '/',
    props: {},
  }),
}));

describe('Footer logo', () => {
  it('reuses the compact header logo without invert or blend hacks', () => {
    render(<Footer menu={[]} socialMenu={[]} />);

    const logo = screen.getByAltText('SAWTEE');

    expect(logo).toHaveAttribute('src', '/assets/logo-sawtee-header.webp');
    expect(logo).toHaveAttribute('loading', 'lazy');
    expect(logo.className).not.toMatch(/invert|mix-blend/);
  });
});
