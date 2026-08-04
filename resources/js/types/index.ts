export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type MenuItem = {
  id: number;
  title: string;
  name: string;
  url: string;
  parent_id: number | null;
  order: number;
  children?: MenuItem[];
  menu_id?: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
};

export type Tag = {
  id: number;
  name: string;
  slug?: string;
};

export type MediaItem = {
  id: number;
  uuid?: string;
  collection_name?: string;
  file_name?: string;
  mime_type?: string | null;
  original_url?: string;
  preview_url?: string;
  responsive_images?: unknown;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  subtitle?: string | null;
  excerpt?: string | null;
  content?: string | null;
  status?: string;
  published_at?: string | null;
  category?: Category | null;
  tags?: Tag[];
  media?: MediaItem[];
  created_at?: string;
  updated_at?: string;
};

export type Page = {
  id: number;
  name: string;
  slug: string;
  title?: string | null;
  content?: string | null;
  template?: string | null;
};

export type Publication = {
  id: number;
  title: string;
  slug?: string;
  category?: Category | null;
  file?: { id: number; url?: string; path?: string } | null;
};

export type Slide = {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  link?: string | null;
  media?: MediaItem[];
};

export type HomePageSection = {
  id: number;
  name: string;
  show: number | boolean;
};

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  path: string;
  links: PaginationLink[];
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string | null;
  prev_page_url?: string | null;
};

export type ZiggyConfig = {
  location: string;
  url?: string;
  port?: number | null;
  defaults?: Record<string, unknown>;
  routes?: Record<string, unknown>;
};

export type SharedProps = {
  auth: {
    user: User | null;
  };
  flash: {
    message: string | null;
  };
  primaryMenu: MenuItem[];
  footerMenu: MenuItem[];
  ziggy: ZiggyConfig;
  errors?: Record<string, string>;
  experts?: unknown[];
};

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & SharedProps;

export type HomePageProps = PageProps<{
  slides: Slide[];
  infocus: Post[];
  sawteeInMedia: Post[];
  events: Post[];
  featuredPublications: Publication[];
  featuredBlogPosts: Post[];
  publications: Publication[];
  newsletters: Post[];
  webinars: Post[];
  slidesResponsiveImages: string[];
  homePageSections: HomePageSection[];
}>;

/** Runtime helper used by tests and typed defaults. */
export function emptySharedProps(
  overrides: Partial<SharedProps> = {}
): SharedProps {
  return {
    auth: { user: null },
    flash: { message: null },
    primaryMenu: [],
    footerMenu: [],
    ziggy: { location: '/' },
    ...overrides,
  };
}
