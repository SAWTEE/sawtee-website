<?php

use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\Slide;
use App\Models\Slider;
use App\Support\ContentCache;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
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
            ->missing('infocus')
            ->has('slidesResponsiveImages')
            ->has('homePageSections')
            ->has('seo.title')
            ->has('seo.description')
            ->missing('featuredPublications')
            ->missing('featuredBlogPosts')
            // Below-the-fold sections are deferred (group: below).
            ->missing('sawteeInMedia')
            ->missing('events')
            ->missing('publications')
            ->missing('newsletters')
            ->missing('webinars')
            ->loadDeferredProps('sidebar', fn (Assert $reload) => $reload
                ->has('featuredPublications')
                ->has('featuredBlogPosts')
            )
            ->loadDeferredProps('below', fn (Assert $reload) => $reload
                ->has('infocus')
                ->has('sawteeInMedia')
                ->has('events')
                ->has('publications')
                ->has('newsletters')
                ->has('webinars')
            )
        );
});

test('home page includes a static lcp fallback image in the initial html', function () {
    $page = Page::query()->firstOrCreate(
        ['slug' => 'home'],
        ['name' => 'home', 'content' => '']
    );

    $slider = Slider::query()->firstOrCreate(
        ['page_id' => $page->id, 'name' => 'Home'],
        ['page_id' => $page->id, 'name' => 'Home']
    );

    $slide = Slide::query()->create([
        'slider_id' => $slider->id,
        'title' => 'Hero',
        'subtitle' => 'Subtitle',
    ]);

    $slide->addMedia(UploadedFile::fake()->image('banner.jpg', 1200, 800))
        ->toMediaCollection('slides');

    Cache::forget(ContentCache::homeKey());

    $response = $this->get(route('home'));

    $response->assertOk();
    expect($response->getContent())
        ->toContain('id="inertia-lcp-fallback"')
        ->toContain('rel="preload" as="image"')
        ->toContain('body.inertia-mounted #inertia-lcp-fallback');
});

test('public htaccess sets long cache headers for build assets', function () {
    $htaccess = file_get_contents(public_path('.htaccess'));

    expect($htaccess)
        ->toContain('SetEnvIf Request_URI "^/build/"')
        ->toContain('max-age=31536000')
        ->toContain('SetEnvIf Request_URI "^/media-library/"')
        ->not->toContain('LocationMatch');
});
