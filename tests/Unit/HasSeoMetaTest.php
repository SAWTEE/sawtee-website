<?php

use App\Models\Page;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('page seo accessors fall back to name and stripped content', function () {
    $page = Page::query()->create([
        'name' => 'Our Work',
        'slug' => 'our-work',
        'content' => '<p>South Asia trade <strong>research</strong>.</p>',
        'meta_title' => null,
        'meta_description' => null,
    ]);

    expect($page->resolved_meta_title)->toBe('Our Work');
    expect($page->resolved_meta_description)->toBe('South Asia trade research.');
});

test('post seo accessors fall back to title and excerpt', function () {
    $post = new Post([
        'title' => 'Trade Insight',
        'excerpt' => 'A short summary of the article.',
        'meta_title' => null,
        'meta_description' => null,
        'content' => '<p>Longer body</p>',
    ]);

    expect($post->resolved_meta_title)->toBe('Trade Insight');
    expect($post->resolved_meta_description)->toBe('A short summary of the article.');
});

test('explicit meta fields win over fallbacks', function () {
    $page = Page::query()->create([
        'name' => 'Our Work',
        'slug' => 'our-work-meta',
        'content' => '<p>Body</p>',
        'meta_title' => 'Custom Title',
        'meta_description' => 'Custom description',
    ]);

    expect($page->resolved_meta_title)->toBe('Custom Title');
    expect($page->resolved_meta_description)->toBe('Custom description');
});
