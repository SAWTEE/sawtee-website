import { ArrowRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import InertiaLink from '@/components/shared/InertiaLink';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Nudges editors toward the screens that now own public copy, and points
 * remaining content at the right CMS area.
 *
 * Bump `STORAGE_KEY` whenever the lists below change, so editors see the
 * updated summary once instead of staying dismissed on stale content.
 */
const STORAGE_KEY = 'sawtee.dashboard.dynamic-content-notice.v4';

type StartHereItem = {
  step: string;
  label: string;
  routeName: string;
  hint: string;
};

const START_HERE: StartHereItem[] = [
  {
    step: '1',
    label: 'Site Settings',
    routeName: 'admin.settings.edit',
    hint: 'Footer, social icons, newsletter, search, SEO defaults, error pages, Know Us intro, Our Work, Reform Monitor, and Media fellows copy. Each heading on that screen says where the text appears.',
  },
  {
    step: '2',
    label: 'Features',
    routeName: 'admin.features.index',
    hint: 'Home-page feature cards: title, description, image path, link, order, and visibility.',
  },
  {
    step: '3',
    label: 'Home Page Sections',
    routeName: 'admin.home-page-sections.index',
    hint: 'Show or hide each home block, and edit the public heading and intro. Those headings win over Site Settings when both are set.',
  },
];

type Group = {
  heading: string;
  description: string;
  items: string[];
  tone: 'live' | 'seeded';
};

const GROUPS: Group[] = [
  {
    heading: 'Day-to-day content',
    description: 'Unchanged: publish as you always have.',
    tone: 'live',
    items: [
      'Posts, articles, publications and research',
      'Pages and page sections (including Contact phones, email, and address in that page’s JSON)',
      'Header and footer navigation menus',
      'Sliders and slides',
      'Team, member countries, member institutes, fellowships and fellows',
      'SEO title, description and share image on every content type',
    ],
  },
  {
    heading: 'Leave these alone unless you mean to',
    description:
      'These used to live in code. Defaults remain as a fallback if a field is empty.',
    tone: 'seeded',
    items: [
      'Do not edit React files for public wording — use the three screens above.',
      'The Contact page JSON still owns phones, email, address, and office hours.',
      'Menus still own header and footer labels; Site Settings only supplies a mobile-menu fallback when the CMS header menu is empty.',
    ],
  },
];

const TONE_STYLES: Record<Group['tone'], string> = {
  live: 'border-emerald-500/30 bg-emerald-500/5',
  seeded: 'border-amber-500/30 bg-amber-500/5',
};

const TONE_DOT: Record<Group['tone'], string> = {
  live: 'bg-emerald-500',
  seeded: 'bg-amber-500',
};

export function DynamicContentBanner() {
  // Start hidden so a dismissed banner never flashes on load.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== 'dismissed');
    } catch {
      // Private browsing or blocked storage: show the notice rather than fail.
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);

    try {
      window.localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      // Dismissal simply will not persist.
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <aside
      aria-labelledby="dynamic-content-banner-title"
      className="border-primary/20 from-primary/5 to-card relative mx-4 rounded-xl border bg-linear-to-t p-4 sm:p-5 lg:mx-6"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={dismiss}
        aria-label="Dismiss content management notice"
        className="absolute top-2 right-2"
      >
        <X className="size-4" aria-hidden />
      </Button>

      <p className="text-primary text-xs font-semibold tracking-wide uppercase">
        What’s new
      </p>
      <h2
        id="dynamic-content-banner-title"
        className="mt-1 pr-10 text-base font-semibold tracking-tight"
      >
        Public copy is now editable in this admin
      </h2>
      <p className="text-muted-foreground mt-1 max-w-3xl text-sm leading-relaxed">
        Footer text, feature cards, home headings, search, SEO fallbacks, and
        error pages no longer require a deploy. Start with the three screens
        below — then dismiss this notice when you are done.
      </p>

      <ol className="mt-4 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-3">
        {START_HERE.map(item => (
          <li key={item.routeName}>
            <InertiaLink
              href={route(item.routeName)}
              prefetch
              aria-label={item.label}
              className="border-border bg-card hover:border-primary/40 hover:bg-primary/5 focus-visible:ring-ring group flex h-full flex-col gap-2 rounded-lg border p-3 no-underline transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground font-mono text-xs">
                  {item.step}
                </span>
                <ArrowRight
                  className="text-muted-foreground size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
              <span className="text-sm font-semibold">{item.label}</span>
              <span className="text-muted-foreground text-xs leading-relaxed">
                {item.hint}
              </span>
            </InertiaLink>
          </li>
        ))}
      </ol>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {GROUPS.map(group => (
          <section
            key={group.heading}
            className={cn('rounded-lg border p-3', TONE_STYLES[group.tone])}
          >
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <span
                aria-hidden
                className={cn(
                  'size-2 shrink-0 rounded-full',
                  TONE_DOT[group.tone]
                )}
              />
              {group.heading}
            </h3>
            <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
              {group.description}
            </p>
            <ul className="mt-2.5 space-y-1">
              {group.items.map(item => (
                <li
                  key={item}
                  className="text-muted-foreground flex gap-1.5 text-xs leading-relaxed"
                >
                  <span aria-hidden>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}
