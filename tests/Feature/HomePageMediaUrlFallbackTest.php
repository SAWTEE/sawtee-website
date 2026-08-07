<?php

use App\Models\Category;
use App\Models\Page;
use App\Models\Publication;
use App\Models\Slide;
use App\Models\Slider;
use App\Models\Tag;
use App\Support\ContentCache;
use App\Support\HomePageDataAssembler;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

test('home slides omit missing large srcSet and keep a working original_url', function () {
    Cache::forget(ContentCache::homeKey());

    $page = Page::query()->create([
        'name' => 'home',
        'slug' => 'home',
        'content' => '',
    ]);

    $slider = Slider::query()->create([
        'name' => 'Home',
        'page_id' => $page->id,
    ]);

    $slide = Slide::query()->create([
        'slider_id' => $slider->id,
        'title' => 'Hero',
        'subtitle' => 'Subtitle',
    ]);

    $slide->addMedia(UploadedFile::fake()->image('banner.jpg', 1200, 800))
        ->toMediaCollection('slides');

    $media = $slide->fresh()->getFirstMedia('slides');
    expect($media)->not->toBeNull();

    File::delete($media->getPath('large'));
    $media->markAsConversionGenerated('large');
    $media->refresh();

    $payload = app(HomePageDataAssembler::class)->assemble();

    expect($payload['slidesResponsiveImages'][0] ?? null)->toBe('')
        ->and($payload['slides'][0]['media'][0]['original_url'] ?? null)
        ->not->toContain('-large.webp')
        ->and($payload['slides'][0]['media'][0]['original_url'] ?? null)
        ->toContain('/media-library/');
});

test('featured publications fall back when preview webp is missing but flag is set', function () {
    Cache::forget(ContentCache::homeKey());

    $category = Category::query()->create([
        'name' => 'Publications',
        'slug' => 'publications-fallback-'.uniqid(),
    ]);

    $publication = Publication::query()->create([
        'category_id' => $category->id,
        'title' => 'Featured pub '.uniqid(),
        'volume' => 'Vol '.uniqid(),
        'description' => 'Desc',
    ]);

    $tag = Tag::query()->firstOrCreate(['name' => 'featured']);
    $publication->tags()->attach($tag);

    $publication->addMedia(UploadedFile::fake()->image('cover.jpg', 400, 560))
        ->toMediaCollection('publication_featured_image');

    $media = $publication->fresh()->getFirstMedia('publication_featured_image');
    expect($media)->not->toBeNull();

    File::delete($media->getPath('preview'));
    $media->markAsConversionGenerated('preview');
    $media->refresh();

    $payload = app(HomePageDataAssembler::class)->assemble();
    $featured = collect($payload['featuredPublications'])
        ->firstWhere('id', $publication->id);

    expect($featured)->not->toBeNull()
        ->and($featured['media'][0]['preview_url'] ?? null)->toBe($media->getUrl())
        ->and($featured['media'][0]['preview_url'] ?? null)->not->toContain('-preview.webp');
});
