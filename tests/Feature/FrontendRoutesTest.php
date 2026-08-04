<?php

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use Inertia\Testing\AssertableInertia as Assert;

test('page by slug returns inertia payload', function () {
    $page = Page::query()->create([
        'name' => 'About SAWTEE',
        'slug' => 'about',
        'content' => '<p>About us</p>',
        'meta_title' => null,
        'meta_description' => null,
        'page_template' => 'DefaultPage',
    ]);

    $this->get(route('page.show', $page->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $pageAssert) => $pageAssert
            ->component('Frontend/Page')
            ->where('page.slug', 'about')
            ->has('sections')
            ->has('seo')
        );
});

test('category archive returns inertia payload', function () {
    $category = Category::query()->create([
        'name' => 'In Focus',
        'slug' => 'in-focus',
        'type' => 'post',
        'parent_id' => null,
    ]);

    Post::factory()->create([
        'category_id' => $category->id,
        'theme_id' => null,
        'status' => 'published',
        'title' => 'Archive fixture post',
    ]);

    $this->get(route('category.show', $category->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/Category')
            ->where('category.slug', 'in-focus')
            ->has('posts')
            ->has('seo')
        );
});

test('search returns inertia search page', function () {
    $category = Category::query()->create([
        'name' => 'Blog',
        'slug' => 'blog',
        'type' => 'post',
    ]);

    Post::factory()->create([
        'category_id' => $category->id,
        'theme_id' => null,
        'status' => 'published',
        'title' => 'Trade policy update',
        'excerpt' => 'Regional trade news',
    ]);

    $this->get('/search?query=Trade')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/SearchPage')
            ->where('query', 'Trade')
            ->has('posts')
        );
});
