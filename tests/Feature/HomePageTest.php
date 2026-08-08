<?php

use App\Models\Menu;
use App\Models\MenuItem;
use Inertia\Testing\AssertableInertia as Assert;

test('home page returns 200 with empty menus', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/Pages/Home')
            ->has('primaryMenu')
            ->has('footerMenu')
        );
});

test('home page returns 200 with seeded menus', function () {
    $header = Menu::create(['title' => 'Header', 'location' => 'header']);

    MenuItem::create([
        'menu_id' => $header->id,
        'title' => 'Home',
        'name' => 'Home',
        'url' => '/',
        'parent_id' => null,
        'order' => 1,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/Pages/Home')
            ->has('primaryMenu', 1)
        );
});

test('home page exposes assembler payload keys', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/Pages/Home')
            ->has('slides')
            ->has('infocus')
            ->has('featuredPublications')
            ->has('featuredBlogPosts')
            ->has('slidesResponsiveImages')
            ->has('homePageSections')
            ->has('seo.title')
            ->has('seo.description')
            // Below-the-fold sections are deferred (group: below).
            ->missing('sawteeInMedia')
            ->missing('events')
            ->missing('publications')
            ->missing('newsletters')
            ->missing('webinars')
            ->loadDeferredProps('below', fn (Assert $reload) => $reload
                ->has('sawteeInMedia')
                ->has('events')
                ->has('publications')
                ->has('newsletters')
                ->has('webinars')
            )
        );
});
