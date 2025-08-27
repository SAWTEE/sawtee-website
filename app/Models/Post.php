<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Laravel\Scout\Searchable;
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Attributes\SearchUsingPrefix;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Post extends Model implements HasMedia
{
    use InteractsWithMedia;
    use HasFactory;
    use Searchable;
    use HasSlug;

    // protected $with = ['media', 'tags'];

    protected $fillable = [
        "title",
        "slug",
        "content",
        "excerpt",
        "category_id",
        "theme_id",
        "author",
        "genre",
        "status",
        "link",
        "published_at",
        "meta_title",
        "meta_description",
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */

    #[SearchUsingPrefix(["title", "author"])]
    public function toSearchableArray(): array
    {
        return [
            "title" => $this->title,
            "author" => $this->author,
            "excerpt" => $this->excerpt,
        ];
    }

    /**
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable(): bool
    {
        return $this->status === "published";
    }

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

    public function postContentFiles(): MorphMany
    {
        return $this->morphMany(File::class, "fileable");
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
            ->performOnCollections("post-featured-image")
            ->quality(75)
            ->format(Manipulations::FORMAT_WEBP)
            ->withResponsiveImages()
            ->nonQueued();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection("post-featured-image")->singleFile();

        $this->addMediaCollection("post-content-media");

        $this->addMediaCollection("post-files")->singleFile();
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
        return $this->belongsToMany(Tag::class)->as("tags");
    }

    public function scopeIdDescending($query)
    {
        return $query->orderBy("id", "DESC");
    }
}
