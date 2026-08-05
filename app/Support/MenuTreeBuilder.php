<?php

namespace App\Support;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class MenuTreeBuilder
{
    /**
     * Build the root menu item tree for a menu location (header, footer, etc.).
     *
     * Cached as plain arrays so Laravel 13's cache.serializable_classes=false
     * does not return __PHP_Incomplete_Class on read.
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function forLocation(string $location): Collection
    {
        $key = ContentCache::menuKey($location);
        $cached = Cache::get($key);

        if ($this->isUnusableCacheValue($cached)) {
            Cache::forget($key);
            $cached = null;
        }

        if (is_array($cached)) {
            return collect($cached);
        }

        $items = $this->buildForLocation($location);
        Cache::put($key, $items, ContentCache::MENU_TTL);

        return collect($items);
    }

    /**
     * @return list<array<string, mixed>>
     */
    protected function buildForLocation(string $location): array
    {
        try {
            $menu = Menu::query()->where('location', $location)->first();

            if (! $menu) {
                return [];
            }

            return MenuItem::query()
                ->with('children')
                ->where('menu_id', $menu->id)
                ->where(function ($query) {
                    $query->whereNull('parent_id')
                        ->orWhere('parent_id', 0);
                })
                ->orderBy('order', 'ASC')
                ->get()
                ->toArray();
        } catch (\Throwable $e) {
            Log::warning('Failed to load Inertia menu items.', [
                'location' => $location,
                'message' => $e->getMessage(),
            ]);

            return [];
        }
    }

    protected function isUnusableCacheValue(mixed $value): bool
    {
        return $value !== null && ! is_array($value);
    }
}
