<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Fellow extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $with = ['fellowship', 'media'];

    protected $fillable = [
        "name",
        "fellowship_id",
        "designation",
        "description",
        "experience",
    ];

    public function published_stories(): HasMany
    {
        return $this->HasMany(PublishedStory::class);
    }

    public function fellowship(): BelongsTo
    {
        return $this->BelongsTo(Fellowship::class);
    }

    public function registerMediaConversions(Media $media = null): void
    {
        // @phpstan-ignore-next-line
        $this->addMediaConversion("preview")
            ->fit(Manipulations::FIT_MAX, 200, 200)
            ->format(Manipulations::FORMAT_WEBP)
            ->quality(75)
            ->nonQueued();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection("profile_picture")->singleFile();
    }

}
