<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class PublishedStory extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $with = ["fellow", "media"];
    protected $fillable = [
        "title",
        "link",
        "fellow_id",
    ];

    public function registerMediaConversions(Media $media = null): void
    {
        // @phpstan-ignore-next-line
        $this->addMediaConversion("responsive")
            ->fit(Manipulations::FIT_MAX, 400, 250)
            ->performOnCollections("published-story-images")
            ->quality(75)
            ->format(Manipulations::FORMAT_WEBP)
            ->withResponsiveImages()
            ->nonQueued();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection("published-story-images");
    }

    public function fellow(): BelongsTo
    {
        return $this->BelongsTo(Fellow::class);
    }
}
