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
use Illuminate\Support\Collection;

class HomePageDataAssembler
{
    /**
     * Assemble Inertia props for the frontend home page.
     *
     * @return array<string, mixed>
     */
    public function assemble(): array
    {
        $slidesResponsiveImages = [];

        $featuredPublications = Publication::query()
            ->whereHas('tags', fn (Builder $query) => $query->where('name', 'featured'))
            ->with(['file', 'category'])
            ->latest()
            ->limit(3)
            ->get();

        $featuredBlogPosts = [
            ...$this->featuredPostsByCategorySlug('opinion-in-lead', 1),
            ...$this->featuredPostsByCategorySlug('commentary', 1),
            ...$this->featuredPostsByCategorySlug('blog', 1),
        ];

        $publications = Publication::query()
            ->with(['file', 'category'])
            ->orderBy('id', 'DESC')
            ->limit(6)
            ->get();

        [$slides, $slidesResponsiveImages] = $this->homeSlides();

        return [
            'slides' => $slides,
            'infocus' => $this->featuredPostsByCategorySlug('in-focus', 5),
            'sawteeInMedia' => $this->publishedPostsByCategorySlug('sawtee-in-media', 6),
            'events' => $this->publishedPostsByCategorySlug('featured-events', 5),
            'featuredPublications' => $featuredPublications,
            'featuredBlogPosts' => $featuredBlogPosts,
            'publications' => $publications,
            'newsletters' => $this->publishedPostsByCategorySlug('newsletters', 6),
            'webinars' => $this->publishedPostsByCategorySlug('webinar-series', 5),
            'slidesResponsiveImages' => $slidesResponsiveImages,
            'homePageSections' => HomePageSection::all(),
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
     * @return array{0: Collection<int, Slide>, 1: list<string>}
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
            : collect();

        foreach ($slides as $slide) {
            $media = $slide->getFirstMedia('slides');
            $responsive = $media?->getSrcSet('responsive');

            if ($responsive) {
                $slidesResponsiveImages[] = $responsive;
            }
        }

        return [$slides, $slidesResponsiveImages];
    }
}
