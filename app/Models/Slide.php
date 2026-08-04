<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Slide extends Model implements HasMedia
{
    use InteractsWithMedia;

    public mixed $image;

    protected $fillable = [
        'title',
        'subtitle',
        'slider_id',
    ];

    public function slider(): BelongsTo
    {
        return $this->belongsTo(Slider::class);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this
            ->addMediaConversion('preview')
            ->fit(Fit::Max, 300, 150)
            ->format('webp')
            ->nonQueued();

        $this
            ->addMediaConversion('responsive')
            ->fit(Fit::Max, 1280, 720)
            ->performOnCollections('slides')
            ->quality(75)
            ->format('webp')
            ->withResponsiveImages()
            ->nonQueued();
    }

    protected $with = ['media'];

    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection('slides')
            ->singleFile();
    }
}
