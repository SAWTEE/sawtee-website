<?php

use App\Models\Menu;
use App\Models\MenuItem;
use App\Support\MenuTreeBuilder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

/**
 * Reproduce Laravel 13 cache.serializable_classes=false: object values become
 * __PHP_Incomplete_Class after a serialize round-trip.
 */
function useSerializingCacheStore(): void
{
    config([
        'cache.default' => 'array',
        'cache.stores.array.serialize' => true,
        'cache.serializable_classes' => false,
    ]);

    app()->forgetInstance('cache');
    app()->forgetInstance('cache.store');
    Cache::flush();
}

test('returns empty collection when menu location does not exist', function () {
    $items = app(MenuTreeBuilder::class)->forLocation('header');

    expect($items)->toBeEmpty();
});

test('forLocation returns a Collection of menu data after serialized cache round-trip', function () {
    useSerializingCacheStore();

    $menu = Menu::create(['title' => 'Header', 'location' => 'header']);

    $parent = MenuItem::create([
        'menu_id' => $menu->id,
        'title' => 'About',
        'name' => 'About',
        'url' => '/about',
        'parent_id' => null,
        'order' => 1,
    ]);

    MenuItem::create([
        'menu_id' => $menu->id,
        'title' => 'Team',
        'name' => 'Team',
        'url' => '/team',
        'parent_id' => $parent->id,
        'order' => 1,
    ]);

    $builder = app(MenuTreeBuilder::class);

    $fromBuilder = $builder->forLocation('header');
    $fromCache = $builder->forLocation('header');

    expect($fromBuilder)->toBeInstanceOf(Collection::class)
        ->and($fromCache)->toBeInstanceOf(Collection::class)
        ->and($fromCache)->toHaveCount(1)
        ->and($fromCache->first())->toBeArray()
        ->and($fromCache->first()['title'])->toBe('About')
        ->and($fromCache->first()['children'])->toHaveCount(1)
        ->and($fromCache->first()['children'][0]['title'])->toBe('Team');
});

test('returns root items with null or zero parent_id ordered by order', function () {
    $menu = Menu::create(['title' => 'Header', 'location' => 'header']);

    MenuItem::create([
        'menu_id' => $menu->id,
        'title' => 'Second',
        'name' => 'Second',
        'url' => '/second',
        'parent_id' => 0,
        'order' => 2,
    ]);

    MenuItem::create([
        'menu_id' => $menu->id,
        'title' => 'First',
        'name' => 'First',
        'url' => '/first',
        'parent_id' => null,
        'order' => 1,
    ]);

    MenuItem::create([
        'menu_id' => $menu->id,
        'title' => 'Child',
        'name' => 'Child',
        'url' => '/child',
        'parent_id' => 999,
        'order' => 1,
    ]);

    $items = app(MenuTreeBuilder::class)->forLocation('header');

    expect($items)->toBeInstanceOf(Collection::class)
        ->and($items)->toHaveCount(2)
        ->and($items->first()['title'])->toBe('First')
        ->and($items->last()['title'])->toBe('Second');
});

test('includes nested children on root items', function () {
    $menu = Menu::create(['title' => 'Header', 'location' => 'header']);

    $parent = MenuItem::create([
        'menu_id' => $menu->id,
        'title' => 'Parent',
        'name' => 'Parent',
        'url' => '/parent',
        'parent_id' => null,
        'order' => 1,
    ]);

    MenuItem::create([
        'menu_id' => $menu->id,
        'title' => 'Child',
        'name' => 'Child',
        'url' => '/child',
        'parent_id' => $parent->id,
        'order' => 1,
    ]);

    $items = app(MenuTreeBuilder::class)->forLocation('header');

    expect($items)->toHaveCount(1)
        ->and($items->first())->toBeArray()
        ->and($items->first()['children'])->toHaveCount(1)
        ->and($items->first()['children'][0]['title'])->toBe('Child');
});
