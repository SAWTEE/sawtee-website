import { describe, expect, it } from 'vitest';

import type {
  Article,
  FrontendArchiveProps,
  FrontendArticleProps,
  FrontendCategoryProps,
  FrontendPageProps,
  FrontendPostProps,
  FrontendPublicationCategoryProps,
  FrontendPublicationsArchiveProps,
  FrontendSearchProps,
  FrontendTeamsArchiveProps,
  FrontendTradeInsightProps,
  HomePageProps,
  PageSection,
  ResearchByYear,
  SeoMeta,
  Team,
  Theme,
} from '@/types';
import { emptySharedProps } from '@/types';

const seo: SeoMeta = {
  title: 'Fixture',
  description: 'Fixture description',
  image: '/assets/logo-sawtee.webp',
  type: 'website',
};

describe('Frontend page prop contracts', () => {
  it('HomePageProps accepts assembler payload', () => {
    const props: HomePageProps = {
      ...emptySharedProps(),
      slides: [],
      infocus: [],
      sawteeInMedia: [],
      events: [],
      featuredPublications: [],
      featuredBlogPosts: [],
      publications: [],
      newsletters: [],
      webinars: [],
      slidesResponsiveImages: [],
      homePageSections: [{ id: 1, name: 'Carousel', show: 1 }],
      seo,
    };

    expect(props.homePageSections?.[0]?.name).toBe('Carousel');
    expect(props.seo?.title).toBe('Fixture');
  });

  it('FrontendPageProps requires page slug and seo', () => {
    const sections: PageSection[] = [
      {
        id: 1,
        title: 'Intro',
        description: '<p>Hi</p>',
        type: 'default',
        parent_id: null,
        page_id: 1,
        order: 0,
      },
    ];
    const themes: Theme[] = [
      { id: 1, title: 'Trade', description: 'Trade theme' },
    ];

    const props: FrontendPageProps = {
      ...emptySharedProps(),
      page: {
        id: 1,
        name: 'About',
        slug: 'about',
        content: '<p>Hi</p>',
        page_template: 'DefaultPage',
      },
      sections,
      themes,
      featured_image: null,
      seo,
    };

    expect(props.page.slug).toBe('about');
    expect(props.sections?.[0]?.type).toBe('default');
  });

  it('FrontendPostProps and Search props type-check with fixtures', () => {
    const postProps: FrontendPostProps = {
      ...emptySharedProps(),
      post: {
        id: 1,
        title: 'Hello',
        slug: 'hello',
        content: '<p>Body</p>',
        category: { id: 1, name: 'Blog', slug: 'blog', parent: null },
      },
      featured_image: null,
      relatedPosts: [],
      seo: { ...seo, type: 'article', jsonLd: { '@type': 'Article' } },
    };

    const searchProps: FrontendSearchProps = {
      ...emptySharedProps(),
      query: 'trade',
      posts: {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: null,
        to: null,
        path: '/search',
        links: [],
      },
      seo,
    };

    const researchByYear: ResearchByYear = {
      '2024': [
        {
          id: 1,
          title: 'Report',
          year: 2024,
          file: { id: 1, name: 'report.pdf' },
        },
      ],
    };

    const categoryProps: FrontendCategoryProps = {
      ...emptySharedProps(),
      category: { id: 1, name: 'In Focus', slug: 'in-focus' },
      posts: {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: null,
        to: null,
        path: '/',
        links: [],
      },
      seo,
    };

    const researchCategory: FrontendCategoryProps = {
      ...emptySharedProps(),
      category: { id: 2, name: 'Research', slug: 'research' },
      posts: researchByYear,
      seo,
    };

    const archiveProps: FrontendArchiveProps = {
      ...emptySharedProps(),
      layout_title: 'Tag',
      posts: {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: null,
        to: null,
        path: '/',
        links: [],
      },
      seo,
    };

    expect(postProps.post.slug).toBe('hello');
    expect(searchProps.query).toBe('trade');
    expect(categoryProps.category.slug).toBe('in-focus');
    expect(researchCategory.posts).toBe(researchByYear);
    expect(archiveProps.layout_title).toBe('Tag');
  });

  it('article, trade insight, teams, and publication archive props type-check', () => {
    const article: Article = {
      id: 1,
      title: 'Article',
      publication_id: 10,
      slug: 'article',
      published_at: '2024-01-01T00:00:00Z',
      author: 'Author',
    };

    const articleProps: FrontendArticleProps = {
      ...emptySharedProps(),
      article,
      volume: {
        id: 10,
        title: 'Vol 1',
        volume: 'Vol 1',
        volume_slug: 'vol-1',
        slug: 'vol-1',
      },
      relatedArticles: [
        {
          id: 2,
          title: 'Related',
          slug: 'related',
          published_at: '2024-01-02T00:00:00Z',
        },
      ],
      featured_image: null,
      seo,
    };

    const tradeProps: FrontendTradeInsightProps = {
      ...emptySharedProps(),
      tradeInsightVolume: {
        id: 10,
        title: 'Vol 1',
        volume: 'Vol 1',
        volume_slug: 'vol-1',
        articles: [article],
        file: { id: 1, name: 'vol.pdf' },
      },
      media: '/cover.jpg',
      seo,
    };

    const team: Team = { id: 1, name: 'Expert', designation: 'Director' };
    const teamsProps: FrontendTeamsArchiveProps = {
      ...emptySharedProps(),
      category: { id: 3, name: 'Teams', slug: 'teams' },
      teams: {
        data: [team],
        current_page: 1,
        from: 1,
        to: 1,
        path: '/category/teams',
        per_page: 10,
        next_page_url: null,
        prev_page_url: null,
      },
      featured_image: null,
      seo,
    };

    const pubsArchive: FrontendPublicationsArchiveProps = {
      ...emptySharedProps(),
      category: {
        id: 4,
        name: 'Publications',
        slug: 'publications',
        children: [
          {
            id: 5,
            name: 'English',
            slug: 'english',
            children: [
              {
                id: 6,
                name: 'Trade Insight',
                slug: 'trade-insight',
                children: [
                  { id: 7, name: 'Special Series', slug: 'special-series' },
                ],
              },
            ],
          },
        ],
      },
      publications: {
        english: [],
        'trade-insight': [
          {
            id: 1,
            title: 'TI',
            volume_slug: 'vol-1',
            media: [],
            file: { id: 1, name: 'ti.pdf' },
          },
        ],
        'special-series': [],
      },
      seo,
    };

    const pubCategory: FrontendPublicationCategoryProps = {
      ...emptySharedProps(),
      category: { id: 5, name: 'Trade Insight', slug: 'trade-insight' },
      publications: {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
        from: null,
        to: null,
        path: '/',
        links: [],
      },
      seo,
    };

    expect(articleProps.article.slug).toBe('article');
    expect(tradeProps.tradeInsightVolume.volume_slug).toBe('vol-1');
    expect(teamsProps.teams.data[0]?.name).toBe('Expert');
    expect(pubsArchive.publications?.['trade-insight']?.[0]?.title).toBe('TI');
    expect(pubCategory.publications.per_page).toBe(12);
  });
});
