export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type MenuItem = {
  id?: number;
  title: string;
  name?: string;
  url: string;
  parent_id?: number | null;
  order?: number;
  /** Nested menu tree (arbitrary depth) from shared Inertia menus. */
  children?: MenuItem[] | null;
  menu_id?: number;
};

/** Alias for multilevel nav consumers (desktop MultiLevelMenu, mobile accordion). */
export type MultiLevelMenuItem = MenuItem;

export type SocialMenuItem = {
  name: 'twitter' | 'linkedin' | 'facebook' | 'youtube' | string;
  link: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  parent?: Category | null;
  children?: Category[];
  resolved_meta_title?: string;
  resolved_meta_description?: string;
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
  author?: string | null;
  link?: string | null;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  category?: Category | null;
  tags?: Tag[];
  media?: MediaItem[];
  created_at?: string;
  updated_at?: string;
  resolved_meta_title?: string;
  resolved_meta_description?: string;
};

export type SeoMeta = {
  title: string;
  description: string;
  image?: string | null;
  url?: string | null;
  type?: string;
  jsonLd?: Record<string, unknown> | null;
};

export type Page = {
  id: number;
  name: string;
  slug: string;
  title?: string | null;
  content?: string | null;
  template?: string | null;
  page_template?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  pageData?: Record<string, unknown> | null;
  resolved_meta_title?: string;
  resolved_meta_description?: string;
};

export type Publication = {
  id: number;
  title: string;
  slug?: string;
  subtitle?: string | null;
  volume_slug?: string | null;
  created_at?: string | number;
  category?: Category | null;
  media?: MediaItem[];
  file?: { id?: number; name?: string; url?: string; path?: string } | null;
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

export type TrendDirection = 'up' | 'down' | 'neutral';

export type AnalyticsTopPage = {
  path: string;
  views: number;
};

export type AnalyticsSummary = {
  views_today: number;
  views_this_week: number;
  views_this_month: number;
  top_pages: AnalyticsTopPage[];
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

export type DashboardProps = PageProps<{
  posts: number;
  publications: number;
  researchs: number;
  postsIncreasePercent: number;
  publicationsIncreasePercent: number;
  researchsIncreasePercent: number;
  postsThisMonth: number;
  postsLastMonth: number;
  publicationsThisMonth: number;
  publicationsLastMonth: number;
  researchsThisMonth: number;
  researchsLastMonth: number;
  postsTrend: TrendDirection;
  publicationsTrend: TrendDirection;
  researchsTrend: TrendDirection;
  analytics: AnalyticsSummary;
}>;

export type HomePageProps = PageProps<{
  slides?: Slide[];
  infocus?: Post[];
  sawteeInMedia?: Post[];
  events?: Post[];
  featuredPublications?: Publication[];
  featuredBlogPosts?: Post[];
  publications?: Publication[];
  newsletters?: Post[];
  webinars?: Post[];
  slidesResponsiveImages?: string[];
  homePageSections?: HomePageSection[];
  seo?: SeoMeta;
}>;

export type FrontendPageProps = PageProps<{
  page: Page;
  sections?: unknown[];
  themes?: unknown[] | null;
  featured_image?: string | MediaItem | null;
  srcSet?: string | null;
  seo?: SeoMeta;
}>;

export type FrontendPostProps = PageProps<{
  post: Post;
  category?: Category | null;
  featured_image?: string | null;
  srcSet?: string | null;
  file?: string | null;
  relatedPosts?: Post[];
  seo?: SeoMeta;
}>;

export type FrontendCategoryProps = PageProps<{
  category: Category;
  posts?: unknown;
  infocus?: Post[] | null;
  sawteeInMedia?: Post[] | null;
  events?: Post[] | null;
  featured_image?: string | null;
  srcSet?: string | null;
  seo?: SeoMeta;
}>;

export type FrontendSearchProps = PageProps<{
  posts?: Paginated<Post & { category?: string; category_slug?: string }>;
  query?: string;
  seo?: SeoMeta;
}>;

export type FrontendArchiveProps = PageProps<{
  meta_title?: string;
  meta_description?: string;
  layout_title?: string;
  posts?: Paginated<Post> | Post[];
  sawteeInMedia?: Post[] | null;
  category?: Category;
  publications?: unknown;
  teams?: unknown;
  infocus?: Post[] | null;
  featured_image?: string | null;
  srcSet?: string | null;
  seo?: SeoMeta;
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
