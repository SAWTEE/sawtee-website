import { describe, expect, it } from 'vitest';
import type {
  FrontendArchiveProps,
  FrontendCategoryProps,
  FrontendPageProps,
  FrontendPostProps,
  FrontendSearchProps,
  HomePageProps,
  SeoMeta,
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
    const props: FrontendPageProps = {
      ...emptySharedProps(),
      page: {
        id: 1,
        name: 'About',
        slug: 'about',
        content: '<p>Hi</p>',
        page_template: 'DefaultPage',
      },
      sections: [],
      themes: null,
      featured_image: null,
      seo,
    };

    expect(props.page.slug).toBe('about');
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

    const categoryProps: FrontendCategoryProps = {
      ...emptySharedProps(),
      category: { id: 1, name: 'In Focus', slug: 'in-focus' },
      posts: { data: [] },
      seo,
    };

    const archiveProps: FrontendArchiveProps = {
      ...emptySharedProps(),
      layout_title: 'Tag',
      posts: { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0, from: null, to: null, path: '/', links: [] },
      seo,
    };

    expect(postProps.post.slug).toBe('hello');
    expect(searchProps.query).toBe('trade');
    expect(categoryProps.category.slug).toBe('in-focus');
    expect(archiveProps.layout_title).toBe('Tag');
  });
});
