import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Explains which parts of the public site are already CMS-managed and which are
 * still held in code or seed files, so editors know where a given piece of
 * content can actually be changed.
 *
 * Bump `STORAGE_KEY` whenever the lists below change, so editors see the
 * updated summary once instead of staying dismissed on stale content.
 */
const STORAGE_KEY = 'sawtee.dashboard.dynamic-content-notice.v2';

type Group = {
  heading: string;
  description: string;
  items: string[];
  tone: 'live' | 'seeded' | 'static';
};

const GROUPS: Group[] = [
  {
    heading: 'Editable here now',
    description: 'Changes publish to the live site straight from this admin.',
    tone: 'live',
    items: [
      'Posts, articles, publications and research',
      'Pages and page sections',
      'Categories, tags and themes',
      'Header and footer navigation menus',
      'Home page section toggles, sliders and slides',
      'Team, member countries and member institutes',
      'Media fellowships, fellows and published stories',
      'Contact page details, via the Contact page’s JSON data',
      'SEO title, description and share image on every content type',
    ],
  },
  {
    heading: 'In the database, but no editor yet',
    description:
      'These no longer live in the frontend code, but there is no admin screen for them. A developer has to update database/data and re-run the seeder (php artisan sawtee:seed-content).',
    tone: 'seeded',
    items: [
      'Home page “feature” cards (media fellowship, COVID resources, LDC interests)',
      'The “Know Us” mega-menu intro text',
      'Global social media links',
    ],
  },
  {
    heading: 'Still fixed in code',
    description:
      'Wording and links baked into the site’s templates. A developer has to change these. Not an exhaustive list.',
    tone: 'static',
    items: [
      'Home page section headings and intro copy',
      'Footer tagline and quick links',
      'Newsletter callout copy and Substack addresses',
      'Our Work section blurbs and their curated images',
      'Reform Monitor disclaimer and error page wording',
      'Footer map embed and the Know Us globe markers',
      'Mobile menu fallback, used only when CMS menus are empty',
    ],
  },
];

const TONE_STYLES: Record<Group['tone'], string> = {
  live: 'border-emerald-500/30 bg-emerald-500/5',
  seeded: 'border-amber-500/30 bg-amber-500/5',
  static: 'border-border bg-muted/40',
};

const TONE_DOT: Record<Group['tone'], string> = {
  live: 'bg-emerald-500',
  seeded: 'bg-amber-500',
  static: 'bg-muted-foreground',
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

      <h2
        id="dynamic-content-banner-title"
        className="pr-10 text-base font-semibold tracking-tight"
      >
        What you can edit on the website
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Content that used to be written into the site’s code has been moved into
        this CMS in stages. Here is where each part stands today.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
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
