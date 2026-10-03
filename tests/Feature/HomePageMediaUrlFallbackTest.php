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

function homeSlideWithMedia(): Slide
{
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

    return $slide->fresh();
}

test('home slides omit srcSet entirely when no image file is left to point at', function () {
    $slide = homeSlideWithMedia();

    $media = $slide->getFirstMedia('slides');
    expect($media)->not->toBeNull();

    $media->responsiveImages('large')->delete();
    File::delete($media->getPath('large'));
    $media->markAsConversionGenerated('large');
    $media->refresh();

    $payload = app(HomePageDataAssembler::class)->assemble();

    expect($payload['slidesResponsiveImages'][0] ?? null)->toBe('')
        ->and($payload['slides'][0]['media'][0])->toHaveKey('srcset')
        ->and($payload['slides'][0]['media'][0]['srcset'])->toBeNull()
        ->and($payload['slides'][0]['media'][0]['original_url'] ?? null)
        ->not->toContain('-large.webp')
        ->and($payload['slides'][0]['media'][0]['original_url'] ?? null)
        ->toContain('/media-library/');
});

test('home slides keep their responsive srcSet when the large conversion file is gone', function () {
    $slide = homeSlideWithMedia();

    $media = $slide->getFirstMedia('slides');
    expect($media)->not->toBeNull();

    // Responsive variants live in their own directory, so losing the single
    // large conversion must not cost us the srcset.
    File::delete($media->getPath('large'));
    $media->markAsConversionGenerated('large');
    $media->refresh();

    $payload = app(HomePageDataAssembler::class)->assemble();

    expect($payload['slidesResponsiveImages'][0] ?? null)
        ->toContain('/responsive-images/')
        ->toEndWith('w')
        ->and($payload['slides'][0]['media'][0]['placeholder'] ?? null)
        ->toStartWith('data:image/svg+xml;base64,');
});

test('hidden media columns stay out of the home payload', function () {
    $slide = homeSlideWithMedia();

    expect($slide->getFirstMedia('slides'))->not->toBeNull();

    $payload = app(HomePageDataAssembler::class)->assemble();
    $media = $payload['slides'][0]['media'][0] ?? [];

    expect($media)->not->toHaveKey('responsive_images')
        ->and($media)->not->toHaveKey('generated_conversions')
        ->and($media)->not->toHaveKey('manipulations');
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
        ->and($featured['media'][0]['preview_url'] ?? null)->toStartWith($media->getUrl())
        ->and($featured['media'][0]['preview_url'] ?? null)->toContain('?v=')
        ->and($featured['media'][0]['preview_url'] ?? null)->not->toContain('-preview.webp');
});

test('featured publications preview_url uses on-disk preview jpg when preview webp is missing', function () {
    Cache::forget(ContentCache::homeKey());

    $category = Category::query()->create([
        'name' => 'Publications',
        'slug' => 'publications-jpg-fallback-'.uniqid(),
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

    $legacyJpg = dirname($media->getPath()).'/conversions/'
        .pathinfo($media->file_name, PATHINFO_FILENAME).'-preview.jpg';
    File::put($legacyJpg, 'legacy-preview');

    $payload = app(HomePageDataAssembler::class)->assemble();
    $featured = collect($payload['featuredPublications'])
        ->firstWhere('id', $publication->id);

    expect($featured)->not->toBeNull()
        ->and($featured['media'][0]['preview_url'] ?? null)->toContain('-preview.jpg')
        ->and($featured['media'][0]['preview_url'] ?? null)->not->toContain('-preview.webp');

    File::delete($legacyJpg);
});
