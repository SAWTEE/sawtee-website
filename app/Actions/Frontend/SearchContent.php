<?php

namespace App\Actions\Frontend;

use App\Models\Article;
use App\Models\Category;
use App\Models\Post;
use App\Models\Publication;
use App\Models\Research;
use App\Models\Theme;
use App\Support\ResolvesSeoMeta;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class SearchContent
{
    private const int PER_PAGE = 15;

    private const int PER_SOURCE_LIMIT = 100;

    public function __construct(protected ResolvesSeoMeta $seo) {}

    /**
     * @param  array{query: string, category: string, year: int|null, theme: int|null, page: int|null}  $filters
     */
    public function handle(array $filters): Response
    {
        $term = $filters['query'];
        $categorySlug = $filters['category'];
        $year = $filters['year'];
        $themeId = $filters['theme'];
        $page = max(1, $filters['page'] ?? 1);

        $scope = $this->resolveSearchScope($categorySlug);

        $results = collect()
            ->when(
                $scope['include_posts'],
                fn (Collection $items) => $items->concat(
                    $this->searchPosts($term, $scope['post_category_ids'], $year, $themeId)
                )
            )
            ->when(
                $scope['include_publications'] && $themeId === null,
                fn (Collection $items) => $items->concat(
                    $this->searchPublications($term, $scope['publication_category_ids'], $year)
                )
            )
            ->when(
                $scope['include_research'] && $themeId === null,
                fn (Collection $items) => $items->concat(
                    $this->searchResearch($term, $year)
                )
            )
            ->when(
                $scope['include_articles'] && $themeId === null,
                fn (Collection $items) => $items->concat(
                    $this->searchArticles($term, $year)
                )
            )
            ->sortByDesc('sort_at')
            ->values();

        $paginator = new LengthAwarePaginator(
            $results->forPage($page, self::PER_PAGE)->values(),
            $results->count(),
            self::PER_PAGE,
            $page,
            [
                'path' => request()->url(),
                'query' => request()->query(),
            ]
        );

        $paginator->appends(array_filter([
            'query' => $term !== '' ? $term : null,
            'category' => $categorySlug !== '' ? $categorySlug : null,
            'year' => $year,
            'theme' => $themeId,
        ], fn ($value) => $value !== null && $value !== ''));

        return Inertia::render('Frontend/SearchPage', [
            'posts' => $paginator,
            'query' => $term,
            'filters' => [
                'category' => $categorySlug !== '' ? $categorySlug : null,
                'year' => $year,
                'theme' => $themeId,
            ],
            'filterOptions' => [
                'categories' => $this->categoryOptions(),
                'years' => $this->yearOptions(),
                'themes' => $this->themeOptions(),
            ],
            'seo' => $this->seo->for(
                title: $term !== '' ? "Search: {$term}" : 'Search',
                description: 'Search SAWTEE publications, posts, research, and resources.',
            ),
        ]);
    }

    /**
     * @return array{
     *     include_posts: bool,
     *     include_publications: bool,
     *     include_research: bool,
     *     include_articles: bool,
     *     post_category_ids: list<int>|null,
     *     publication_category_ids: list<int>|null
     * }
     */
    private function resolveSearchScope(string $slug): array
    {
        $default = [
            'include_posts' => true,
            'include_publications' => true,
            'include_research' => true,
            'include_articles' => true,
            'post_category_ids' => null,
            'publication_category_ids' => null,
        ];

        if ($slug === '') {
            return $default;
        }

        $category = Category::query()
            ->with('children')
            ->where('slug', $slug)
            ->first();

        if ($category === null) {
            return [
                'include_posts' => false,
                'include_publications' => false,
                'include_research' => false,
                'include_articles' => false,
                'post_category_ids' => [-1],
                'publication_category_ids' => [-1],
            ];
        }

        $ids = $this->categoryIds($category);

        return match ($category->type) {
            'post' => [
                'include_posts' => true,
                'include_publications' => false,
                'include_research' => false,
                'include_articles' => false,
                'post_category_ids' => $ids,
                'publication_category_ids' => null,
            ],
            'publication' => [
                'include_posts' => false,
                'include_publications' => true,
                'include_research' => false,
                'include_articles' => $this->includesTradeInsight($category, $ids),
                'post_category_ids' => null,
                'publication_category_ids' => $ids,
            ],
            'research' => [
                'include_posts' => false,
                'include_publications' => false,
                'include_research' => true,
                'include_articles' => false,
                'post_category_ids' => null,
                'publication_category_ids' => null,
            ],
            default => [
                'include_posts' => false,
                'include_publications' => false,
                'include_research' => false,
                'include_articles' => false,
                'post_category_ids' => [-1],
                'publication_category_ids' => [-1],
            ],
        };
    }

    /**
     * @return list<int>
     */
    private function categoryIds(Category $category): array
    {
        $ids = $category->getCategoriesIds($category);

        if (! is_array($ids) || $ids === []) {
            return [-1];
        }

        return array_values(array_map('intval', $ids));
    }

    /**
     * @param  list<int>  $ids
     */
    private function includesTradeInsight(Category $category, array $ids): bool
    {
        if ($category->slug === 'trade-insight') {
            return true;
        }

        return Category::query()
            ->whereIn('id', $ids)
            ->where('slug', 'trade-insight')
            ->exists();
    }

    /**
     * @param  list<int>|null  $categoryIds
     * @return Collection<int, array<string, mixed>>
     */
    private function searchPosts(string $term, ?array $categoryIds, ?int $year, ?int $themeId): Collection
    {
        return Post::search($term)
            ->take(self::PER_SOURCE_LIMIT)
            ->query(function ($query) use ($categoryIds, $year, $themeId) {
                $query->with(['category.parent'])
                    ->where('posts.status', 'published');

                if ($categoryIds !== null) {
                    $query->whereIn('posts.category_id', $categoryIds);
                }

                if ($year !== null) {
                    $query->whereYear('posts.published_at', $year);
                }

                if ($themeId !== null) {
                    $query->where('posts.theme_id', $themeId);
                }
            })
            ->get()
            ->map(fn (Post $post) => $this->mapPost($post));
    }

    /**
     * @param  list<int>|null  $categoryIds
     * @return Collection<int, array<string, mixed>>
     */
    private function searchPublications(string $term, ?array $categoryIds, ?int $year): Collection
    {
        return Publication::search($term)
            ->take(self::PER_SOURCE_LIMIT)
            ->query(function ($query) use ($categoryIds, $year) {
                $query->with(['category', 'file']);

                if ($categoryIds !== null) {
                    $query->whereIn('publications.category_id', $categoryIds);
                }

                if ($year !== null) {
                    $query->whereYear('publications.created_at', $year);
                }
            })
            ->get()
            ->map(fn (Publication $publication) => $this->mapPublication($publication));
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function searchResearch(string $term, ?int $year): Collection
    {
        return Research::search($term)
            ->take(self::PER_SOURCE_LIMIT)
            ->query(function ($query) use ($year) {
                $query->with('file');

                if ($year !== null) {
                    $query->where('research.year', $year);
                }
            })
            ->get()
            ->map(fn (Research $research) => $this->mapResearch($research));
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function searchArticles(string $term, ?int $year): Collection
    {
        return Article::search($term)
            ->take(self::PER_SOURCE_LIMIT)
            ->query(function ($query) use ($year) {
                $query->with(['publication.category', 'publication.file'])
                    ->whereNotNull('articles.published_at');

                if ($year !== null) {
                    $query->whereYear('articles.published_at', $year);
                }
            })
            ->get()
            ->map(fn (Article $article) => $this->mapArticle($article));
    }

    /**
     * @return array<string, mixed>
     */
    private function mapPost(Post $post): array
    {
        $category = $post->category;
        $parentSlug = $category?->parent?->slug;
        $slug = $category?->slug;

        $href = match (true) {
            $parentSlug && $slug => "/category/{$parentSlug}/{$slug}/{$post->slug}",
            (bool) $slug => "/category/{$slug}/{$post->slug}",
            default => '#',
        };

        return [
            'id' => $post->id,
            'result_type' => 'post',
            'title' => $post->title,
            'excerpt' => $post->excerpt,
            'author' => $post->author,
            'slug' => $post->slug,
            'published_at' => optional($post->published_at)?->toDateTimeString(),
            'category' => $category?->name,
            'category_slug' => $slug,
            'href' => $href,
            'sort_at' => $this->sortTimestamp($post->published_at ?? $post->created_at),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function mapPublication(Publication $publication): array
    {
        $category = $publication->category;
        $slug = $category?->slug;
        $href = $this->publicationHref($publication);

        return [
            'id' => $publication->id,
            'result_type' => 'publication',
            'title' => $publication->title,
            'excerpt' => $publication->subtitle ?: $publication->description,
            'author' => null,
            'slug' => $publication->volume_slug ?: $publication->slug,
            'published_at' => optional($publication->created_at)?->toDateTimeString(),
            'category' => $category?->name ?? 'Publications',
            'category_slug' => $slug,
            'href' => $href,
            'sort_at' => $this->sortTimestamp($publication->created_at),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function mapResearch(Research $research): array
    {
        $fileName = $research->file?->name;
        $href = $fileName
            ? '/Research_Reports/'.$fileName
            : ($research->link ?: '#');

        return [
            'id' => $research->id,
            'result_type' => 'research',
            'title' => $research->title,
            'excerpt' => $research->subtitle ?: $research->description,
            'author' => null,
            'slug' => $research->slug,
            'published_at' => $research->year ? $research->year.'-01-01 00:00:00' : null,
            'category' => 'Research',
            'category_slug' => 'research',
            'href' => $href,
            'sort_at' => $research->year
                ? Carbon::create($research->year)->startOfYear()->getTimestamp()
                : $this->sortTimestamp($research->created_at),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function mapArticle(Article $article): array
    {
        $volume = $article->publication;
        $volumeSlug = $volume?->volume_slug ?: $volume?->slug;
        $href = $volumeSlug
            ? "/category/publications/trade-insight/{$volumeSlug}/{$article->slug}"
            : '#';

        return [
            'id' => $article->id,
            'result_type' => 'article',
            'title' => $article->title,
            'excerpt' => $article->excerpt ?: $article->subtitle,
            'author' => $article->author,
            'slug' => $article->slug,
            'published_at' => optional($article->published_at)?->toDateTimeString(),
            'category' => 'Trade Insight',
            'category_slug' => 'trade-insight',
            'href' => $href,
            'sort_at' => $this->sortTimestamp($article->published_at ?? $article->created_at),
        ];
    }

    private function publicationHref(Publication $publication): string
    {
        $categorySlug = $publication->category?->slug;

        if ($categorySlug === 'trade-insight' && $publication->volume_slug) {
            return "/category/publications/trade-insight/{$publication->volume_slug}";
        }

        $fileName = $publication->file?->name;

        if ($fileName) {
            return '/publications/'.$fileName;
        }

        if ($categorySlug && $publication->volume_slug) {
            return "/category/publications/{$categorySlug}/{$publication->volume_slug}";
        }

        return '#';
    }

    private function sortTimestamp(mixed $value): int
    {
        if ($value instanceof Carbon) {
            return $value->getTimestamp();
        }

        if (is_string($value) && $value !== '') {
            return Carbon::parse($value)->getTimestamp();
        }

        return 0;
    }

    /**
     * @return Collection<int, array{name: string, slug: string}>
     */
    private function categoryOptions(): Collection
    {
        $postCategories = Category::query()
            ->ofType('post')
            ->whereHas('posts', fn (Builder $query) => $query->where('status', 'published'))
            ->orderBy('name')
            ->get(['name', 'slug']);

        $publicationCategories = Category::query()
            ->ofType('publication')
            ->whereHas('publications')
            ->orderBy('name')
            ->get(['name', 'slug']);

        $research = Category::query()
            ->ofType('research')
            ->orderBy('name')
            ->get(['name', 'slug']);

        return $postCategories
            ->concat($publicationCategories)
            ->concat($research)
            ->unique('slug')
            ->sortBy('name', SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->map(fn (Category $category) => [
                'name' => $category->name,
                'slug' => $category->slug,
            ]);
    }

    /**
     * @return list<int>
     */
    private function yearOptions(): array
    {
        $postYears = Post::query()
            ->published()
            ->whereNotNull('published_at')
            ->pluck('published_at')
            ->map(fn ($date) => (int) $date->format('Y'));

        $publicationYears = Publication::query()
            ->whereNotNull('created_at')
            ->pluck('created_at')
            ->map(fn ($date) => (int) $date->format('Y'));

        $researchYears = Research::query()
            ->whereNotNull('year')
            ->pluck('year')
            ->map(fn ($year) => (int) $year);

        $articleYears = Article::query()
            ->whereNotNull('published_at')
            ->pluck('published_at')
            ->map(fn ($date) => (int) $date->format('Y'));

        return $postYears
            ->concat($publicationYears)
            ->concat($researchYears)
            ->concat($articleYears)
            ->unique()
            ->sortDesc()
            ->values()
            ->all();
    }

    /**
     * @return Collection<int, array{id: int, title: string}>
     */
    private function themeOptions(): Collection
    {
        return Theme::query()
            ->whereHas('posts', fn (Builder $query) => $query->where('status', 'published'))
            ->orderBy('title')
            ->get(['id', 'title'])
            ->map(fn (Theme $theme) => [
                'id' => $theme->id,
                'title' => $theme->title,
            ])
            ->values();
    }
}
