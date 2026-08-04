<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

class ContentCache
{
    public const MENU_TTL = 3600;

    public const HOME_TTL = 300;

    public const TAXONOMY_TTL = 1800;

    public static function menuKey(string $location): string
    {
        return "menus.location.{$location}";
    }

    public static function homeKey(): string
    {
        return 'home.page.data';
    }

    public static function forgetMenus(): void
    {
        foreach (['header', 'footer'] as $location) {
            Cache::forget(self::menuKey($location));
        }
    }

    public static function forgetHome(): void
    {
        Cache::forget(self::homeKey());
    }

    public static function forgetAll(): void
    {
        self::forgetMenus();
        self::forgetHome();
        app(SitemapCache::class)->forget();
    }
}
