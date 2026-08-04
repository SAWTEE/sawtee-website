<?php

namespace App\Providers;

use App\MediaLibrary\FileManipulator;
use App\MediaLibrary\ResponsiveImageGenerator;
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
        //
    }
}
