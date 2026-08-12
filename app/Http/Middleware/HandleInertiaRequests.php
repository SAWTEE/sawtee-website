<?php

namespace App\Http\Middleware;

use App\Models\Feature;
use App\Models\SiteSetting;
use App\Support\MemberInstituteAssembler;
use App\Support\MenuTreeBuilder;
use App\Support\ZiggyConfig;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;

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
            // Public guests get a whitelist; admin/auth groups avoid leaking the CMS map.
            'ziggy' => fn () => $request->header('X-Inertia')
                ? [
                    'location' => $request->url(),
                ]
                : [
                    ...ZiggyConfig::forRequest($request),
                    'location' => $request->url(),
                ],
            ...($request->is('admin', 'admin/*') ? [] : [
                'features' => fn () => Feature::query()
                    ->active()
                    ->orderBy('sort_order')
                    ->get()
                    ->map->toFrontendArray()
                    ->values()
                    ->all(),
                'socialMenu' => fn () => SiteSetting::getValue('social_menu', []),
                'aboutIntro' => Inertia::defer(
                    fn () => SiteSetting::getValue('about_intro'),
                    'below'
                ),
                'memberInstitutes' => fn () => app(MemberInstituteAssembler::class)->forMarquee(),
            ]),
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
