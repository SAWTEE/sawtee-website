<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

class ContentCache
{
    public const MENU_TTL = 3600;

    public const HOME_TTL = 300;

    public const TAXONOMY_TTL = 1800;

    /**
     * Bump when cached payload shape changes (e.g. arrays instead of Eloquent).
     */
    public const PAYLOAD_VERSION = 'v4';

    public static function menuKey(string $location): string
    {
        return 'menus.'.self::PAYLOAD_VERSION.".location.{$location}";
    }

    public static function homeKey(): string
    {
        return 'home.page.data.'.self::PAYLOAD_VERSION;
    }

    public static function forgetMenus(): void
    {
        foreach (['header', 'footer'] as $location) {
            Cache::forget("menus.location.{$location}");
            Cache::forget(self::menuKey($location));
        }
    }

    public static function forgetHome(): void
    {
        Cache::forget('home.page.data');
        Cache::forget(self::homeKey());
    }

    /**
     * Drop legacy Eloquent-serialized cache entries (pre-PAYLOAD_VERSION keys).
     * Safe to call on every boot: current versioned keys are left intact.
     */
    public static function forgetStaleObjectCaches(): void
    {
        foreach (['header', 'footer'] as $location) {
            Cache::forget("menus.location.{$location}");
        }

        Cache::forget('home.page.data');
    }

    public static function forgetAll(): void
    {
        self::forgetMenus();
        self::forgetHome();
        app(SitemapCache::class)->forget();
    }
}
