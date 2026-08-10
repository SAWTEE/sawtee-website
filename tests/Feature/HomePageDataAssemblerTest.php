<?php

use App\Support\ContentCache;
use App\Support\HomePageDataAssembler;
use Illuminate\Support\Facades\Cache;

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
