<?php

use App\Support\HomePageDataAssembler;

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
    ]);
});

test('featured blog posts is a list even when empty', function () {
    $payload = app(HomePageDataAssembler::class)->assemble();

    expect($payload['featuredBlogPosts'])->toBeArray();
});
