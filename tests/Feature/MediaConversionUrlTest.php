<?php

use App\Models\Page;
use App\Models\Slide;
use App\Models\Slider;
use App\Support\MediaConversionUrl;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

function createSlideWithMedia(): Slide
{
    $page = Page::query()->create([
        'name' => 'home',
        'slug' => 'home-media-url-'.uniqid(),
        'content' => '',
    ]);

    $slider = Slider::query()->create([
        'name' => 'Home slider',
        'page_id' => $page->id,
    ]);

    $slide = Slide::query()->create([
        'slider_id' => $slider->id,
        'title' => 'Slide title',
        'subtitle' => 'Slide subtitle',
    ]);

    $slide->addMedia(UploadedFile::fake()->image('hero.jpg', 800, 600))
        ->toMediaCollection('slides');

    return $slide->fresh(['media']);
}

test('isUsable is true when the conversion file exists on disk', function () {
    $slide = createSlideWithMedia();
    $media = $slide->getFirstMedia('slides');

    expect($media)->not->toBeNull()
        ->and(MediaConversionUrl::isUsable($media, 'preview'))->toBeTrue()
        ->and(MediaConversionUrl::isUsable($media, 'large'))->toBeTrue();
});

test('resolve falls back to original when conversion is marked generated but file is missing', function () {
    $slide = createSlideWithMedia();
    $media = $slide->getFirstMedia('slides');
    expect($media)->not->toBeNull();

    $previewPath = $media->getPath('preview');
    $largePath = $media->getPath('large');

    File::delete($previewPath);
    File::delete($largePath);

    $media->markAsConversionGenerated('preview');
    $media->markAsConversionGenerated('large');
    $media->refresh();

    expect($media->hasGeneratedConversion('preview'))->toBeTrue()
        ->and($media->hasGeneratedConversion('large'))->toBeTrue()
        ->and(MediaConversionUrl::isUsable($media, 'preview'))->toBeFalse()
        ->and(MediaConversionUrl::isUsable($media, 'large'))->toBeFalse()
        ->and(MediaConversionUrl::resolve($media, 'large', 'preview'))->toBe($media->getUrl())
        ->and(MediaConversionUrl::optional($media, 'large'))->toBeNull();
});

test('resolve prefers large then preview when those files exist', function () {
    $slide = createSlideWithMedia();
    $media = $slide->getFirstMedia('slides');
    expect($media)->not->toBeNull();

    expect(MediaConversionUrl::resolve($media, 'large', 'preview'))
        ->toBe($media->getUrl('large'));

    File::delete($media->getPath('large'));

    expect(MediaConversionUrl::resolve($media, 'large', 'preview'))
        ->toBe($media->getUrl('preview'));
});

test('resolve falls back to legacy responsive webp when large is missing', function () {
    $slide = createSlideWithMedia();
    $media = $slide->getFirstMedia('slides');
    expect($media)->not->toBeNull();

    File::delete($media->getPath('large'));

    $legacy = dirname($media->getPath()).'/conversions/'.pathinfo($media->file_name, PATHINFO_FILENAME).'-responsive.webp';
    File::put($legacy, 'legacy-responsive');

    expect(MediaConversionUrl::optional($media, 'large'))
        ->toEndWith('-responsive.webp')
        ->and(MediaConversionUrl::resolve($media, 'large'))
        ->toContain('/conversions/')
        ->toContain('-responsive.webp');

    File::delete($legacy);
});

test('resolve serves on-disk preview jpg when registered preview webp is missing', function () {
    $slide = createSlideWithMedia();
    $media = $slide->getFirstMedia('slides');
    expect($media)->not->toBeNull();

    File::delete($media->getPath('preview'));

    $legacyJpg = dirname($media->getPath()).'/conversions/'.pathinfo($media->file_name, PATHINFO_FILENAME).'-preview.jpg';
    File::put($legacyJpg, 'legacy-preview');

    expect(MediaConversionUrl::resolve($media, 'preview'))
        ->toContain('-preview.jpg');

    File::delete($legacyJpg);
});
