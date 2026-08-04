<?php

namespace App\Http\Middleware;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
            ],
            'primaryMenu' => fn () => $this->menuItemsForLocation('header'),
            'footerMenu' => fn () => $this->menuItemsForLocation('footer'),
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ]);
    }

    /**
     * @return Collection<int, MenuItem>
     */
    protected function menuItemsForLocation(string $location)
    {
        try {
            $menu = Menu::where('location', $location)->first();

            if (! $menu) {
                return collect();
            }

            return MenuItem::with('children')
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
