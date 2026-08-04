<?php

namespace App\MediaLibrary;

use Illuminate\Support\Facades\Image;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\ResponsiveImages\Exceptions\InvalidTinyJpg;
use Spatie\MediaLibrary\ResponsiveImages\ResponsiveImage;
use Spatie\MediaLibrary\ResponsiveImages\ResponsiveImageGenerator as SpatieResponsiveImageGenerator;
use Spatie\MediaLibrary\Support\File;
use Spatie\TemporaryDirectory\TemporaryDirectory as BaseTemporaryDirectory;

class ResponsiveImageGenerator extends SpatieResponsiveImageGenerator
{
    protected const DEFAULT_CONVERSION_QUALITY = 90;

    public function generateResponsiveImage(
        Media $media,
        string $baseImage,
        string $conversionName,
        int $targetWidth,
        BaseTemporaryDirectory $temporaryDirectory,
        int $conversionQuality = self::DEFAULT_CONVERSION_QUALITY
    ): void {
        $extension = $this->fileNamer->extensionFromBaseImage($baseImage);
        $responsiveImagePath = $this->fileNamer->temporaryFileName($media, $extension);
        $tempDestination = $temporaryDirectory->path($responsiveImagePath);

        $image = Image::fromPath($baseImage)
            ->scale(width: max(1, $targetWidth))
            ->quality(max(1, min(100, $conversionQuality)));

        $image = match (strtolower($extension)) {
            'webp' => $image->toWebp(),
            'png' => $image->toPng(),
            'gif' => $image->toGif(),
            'avif' => $image->toAvif(),
            default => $image->toJpeg(),
        };

        file_put_contents($tempDestination, $image->toBytes());

        $responsiveImageHeight = Image::fromPath($tempDestination)->height();

        $fileName = $this->addPropertiesToFileName(
            $responsiveImagePath,
            $conversionName,
            $targetWidth,
            $responsiveImageHeight,
            $extension
        );

        $responsiveImagePath = $temporaryDirectory->path($fileName);

        rename($tempDestination, $responsiveImagePath);

        $this->filesystem->copyToMediaLibrary($responsiveImagePath, $media, 'responsiveImages');

        ResponsiveImage::register($media, $fileName, $conversionName);
    }

    public function generateTinyJpg(
        Media $media,
        string $originalImagePath,
        string $conversionName,
        BaseTemporaryDirectory $temporaryDirectory
    ): void {
        if (! config('media-library.responsive_images.use_tiny_placeholders')) {
            return;
        }

        $tempDestination = $temporaryDirectory->path('tiny.jpg');

        $this->tinyPlaceholderGenerator->generateTinyPlaceholder($originalImagePath, $tempDestination);

        $this->guardAgainstInvalidTinyPlaceHolder($tempDestination);

        $tinyImageDataBase64 = base64_encode(file_get_contents($tempDestination));
        $tinyImageBase64 = 'data:image/jpeg;base64,'.$tinyImageDataBase64;

        $originalImage = Image::fromPath($originalImagePath);
        $originalImageWidth = $originalImage->width();
        $originalImageHeight = $originalImage->height();

        $svg = view('media-library::placeholderSvg', compact(
            'originalImageWidth',
            'originalImageHeight',
            'tinyImageBase64'
        ));

        $base64Svg = 'data:image/svg+xml;base64,'.base64_encode($svg);

        ResponsiveImage::registerTinySvg($media, $base64Svg, $conversionName);
    }

    protected function guardAgainstInvalidTinyPlaceHolder(string $tinyPlaceholderPath): void
    {
        if (! file_exists($tinyPlaceholderPath)) {
            throw InvalidTinyJpg::doesNotExist($tinyPlaceholderPath);
        }

        if (File::getMimeType($tinyPlaceholderPath) !== 'image/jpeg') {
            throw InvalidTinyJpg::hasWrongMimeType($tinyPlaceholderPath);
        }
    }
}
