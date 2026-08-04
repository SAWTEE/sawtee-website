<?php

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Support\SitemapCache;
use Illuminate\Support\Facades\Cache;

test('sitemap returns xml with published content urls', function () {
    $page = Page::query()->create([
        'name' => 'Contact',
        'slug' => 'contact',
        'content' => '<p>Contact</p>',
    ]);

    $category = Category::query()->create([
        'name' => 'News',
        'slug' => 'news',
        'type' => 'post',
    ]);

    $post = Post::factory()->create([
        'category_id' => $category->id,
        'theme_id' => null,
        'status' => 'published',
        'slug' => 'published-news-item',
        'title' => 'Published news item',
    ]);

    Post::factory()->create([
        'category_id' => $category->id,
        'theme_id' => null,
        'status' => 'draft',
        'slug' => 'draft-news-item',
        'title' => 'Draft news item',
    ]);

    $response = $this->get(route('sitemap'));

    $response->assertOk();
    expect($response->headers->get('content-type'))->toContain('xml');

    $body = $response->getContent();
    expect($body)->toContain(url('/'.$page->slug));
    expect($body)->toContain(url('/category/'.$category->slug.'/'.$post->slug));
    expect($body)->not->toContain('draft-news-item');
});

test('sitemap cache is invalidated when a page is updated', function () {
    Page::query()->create([
        'name' => 'Cached Page',
        'slug' => 'cached-page',
        'content' => '<p>One</p>',
    ]);

    $this->get(route('sitemap'))->assertOk();
    expect(Cache::has(SitemapCache::KEY))->toBeTrue();

    Page::query()->where('slug', 'cached-page')->first()->update([
        'content' => '<p>Two</p>',
    ]);

    expect(Cache::has(SitemapCache::KEY))->toBeFalse();
});
