<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Team extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    public $fillable = ['name', 'email', 'designation', 'bio', 'order'];

    public function registerMediaConversions(?Media $media = null): void
    {
        $this
            ->addMediaConversion('preview')
            ->fit(Fit::Crop, 120, 80)
            ->quality(90)
            ->keepOriginalImageFormat()
            ->nonQueued();

        $this
            ->addMediaConversion('responsive')
            ->fit(Fit::Max, 600, 400)
            ->performOnCollections('avatar')
            ->quality(75)
            ->format('webp')
            ->withResponsiveImages()
            ->nonQueued();

    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')
            ->singleFile();

    }
}
