<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MenuItemRequest;
use App\Http\Requests\Admin\MenuRequest;
use App\Models\Category;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\Section;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/Menu/Index', [
            'menus' => Menu::withCount('items')->latest('id')->get(),
        ]);
    }

    public function store(MenuRequest $request): RedirectResponse
    {
        Menu::create($request->validated());

        return to_route('admin.menus.index');
    }

    /**
     * Menu builder screen: the chosen menu plus every link source the builder offers.
     */
    public function manage(?string $id = null): Response
    {
        $desiredMenu = $id
            ? Menu::findOrFail($id)
            : Menu::latest('id')->first();

        $menuItems = $desiredMenu
            ? MenuItem::with('children')
                ->where('menu_id', $desiredMenu->id)
                ->orderBy('order')
                ->get()
            : null;

        return Inertia::render('Backend/Menu/ManageMenus', [
            'categories' => Category::select(['id', 'name', 'slug', 'type', 'parent_id'])
                ->with('parent:id,slug')
                ->orderBy('name')
                ->get(),
            'pages' => Page::select(['id', 'name', 'slug'])->orderBy('name')->get(),
            'menus' => Menu::select(['id', 'title', 'location'])->orderBy('title')->get(),
            'sections' => Section::select(['id', 'title'])->orderBy('title')->get(),
            'desiredMenu' => $desiredMenu,
            'menuItems' => $menuItems,
        ]);
    }

    public function addMenuItemToMenu(MenuItemRequest $request): RedirectResponse
    {
        $menuItem = MenuItem::create($request->validated());

        return to_route('admin.manage.menus', $menuItem->menu_id);
    }

    public function editMenuItem(MenuItemRequest $request, MenuItem $menuItem): RedirectResponse
    {
        $menuItem->update($request->validated());

        return to_route('admin.manage.menus', $menuItem->menu_id);
    }

    public function deleteMenuItem(MenuItem $menuItem): RedirectResponse
    {
        $menuId = $menuItem->menu_id;

        MenuItem::where('parent_id', $menuItem->id)->delete();
        $menuItem->delete();

        return to_route('admin.manage.menus', $menuId);
    }

    /**
     * The edit dialog has no route parameter, so the menu arrives in the query string.
     */
    public function update(MenuRequest $request): RedirectResponse
    {
        $menu = Menu::findOrFail($request->menuId());
        $menu->update($request->validated());

        return to_route('admin.manage.menus', $menu->id);
    }

    public function delete(Menu $menu): RedirectResponse
    {
        $menu->delete();

        $nextMenu = Menu::latest('id')->first();

        return $nextMenu
            ? to_route('admin.manage.menus', $nextMenu->id)
            : to_route('admin.menus.index');
    }
}
