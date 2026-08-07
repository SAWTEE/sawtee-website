<?php

namespace App\Models;

use App\Models\Concerns\DeletesAssociatedFiles;
use App\Models\Concerns\HasSeoMeta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Laravel\Scout\Attributes\SearchUsingPrefix;
use Laravel\Scout\Searchable;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Publication extends Model implements HasMedia
{
    use DeletesAssociatedFiles;
    use HasFactory;
    use HasSeoMeta;
    use HasSlug;
    use InteractsWithMedia;
    use Searchable;

    protected $fillable = ['title', 'subtitle', 'description', 'volume', 'category_id', 'meta_title', 'meta_description'];

    protected $with = ['media', 'file'];

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    #[SearchUsingPrefix(['title', 'subtitle', 'description'])]
    public function toSearchableArray(): array
    {
        return [
            'title' => $this->title,
            'subtitle' => $this->subtitle,
        ];
    }

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('volume')
            ->saveSlugsTo('volume_slug')
            ->startSlugSuffixFrom(2);
    }

    /**
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable(): bool
    {
        return $this->status === 'published';
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->as('tags');
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    public function file(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable');
    }

    /**
     * Retrieves the category associated with this publication.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
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
            ->performOnCollections('publication_featured_image')
            ->format('webp')
            ->quality(80)
            ->nonQueued();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('publication_featured_image')
            ->singleFile();

        $this->addMediaCollection('files')
            ->singleFile();
    }
}
