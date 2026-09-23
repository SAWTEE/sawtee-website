<?php

namespace App\Support;

use App\Models\Feature;
use App\Models\HomePageSection;
use App\Models\Page;
use App\Models\Post;
use App\Models\Publication;
use App\Models\Slide;
use App\Models\Slider;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class HomePageDataAssembler
{
    /**
     * Columns the home page actually renders. Everything else — post bodies, SEO
     * columns, timestamps, Spatie conversion metadata — is dropped before it is
     * serialised into the Inertia payload.
     *
     * @var list<string>
     */
    private const POST_KEYS = [
        'id', 'title', 'subtitle', 'slug', 'excerpt', 'link', 'published_at',
    ];

    /** @var list<string> */
    private const PUBLICATION_KEYS = [
        'id', 'title', 'subtitle', 'slug', 'volume_slug', 'created_at',
    ];

    /** @var list<string> */
    private const SLIDE_KEYS = ['id', 'title', 'subtitle'];

    /** @var list<string> */
    private const MEDIA_KEYS = [
        'id', 'collection_name', 'original_url', 'preview_url',
    ];

    /** @var list<string> */
    private const CATEGORY_KEYS = ['id', 'name', 'slug'];

    /** @var list<string> */
    private const FILE_KEYS = ['id', 'name'];

    /**
     * Assemble Inertia props for the frontend home page.
     *
     * Cached as plain arrays so Laravel 13's cache.serializable_classes=false
     * does not return __PHP_Incomplete_Class on read.
     *
     * @return array<string, mixed>
     */
    public function assemble(): array
    {
        $key = ContentCache::homeKey();
        $cached = Cache::get($key);

        if ($this->isUnusableCacheValue($cached)) {
            Cache::forget($key);
            $cached = null;
        }

        if (is_array($cached)) {
            return $cached;
        }

        $payload = $this->build();
        Cache::put($key, $payload, ContentCache::HOME_TTL);

        return $payload;
    }

    /**
     * @return array<string, mixed>
     */
    protected function build(): array
    {
        $featuredPublications = Publication::query()
            ->whereHas('tags', fn (Builder $query) => $query->where('name', 'featured'))
            ->with(['file', 'category', 'media'])
            ->latest()
            ->limit(3)
            ->get();

        $featuredBlogPosts = [
            ...$this->featuredPostsByCategorySlug('opinion-in-lead', 1),
            ...$this->featuredPostsByCategorySlug('commentary', 1),
            ...$this->featuredPostsByCategorySlug('blog', 1),
        ];

        $publications = Publication::query()
            ->with(['file', 'category', 'media'])
            ->orderBy('id', 'DESC')
            ->limit(6)
            ->get();

        [$slides, $slidesResponsiveImages] = $this->homeSlides();

        return [
            'slides' => $this->slimSlides($slides),
            'infocus' => $this->slimPosts($this->modelsWithOptimizedMedia(
                $this->featuredPostsByCategorySlug('in-focus', 5),
                'post-featured-image',
                'preview'
            )),
            'sawteeInMedia' => $this->slimPosts($this->modelsWithOptimizedMedia(
                $this->publishedPostsByCategorySlug('sawtee-in-media', 6),
                'post-featured-image',
                'preview'
            )),
            'events' => $this->slimPosts($this->modelsWithOptimizedMedia(
                $this->publishedPostsByCategorySlug('featured-events', 5),
                'post-featured-image',
                // Lead card is wide; large WebP stays sharp without shipping originals.
                // Thumbs on the frontend still prefer preview_url.
                'large'
            )),
            'featuredPublications' => $this->slimPublications($this->modelsWithOptimizedMedia(
                $featuredPublications,
                'publication_featured_image',
                'preview'
            )),
            'featuredBlogPosts' => $this->slimPosts($this->modelsWithOptimizedMedia(
                new EloquentCollection($featuredBlogPosts),
                'post-featured-image',
                'preview'
            )),
            'publications' => $this->slimPublications($this->modelsWithOptimizedMedia(
                $publications,
                'publication_featured_image',
                'preview'
            )),
            'newsletters' => $this->slimPosts($this->modelsWithOptimizedMedia(
                $this->publishedPostsByCategorySlug('newsletters', 6),
                'post-featured-image',
                'preview'
            )),
            'webinars' => $this->slimPosts($this->modelsWithOptimizedMedia(
                $this->publishedPostsByCategorySlug('webinar-series', 5),
                'post-featured-image',
                // Main carousel needs the large WebP; thumbs still read preview_url.
                'large'
            )),
            'slidesResponsiveImages' => $slidesResponsiveImages,
            'homePageSections' => HomePageSection::query()
                ->get(['id', 'name', 'heading', 'intro', 'show'])
                ->toArray(),
            'features' => Feature::query()
                ->active()
                ->orderBy('sort_order')
                ->get()
                ->map->toFrontendArray()
                ->values()
                ->all(),
        ];
    }

    /**
     * @return EloquentCollection<int, Post>
     */
    protected function featuredPostsByCategorySlug(string $slug, int $limit): EloquentCollection
    {
        // Tags are filtered on, not rendered, so they are not eager loaded.
        return Post::query()
            ->with(['category', 'media'])
            ->whereHas('category', fn (Builder $query) => $query->where('slug', $slug))
            ->whereHas('tags', fn (Builder $query) => $query->where('name', 'featured'))
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * @return EloquentCollection<int, Post>
     */
    protected function publishedPostsByCategorySlug(string $slug, int $limit): EloquentCollection
    {
        return Post::query()
            ->with(['category', 'media'])
            ->whereHas('category', fn (Builder $query) => $query->where('slug', $slug))
            ->where('status', 'published')
            ->latest()
            ->take($limit)
            ->get();
    }

    /**
     * @return array{0: list<array<string, mixed>>, 1: list<string>}
     */
    protected function homeSlides(): array
    {
        $slidesResponsiveImages = [];

        $homePage = Page::query()
            ->where(fn (Builder $query) => $query->where('name', 'home')->orWhere('slug', 'home'))
            ->first();

        $slider = $homePage
            ? Slider::query()->where('page_id', $homePage->id)->latest()->first()
            : null;

        $slides = $slider
            ? Slide::query()
                ->where('slider_id', $slider->id)
                ->with('media')
                ->orderBy('id', 'DESC')
                ->take(5)
                ->get()
            : new EloquentCollection;

        $payload = [];

        foreach ($slides as $slide) {
            /** @var Slide $slide */
            $media = $slide->getFirstMedia('slides');
            // Only emit srcSet when the large file exists; a bare conversion URL 404s
            // and can break <img> even when original_url is valid.
            $slidesResponsiveImages[] = MediaConversionUrl::optional($media, 'large') ?? '';
            $payload[] = $this->modelToArrayWithOptimizedMedia($slide, 'slides', 'large');
        }

        return [$payload, $slidesResponsiveImages];
    }

    /**
     * @param  EloquentCollection<int, Model>  $models
     * @return list<array<string, mixed>>
     */
    protected function modelsWithOptimizedMedia(
        EloquentCollection $models,
        string $collection,
        string $conversion
    ): array {
        return $models
            ->map(fn (Model $model) => $this->modelToArrayWithOptimizedMedia($model, $collection, $conversion))
            ->values()
            ->all();
    }

    /**
     * Point frontend `original_url` at a generated conversion when available.
     *
     * @return array<string, mixed>
     */
    protected function modelToArrayWithOptimizedMedia(
        Model $model,
        string $collection,
        string $conversion
    ): array {
        $item = $model->toArray();

        if (! isset($item['media']) || ! is_array($item['media'])) {
            return $item;
        }

        $mediaById = [];
        if (method_exists($model, 'getMedia')) {
            foreach ($model->getMedia($collection) as $media) {
                $mediaById[$media->id] = $media;
            }
        }

        $item['media'] = array_map(function (mixed $mediaArray) use ($collection, $conversion, $mediaById) {
            if (! is_array($mediaArray)) {
                return $mediaArray;
            }

            if (($mediaArray['collection_name'] ?? null) !== $collection) {
                return $mediaArray;
            }

            $id = $mediaArray['id'] ?? null;
            $media = is_numeric($id) ? ($mediaById[(int) $id] ?? null) : null;
            if (! $media instanceof Media) {
                return $mediaArray;
            }

            return $this->optimizeMediaArray($mediaArray, $media, $conversion);
        }, $item['media']);

        return $item;
    }

    /**
     * @param  array<string, mixed>  $mediaArray
     * @return array<string, mixed>
     */
    protected function optimizeMediaArray(array $mediaArray, Media $media, string $conversion): array
    {
        // Use resolve() so legacy on-disk formats (e.g. preview.jpg when preview.webp
        // is registered but missing) never emit a Spatie URL that 404s.
        $mediaArray['preview_url'] = MediaConversionUrl::resolve($media, 'preview');

        // Frontend components read `original_url`; prefer optimized conversions on disk.
        $mediaArray['original_url'] = MediaConversionUrl::resolve($media, $conversion, 'preview');

        return $mediaArray;
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     * @return list<array<string, mixed>>
     */
    protected function slimPosts(array $rows): array
    {
        return array_map(
            // The media list only needs to know whether a body exists, so ship the
            // flag instead of the full HTML (by far the largest prop on the page).
            fn (array $row) => $this->slimRow($row, self::POST_KEYS) + [
                'has_content' => trim((string) ($row['content'] ?? '')) !== '',
            ],
            $rows
        );
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     * @return list<array<string, mixed>>
     */
    protected function slimPublications(array $rows): array
    {
        return array_map(
            fn (array $row) => $this->slimRow($row, self::PUBLICATION_KEYS),
            $rows
        );
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     * @return list<array<string, mixed>>
     */
    protected function slimSlides(array $rows): array
    {
        return array_map(
            fn (array $row) => $this->slimRow($row, self::SLIDE_KEYS),
            $rows
        );
    }

    /**
     * Reduce one row to the whitelisted columns plus slimmed relations.
     *
     * @param  array<string, mixed>  $row
     * @param  list<string>  $keys
     * @return array<string, mixed>
     */
    protected function slimRow(array $row, array $keys): array
    {
        $slim = array_intersect_key($row, array_flip($keys));

        if (isset($row['category']) && is_array($row['category'])) {
            $slim['category'] = array_intersect_key(
                $row['category'],
                array_flip(self::CATEGORY_KEYS)
            );
        }

        if (isset($row['file']) && is_array($row['file'])) {
            $slim['file'] = array_intersect_key(
                $row['file'],
                array_flip(self::FILE_KEYS)
            );
        }

        if (isset($row['media']) && is_array($row['media'])) {
            $slim['media'] = array_values(array_map(
                fn (mixed $media) => is_array($media)
                    ? array_intersect_key($media, array_flip(self::MEDIA_KEYS))
                    : $media,
                $row['media']
            ));
        }

        return $slim;
    }

    protected function isUnusableCacheValue(mixed $value): bool
    {
        if ($value === null) {
            return false;
        }

        if (! is_array($value)) {
            return true;
        }

        foreach ([
            'slides',
            'infocus',
            'sawteeInMedia',
            'events',
            'featuredPublications',
            'featuredBlogPosts',
            'publications',
            'newsletters',
            'webinars',
            'homePageSections',
            'features',
        ] as $key) {
            if (! array_key_exists($key, $value) || ! is_array($value[$key])) {
                return true;
            }
        }

        return ! array_key_exists('slidesResponsiveImages', $value)
            || ! is_array($value['slidesResponsiveImages']);
    }
}
