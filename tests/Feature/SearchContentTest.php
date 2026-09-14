<?php

use App\Models\Article;
use App\Models\Category;
use App\Models\Post;
use App\Models\Publication;
use App\Models\Research;
use Inertia\Testing\AssertableInertia as Assert;

test('search includes publications research and trade insight articles alongside posts', function () {
    $blog = Category::query()->create([
        'name' => 'Blog',
        'slug' => 'blog-search-'.uniqid(),
        'type' => 'post',
    ]);
    $books = Category::query()->create([
        'name' => 'Books',
        'slug' => 'books-search-'.uniqid(),
        'type' => 'publication',
    ]);
    $tradeInsight = Category::query()->create([
        'name' => 'Trade Insight',
        'slug' => 'trade-insight',
        'type' => 'publication',
    ]);

    Post::factory()->create([
        'category_id' => $blog->id,
        'theme_id' => null,
        'status' => 'published',
        'title' => 'UniqueSearchToken post briefing',
        'excerpt' => 'Post excerpt',
        'published_at' => '2024-01-10 00:00:00',
    ]);

    Post::factory()->create([
        'category_id' => $blog->id,
        'theme_id' => null,
        'status' => 'draft',
        'title' => 'UniqueSearchToken draft should hide',
        'excerpt' => 'Draft excerpt',
        'published_at' => '2024-01-11 00:00:00',
    ]);

    $publication = Publication::query()->create([
        'category_id' => $books->id,
        'title' => 'UniqueSearchToken publication volume',
        'subtitle' => 'Policy book',
        'description' => 'Publication description',
        'volume' => 'Vol 1',
    ]);
    $publication->file()->create([
        'name' => 'unique-search-token-book.pdf',
        'path' => 'publications/unique-search-token-book.pdf',
    ]);

    Research::query()->create([
        'title' => 'UniqueSearchToken research report',
        'slug' => 'unique-search-token-research',
        'subtitle' => 'South Asia study',
        'description' => 'Research description',
        'year' => 2023,
    ]);

    $volume = Publication::query()->create([
        'category_id' => $tradeInsight->id,
        'title' => 'Trade Insight Volume Without Shared Token',
        'subtitle' => 'Volume subtitle',
        'description' => 'Volume description',
        'volume' => 'TI Unique Search Token',
    ]);

    $article = Article::factory()->create([
        'publication_id' => $volume->id,
        'title' => 'UniqueSearchToken trade insight article',
        'excerpt' => 'Article excerpt',
        'author' => 'Ada Lovelace',
        'published_at' => '2024-05-01 00:00:00',
    ]);

    $volume->refresh();

    $this->get('/search?query=UniqueSearchToken')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/SearchPage')
            ->where('query', 'UniqueSearchToken')
            ->where('posts.total', 4)
            ->has('posts.data', 4)
            ->where('posts.data', function ($data) use ($volume, $article) {
                $types = collect($data)->pluck('result_type')->sort()->values()->all();
                $titles = collect($data)->pluck('title');

                expect($types)->toBe(['article', 'post', 'publication', 'research'])
                    ->and($titles)->not->toContain('UniqueSearchToken draft should hide')
                    ->and(collect($data)->firstWhere('result_type', 'publication')['href'] ?? null)
                    ->toBe('/publications/unique-search-token-book.pdf')
                    ->and(collect($data)->firstWhere('result_type', 'article')['href'] ?? null)
                    ->toBe("/category/publications/trade-insight/{$volume->volume_slug}/{$article->slug}");

                return true;
            })
        );
});

test('search category filter scopes to publication catalogue entries', function () {
    $books = Category::query()->create([
        'name' => 'Books',
        'slug' => 'books-filter-'.uniqid(),
        'type' => 'publication',
    ]);
    $blog = Category::query()->create([
        'name' => 'Blog',
        'slug' => 'blog-filter-'.uniqid(),
        'type' => 'post',
    ]);

    Publication::query()->create([
        'category_id' => $books->id,
        'title' => 'ScopedPubToken book only',
        'subtitle' => 'Book',
        'volume' => 'Vol X',
    ]);

    Post::factory()->create([
        'category_id' => $blog->id,
        'theme_id' => null,
        'status' => 'published',
        'title' => 'ScopedPubToken post should not match category filter',
        'published_at' => '2024-02-01 00:00:00',
    ]);

    $this->get('/search?query=ScopedPubToken&category='.$books->slug)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/SearchPage')
            ->where('filters.category', $books->slug)
            ->where('posts.total', 1)
            ->where('posts.data.0.result_type', 'publication')
            ->where('posts.data.0.title', 'ScopedPubToken book only')
        );
});

test('unpublished posts remain excluded from search results', function () {
    $blog = Category::query()->create([
        'name' => 'Blog',
        'slug' => 'blog-draft-'.uniqid(),
        'type' => 'post',
    ]);

    Post::factory()->create([
        'category_id' => $blog->id,
        'theme_id' => null,
        'status' => 'draft',
        'title' => 'DraftOnlyToken never indexed',
        'published_at' => '2024-03-01 00:00:00',
    ]);

    $this->get('/search?query=DraftOnlyToken')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/SearchPage')
            ->where('posts.total', 0)
        );
});
