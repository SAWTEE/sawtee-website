<?php

namespace App\Support;

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
            'slides' => $slides,
            'infocus' => $this->modelsWithOptimizedMedia(
                $this->featuredPostsByCategorySlug('in-focus', 5),
                'post-featured-image',
                'preview'
            ),
            'sawteeInMedia' => $this->modelsWithOptimizedMedia(
                $this->publishedPostsByCategorySlug('sawtee-in-media', 6),
                'post-featured-image',
                'preview'
            ),
            'events' => $this->modelsWithOptimizedMedia(
                $this->publishedPostsByCategorySlug('featured-events', 5),
                'post-featured-image',
                'preview'
            ),
            'featuredPublications' => $this->modelsWithOptimizedMedia(
                $featuredPublications,
                'publication_featured_image',
                'preview'
            ),
            'featuredBlogPosts' => $this->modelsWithOptimizedMedia(
                new EloquentCollection($featuredBlogPosts),
                'post-featured-image',
                'preview'
            ),
            'publications' => $this->modelsWithOptimizedMedia(
                $publications,
                'publication_featured_image',
                'preview'
            ),
            'newsletters' => $this->modelsWithOptimizedMedia(
                $this->publishedPostsByCategorySlug('newsletters', 6),
                'post-featured-image',
                'preview'
            ),
            'webinars' => $this->modelsWithOptimizedMedia(
                $this->publishedPostsByCategorySlug('webinar-series', 5),
                'post-featured-image',
                // Main carousel needs the large WebP; thumbs still read preview_url.
                'large'
            ),
            'slidesResponsiveImages' => $slidesResponsiveImages,
            'homePageSections' => HomePageSection::all()->toArray(),
        ];
    }

    /**
     * @return EloquentCollection<int, Post>
     */
    protected function featuredPostsByCategorySlug(string $slug, int $limit): EloquentCollection
    {
        return Post::query()
            ->with(['category', 'tags', 'media'])
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
        // Spatie appends preview_url from hasGeneratedConversion alone; overwrite when
        // the file is missing (stale flags / format mismatch) so the frontend never 404s.
        $mediaArray['preview_url'] = MediaConversionUrl::isUsable($media, 'preview')
            ? $media->getUrl('preview')
            : $media->getUrl();

        // Frontend components read `original_url`; prefer optimized conversions on disk.
        $mediaArray['original_url'] = MediaConversionUrl::resolve($media, $conversion, 'preview');

        return $mediaArray;
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
        ] as $key) {
            if (! array_key_exists($key, $value) || ! is_array($value[$key])) {
                return true;
            }
        }

        return ! array_key_exists('slidesResponsiveImages', $value)
            || ! is_array($value['slidesResponsiveImages']);
    }
}
