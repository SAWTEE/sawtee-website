import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DynamicContentBanner } from './DynamicContentBanner';

vi.mock('@/components/shared/InertiaLink', () => ({
  default: ({
    href,
    children,
    prefetch: _prefetch,
    ...props
  }: {
    href: string;
    children?: React.ReactNode;
    prefetch?: boolean | string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.stubGlobal('route', (name: string) => `/${name}`);

/** This jsdom setup has no localStorage, so provide a minimal in-memory one. */
function stubLocalStorage(): void {
  let store: Record<string, string> = {};

  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  });
}

describe('DynamicContentBanner', () => {
  beforeEach(() => {
    stubLocalStorage();
  });

  it('nudges editors toward the new public-copy screens', () => {
    render(<DynamicContentBanner />);

    expect(
      screen.getByRole('heading', {
        name: 'Public copy is now editable in this admin',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('What’s new')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Site Settings' })).toHaveAttribute(
      'href',
      '/admin.settings.edit'
    );
    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute(
      'href',
      '/admin.features.index'
    );
    expect(
      screen.getByRole('link', { name: 'Home Page Sections' })
    ).toHaveAttribute('href', '/admin.home-page-sections.index');
  });

  it('explains home headings win over site settings', () => {
    render(<DynamicContentBanner />);

    expect(
      screen.getByText(
        /Those headings win over Site Settings when both are set/
      )
    ).toBeInTheDocument();
  });

  it('points remaining contact details at the Contact page JSON', () => {
    render(<DynamicContentBanner />);

    expect(
      screen.getByText(/Contact page JSON still owns phones, email, address/)
    ).toBeInTheDocument();
  });

  it('stays hidden once dismissed', () => {
    const { unmount } = render(<DynamicContentBanner />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Dismiss content management notice' })
    );

    expect(
      screen.queryByRole('heading', {
        name: 'Public copy is now editable in this admin',
      })
    ).not.toBeInTheDocument();

    unmount();
    render(<DynamicContentBanner />);

    expect(
      screen.queryByRole('heading', {
        name: 'Public copy is now editable in this admin',
      })
    ).not.toBeInTheDocument();
  });
});
