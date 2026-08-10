<?php

namespace App\Actions\Frontend;

use App\Models\Category;
use App\Models\Post;
use App\Models\Theme;
use App\Support\ResolvesSeoMeta;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class SearchContent
{
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

        $categoryIds = $this->resolveCategoryIds($categorySlug);

        $posts = Post::search($term)
            ->query(function ($query) use ($categoryIds, $year, $themeId) {
                $query->join('categories', 'posts.category_id', 'categories.id')
                    ->select([
                        'posts.id',
                        'posts.title',
                        'posts.author',
                        'posts.excerpt',
                        'posts.slug',
                        'posts.published_at',
                        'posts.theme_id',
                        'categories.name as category',
                        'categories.slug as category_slug',
                    ])
                    ->orderBy('posts.id', 'DESC');

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
            ->paginate();

        $posts->appends(array_filter([
            'query' => $term !== '' ? $term : null,
            'category' => $categorySlug !== '' ? $categorySlug : null,
            'year' => $year,
            'theme' => $themeId,
        ], fn ($value) => $value !== null && $value !== ''));

        $activeFilters = [
            'category' => $categorySlug !== '' ? $categorySlug : null,
            'year' => $year,
            'theme' => $themeId,
        ];

        return Inertia::render('Frontend/SearchPage', [
            'posts' => $posts,
            'query' => $term,
            'filters' => $activeFilters,
            'filterOptions' => [
                'categories' => $this->categoryOptions(),
                'years' => $this->yearOptions(),
                'themes' => $this->themeOptions(),
            ],
            'seo' => $this->seo->for(
                title: $term !== '' ? "Search: {$term}" : 'Search',
                description: 'Search SAWTEE publications, posts, and resources.',
            ),
        ]);
    }

    /**
     * @return list<int>|null
     */
    private function resolveCategoryIds(string $slug): ?array
    {
        if ($slug === '') {
            return null;
        }

        $category = Category::query()
            ->with('children')
            ->where('slug', $slug)
            ->first();

        if ($category === null) {
            return [-1];
        }

        $ids = $category->getCategoriesIds($category);

        return is_array($ids) && $ids !== [] ? array_values(array_map('intval', $ids)) : [-1];
    }

    /**
     * @return Collection<int, array{name: string, slug: string}>
     */
    private function categoryOptions(): Collection
    {
        return Category::query()
            ->ofType('post')
            ->whereHas('posts', fn (Builder $query) => $query->where('status', 'published'))
            ->orderBy('name')
            ->get(['name', 'slug'])
            ->map(fn (Category $category) => [
                'name' => $category->name,
                'slug' => $category->slug,
            ])
            ->values();
    }

    /**
     * @return list<int>
     */
    private function yearOptions(): array
    {
        return Post::query()
            ->published()
            ->whereNotNull('published_at')
            ->pluck('published_at')
            ->map(fn ($date) => (int) $date->format('Y'))
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
