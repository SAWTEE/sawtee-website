<?php

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\Publication;
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

test('publications archive includes nested category children and grandchildren', function () {
    $root = Category::query()->create([
        'name' => 'Publications',
        'slug' => 'publications',
        'type' => 'publication',
        'parent_id' => null,
    ]);
    $child = Category::query()->create([
        'name' => 'English',
        'slug' => 'english',
        'type' => 'publication',
        'parent_id' => $root->id,
    ]);
    $grandChild = Category::query()->create([
        'name' => 'Trade Insight',
        'slug' => 'trade-insight',
        'type' => 'publication',
        'parent_id' => $child->id,
    ]);
    $greatGrandChild = Category::query()->create([
        'name' => 'Special Series',
        'slug' => 'special-series',
        'type' => 'publication',
        'parent_id' => $grandChild->id,
    ]);

    Publication::query()->create([
        'title' => 'Nested archive fixture',
        'category_id' => $greatGrandChild->id,
    ]);

    $this->get(route('category.show', 'publications'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/Archives/PublicationsArchive')
            ->where('category.slug', 'publications')
            ->has('category.children', 1)
            ->where('category.children.0.slug', 'english')
            ->has('category.children.0.children', 1)
            ->where('category.children.0.children.0.slug', 'trade-insight')
            ->has('category.children.0.children.0.children', 1)
            ->where('category.children.0.children.0.children.0.slug', 'special-series')
            ->has('publications.special-series')
            ->has('publications.trade-insight')
            ->has('publications.english')
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
