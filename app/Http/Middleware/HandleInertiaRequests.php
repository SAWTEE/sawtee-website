<?php

namespace App\Http\Middleware;

use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

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
  public function version(Request $request): string|null
  {
    return parent::version($request);
  }

  /**
   * Define the props that are shared by default.
   * @param  \Illuminate\Http\Request  $request
   * @return array<string, mixed>
   */
  public function share(Request $request): array
  {
    $primaryMenu = Menu::where('location', 'header')->firstOrFail();
    $footerMenu = Menu::where('location', 'footer')->firstOrFail();
    $primaryMenuItems = null;
    $footerMenuItems = null;
      $primaryMenuItems = MenuItem::with('children')
        ->where('menu_id', $primaryMenu->id)
        ->where('parent_id', null)
        ->orderBy('order', 'ASC')
        ->get();

      $footerMenuItems = MenuItem::with('children')
        ->where('menu_id', $footerMenu->id)
        ->where('parent_id', 0)
        ->orderBy('order', 'ASC')
        ->get();


    return array_merge(parent::share($request), [
      'auth' => [
        'user' => $request->user(),
      ],
      'flash' => [
        'message' => fn() => $request->session()->get('message'),
      ],
      'primaryMenu' => fn() => $primaryMenuItems,
      'footerMenu' => fn() => $footerMenuItems,
      'ziggy' => fn() => [...(new Ziggy())->toArray(), 'location' => $request->url()],
    ]);
  }
}
