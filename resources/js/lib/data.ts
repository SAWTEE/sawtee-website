export const aboutMenuData = {
  introText:
    'South Asia Watch on Trade, Economics and Environment (SAWTEE) was launched in 1994 as a loose regional network of non-governmental organizations (NGOs) from five South Asian countries: Bangladesh, India, Nepal, Pakistan and Sri Lanka. Taking into consideration the emerging need for fair, effective and meaningful integration of South Asian countries into the regional as well as global economies, the major motto of this regional initiative has been “GLOBALIZATION YES, BUT WITH SAFETY NETS”',
};

export const features = [
  // Reform Monitoring Platform feature card kept commented until relaunch.
  {
    id: '2',
    title: 'Media fellowship',
    image_src: '/assets/Media-Fellowship-banner.webp',
    link: '/media-fellows',
    description:
      'Since 2023, SAWTEE has been offering a media fellowship programme that supports economic journalists with mentorship on a range of technical issues at the intersection of trade, climate change, and related topics—while fully upholding their journalistic independence. .',
  },
  {
    id: '3',
    title: 'COVID-19 resources',
    image_src: '/assets/COVID-19-South-Asia-and-LDCs.webp',
    link: '/category/COVID-19-resources',
    description:
      "Between 2020 and 2021, COVID-19 pandemic affected the social, economic and well-being of people worldwide. SAWTEE undertook activities that provided evidence-based insights and expert perspectives to help understand the pandemic and its impacts. Explore SAWTEE's curated collection of works related to the COVID-19 pandemic, including articles, reports and recorded webinars that examined the health impacts of the pandemic, along with lessons for future resilience and preparedness.",
  },
  {
    id: '4',
    title: "LDCs' Interests ",
    image_src: '/assets/interests.webp',
    link: '/category/LDCs-Interests',
    description:
      'Least Developed Countries (LDCs) continue to face challenges in securing their trade and development interests. For those LDCs that have recently graduated or are on the verge of graduation, ensuring a sustainable and irreversible graduation is a a critical challenge. This curated collection brings together articles, reports, and recorded webinars that highlight the constraints LDCs face, their evolving priorities, and the reforms needed to leverage trade and finance for their sustainable development.',
  },
];

export const socialMenu = [
  {
    name: 'twitter',
    link: 'https://x.com/sawteenp',
  },
  {
    name: 'facebook',
    link: 'https://www.facebook.com/sawteenp/',
  },
  {
    name: 'linkedin',
    link: 'https://www.linkedin.com/company/sawtee/',
  },
  {
    name: 'youtube',
    link: 'https://www.youtube.com/@sawteenp/',
  },
];

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
