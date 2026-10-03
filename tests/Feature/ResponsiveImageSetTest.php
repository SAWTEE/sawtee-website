<?php

use App\Models\Page;
use App\Models\Slide;
use App\Models\Slider;
use App\Support\ResponsiveImageSet;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\ResponsiveImages\ResponsiveImage;
use Spatie\MediaLibrary\Support\PathGenerator\PathGeneratorFactory;

function slideWithResponsiveImages(): Slide
{
    $page = Page::query()->create([
        'name' => 'home',
        'slug' => 'home-responsive-'.uniqid(),
        'content' => '',
    ]);

    $slider = Slider::query()->create([
        'name' => 'Home slider',
        'page_id' => $page->id,
    ]);

    $slide = Slide::query()->create([
        'slider_id' => $slider->id,
        'title' => 'Slide title',
    ]);

    $slide->addMedia(UploadedFile::fake()->image('hero.jpg', 1200, 900))
        ->toMediaCollection('slides');

    return $slide->fresh(['media']);
}

/**
 * Write variant files to disk and register them, so width filtering and
 * ordering can be asserted without depending on what the width calculator
 * decides for a given source image.
 *
 * @param  list<array{int, int}>  $dimensions
 */
function registerVariants(Media $media, array $dimensions, string $conversion = 'large'): void
{
    $directory = rtrim((string) config("filesystems.disks.{$media->disk}.root"), '/')
        .'/'.PathGeneratorFactory::create($media)->getPathForResponsiveImages($media);

    File::ensureDirectoryExists($directory);

    foreach ($dimensions as [$width, $height]) {
        $fileName = "hero___{$conversion}_{$width}_{$height}.webp";
        File::put($directory.$fileName, 'variant');
        ResponsiveImage::register($media->refresh(), $fileName, $conversion);
    }
}

test('srcset lists every generated variant with a width descriptor', function () {
    $slide = slideWithResponsiveImages();
    $media = $slide->getFirstMedia('slides');

    expect($media)->not->toBeNull()
        ->and($media->responsive_images)->toHaveKey('large');

    $srcset = ResponsiveImageSet::srcset($media, 'large');

    expect($srcset)->not->toBeNull();

    foreach (explode(', ', $srcset) as $candidate) {
        expect($candidate)->toMatch('/^\S+\.webp \d+w$/');
    }
});

test('srcset orders variants widest first and drops ones below the minimum width', function () {
    $slide = slideWithResponsiveImages();
    $media = $slide->getFirstMedia('slides');
    $media->responsive_images = [];
    $media->save();

    registerVariants($media, [[400, 300], [1200, 900], [32, 24], [800, 600]]);

    $srcset = ResponsiveImageSet::srcset($media->refresh(), 'large');

    expect($srcset)->toBe(implode(', ', [
        $media->responsiveImages('large')->files->firstWhere('fileName', 'hero___large_1200_900.webp')->url().' 1200w',
        $media->responsiveImages('large')->files->firstWhere('fileName', 'hero___large_800_600.webp')->url().' 800w',
        $media->responsiveImages('large')->files->firstWhere('fileName', 'hero___large_400_300.webp')->url().' 400w',
    ]));
});

test('variants whose file is gone from disk are left out of the srcset', function () {
    $slide = slideWithResponsiveImages();
    $media = $slide->getFirstMedia('slides');
    $media->responsive_images = [];
    $media->save();

    registerVariants($media, [[1200, 900], [600, 450]]);
    $media->refresh();

    $missing = $media->responsiveImages('large')->files
        ->firstWhere('fileName', 'hero___large_1200_900.webp');

    $directory = rtrim((string) config("filesystems.disks.{$media->disk}.root"), '/')
        .'/'.PathGeneratorFactory::create($media)->getPathForResponsiveImages($media);

    File::delete($directory.$missing->fileName);

    expect(ResponsiveImageSet::srcset($media, 'large'))
        ->not->toContain('1200w')
        ->toContain('600w');
});

test('srcset falls back to the single large conversion when no variants exist', function () {
    $slide = slideWithResponsiveImages();
    $media = $slide->getFirstMedia('slides');
    $media->responsive_images = [];
    $media->save();

    expect(ResponsiveImageSet::srcset($media->refresh(), 'large'))
        ->toStartWith($media->getUrl('large'))
        ->not->toContain('w,');
});

test('for() exposes a src, placeholder and intrinsic dimensions', function () {
    $slide = slideWithResponsiveImages();
    $media = $slide->getFirstMedia('slides');
    $media->responsive_images = [];
    $media->save();

    registerVariants($media, [[1200, 900], [600, 450]]);

    $payload = ResponsiveImageSet::for($media->refresh(), 'large', 'preview');

    expect($payload['src'])->toStartWith($media->getUrl('large'))
        ->and($payload['srcset'])->toContain('1200w')
        ->and($payload['width'])->toBe(1200)
        ->and($payload['height'])->toBe(900);
});

test('for() degrades to empty values when there is no media', function () {
    expect(ResponsiveImageSet::for(null))->toBe([
        'src' => '',
        'srcset' => null,
        'placeholder' => null,
        'width' => null,
        'height' => null,
    ]);
});

test('a blurred placeholder is generated alongside the responsive variants', function () {
    $slide = slideWithResponsiveImages();
    $media = $slide->getFirstMedia('slides');

    expect(ResponsiveImageSet::placeholder($media, 'large'))
        ->toStartWith('data:image/svg+xml;base64,');
});

test('serialized media includes srcset and placeholder and hides conversion bookkeeping', function () {
    $slide = slideWithResponsiveImages();
    $media = $slide->getFirstMedia('slides');

    expect($media)->not->toBeNull();

    $payload = $media->toArray();

    expect($payload)->toHaveKey('srcset')
        ->and($payload['srcset'])->toContain('w')
        ->and($payload['placeholder'])->toStartWith('data:image/svg+xml;base64,')
        ->and($payload['preview_url'])->not->toBe('')
        ->and($payload)->not->toHaveKey('responsive_images')
        ->and($payload)->not->toHaveKey('generated_conversions')
        ->and($payload)->not->toHaveKey('manipulations');
});
