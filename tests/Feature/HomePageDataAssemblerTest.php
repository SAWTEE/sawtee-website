<?php

use App\Models\Category;
use App\Models\Post;
use App\Support\ContentCache;
use App\Support\HomePageDataAssembler;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * Reproduce Laravel 13 cache.serializable_classes=false: nested Eloquent
 * models become __PHP_Incomplete_Class after a serialize round-trip.
 */
function useSerializingHomeCacheStore(): void
{
    config([
        'cache.default' => 'array',
        'cache.stores.array.serialize' => true,
        'cache.serializable_classes' => false,
    ]);

    app()->forgetInstance('cache');
    app()->forgetInstance('cache.store');
    Cache::flush();
}

test('assembles home page payload with expected keys', function () {
    $payload = app(HomePageDataAssembler::class)->assemble();

    expect($payload)->toHaveKeys([
        'slides',
        'infocus',
        'sawteeInMedia',
        'events',
        'featuredPublications',
        'featuredBlogPosts',
        'publications',
        'newsletters',
        'webinars',
        'slidesResponsiveImages',
        'homePageSections',
        'features',
    ]);
});

test('featured blog posts is a list even when empty', function () {
    $payload = app(HomePageDataAssembler::class)->assemble();

    expect($payload['featuredBlogPosts'])->toBeArray();
});

/**
 * Publish one post into a home page category so payload-shape assertions have
 * a row to inspect.
 */
function seedHomePost(string $categorySlug, string $title, ?string $content): void
{
    $category = Category::query()->firstOrCreate(
        ['slug' => $categorySlug],
        ['name' => Str::headline($categorySlug)]
    );

    Post::factory()->create([
        'category_id' => $category->id,
        'theme_id' => null,
        'status' => 'published',
        'published_at' => now(),
        'title' => $title,
        'slug' => Str::slug($title),
        'content' => $content,
    ]);
}

test('post lists ship a has_content flag instead of the post body', function () {
    seedHomePost(
        'sawtee-in-media',
        'Coverage with a body',
        '<p>'.str_repeat('A very long article body. ', 200).'</p>'
    );
    seedHomePost('sawtee-in-media', 'Coverage that is link only', '');

    $posts = collect(app(HomePageDataAssembler::class)->assemble()['sawteeInMedia']);
    $withBody = $posts->firstWhere('title', 'Coverage with a body');
    $linkOnly = $posts->firstWhere('title', 'Coverage that is link only');

    expect($withBody)->not->toBeNull()
        ->and($withBody)->not->toHaveKey('content')
        ->and($withBody['has_content'])->toBeTrue()
        ->and($linkOnly)->not->toBeNull()
        ->and($linkOnly['has_content'])->toBeFalse();
});

test('home payload drops columns the page never renders', function () {
    seedHomePost('sawtee-in-media', 'Shape check', '<p>Body</p>');

    $rows = app(HomePageDataAssembler::class)->assemble()['sawteeInMedia'];

    expect($rows)->not->toBeEmpty();

    // Post bodies and SEO columns were by far the largest props on the page.
    foreach ($rows as $row) {
        expect($row)->not->toHaveKey('content')
            ->and($row)->not->toHaveKey('meta_title')
            ->and($row)->not->toHaveKey('meta_description')
            ->and($row)->not->toHaveKey('updated_at')
            ->and($row)->toHaveKeys(['id', 'title', 'slug', 'category', 'media']);
    }
});

test('assemble returns plain arrays after serialized cache round-trip', function () {
    useSerializingHomeCacheStore();

    $assembler = app(HomePageDataAssembler::class);

    $fromBuilder = $assembler->assemble();
    $fromCache = $assembler->assemble();

    expect(Cache::has(ContentCache::homeKey()))->toBeTrue()
        ->and($fromCache)->toBeArray()
        ->and($fromCache)->toHaveKeys(array_keys($fromBuilder));

    foreach ([
        'slides',
        'infocus',
        'sawteeInMedia',
        'events',
        'featuredPublications',
        'featuredBlogPosts',
        'publications',
        'newsletters',
        'webinars',
        'homePageSections',
        'features',
    ] as $key) {
        expect($fromCache[$key])->toBeArray();

        foreach ($fromCache[$key] as $item) {
            expect($item)->toBeArray();
        }
    }

    expect($fromCache['slidesResponsiveImages'])->toBeArray();
});
