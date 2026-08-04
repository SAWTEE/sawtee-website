<?php

namespace App\Providers;

use App\MediaLibrary\FileManipulator;
use App\MediaLibrary\ResponsiveImageGenerator;
use App\Models\Article;
use App\Models\Category;
use App\Models\HomePageSection;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\Post;
use App\Models\Publication;
use App\Observers\ContentCacheObserver;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Spatie\MediaLibrary\Conversions\FileManipulator as SpatieFileManipulator;
use Spatie\MediaLibrary\ResponsiveImages\ResponsiveImageGenerator as SpatieResponsiveImageGenerator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Inertia::share('app_url', config('app.url'));

        // Run Media Library conversions / responsive variants through Laravel Image.
        $this->app->bind(SpatieFileManipulator::class, FileManipulator::class);
        $this->app->bind(SpatieResponsiveImageGenerator::class, ResponsiveImageGenerator::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $observer = ContentCacheObserver::class;

        foreach ([
            Page::class,
            Post::class,
            Publication::class,
            Article::class,
            Category::class,
            Menu::class,
            MenuItem::class,
            HomePageSection::class,
        ] as $model) {
            $model::observe($observer);
        }
    }
}
