<?php

namespace App\Models;

use App\Models\Concerns\HasSeoMeta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Page extends Model implements HasMedia
{
    use HasFactory;
    use HasSeoMeta;
    use HasSlug;
    use InteractsWithMedia;

    protected $fillable = ['name', 'slug', 'content', 'meta_title', 'meta_description', 'page_template'];

    protected $casts = ['pageData' => 'json'];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug')
            // ->skipGenerateWhen(fn () => $this->status !== "published")
            ->startSlugSuffixFrom(2);
    }

    public function pageData(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }

    public function sectionCount()
    {
        return $this->sections->count();
    }

    public function slider(): HasMany
    {
        return $this->hasMany(Slider::class);
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
            ->performOnCollections('page-media')
            ->format('webp')
            ->quality(80);
    }

    // protected $with = ['media'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('page-media')->singleFile();
    }

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    // public function getRouteKeyName()
    // {
    //     return 'slug';
    // }
}
