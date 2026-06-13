<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Image\Manipulations;

class TradeInsightVolume extends Model implements HasMedia
{
    use HasFactory;
    use HasSlug;
    use InteractsWithMedia;

    protected $with = ['media'];
    protected $fillable = [
        "volume",
        "slug",
        "content",
        "full_article_link",
    ];

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
            ->performOnCollections("volume-featured-image")
            ->quality(75)
            ->format(Manipulations::FORMAT_WEBP)
            ->withResponsiveImages()
            ->nonQueued();
    }


    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

     /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom("volume")
            ->saveSlugsTo("slug")
            ->startSlugSuffixFrom(2);
    }
}
