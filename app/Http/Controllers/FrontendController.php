<?php

namespace App\Http\Controllers;

use App\Actions\Frontend\BuildCategoryArchive;
use App\Actions\Frontend\BuildTagArchive;
use App\Actions\Frontend\BuildThemeArchive;
use App\Actions\Frontend\ResolvePageBySlug;
use App\Support\HomePageDataAssembler;
use App\Support\ResolvesSeoMeta;
use App\Support\ResponsiveImageSet;
use App\Support\SiteCopy;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{
    public function index(HomePageDataAssembler $homePageData, ResolvesSeoMeta $seo): Response
    {
        $home = $homePageData->assemble();
        $copy = SiteCopy::all();
        [$lcpImage, $lcpSrcSet] = $this->lcpImageFromHome($home);

        // First paint: slider, LCP, and the featured sidebar. Below-the-fold defers.
        $critical = [
            'slides' => $home['slides'] ?? null,
            'slidesResponsiveImages' => $home['slidesResponsiveImages'] ?? null,
            'homePageSections' => $home['homePageSections'] ?? null,
            'featuredPublications' => $home['featuredPublications'] ?? null,
            'featuredBlogPosts' => $home['featuredBlogPosts'] ?? null,
        ];

        return Inertia::render('Frontend/Pages/Home', array_merge(
            $critical,
            [
                'infocus' => Inertia::defer(fn () => $home['infocus'] ?? null, 'below'),
                'events' => Inertia::defer(fn () => $home['events'] ?? null, 'below'),
                'publications' => Inertia::defer(fn () => $home['publications'] ?? null, 'below'),
                'sawteeInMedia' => Inertia::defer(fn () => $home['sawteeInMedia'] ?? null, 'below'),
                'newsletters' => Inertia::defer(fn () => $home['newsletters'] ?? null, 'below'),
                'webinars' => Inertia::defer(fn () => $home['webinars'] ?? null, 'below'),
                'seo' => $seo->for(
                    title: 'Home',
                    description: (string) ($copy['seo']['home_description'] ?? ''),
                    image: (string) ($copy['seo']['default_image'] ?? '/assets/logo-sawtee.webp'),
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

    /**
     * Prefer a srcset candidate for preload/src so HTTP/1.1 does not fetch the
     * original file and a width variant as two competing hero requests.
     *
     * @param  array<string, mixed>  $home
     * @return array{0: string|null, 1: string|null}
     */
    private function lcpImageFromHome(array $home): array
    {
        $original = data_get($home, 'slides.0.media.0.original_url');
        $srcSet = data_get($home, 'slides.0.media.0.srcset')
            ?: data_get($home, 'slidesResponsiveImages.0')
            ?: null;
        $srcSet = is_string($srcSet) && $srcSet !== '' ? $srcSet : null;
        $fromSrcSet = ResponsiveImageSet::firstUrl($srcSet);
        $image = $fromSrcSet
            ?? (is_string($original) && $original !== '' ? $original : null);

        return [$image, $srcSet];
    }
}
