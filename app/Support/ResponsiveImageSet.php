<?php

namespace App\Support;

use Illuminate\Support\Str;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\ResponsiveImages\ResponsiveImage;
use Spatie\MediaLibrary\Support\PathGenerator\PathGeneratorFactory;

/**
 * Flattens the responsive image variants Spatie generates for a conversion into
 * the shape the frontend `<ResponsiveImage>` component consumes.
 *
 * Media uploaded before `withResponsiveImages()` was enabled has no variants,
 * so every accessor degrades to the single conversion URL resolved by
 * {@see MediaConversionUrl}. Run `media-library:regenerate` to backfill.
 */
class ResponsiveImageSet
{
    /**
     * Spatie's width calculator keeps halving until a variant is ~20px wide.
     * Anything this narrow is blurry at every real layout width, and the tiny
     * placeholder already covers the "something on screen now" job.
     */
    private const MIN_VARIANT_WIDTH = 160;

    /**
     * Everything one image needs: a guaranteed `src`, a width-descriptor
     * `srcset`, the blurred placeholder, and intrinsic dimensions so the
     * browser can reserve layout space before any pixels arrive.
     *
     * @return array{src: string, srcset: string|null, placeholder: string|null, width: int|null, height: int|null}
     */
    public static function for(?Media $media, string $conversion = 'large', string ...$srcFallbacks): array
    {
        $variants = self::usableVariants($media, $conversion);
        $widest = $variants[0] ?? null;

        return [
            'src' => MediaConversionUrl::resolve($media, $conversion, ...$srcFallbacks),
            'srcset' => self::srcsetFor($variants) ?? MediaConversionUrl::optional($media, $conversion),
            'placeholder' => self::placeholder($media, $conversion),
            'width' => $widest?->width(),
            'height' => $widest?->height(),
        ];
    }

    /**
     * Width-descriptor srcset, falling back to the single conversion URL while
     * no variants exist and to null when even that file is missing.
     */
    public static function srcset(?Media $media, string $conversion = 'large'): ?string
    {
        return self::srcsetFor(self::usableVariants($media, $conversion))
            ?? MediaConversionUrl::optional($media, $conversion);
    }

    /**
     * First candidate URL from a srcset string, so preload/src share one file
     * instead of the original plus a width variant on HTTP/1.1.
     */
    public static function firstUrl(?string $srcset): ?string
    {
        if (! is_string($srcset) || $srcset === '') {
            return null;
        }

        $first = trim(Str::before(Str::before($srcset, ','), ' '));

        return $first !== '' ? $first : null;
    }

    /**
     * Base64 blurred SVG to show while the real image is still on the wire.
     */
    public static function placeholder(?Media $media, string $conversion = 'large'): ?string
    {
        if (! $media instanceof Media) {
            return null;
        }

        return $media->responsiveImages($conversion)->getPlaceholderSvg();
    }

    /**
     * Spatie's own `Media::getSrcset()` appends the tiny placeholder as a `32w`
     * candidate so its Blade progressive-loading script can swap it out. We
     * leave it off the srcset — the browser must never settle on the blurred
     * SVG as a real candidate — and hand the placeholder over separately.
     *
     * @param  list<ResponsiveImage>  $variants
     */
    private static function srcsetFor(array $variants): ?string
    {
        if ($variants === []) {
            return null;
        }

        return implode(', ', array_map(
            fn (ResponsiveImage $variant): string => $variant->url().' '.$variant->width().'w',
            $variants
        ));
    }

    /**
     * Generated variants whose file is actually on disk, widest first.
     *
     * The `responsive_images` column keeps pointing at filenames that a manual
     * cleanup or a half-finished regenerate removed, so trust the disk the same
     * way {@see MediaConversionUrl} does.
     *
     * @return list<ResponsiveImage>
     */
    private static function usableVariants(?Media $media, string $conversion): array
    {
        if (! $media instanceof Media) {
            return [];
        }

        $directory = self::variantDirectory($media);

        return $media->responsiveImages($conversion)->files
            ->filter(fn (ResponsiveImage $variant): bool => $variant->width() >= self::MIN_VARIANT_WIDTH)
            ->filter(fn (ResponsiveImage $variant): bool => $directory === null || is_file($directory.$variant->fileName))
            ->sortByDesc(fn (ResponsiveImage $variant): int => $variant->width())
            ->values()
            ->all();
    }

    /**
     * Local directory holding the variants, or null when the disk has no local
     * root and existence cannot be checked without a remote call.
     */
    private static function variantDirectory(Media $media): ?string
    {
        $root = rtrim((string) config("filesystems.disks.{$media->disk}.root"), '/');

        if ($root === '') {
            return null;
        }

        $relative = PathGeneratorFactory::create($media)->getPathForResponsiveImages($media);

        return $root.'/'.ltrim(str_replace('\\', '/', $relative), '/');
    }
}
