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
        return Inertia::render('Frontend/Pages/Home', array_merge(
            $homePageData->assemble(),
            [
                'seo' => $seo->for(
                    title: 'Home',
                    description: "Explore South Asia's dynamic journey since the 1980s, navigating global integration and economic challenges.",
                    image: '/assets/logo-sawtee.webp',
                ),
            ],
        ));
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
