<?php

namespace App\MediaLibrary;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\Conversions\Conversion;
use Spatie\MediaLibrary\Conversions\ConversionCollection;
use Spatie\MediaLibrary\Conversions\FileManipulator as SpatieFileManipulator;
use Spatie\MediaLibrary\MediaCollections\Filesystem;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\TemporaryDirectory;

class FileManipulator extends SpatieFileManipulator
{
    public function performConversions(
        ConversionCollection $conversions,
        Media $media,
        bool $onlyMissing = false
    ): self {
        $conversions = $conversions
            ->when(
                $onlyMissing,
                fn (ConversionCollection $conversions) => $conversions->reject(function (Conversion $conversion) use ($media) {
                    $relativePath = $media->getPath($conversion->getName());

                    if ($rootPath = config("filesystems.disks.{$media->disk}.root")) {
                        $relativePath = str_replace($rootPath, '', $relativePath);
                    }

                    return Storage::disk($media->disk)->exists($relativePath);
                })
            );

        if ($conversions->isEmpty()) {
            return $this;
        }

        $temporaryDirectory = TemporaryDirectory::create();

        $copiedOriginalFile = app(Filesystem::class)->copyFromMediaLibrary(
            $media,
            $temporaryDirectory->path(Str::random(32).'.'.$media->extension)
        );

        if (! file_exists($copiedOriginalFile) || filesize($copiedOriginalFile) === 0) {
            Log::warning('Media Library conversion skipped: original file missing or empty.', [
                'media_id' => $media->getKey(),
                'path' => $copiedOriginalFile,
            ]);

            $temporaryDirectory->delete();

            return $this;
        }

        $conversions->each(
            fn (Conversion $conversion) => (new PerformConversionAction)->execute($conversion, $media, $copiedOriginalFile)
        );

        $temporaryDirectory->delete();

        return $this;
    }
}
