<?php

namespace App\Support;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class MenuTreeBuilder
{
    /**
     * Build the root menu item tree for a menu location (header, footer, etc.).
     *
     * @return Collection<int, MenuItem>
     */
    public function forLocation(string $location): Collection
    {
        try {
            $menu = Menu::query()->where('location', $location)->first();

            if (! $menu) {
                return collect();
            }

            return MenuItem::query()
                ->with('children')
                ->where('menu_id', $menu->id)
                ->where(function ($query) {
                    $query->whereNull('parent_id')
                        ->orWhere('parent_id', 0);
                })
                ->orderBy('order', 'ASC')
                ->get();
        } catch (\Throwable $e) {
            Log::warning('Failed to load Inertia menu items.', [
                'location' => $location,
                'message' => $e->getMessage(),
            ]);

            return collect();
        }
    }
}
