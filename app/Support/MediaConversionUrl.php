<?php

namespace App\Support;

use Spatie\MediaLibrary\MediaCollections\Exceptions\InvalidConversion;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaConversionUrl
{
    /**
     * Legacy conversion names that older uploads may still have on disk after
     * registerMediaConversions() was renamed (responsive → large).
     *
     * @var array<string, list<string>>
     */
    private const LEGACY_ALIASES = [
        'large' => ['responsive'],
    ];

    /**
     * Whether a conversion file exists on disk at a path we can serve.
     *
     * {@see Media::hasGeneratedConversion()} alone is not enough: after format
     * changes (e.g. jpg → webp) or renames (responsive → large) the DB flag /
     * registered name can disagree with files still on disk.
     */
    public static function isUsable(?Media $media, string $conversion): bool
    {
        return self::existingConversionRelativePath($media, $conversion) !== null;
    }

    /**
     * First usable conversion URL, otherwise the original media URL.
     */
    public static function resolve(?Media $media, string ...$conversions): string
    {
        if (! $media instanceof Media) {
            return '';
        }

        foreach ($conversions as $conversion) {
            $url = self::urlForConversion($media, $conversion);
            if ($url !== null) {
                return $url;
            }
        }

        return $media->getUrl();
    }

    /**
     * Conversion URL when the file exists; null when missing (safe for srcSet).
     */
    public static function optional(?Media $media, string $conversion): ?string
    {
        if (! $media instanceof Media) {
            return null;
        }

        return self::urlForConversion($media, $conversion);
    }

    private static function urlForConversion(Media $media, string $conversion): ?string
    {
        $match = self::existingConversionMatch($media, $conversion);
        if ($match === null) {
            return null;
        }

        if ($match['use_spatie_url']) {
            return $media->getUrl($conversion);
        }

        return self::publicUrlForRelativePath($media, $match['relative']);
    }

    /**
     * @return array{relative: string, use_spatie_url: bool}|null
     */
    private static function existingConversionMatch(?Media $media, string $conversion): ?array
    {
        if (! $media instanceof Media || $conversion === '') {
            return null;
        }

        $names = [$conversion, ...(self::LEGACY_ALIASES[$conversion] ?? [])];

        foreach ($names as $index => $name) {
            $relative = self::findConversionRelativePath($media, $name);
            if ($relative === null) {
                continue;
            }

            return [
                'relative' => $relative,
                // Only the primary registered conversion name can use getUrl().
                'use_spatie_url' => $index === 0 && self::registeredPathMatches($media, $conversion, $relative),
            ];
        }

        return null;
    }

    private static function existingConversionRelativePath(?Media $media, string $conversion): ?string
    {
        return self::existingConversionMatch($media, $conversion)['relative'] ?? null;
    }

    private static function registeredPathMatches(Media $media, string $conversion, string $relative): bool
    {
        try {
            $expected = ltrim(str_replace('\\', '/', $media->getPathRelativeToRoot($conversion)), '/');
        } catch (InvalidConversion) {
            return false;
        }

        return $relative === $expected;
    }

    private static function findConversionRelativePath(Media $media, string $conversion): ?string
    {
        try {
            $expected = $media->getPath($conversion);
            if (is_string($expected) && $expected !== '' && is_file($expected)) {
                return ltrim(str_replace('\\', '/', $media->getPathRelativeToRoot($conversion)), '/');
            }
        } catch (InvalidConversion) {
            // Conversion no longer registered (e.g. renamed responsive → large).
        }

        $diskRoot = rtrim(str_replace('\\', '/', (string) config("filesystems.disks.{$media->disk}.root")), '/');
        $mediaDir = dirname($media->getPath());
        $base = pathinfo($media->file_name, PATHINFO_FILENAME);

        foreach (['webp', 'jpg', 'jpeg', 'png', 'gif'] as $extension) {
            $candidate = $mediaDir.DIRECTORY_SEPARATOR.'conversions'.DIRECTORY_SEPARATOR.$base.'-'.$conversion.'.'.$extension;
            if (! is_file($candidate)) {
                continue;
            }

            $normalized = str_replace('\\', '/', $candidate);
            if ($diskRoot !== '' && str_starts_with($normalized, $diskRoot.'/')) {
                return substr($normalized, strlen($diskRoot) + 1);
            }

            return ltrim($normalized, '/');
        }

        return null;
    }

    private static function publicUrlForRelativePath(Media $media, string $relativePath): string
    {
        $baseUrl = rtrim((string) config("filesystems.disks.{$media->disk}.url"), '/');

        return $baseUrl.'/'.ltrim(str_replace('\\', '/', $relativePath), '/');
    }
}
