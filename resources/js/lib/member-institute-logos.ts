/**
 * Local logo paths for SAWTEE member institutions.
 * Images live under `public/assets/member-institutes/`.
 * Regenerate via `node scripts/download-member-logos.mjs`.
 */
export type MemberInstituteLogo = {
  slug: string;
  member_name: string;
  member_website_link: string;
  short_label: string;
  logo: string | null;
};

export const memberInstituteLogos: MemberInstituteLogo[] = [
  {
    slug: 'bela',
    member_name: 'Bangladesh Environmental Lawyers’ Association (BELA), Dhaka',
    member_website_link: 'https://www.belabangla.org/',
    short_label: 'BELA',
    logo: '/assets/member-institutes/bela.png',
  },
  {
    slug: 'unnayan-shamannay',
    member_name: 'Unnayan Shamannay, Dhaka',
    member_website_link: 'https://www.unsy.org/',
    short_label: 'Unnayan Shamannay',
    logo: '/assets/member-institutes/unnayan-shamannay.png',
  },
  {
    slug: 'cag',
    member_name: 'Citizen consumer and civic Action Group (CAG), Chennai',
    member_website_link: 'https://www.cag.org.in/',
    short_label: 'CAG',
    logo: '/assets/member-institutes/cag.png',
  },
  {
    slug: 'cuts',
    member_name: 'Consumer Unity & Trust Society (CUTS), Jaipur',
    member_website_link: 'https://cuts-international.org/',
    short_label: 'CUTS',
    logo: '/assets/member-institutes/cuts.jpg',
  },
  {
    slug: 'drag',
    member_name: 'Development Research and Action Group (DRAG), New Delhi',
    member_website_link: 'https://dragindia.org/',
    short_label: 'DRAG',
    logo: null,
  },
  {
    slug: 'leaders',
    member_name:
      'Society for Legal and Environmental Analysis and Development Research (LEADERS), Kathmandu',
    member_website_link: 'https://leadersnepal.org.np/',
    short_label: 'LEADERS',
    logo: '/assets/member-institutes/leaders.png',
  },
  {
    slug: 'pro-public',
    member_name:
      'Forum for Protection of Public Interest (Pro Public), Kathmandu',
    member_website_link: 'http://propublic.org/',
    short_label: 'Pro Public',
    logo: '/assets/member-institutes/pro-public.png',
  },
  {
    slug: 'jdhr',
    member_name: 'Journalists for Democracy and Human Rights (JDHR), Islamabad',
    member_website_link: 'http://www.jdhr.org/',
    short_label: 'JDHR',
    logo: null,
  },
  {
    slug: 'sdpi',
    member_name: 'Sustainable Development Policy Institute (SDPI), Islamabad',
    member_website_link: 'https://sdpi.org/',
    short_label: 'SDPI',
    logo: null,
  },
  {
    slug: 'ips',
    member_name: 'Institute of Policy Studies (IPS), Colombo',
    member_website_link: 'https://www.ips.lk/',
    short_label: 'IPS',
    logo: '/assets/member-institutes/ips.png',
  },
  {
    slug: 'lst',
    member_name: 'Law & Society Trust (LST), Colombo',
    member_website_link: 'https://www.lstlanka.org/',
    short_label: 'LST',
    logo: null,
  },
];
