import { HomeIcon } from '@/components/Frontend/icons';
import {
  BookDashed,
  FilePenIcon,
  FilesIcon,
  FileUpIcon,
  FilterX,
  Globe2Icon,
  LayoutDashboard,
  MenuIcon,
  SlidersHorizontalIcon,
  TagsIcon,
  UsersIcon,
} from 'lucide-react';

export const feature = {
  name: 'Reform Monitoring Platform',
  image: '/assets/Policy-Reform-Banner-green-sized.webp',
  link: '/reform-monitoring-platform',
};

export const memberInstitutions = [
  {
    id: 1,
    country: 'Bangladesh',
    institutes: [
      {
        id: 1,
        member_name:
          'Bangladesh Environmental Lawyers’ Association (BELA), Dhaka',
        member_website_link: 'https://www.belabangla.org/',
      },
      {
        id: 2,
        member_name: 'Unnayan Shamannay, Dhaka',
        member_website_link: 'https://www.unsy.org/',
      },
    ],
  },
  {
    id: 2,
    country: 'India',
    institutes: [
      {
        id: 1,
        member_name: 'Citizen consumer and civic Action Group (CAG), Chennai',
        member_website_link: 'https://www.cag.org.in/',
      },
      {
        id: 2,
        member_name: 'Consumer Unity & Trust Society (CUTS), Jaipur',
        member_website_link: 'https://cuts-international.org/',
      },
      {
        id: 3,
        member_name: 'Development Research and Action Group (DRAG), New Delhi',
        member_website_link: 'https://dragindia.org/',
      },
    ],
  },
  {
    id: 3,
    country: 'Nepal',
    institutes: [
      {
        id: 1,
        member_name:
          'Society for Legal and Environmental Analysis and Development Research (LEADERS), Kathmandu',
        member_website_link: 'https://leadersnepal.org.np/',
      },
      {
        id: 2,
        member_name:
          'Forum for Protection of Public Interest (Pro Public), Kathmandu',
        member_website_link: 'http://propublic.org/',
      },
    ],
  },
  {
    id: 4,
    country: 'Pakistan',
    institutes: [
      {
        id: 1,
        member_name:
          'Journalists for Democracy and Human Rights (JDHR), Islamabad',
        member_website_link: 'http://www.jdhr.org/',
      },
      {
        id: 2,
        member_name:
          'Sustainable Development Policy Institute (SDPI), Islamabad',
        member_website_link: 'https://sdpi.org/',
      },
    ],
  },
  {
    id: 5,
    country: 'Sri Lanka',
    institutes: [
      {
        id: 1,
        member_name: 'Institute of Policy Studies (IPS), Colombo',
        member_website_link: 'https://www.ips.lk/',
      },
      {
        id: 2,
        member_name: 'Law & Society Trust (LST), Colombo',
        member_website_link: 'https://www.lstlanka.org/',
      },
    ],
  },
];

export const MemberLogos = [
  {
    id: 1,
    name: 'Bangladesh Environmental Lawyers’ Association (BELA)',
    logo: '/assets/belabangla.png',
    link: 'https://www.belabangla.org/',
  },
  {
    id: 2,
    name: 'Unnayan Shamannay, Dhaka',
    logo: '/assets/unnayanshamannay.png',
    link: 'https://www.unsy.org/',
  },
  {
    id: 3,
    name: 'Citizen consumer and civic Action Group (CAG)',
    logo: '/assets/cag.png',
    link: 'https://www.cag.org.in/',
  },
  {
    id: 4,
    name: 'Consumer Unity & Trust Society (CUTS)',
    logo: '/assets/cuts.png',
    link: 'https://cuts-international.org/',
  },
  {
    id: 5,
    name: 'Development Research and Action Group (DRAG)',
    logo: '/assets/drag.png',
    link: 'https://dragindia.org/',
  },
  {
    id: 6,
    name: 'Society for Legal and Environmental Analysis and Development Research (LEADERS)',
    logo: '/assets/leaders.png',
    link: 'https://leadersnepal.org.np/',
  },
  {
    id: 7,
    name: 'Forum for Protection of Public Interest (Pro Public)',
    logo: '/assets/propublic.png',
    link: 'http://propublic.org/',
  },
  {
    id: 8,
    name: 'Journalists for Democracy and Human Rights (JDHR)',
    logo: '/assets/jdhr.png',
    link: 'http://www.jdhr.org/',
  },
  {
    id: 9,
    name: 'Sustainable Development Policy Institute (SDPI)',
    logo: '/assets/sdpi.png',
    link: 'https://sdpi.org/',
  },
  {
    id: 10,
    name: 'Institute of Policy Studies (IPS)',
    logo: '/assets/ips.png',
    link: 'https://www.ips.lk/',
  },
  {
    id: 11,
    name: 'Law & Society Trust (LST)',
    logo: '/assets/lst.png',
    link: 'https://www.lstlanka.org/',
  },
];

export const aboutMenuData = {
  introText:
    'South Asia Watch on Trade, Economics and Environment (SAWTEE) was launched in 1994 as a loose regional network of non-governmental organizations (NGOs) from five South Asian countries: Bangladesh, India, Nepal, Pakistan and Sri Lanka. Taking into consideration the emerging need for fair, effective and meaningful integration of South Asian countries into the regional as well as global economies, the major motto of this regional initiative has been “GLOBALIZATION YES, BUT WITH SAFETY NETS”',
  introImage: '/assets/Airports_Network_Map.png',
};

export const DashBoardMenuItems = [
  {
    name: 'Dashboard',
    icon: HomeIcon,
    route: 'admin.dashboard',
  },
  {
    name: 'Website',
    icon: Globe2Icon,
    route: 'home',
  },
  {
    name: 'Menu',
    icon: MenuIcon,
    route: 'admin.menus.index',
  },
  {
    name: 'Pages',
    icon: FilesIcon,
    route: 'admin.pages.index',
  },
  {
    name: 'Sections',
    icon: LayoutDashboard,
    route: 'admin.sections.index',
  },
  {
    name: 'Posts',
    icon: FileUpIcon,
    route: 'admin.posts.index',
  },
  {
    name: 'Themes',
    icon: TagsIcon,
    route: 'admin.themes.index',
  },
  {
    name: 'Tags',
    icon: TagsIcon,
    route: 'admin.tags.index',
  },
  {
    name: 'Categories',
    icon: FilterX,
    route: 'admin.categories.index',
  },
  {
    name: 'Publications',
    icon: BookDashed,
    route: 'admin.publications.index',
  },
  {
    name: 'Research',
    icon: FilePenIcon,
    route: 'admin.research.index',
  },
  {
    name: 'Team Members',
    icon: UsersIcon,
    route: 'admin.teams.index',
  },
  {
    name: 'Slider',
    icon: SlidersHorizontalIcon,
    route: 'admin.sliders.index',
  },
  {
    name: 'Subscribers',
    icon: UsersIcon,
    route: 'admin.subscribers.list',
  },
];

export const primarMenu = [
  {
    title: 'Home',
    url: '/',
    children: null,
  },
  {
    title: 'Know Us',
    url: '/about',
    children: [
      {
        title: 'Genesis',
        url: '/about#genesis',
        children: null,
      },
      {
        title: 'Registration and Recognition',
        url: '/about#registration-and-recognition',
        children: null,
      },
      {
        title: 'Governance Structure',
        url: '/about#governance-structure',
        children: null,
      },
      {
        title: 'Vision, Goal and Objectives',
        url: '/about#vision-goal-and-objectives',
        children: null,
      },
      {
        title: 'Strategies',
        url: '/about#strategies',
        children: null,
      },
      {
        title: 'Resources',
        url: '/about#resources',
        children: null,
      },
      {
        title: 'Member Institutions',
        url: '/about#member-institutions',
        children: null,
      },
    ],
    introText:
      'South Asia Watch on Trade, Economics and Environment (SAWTEE) was launched in 1994 as a loose regional network of non-governmental organizations (NGOs) from five South Asian countries: Bangladesh, India, Nepal, Pakistan and Sri Lanka. Taking into consideration the emerging need for fair, effective and meaningful integration of South Asian countries into the regional as well as global economies, the major motto of this regional initiative has been “GLOBALIZATION YES, BUT WITH SAFETY NETS”',
    introImage: '/assets/Airports_Network_Map.png',
    // experts: [...staticExperts],
  },
  {
    title: 'Our Work',
    url: '/our-work',
    children: [
      {
        title: 'Thematic Areas',
        url: '/our-work#thematic-areas',
        children: [
          {
            title: 'Economic and social reform, growth and poverty',
            url: '/our-work#theme1',
            children: null,
          },
          {
            title: 'Trade integration and supply-side constrants',
            url: '/our-work#theme2',
            children: null,
          },
          {
            title: 'Trade and climate change',
            url: '/our-work#theme3',
            children: null,
          },
          {
            title:
              'Agriculture policies, biodiversity management and food security',
            url: '/our-work#theme4',
            children: null,
          },
          {
            title: 'Competition, regulation and competitiveness',
            url: '/our-work#theme5',
            children: null,
          },
          {
            title: 'Financial resource management',
            url: '/our-work#theme6',
            children: null,
          },
          {
            title: 'Remittance and development',
            url: '/our-work#theme7',
            children: null,
          },
          {
            title: 'Covid-19',
            url: '/our-work#theme8',
            children: null,
          },
          {
            title: "Advancing LDCs' Trade Interest",
            url: '/our-work#theme9',
            children: null,
          },
        ],
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

export const FooterMenu = [
  {
    title: 'Contact Us',
    url: '/contact',
    children: [
      {
        title: 'Phone: +977-1-4544438',
        url: 'tel:+977-1-4544438',
      },
      {
        title: 'Fax: +977-1-4544570',
        url: 'fax:+977-1-4544570',
      },
      {
        title: 'Email: sawtee@sawtee.org',
        url: 'mailto:sawtee@sawtee.org',
      },
      {
        title: 'Address: Tukucha Marg, Baluwatar, Kathmandu',
        url: null,
      },
      {
        title: 'P.O Box: 19366',
        url: null,
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
      },
      {
        title: 'Policy Brief',
        url: '/category/publications/policy-brief',
      },
      {
        title: 'Books',
        url: '/category/publications/books',
      },
      {
        title: 'Briefing Paper',
        url: '/category/publications/briefing-paper',
      },
      {
        title: 'Discussion Paper',
        url: '/category/publications/discussion-paper',
      },
    ],
  },
  {
    title: 'Useful Links',
    url: null,
    children: [
      {
        title: 'InFocus',
        url: '/category/infocus',
      },
      {
        title: 'Work with Us',
        url: '/career',
      },
      {
        title: 'Contact Us',
        url: '/contact',
      },
      {
        title: 'Newsletters',
        url: '/category/newsletters',
      },
      {
        title: 'SAES',
        url: 'https://sawtee.org/saes',
      },
    ],
  },
];

export const socialMenu = [
  {
    name: 'twitter',
    link: 'https://www.twitter.com/SAWTEENP/',
  },
  {
    name: 'facebook',
    link: 'https://www.facebook.com/sawteenp/',
  },
  {
    name: 'linkedin',
    link: 'https://www.linkedin.com/sawteenp/',
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
