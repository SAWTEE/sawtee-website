<?php

namespace App\Models;

use App\Support\MediaConversionUrl;
use App\Support\ResponsiveImageSet;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

/**
 * Keeps conversion bookkeeping out of Inertia payloads.
 *
 * `responsive_images` holds every generated variant filename plus a base64
 * placeholder SVG — a couple of kilobytes per image, repeated for every card in
 * a listing. Hiding it only affects serialization; the conversion pipeline
 * still reads the attribute directly. The frontend gets the flat `srcset` and
 * `placeholder` keys that {@see ResponsiveImageSet} derives from it instead.
 */
class Media extends BaseMedia
{
    /**
     * @var list<string>
     */
    protected $hidden = [
        'responsive_images',
        'generated_conversions',
        'manipulations',
    ];

    /**
     * Parent already appends `original_url` and `preview_url`.
     *
     * @var list<string>
     */
    protected $appends = [
        'original_url',
        'preview_url',
        'srcset',
        'placeholder',
    ];

    /**
     * Width-descriptor srcset for the large conversion. Falls back to the
     * single conversion URL while variants are still being generated.
     */
    protected function srcset(): Attribute
    {
        return Attribute::get(fn (): ?string => ResponsiveImageSet::srcset($this, 'large'));
    }

    /**
     * Tiny pixelated SVG shown while the full image is deferred or in flight.
     */
    protected function placeholder(): Attribute
    {
        return Attribute::get(fn (): ?string => ResponsiveImageSet::placeholder($this, 'large'));
    }

    /**
     * Small conversion URL for thumbs. Uses the on-disk file, not the
     * registered conversion name, so a stale webp flag cannot emit a 404.
     */
    protected function previewUrl(): Attribute
    {
        return Attribute::get(fn (): string => MediaConversionUrl::resolve($this, 'preview'));
    }
}
