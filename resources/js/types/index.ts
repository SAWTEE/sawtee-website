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

/** Morph file attachment (Publication / Research). */
export type FileAttachment = {
  id: number;
  name: string;
  path?: string;
  url?: string;
  fileable_type?: string | null;
  fileable_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
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
  genre?: string | null;
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

/** CMS page section (`sections` table). */
export type PageSection = {
  id: number;
  title: string;
  description?: string | null;
  link?: string | null;
  type: 'default' | 'tabs' | 'accordian' | 'members' | string;
  parent_id?: number | null;
  page_id: number;
  order?: number | null;
  media?: MediaItem[];
  created_at?: string | null;
  updated_at?: string | null;
};

export type Theme = {
  id: number;
  title: string;
  description: string;
  created_at?: string | null;
  updated_at?: string | null;
};

/** Trade Insight article (`articles` table). */
export type Article = {
  id: number;
  title: string;
  publication_id: number;
  slug?: string | null;
  subtitle?: string | null;
  excerpt?: string | null;
  author?: string | null;
  content?: string | null;
  published_at: string;
  meta_title?: string | null;
  meta_description?: string | null;
  tags?: Tag[];
  media?: MediaItem[];
  created_at?: string | null;
  updated_at?: string | null;
  resolved_meta_title?: string;
  resolved_meta_description?: string;
};

/** Team member (`teams` table). */
export type Team = {
  id: number;
  name: string;
  email?: string | null;
  designation?: string | null;
  order?: number | null;
  bio?: string | null;
  media?: MediaItem[];
  created_at?: string | null;
  updated_at?: string | null;
};

/** Research report (`research` table). */
export type Research = {
  id: number;
  title: string;
  slug?: string | null;
  subtitle?: string | null;
  description?: string | null;
  year: number;
  link?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  media?: MediaItem[];
  file?: FileAttachment | null;
  created_at?: string | null;
  updated_at?: string | null;
  resolved_meta_title?: string;
  resolved_meta_description?: string;
};

/** Research archive payload: `groupBy('year')` from BuildCategoryArchive. */
export type ResearchByYear = Record<string, Research[]>;

/** Publications index: subcategory slug → latest publications. */
export type PublicationsBySlug = Record<string, Publication[]>;

/** Contact template `page.pageData` JSON. */
export type ContactPageData = {
  opening_hours?: string | null;
  phone_numbers?: string[];
  fax?: string | null;
  email?: string | null;
  address?: string | null;
  location_image?: string | null;
  map_url?: string | null;
  social_menus?: SocialMenuItem[] | null;
};

/** SectionTemplate member institutions `page.pageData` JSON. */
export type MemberInstitute = {
  id?: number;
  member_name: string;
  member_website_link: string;
};

export type MemberCountry = {
  id: number;
  country: string;
  institutes: MemberInstitute[];
};

/** Static media-fellowship UI data (`resources/js/lib/media-fellowship`). */
export type MediaFellowPublishedStory = {
  title: string;
  link: string;
  image_src: string[];
  media_src: string | null;
};

export type MediaFellow = {
  id: number;
  name: string;
  avatar: string;
  designation: string;
  bio: string;
  experience: string[];
  published_stories: MediaFellowPublishedStory[];
};

export type MediaFellowshipYear = {
  year: string;
  description: string;
  fellows: MediaFellow[];
};

export type PageData =
  | ContactPageData
  | MemberCountry[]
  | MediaFellow[]
  | Record<string, unknown>
  | null;

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
  pageData?: PageData;
  resolved_meta_title?: string;
  resolved_meta_description?: string;
};

export type Publication = {
  id: number;
  title: string;
  slug?: string | null;
  subtitle?: string | null;
  volume?: string | null;
  volume_slug?: string | null;
  description?: string | null;
  category_id?: number;
  category?: Category | null;
  media?: MediaItem[];
  file?: FileAttachment | null;
  articles?: Article[];
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string | number;
  updated_at?: string;
  resolved_meta_title?: string;
  resolved_meta_description?: string;
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

/** Laravel `simplePaginate()` payload (e.g. TeamsArchive). */
export type SimplePaginated<T> = {
  data: T[];
  current_page: number;
  first_page_url?: string;
  from: number | null;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
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
    success?: string | null;
  };
  /** Public frontend only (once props); absent on /admin. */
  primaryMenu?: MenuItem[];
  footerMenu?: MenuItem[];
  /** Full Ziggy on first load; location-only on subsequent XHR visits. */
  ziggy?: ZiggyConfig | { location: string };
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
  /** Deferred on first paint; may be undefined until loaded. */
  analytics?: AnalyticsSummary | null;
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
  sections?: PageSection[];
  themes?: Theme[] | null;
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

/** Category archive `posts` varies by slug (paginated posts, research-by-year, teams). */
export type CategoryArchivePosts =
  Paginated<Post> | ResearchByYear | Team[] | Post[] | null;

export type SubstackFeedItem = {
  id: number | string;
  title: string;
  subtitle?: string | null;
  url: string;
  published_at?: string | null;
  cover_image?: string | null;
  reaction_count?: number;
};

export type FrontendCategoryProps = PageProps<{
  category: Category;
  posts?: CategoryArchivePosts;
  infocus?: Post[] | null;
  sawteeInMedia?: Post[] | null;
  events?: Post[] | null;
  substackFeed?: SubstackFeedItem[] | null;
  featured_image?: string | null;
  srcSet?: string | null;
  seo?: SeoMeta;
}>;

export type SearchResultPost = Post & {
  category?: Category | string | null;
  category_slug?: string;
};

export type SearchFilterOptionCategory = {
  name: string;
  slug: string;
};

export type SearchFilterOptionTheme = {
  id: number;
  title: string;
};

export type SearchFilters = {
  category?: string | null;
  year?: number | null;
  theme?: number | null;
};

export type SearchFilterOptions = {
  categories: SearchFilterOptionCategory[];
  years: number[];
  themes: SearchFilterOptionTheme[];
};

export type FrontendSearchProps = PageProps<{
  posts?: Paginated<SearchResultPost>;
  query?: string;
  filters?: SearchFilters;
  filterOptions?: SearchFilterOptions;
  seo?: SeoMeta;
}>;

export type FrontendArchiveProps = PageProps<{
  meta_title?: string;
  meta_description?: string;
  layout_title?: string;
  posts?: Paginated<Post> | Post[];
  sawteeInMedia?: Post[] | null;
  category?: Category;
  publications?: PublicationsBySlug | Paginated<Publication> | null;
  teams?: SimplePaginated<Team> | null;
  infocus?: Post[] | null;
  featured_image?: string | null;
  srcSet?: string | null;
  seo?: SeoMeta;
}>;

export type FrontendArticleProps = PageProps<{
  article: Article;
  volume: Publication;
  featured_image?: string | null;
  srcSet?: string | null;
  relatedArticles?: Pick<Article, 'id' | 'title' | 'slug' | 'published_at'>[];
  seo?: SeoMeta;
}>;

export type FrontendTradeInsightProps = PageProps<{
  tradeInsightVolume: Publication;
  media?: string | null;
  seo?: SeoMeta;
}>;

export type FrontendTeamsArchiveProps = PageProps<{
  category: Category;
  teams: SimplePaginated<Team>;
  featured_image?: string | null;
  srcSet?: string | null;
  seo?: SeoMeta;
}>;

export type FrontendPublicationsArchiveProps = PageProps<{
  category: Category;
  publications?: PublicationsBySlug | null;
  infocus?: Post[] | null;
  sawteeInMedia?: Post[] | null;
  featured_image?: string | null;
  srcSet?: string | null;
  seo?: SeoMeta;
  showSubscriptionBox?: boolean;
}>;

export type FrontendPublicationCategoryProps = PageProps<{
  category: Category;
  publications: Paginated<Publication>;
  infocus?: Post[] | null;
  sawteeInMedia?: Post[] | null;
  featured_image?: string | null;
  srcSet?: string | null;
  seo?: SeoMeta;
  showSubscriptionBox?: boolean;
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
