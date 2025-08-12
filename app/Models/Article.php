<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
class Article extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use HasSlug;

     protected $with = ['media', 'tags'];
    protected $fillable = [
        "title",
        "slug",
        "trade_insight_volume_id",
        "subtitle",
        "excerpt",
        "author",
        "published_at",
        "meta_title",
        "meta_description",
        "content",
    ];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom("title")
            ->saveSlugsTo("slug")
            ->startSlugSuffixFrom(2);
    }

    public function registerMediaConversions(Media $media = null): void
    {
        // @phpstan-ignore-next-line
        $this->addMediaConversion("preview")
            ->fit(Manipulations::FIT_MAX, 300, 200)
            ->format(Manipulations::FORMAT_WEBP)
            ->quality(75)
            ->nonQueued();

        // @phpstan-ignore-next-line
        $this->addMediaConversion("responsive")
            ->fit(Manipulations::FIT_MAX, 1200, 800)
            ->performOnCollections("article-featured-image")
            ->quality(75)
            ->format(Manipulations::FORMAT_WEBP)
            ->withResponsiveImages()
            ->nonQueued();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection("article-featured-image")->singleFile();
        $this->addMediaCollection("article-content-media");
    }

    public function volume(): BelongsTo
    {
        return $this->belongsTo(TradeInsightVolume::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }
}
