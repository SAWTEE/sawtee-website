import MainLayout from '@/layouts/MainLayout';
import PageLayout from '@/layouts/PageLayout';
import PostLayout from '@/layouts/PostLayout';

type PageChrome = {
  title?: string | null;
  featured_image?: string | null;
  srcSet?: string | null;
};

type PostChrome = {
  post: unknown;
  relatedPosts?: unknown;
  featured_image?: string | null;
  srcSet?: string | null;
};

/**
 * Nested persistent layouts: public site shell + page/archive hero chrome.
 * Use as `Page.layout = mainWithPageLayout(props => ({ title: props… }))`.
 */
export function mainWithPageLayout(
  getChrome: (props: Record<string, any>) => PageChrome
) {
  return (props: Record<string, any>) => [
    MainLayout,
    [PageLayout, getChrome(props)],
  ];
}

/**
 * Nested persistent layouts: public site shell + post article chrome.
 */
export function mainWithPostLayout(
  getChrome: (props: Record<string, any>) => PostChrome
) {
  return (props: Record<string, any>) => [
    MainLayout,
    [PostLayout, getChrome(props)],
  ];
}
