<?php

use App\Models\Category;
use App\Models\Post;
use App\Support\SubstackFeed;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Cache::flush();
});

test('substack feed maps archive api posts', function () {
    Http::preventStrayRequests();

    Http::fake([
        'sawteenp.substack.com/api/v1/archive*' => Http::response([
            [
                'id' => 101,
                'title' => 'Trade, Climate Change and Development Monitor',
                'subtitle' => 'Volume 24, Issue 07, July 2026',
                'slug' => 'trade-climate-change-and-development-142',
                'canonical_url' => 'https://sawteenp.substack.com/p/trade-climate-change-and-development-142',
                'post_date' => '2026-08-03T09:24:14.586Z',
                'cover_image' => 'https://example.com/cover.jpg',
                'reaction_count' => 2,
            ],
            [
                'id' => 102,
                'title' => 'Another issue',
                'subtitle' => null,
                'description' => 'Fallback description',
                'slug' => 'another-issue',
                'canonical_url' => '',
                'post_date' => '2026-07-01T00:00:00.000Z',
                'cover_image' => null,
                'reaction_count' => 0,
            ],
        ]),
    ]);

    $posts = app(SubstackFeed::class)->recent(6);

    expect($posts)->toHaveCount(2)
        ->and($posts[0]['title'])->toBe('Trade, Climate Change and Development Monitor')
        ->and($posts[0]['url'])->toBe('https://sawteenp.substack.com/p/trade-climate-change-and-development-142')
        ->and($posts[1]['subtitle'])->toBe('Fallback description')
        ->and($posts[1]['url'])->toBe('https://sawteenp.substack.com/p/another-issue');

    Http::assertSentCount(1);
});

test('substack feed returns empty array when the api fails', function () {
    Http::preventStrayRequests();

    Http::fake([
        'sawteenp.substack.com/api/v1/archive*' => Http::response('unavailable', 503),
    ]);

    expect(app(SubstackFeed::class)->recent())->toBe([]);
});

test('substack feed does not cache empty responses', function () {
    Http::preventStrayRequests();

    Http::fake([
        'sawteenp.substack.com/api/v1/archive*' => Http::sequence()
            ->push([], 200)
            ->push([
                [
                    'id' => 201,
                    'title' => 'Recovered issue',
                    'slug' => 'recovered-issue',
                    'canonical_url' => 'https://sawteenp.substack.com/p/recovered-issue',
                    'post_date' => '2026-08-01T00:00:00.000Z',
                    'subtitle' => 'Volume 1',
                    'cover_image' => null,
                    'reaction_count' => 0,
                ],
            ]),
    ]);

    $feed = app(SubstackFeed::class);

    expect($feed->recent())->toBe([])
        ->and($feed->recent())->toHaveCount(1)
        ->and($feed->recent()[0]['title'])->toBe('Recovered issue');

    Http::assertSentCount(2);
});

test('substack feed does not cache failed responses', function () {
    Http::preventStrayRequests();

    Http::fake([
        'sawteenp.substack.com/api/v1/archive*' => Http::sequence()
            ->push('unavailable', 503)
            ->push([
                [
                    'id' => 201,
                    'title' => 'Recovered issue',
                    'slug' => 'recovered-issue',
                    'canonical_url' => 'https://sawteenp.substack.com/p/recovered-issue',
                    'post_date' => '2026-08-01T00:00:00.000Z',
                    'subtitle' => null,
                    'cover_image' => null,
                    'reaction_count' => 0,
                ],
            ]),
    ]);

    $feed = app(SubstackFeed::class);

    expect($feed->recent())->toBe([])
        ->and($feed->recent())->toHaveCount(1)
        ->and($feed->recent()[0]['title'])->toBe('Recovered issue');

    Http::assertSentCount(2);
});

test('newsletter category archive includes substack feed', function () {
    Http::preventStrayRequests();

    Http::fake([
        'sawteenp.substack.com/api/v1/archive*' => Http::response([
            [
                'id' => 301,
                'title' => 'Substack sidebar item',
                'subtitle' => 'Latest Monitor',
                'slug' => 'substack-sidebar-item',
                'canonical_url' => 'https://sawteenp.substack.com/p/substack-sidebar-item',
                'post_date' => '2026-08-03T09:24:14.586Z',
                'cover_image' => null,
                'reaction_count' => 1,
            ],
        ]),
    ]);

    $category = Category::query()->create([
        'name' => 'Newsletters',
        'slug' => 'newsletters',
        'type' => 'post',
        'parent_id' => null,
    ]);

    Post::factory()->create([
        'category_id' => $category->id,
        'theme_id' => null,
        'status' => 'published',
        'title' => 'PDF archive fixture',
    ]);

    $this->get(route('category.show', $category->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Frontend/Category')
            ->where('category.slug', 'newsletters')
            ->has('substackFeed', 1)
            ->where('substackFeed.0.title', 'Substack sidebar item')
        );
});
