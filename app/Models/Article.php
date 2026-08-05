<?php

namespace App\Models;

use App\Models\Concerns\HasSeoMeta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Article extends Model implements HasMedia
{
    use HasFactory;
    use HasSeoMeta;
    use HasSlug;
    use InteractsWithMedia;

    protected $fillable = [
        'title',
        'slug',
        'publication_id',
        'subtitle',
        'excerpt',
        'author',
        'published_at',
        'meta_title',
        'meta_description',
        'content',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'published_at' => 'datetime:Y-m-d H:i:s',
    ];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug')
            ->startSlugSuffixFrom(2);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        // @phpstan-ignore-next-line
        $this->addMediaConversion('preview')
            ->fit(Fit::Max, 300, 200)
            ->format('webp')
            ->quality(75)
            ->nonQueued();

        // @phpstan-ignore-next-line
        $this->addMediaConversion('responsive')
            ->fit(Fit::Max, 1200, 800)
            ->performOnCollections('article-featured-image')
            ->quality(75)
            ->format('webp')
            ->withResponsiveImages()
            ->nonQueued();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('article-featured-image')->singleFile();
        $this->addMediaCollection('article-content-media');
    }

    public function volume(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'publication_id');
    }

    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class, 'publication_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }
}
