import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DynamicContentBanner } from './DynamicContentBanner';

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

  it('explains where each kind of content is managed', () => {
    render(<DynamicContentBanner />);

    expect(
      screen.getByRole('heading', { name: 'What you can edit on the website' })
    ).toBeInTheDocument();
    expect(screen.getByText('Editable here now')).toBeInTheDocument();
    expect(
      screen.getByText('In the database, but no editor yet')
    ).toBeInTheDocument();
    expect(screen.getByText('Still fixed in code')).toBeInTheDocument();
  });

  it('points editors at the CMS home for contact details', () => {
    render(<DynamicContentBanner />);

    // Contact details come from the Contact page's JSON pageData, not from code.
    expect(
      screen.getByText('Contact page details, via the Contact page’s JSON data')
    ).toBeInTheDocument();
  });

  it('names the seeder for database-backed content that has no admin screen', () => {
    render(<DynamicContentBanner />);

    expect(
      screen.getByText(/php artisan sawtee:seed-content/)
    ).toBeInTheDocument();
  });

  it('stays hidden once dismissed', () => {
    const { unmount } = render(<DynamicContentBanner />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Dismiss content management notice' })
    );

    expect(
      screen.queryByRole('heading', {
        name: 'What you can edit on the website',
      })
    ).not.toBeInTheDocument();

    unmount();
    render(<DynamicContentBanner />);

    expect(
      screen.queryByRole('heading', {
        name: 'What you can edit on the website',
      })
    ).not.toBeInTheDocument();
  });
});
