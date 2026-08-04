<?php

namespace App\MediaLibrary;

use BackedEnum;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Image;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\Conversions\Conversion;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Throwable;

class PerformManipulationsAction
{
    public function execute(
        Media $media,
        Conversion $conversion,
        string $imageFile,
    ): string {
        if ($conversion->getManipulations()->isEmpty()) {
            return $imageFile;
        }

        if (! File::exists($imageFile)) {
            Log::warning('Media Library manipulation skipped: source image missing.', [
                'media_id' => $media->getKey(),
                'conversion' => $conversion->getName(),
                'path' => $imageFile,
            ]);

            return '';
        }

        try {
            $conversionTempFile = $this->getConversionTempFileName($media, $conversion, $imageFile);

            File::copy($imageFile, $conversionTempFile);

            $supportedFormats = ['jpg', 'jpeg', 'pjpg', 'png', 'gif', 'webp'];
            if ($conversion->shouldKeepOriginalImageFormat() && in_array($media->extension, $supportedFormats, true)) {
                $conversion->format($media->extension);
            }

            $manipulations = $conversion->getManipulations()->toArray();
            unset($manipulations['optimize']);

            $image = Image::fromPath($conversionTempFile);

            if (isset($manipulations['fit'])) {
                $params = array_values($manipulations['fit']);
                $fit = $this->enumValue($params[0] ?? 'max');
                $width = max(1, (int) ($params[1] ?? 1));
                $height = max(1, (int) ($params[2] ?? 1));

                $image = match ($fit) {
                    'crop' => $image->cover($width, $height),
                    'contain', 'fill', 'fill-max' => $image->contain($width, $height),
                    'stretch' => $image->scale(width: $width, height: $height),
                    default => $image->scale($width, $height),
                };
            } elseif (isset($manipulations['width']) || isset($manipulations['height'])) {
                $width = isset($manipulations['width'][0]) ? (int) $manipulations['width'][0] : null;
                $height = isset($manipulations['height'][0]) ? (int) $manipulations['height'][0] : null;

                $image = $image->scale(
                    width: $width ? max(1, $width) : null,
                    height: $height ? max(1, $height) : null,
                );
            }

            if (isset($manipulations['sharpen'][0])) {
                $image = $image->sharpen(max(0, min(100, (int) $manipulations['sharpen'][0])));
            }

            if (isset($manipulations['blur'][0])) {
                $image = $image->blur(max(0, min(100, (int) $manipulations['blur'][0])));
            }

            $format = strtolower((string) ($manipulations['format'][0] ?? 'jpg'));
            if ($format === 'pjpg' || $format === 'jpeg') {
                $format = 'jpg';
            }

            $image = match ($format) {
                'webp' => $image->toWebp(),
                'png' => $image->toPng(),
                'gif' => $image->toGif(),
                'avif' => $image->toAvif(),
                default => $image->toJpeg(),
            };

            if (isset($manipulations['quality'][0])) {
                $image = $image->quality(max(1, min(100, (int) $manipulations['quality'][0])));
            }

            File::put($conversionTempFile, $image->toBytes());

            return $conversionTempFile;
        } catch (Throwable $e) {
            Log::error('Media Library manipulation failed.', [
                'media_id' => $media->getKey(),
                'conversion' => $conversion->getName(),
                'message' => $e->getMessage(),
            ]);

            return '';
        }
    }

    protected function getConversionTempFileName(
        Media $media,
        Conversion $conversion,
        string $imageFile,
    ): string {
        $directory = pathinfo($imageFile, PATHINFO_DIRNAME);
        $extension = $media->extension !== '' ? $media->extension : 'jpg';
        $fileName = Str::random(32)."{$conversion->getName()}.{$extension}";

        return "{$directory}/{$fileName}";
    }

    /**
     * Accept Spatie Fit enums or legacy string fit values.
     */
    protected function enumValue(mixed $value): string
    {
        if ($value instanceof BackedEnum) {
            return strtolower((string) $value->value);
        }

        return strtolower((string) $value);
    }
}
