<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Team extends Model implements HasMedia
{
    use InteractsWithMedia;
    use HasFactory;

    public $fillable = ['name', 'email', 'designation', 'bio', 'order'];


    public function registerMediaConversions(Media $media = null): void
    {
        $this
            ->addMediaConversion('preview')
            ->fit(Manipulations::FIT_MAX, 100, 100)
            ->quality(90)
            ->keepOriginalImageFormat()
            ->nonQueued();
    }


    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')
            ->singleFile();

    }

}
