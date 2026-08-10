/**
 * Last-resort mobile nav when CMS header menus are empty.
 * Prefer `primaryMenu` from Inertia shared props in production.
 */
export const mobileMenu = [
  {
    title: 'Home',
    url: '/',
    children: null,
  },
  {
    title: 'Know Us',
    url: '/about',
    children: null,
  },
  {
    title: 'Our Work',
    url: '/our-work',
    children: [
      {
        title: 'Thematic Areas',
        url: '/our-work#thematic-areas',
        children: null,
      },
      {
        title: 'Programmes',
        url: '/category/programme',
        children: [
          {
            title: 'Ongoing Programmes',
            url: '/category/ongoing-programmes',
            children: null,
          },
          {
            title: 'Completed Programmes',
            url: '/category/completed-programmes',
            children: null,
          },
        ],
      },
      {
        title: 'Research',
        url: '/category/research',
        children: null,
      },
    ],
  },
  {
    title: 'Publications',
    url: '/category/publications',
    children: [
      {
        title: 'Trade Insight',
        url: '/category/publications/trade-insight',
        children: null,
      },
      {
        title: 'Policy Brief',
        url: '/category/publications/policy-brief',
        children: null,
      },
      {
        title: 'Briefing Paper',
        url: '/category/publications/briefing-paper',
        children: null,
      },
      {
        title: 'Discussion Paper',
        url: '/category/publications/discussion-paper',
        children: null,
      },
      {
        title: 'Research Brief',
        url: '/category/publications/research-brief',
        children: null,
      },
      {
        title: 'Books',
        url: '/category/publications/books',
        children: null,
      },
      {
        title: 'Working Paper',
        url: '/category/publications/working-paper',
        children: null,
      },
      {
        title: 'Others',
        url: '/category/publications/others',
        children: null,
      },
      {
        title: 'Publications in Nepali',
        url: '/category/publications/publication-in-nepali',
        children: [
          {
            title: 'Nepali Briefing Paper',
            url: '/category/publications/publications-in-nepali/nepali-briefing-paper',
            children: null,
          },
          {
            title: 'Nepali Policy Brief',
            url: '/category/publications/publications-in-nepali/nepali-policy-brief',
            children: null,
          },
          {
            title: 'Nepali Newsletters',
            url: '/category/publications/publications-in-nepali/nepali-newsletters',
            children: [
              {
                title: 'Swachha Pratispardha',
                url: '/category/publications/publications-in-nepali/nepali-newsletters/swachha-pratispardha',
                children: null,
              },
              {
                title: 'Byapar ra Bikash',
                url: '/category/publications/publications-in-nepali/nepali-newsletters/byapar-ra-bikash',
                children: null,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Policy Research',
    url: '/category/featured-events',
    children: null,
  },
];
