import { usePage } from '@inertiajs/react';

import { mobileMenu } from '@/lib/data';
import type { SharedProps, SiteCopy } from '@/types';

export const SITE_COPY_DEFAULTS: SiteCopy = {
  about_intro:
    'South Asia Watch on Trade, Economics and Environment (SAWTEE) was launched in 1994 as a loose regional network of non-governmental organizations (NGOs) from five South Asian countries: Bangladesh, India, Nepal, Pakistan and Sri Lanka. Taking into consideration the emerging need for fair, effective and meaningful integration of South Asian countries into the regional as well as global economies, the major motto of this regional initiative has been “GLOBALIZATION YES, BUT WITH SAFETY NETS”',
  social_menu: [],
  footer: {
    tagline:
      'Research, advocacy, and capacity building on trade, economics, and environment across South Asia.',
    about_label: 'About SAWTEE',
    about_href: '/about',
    contact_label: 'Contact',
    contact_href: '/contact',
    substack_label: 'Substack',
    copyright_name: 'SAWTEE',
    map_title: 'Location Map',
    map_description: "View SAWTEE's location in google maps.",
    map_iframe_title: 'sawtee location map',
    map_embed_url:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.8576852768524!2d85.329329!3d27.72168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1913dfb0b0b3%3A0x4d5d3519d24d3c38!2sSouth%20Asia%20Watch%20on%20Trade%2C%20Economics%20and%20Environment%20(SAWTEE)!5e0!3m2!1sen!2snp!4v1700216228197!5m2!1sen!2snp',
  },
  newsletter: {
    heading:
      'Receive the latest publication releases, events and monthly newsletter.',
    intro:
      "Do you want to get notified? Sign up for our newsletter and you'll be among the first to find out about new publication releases, events and monthly newsletter.",
    substack_url: 'https://sawteenp.substack.com',
    substack_embed: 'https://sawteenp.substack.com/embed',
    substack_title: 'On Substack',
    embed_title: 'Subscribe to the SAWTEE newsletter on Substack',
  },
  home: {
    h1: 'South Asia Watch on Trade, Economics and Environment (SAWTEE)',
    media_and_newsletter_heading: 'Media and Newsletter',
    media_heading: 'Media',
    newsletters_heading: 'Newsletters',
    media_eyebrow: 'Coverage',
    newsletter_eyebrow: 'Updates',
    featured_blogs_heading: 'Blogs and articles',
  },
  our_work: {
    thematic_heading: 'Thematic Areas',
    thematic_intro:
      "Priority areas guiding SAWTEE's research, dialogue, and policy engagement across South Asia.",
    sectors_heading: 'Workstreams',
    sectors_intro:
      'Programmes and research that translate thematic priorities into concrete engagement.',
    explore_label: 'Explore',
    placeholder_image: '/assets/SM-placeholder-1024x512.webp',
    sector_images: {
      programme: '/assets/our-work-programmes.webp',
      programmes: '/assets/our-work-programmes.webp',
      research: '/assets/our-work-research.webp',
    },
  },
  reform_monitor: {
    title: 'Reform Monitoring Platform',
    disclaimer:
      'The content displayed in this Platform may not necessarily reflect the official position of SAWTEE or its member institutions.',
  },
  errors: {
    eyebrow: 'South Asia Watch on Trade, Economics and Environment',
    search_label: 'Search the site',
    go_back_label: 'Go back',
    explore_heading: 'Continue exploring',
    aside_heading:
      'Research, dialogue, and policy engagement across South Asia.',
    aside_body:
      'SAWTEE is an independent think tank network working on trade, economics, and environment.',
    public_links: [
      { href: '/', label: 'Home' },
      { href: '/search', label: 'Search' },
      { href: '/category/publications', label: 'Publications' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
    pages: {
      '403': {
        title: 'Access denied',
        description:
          'You do not have permission to view this page. If you believe this is a mistake, contact SAWTEE.',
        action: 'Go to homepage',
        hint: 'You may need to sign in, or this content may be restricted.',
      },
      '404': {
        title: 'Page not found',
        description:
          'The page you requested could not be found. It may have moved, or the link may be outdated.',
        action: 'Go to homepage',
        hint: 'Try searching, or browse publications and research from the links below.',
      },
      '419': {
        title: 'Session expired',
        description:
          'Your session timed out for security. Please reload the page and try again.',
        action: 'Reload page',
        hint: 'This usually happens after a long idle period.',
      },
      '500': {
        title: 'Something went wrong',
        description:
          'An unexpected error occurred on our servers. Please try again in a moment.',
        action: 'Go to homepage',
        hint: 'If the problem continues, please contact us.',
      },
      '503': {
        title: 'Service unavailable',
        description:
          'SAWTEE is temporarily unavailable for maintenance. Please check back soon.',
        action: 'Go to homepage',
        hint: 'We are working to restore access as quickly as possible.',
      },
    },
  },
  globe_markers: [
    { location: [23.8103, 90.4125], size: 0.06 },
    { location: [13.0827, 80.2707], size: 0.05 },
    { location: [26.9124, 75.7873], size: 0.05 },
    { location: [28.6139, 77.209], size: 0.05 },
    { location: [27.7172, 85.324], size: 0.06 },
    { location: [33.6844, 73.0479], size: 0.06 },
    { location: [6.9271, 79.8612], size: 0.06 },
  ],
  mobile_menu: mobileMenu as SiteCopy['mobile_menu'],
  contact: {
    org_name: 'South Asia Watch on Trade, Economics and Environment (SAWTEE)',
    working_days_label: 'Working days:',
    working_days: 'Monday–Friday',
    office_hours_label: 'Office hours:',
    unavailable:
      'Contact details are unavailable right now. Please try again later.',
    location_image_alt: 'SAWTEE office location',
  },
  media_fellows: {
    intro:
      "Journalists selected for SAWTEE's media fellowship programme, with published work and reflections from each cohort year.",
    empty: 'Media fellowship cohorts will appear here once published.',
    cohort_heading: 'SAWTEE Media Fellowship {year}',
  },
  about: {
    member_institutions_heading: 'Member Institutions',
    member_institutions_intro:
      "Partner organisations across South Asia advancing SAWTEE's regional network.",
  },
  search: {
    button_label: 'Search',
    title: 'Search',
    description:
      'Find research, publications, news, and resources across SAWTEE.',
    placeholder: 'Search the site…',
    input_label: 'Search the website',
    results_label: 'Search results',
    press_enter: 'Press Enter to view matching pages',
    helper:
      'Try a theme, publication title, or keyword — for example {examples}.',
    examples: ['trade', 'climate', 'LDC'],
  },
  seo: {
    default_title: 'SAWTEE',
    default_description:
      'South Asia Watch on Trade, Economics and Environment (SAWTEE) — research, dialogue, and advocacy on trade and development.',
    default_image: '/assets/logo-sawtee.webp',
    home_title: 'South Asia Watch on Trade, Economics and Environment',
    home_description:
      "Explore South Asia's dynamic journey since the 1980s, navigating global integration and economic challenges.",
  },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function mergeSiteCopy(
  defaults: SiteCopy,
  stored?: Partial<SiteCopy> | null
): SiteCopy {
  if (!stored) {
    return defaults;
  }

  const merged = { ...defaults };

  (Object.keys(defaults) as Array<keyof SiteCopy>).forEach(key => {
    const fallback = defaults[key];
    const value = stored[key];

    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(fallback) || Array.isArray(value)) {
      merged[key] = value as never;
      return;
    }

    if (isPlainObject(fallback) && isPlainObject(value)) {
      merged[key] = { ...fallback, ...value } as never;
      return;
    }

    merged[key] = value as never;
  });

  return merged;
}

export function useSiteCopy(): SiteCopy {
  const stored = usePage<SharedProps>().props.siteCopy;

  return mergeSiteCopy(SITE_COPY_DEFAULTS, stored);
}
