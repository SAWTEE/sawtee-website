<?php

namespace App\Http\Controllers;

use App\Actions\Frontend\BuildCategoryArchive;
use App\Actions\Frontend\BuildTagArchive;
use App\Actions\Frontend\BuildThemeArchive;
use App\Actions\Frontend\ResolvePageBySlug;
use App\Support\HomePageDataAssembler;
use App\Support\ResolvesSeoMeta;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{
    public function index(HomePageDataAssembler $homePageData, ResolvesSeoMeta $seo): Response
    {
        $home = $homePageData->assemble();
        $lcpImage = data_get($home, 'slides.0.media.0.original_url');
        $lcpSrcSet = data_get($home, 'slidesResponsiveImages.0') ?: null;

        // First paint: slider / LCP / above-the-fold. Sidebar + below-the-fold defer.
        $critical = [
            'slides' => $home['slides'] ?? null,
            'slidesResponsiveImages' => $home['slidesResponsiveImages'] ?? null,
            'infocus' => $home['infocus'] ?? null,
            'homePageSections' => $home['homePageSections'] ?? null,
            'features' => $home['features'] ?? null,
        ];

        return Inertia::render('Frontend/Pages/Home', array_merge(
            $critical,
            [
                'featuredPublications' => Inertia::defer(fn () => $home['featuredPublications'] ?? null, 'sidebar'),
                'featuredBlogPosts' => Inertia::defer(fn () => $home['featuredBlogPosts'] ?? null, 'sidebar'),
                'events' => Inertia::defer(fn () => $home['events'] ?? null, 'below'),
                'publications' => Inertia::defer(fn () => $home['publications'] ?? null, 'below'),
                'sawteeInMedia' => Inertia::defer(fn () => $home['sawteeInMedia'] ?? null, 'below'),
                'newsletters' => Inertia::defer(fn () => $home['newsletters'] ?? null, 'below'),
                'webinars' => Inertia::defer(fn () => $home['webinars'] ?? null, 'below'),
                'seo' => $seo->for(
                    title: 'Home',
                    description: "Explore South Asia's dynamic journey since the 1980s, navigating global integration and economic challenges.",
                    image: '/assets/logo-sawtee.webp',
                ),
            ],
        ))->withViewData([
            // Discoverable in the initial HTML (Inertia Head preload only appears after JS).
            'lcpImage' => is_string($lcpImage) ? $lcpImage : null,
            'lcpSrcSet' => is_string($lcpSrcSet) && $lcpSrcSet !== '' ? $lcpSrcSet : null,
        ]);
    }

    public function page(string $slug, ResolvePageBySlug $resolvePage): Response
    {
        return $resolvePage->handle($slug);
    }

    public function tags(string $slug, BuildTagArchive $buildTagArchive): Response
    {
        return $buildTagArchive->handle($slug);
    }

    public function themes(string $slug, BuildThemeArchive $buildThemeArchive): Response
    {
        return $buildThemeArchive->handle($slug);
    }

    public function category(
        BuildCategoryArchive $buildCategoryArchive,
        string $slug,
        ?string $subcategory = null,
        ?string $post = null,
        ?string $article = null,
    ): Response {
        return $buildCategoryArchive->handle(
            request(),
            $slug,
            $subcategory,
            $post,
            $article,
        );
    }
}
