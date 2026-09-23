import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SITE_COPY_DEFAULTS } from '@/lib/site-copy';

import Edit from './Edit';

vi.mock('@inertiajs/react', () => ({
  Head: ({ title }: { title?: string }) => <title>{title}</title>,
  useForm: (initial: Record<string, unknown>) => ({
    data: initial,
    setData: vi.fn(),
    patch: vi.fn(),
    processing: false,
    errors: {},
    transform: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.stubGlobal('route', () => '/admin/settings');

const WHERE_USED = [
  'Shown in the Know Us header mega menu as the About intro.',
  'Header and footer social icons on every public page. Contact-page icons still come from that page’s JSON.',
  'Site-wide footer: tagline, About/Contact/Substack links, copyright, and the map that opens from the address.',
  'Homepage newsletter callout, Substack embed and sidebar widget, and the footer Substack URL.',
  'Homepage screen-reader H1 and the Media / Newsletter column labels. Section titles still live under Home Page Sections.',
  'Thematic Areas and Workstreams headings, intros, and sector images on /our-work.',
  'Page title and disclaimer on /reform-monitor.',
  'Organisation name and working days on /contact. Phone, email, and address still come from the Contact page’s JSON.',
  'Member Institutions heading and intro on the About page.',
  'Intro, empty-state message, and cohort headings on /media-fellows.',
  'Header search dialog: description, empty-state helper, and example queries.',
  'Fallback title and description when a page has none. Home title and description are used on the homepage.',
  'Public error screens for 403, 404, 419, 500, and 503.',
  'Country markers on the globe in the Know Us header mega menu.',
  'Mobile navigation only when the CMS header menu is empty.',
];

describe('Site settings edit', () => {
  it('explains where each settings group is used on the public site', () => {
    render(<Edit settings={SITE_COPY_DEFAULTS} />);

    expect(
      screen.getByRole('heading', { name: 'Know Us' })
    ).toBeInTheDocument();

    WHERE_USED.forEach(description => {
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });
});
