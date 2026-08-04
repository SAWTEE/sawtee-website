<?php

namespace App\Models;

use App\Models\Concerns\HasSeoMeta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Laravel\Scout\Attributes\SearchUsingPrefix;
use Laravel\Scout\Searchable;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Post extends Model implements HasMedia
{
    use HasFactory;
    use HasSeoMeta;
    use HasSlug;
    use InteractsWithMedia;
    use Searchable;

    // protected $with = ['media', 'tags'];

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'category_id',
        'theme_id',
        'author',
        'genre',
        'status',
        'link',
        'published_at',
        'meta_title',
        'meta_description',
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    #[SearchUsingPrefix(['title', 'author'])]
    public function toSearchableArray(): array
    {
        return [
            'title' => $this->title,
            'author' => $this->author,
            'excerpt' => $this->excerpt,
        ];
    }

    /**
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable(): bool
    {
        return $this->status === 'published';
    }

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

    public function postContentFiles(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
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
            ->performOnCollections('post-featured-image')
            ->quality(75)
            ->format('webp')
            ->withResponsiveImages()
            ->nonQueued();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('post-featured-image')->singleFile();

        $this->addMediaCollection('post-content-media');

        $this->addMediaCollection('post-files')->singleFile();
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function theme(): BelongsTo
    {
        return $this->belongsTo(Theme::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->as('tags');
    }

    public function scopeIdDescending($query)
    {
        return $query->orderBy('id', 'DESC');
    }
}
