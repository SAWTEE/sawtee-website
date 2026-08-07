<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Fellow extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'fellowship_id',
        'designation',
        'description',
        'experience',
    ];

    public function published_stories(): HasMany
    {
        return $this->hasMany(PublishedStory::class);
    }

    public function fellowship(): BelongsTo
    {
        return $this->belongsTo(Fellowship::class);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('preview')
            ->fit(Fit::Max, 400, 400)
            ->format('webp')
            ->quality(75)
            ->nonQueued();

        $this->addMediaConversion('large')
            ->fit(Fit::Max, 1600, 1200)
            ->performOnCollections('profile_picture')
            ->format('webp')
            ->quality(80);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('profile_picture')->singleFile();
    }
}
