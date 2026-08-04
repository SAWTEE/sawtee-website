<?php

use App\Models\Menu;
use App\Models\MenuItem;
use Inertia\Testing\AssertableInertia as Assert;

test('shared menus default to empty collections when none exist', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/Pages/Home')
            ->has('primaryMenu', 0)
            ->has('footerMenu', 0)
        );
});

test('header and footer menus include null and zero parent roots', function () {
    $header = Menu::create(['title' => 'Header', 'location' => 'header']);
    $footer = Menu::create(['title' => 'Footer', 'location' => 'footer']);

    MenuItem::create([
        'menu_id' => $header->id,
        'title' => 'About',
        'name' => 'About',
        'url' => '/about',
        'parent_id' => null,
        'order' => 1,
    ]);

    MenuItem::create([
        'menu_id' => $footer->id,
        'title' => 'Contact',
        'name' => 'Contact',
        'url' => '/contact',
        'parent_id' => 0,
        'order' => 1,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/Pages/Home')
            ->has('primaryMenu', 1)
            ->has('footerMenu', 1)
            ->where('primaryMenu.0.title', 'About')
            ->where('footerMenu.0.title', 'Contact')
        );
});
