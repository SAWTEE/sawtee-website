<?php

use App\Models\Menu;
use App\Models\MenuItem;
use App\Support\MenuTreeBuilder;

test('returns empty collection when menu location does not exist', function () {
    $items = app(MenuTreeBuilder::class)->forLocation('header');

    expect($items)->toBeEmpty();
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

    expect($items)->toHaveCount(2)
        ->and($items->first()->title)->toBe('First')
        ->and($items->last()->title)->toBe('Second');
});

test('eager loads children relation on root items', function () {
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
        ->and($items->first()->relationLoaded('children'))->toBeTrue()
        ->and($items->first()->children)->toHaveCount(1)
        ->and($items->first()->children->first()->title)->toBe('Child');
});
