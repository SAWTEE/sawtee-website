<?php

namespace App\Actions\Frontend;

use App\Models\Page;
use App\Models\Section;
use App\Models\Theme;
use App\Support\HomePageDataAssembler;
use App\Support\MediaConversionUrl;
use App\Support\MediaFellowshipAssembler;
use App\Support\ResolvesSeoMeta;
use App\Support\SiteCopy;
use Inertia\Inertia;
use Inertia\Response;

class ResolvePageBySlug
{
    public function __construct(
        protected HomePageDataAssembler $homePageData,
        protected ResolvesSeoMeta $seo,
    ) {}

    public function handle(string $slug): Response
    {
        if ($slug === 'home') {
            return Inertia::render('Frontend/Pages/Home', array_merge(
                $this->homePageData->assemble(),
                ['seo' => $this->seo->for(title: 'Home', description: (string) (SiteCopy::all()['seo']['home_description'] ?? ''))]
            ));
        }

        $page = Page::query()->where('slug', $slug)->firstOrFail();
        $sections = Section::query()->where('page_id', $page->id)->with('media')->get();
        $themes = $slug === 'our-work' ? Theme::all() : null;
        $featuredImage = $page->getFirstMediaUrl('page-media');

        $props = [
            'page' => $page,
            'sections' => $sections,
            'themes' => $themes,
            'featured_image' => $featuredImage,
            'srcSet' => MediaConversionUrl::optional($page->getFirstMedia('page-media'), 'large'),
            'seo' => $this->seo->for(
                model: $page,
                image: $featuredImage ?: '/assets/logo-sawtee.webp',
            ),
        ];

        if ($page->page_template === 'MediaFellows') {
            $props['fellowships'] = app(MediaFellowshipAssembler::class)->assemble();
        }

        return Inertia::render('Frontend/Page', $props);
    }
}
