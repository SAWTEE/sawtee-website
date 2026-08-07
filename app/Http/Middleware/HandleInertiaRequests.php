<?php

namespace App\Http\Middleware;

use App\Support\MenuTreeBuilder;
use Illuminate\Http\Request;
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
                'user' => $request->user()
                    ? $request->user()->only('id', 'name', 'email', 'email_verified_at')
                    : null,
            ],
            // Compatibility shim: session flash still works; prefer Inertia::flash() for new code.
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
            ],
            // Ziggy is already injected via Blade @routes on the first visit.
            // Only share on full document / SSR requests so XHR navigations stay lean.
            'ziggy' => fn () => $request->header('X-Inertia')
                ? [
                    'location' => $request->url(),
                ]
                : [
                    ...(new Ziggy)->toArray(),
                    'location' => $request->url(),
                ],
        ]);
    }

    /**
     * Menus are stable and only needed on the public frontend (not /admin).
     * Once props are remembered client-side; visiting /admin forgets them so
     * the next frontend visit resolves fresh trees after menu CRUD.
     *
     * @return array<string, callable>
     */
    public function shareOnce(Request $request): array
    {
        if ($request->is('admin', 'admin/*')) {
            return [];
        }

        $menus = app(MenuTreeBuilder::class);

        return [
            'primaryMenu' => fn () => $menus->forLocation('header'),
            'footerMenu' => fn () => $menus->forLocation('footer'),
        ];
    }
}
