import WebsiteHead from '@/components/Frontend/Head';
import PostHeader from '@/components/Frontend/post/post-header';
import PostPreviewCard from '@/components/Frontend/PostPreviewCard';
import MainLayout from '@/components/Layouts/MainLayout';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/components/Frontend/Pagination';

export default function SearchPage({ posts, query }) {
  const [searchQuery, setSearchQuery] = useState(query ?? '');
  const [state, setState] = useState({
    query: query,
    loading: true,
    error: null,
    data: posts?.data,
  });

  function handleSubmit(e) {
    e.preventDefault();
    router.visit(`/search`, {
      data: { query: searchQuery, page: 1 },
      onSuccess: () => {
        setState({ ...state, loading: false,  data: posts?.data });
      },
    });
  }
  // console.log('SearchPage posts:', posts);

  return (
    <>
      <WebsiteHead title={'Search Page'} />

      <MainLayout>
        <div>
          <div className="relative z-0 h-80 max-h-80 w-full bg-white/20 dark:bg-black/75">
            <div
              className="absolute inset-0 -z-[1] h-full w-full bg-[url(/assets/pattern-tile-green.svg)] dark:bg-[url(/assets/pattern-tile-light-fade.svg)]"
              style={{
                backgroundSize: '1018px',
                backgroundPosition: 'top center',
                backgroundBlendMode: 'multiply',
              }}
            />
            <PostHeader
              className={
                'absolute bottom-4 left-12 z-10 px-2 text-left text-gray-800 dark:text-gray-200'
              }
              heading={'Search Page'}
            />
          </div>
          <div className="mx-auto max-w-5xl px-[32px] py-[80px] text-lg leading-8 md:px-0">
            <form onSubmit={handleSubmit} className="mb-10">
              <label
                htmlFor="search-modal"
                className="font-bold text-slate-800 dark:text-slate-300"
              >
                Search
              </label>

              <Input
                id="search-modal"
                className="[&::-webkit-search-decoration]:none placeholder-text-muted-foreground h-12 w-full appearance-none border bg-bgDarker py-3 text-sm"
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </form>
            {searchQuery && posts
              ? `Found ${posts?.total} ${posts?.total > 1 ? 'results' : 'result'} for "${searchQuery}"`
              : 'Start typing to search the website'}

            <div className="grid place-items-center gap-10 md:grid-cols-2">
              {!state.data && searchQuery && (
                <div className="flex h-20 items-center justify-center space-x-2 bg-white dark:invert">
                  <span className="sr-only">Loading...</span>
                  <div className="h-6 w-6 animate-bounce rounded-full bg-black [animation-delay:-0.3s]"></div>
                  <div className="h-6 w-6 animate-bounce rounded-full bg-black [animation-delay:-0.15s]"></div>
                  <div className="h-6 w-6 animate-bounce rounded-full bg-black"></div>
                </div>
              )}
              {state.data?.map(post => {
                return (
                  <PostPreviewCard
                    className="w-full"
                    key={post.id}
                    post={post}
                    showCategoryTag={true}
                  />
                );
              })}
            </div>
            <Pagination
              links={posts.links}
              currentPage={posts.current_page}
              totalPages={posts.last_page}
              nextPage={posts.next_page_url}
              prevPage={posts.prev_page_url}
              className={'mt-8'}
              nextButtonLabel="Next"
              prevButtonLabel="Previous"
            />
          </div>
        </div>
      </MainLayout>
    </>
  );
}
