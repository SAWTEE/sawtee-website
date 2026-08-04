<?php

namespace App\Models;

use App\Models\Concerns\HasSeoMeta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Laravel\Scout\Attributes\SearchUsingPrefix;
use Laravel\Scout\Searchable;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Research extends Model implements HasMedia
{
    use HasFactory;
    use HasSeoMeta;
    use InteractsWithMedia;
    use Searchable;

    protected $fillable = ['title', 'subtitle', 'description', 'year', 'link', 'meta_title', 'meta_description'];

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
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable(): bool
    {
        return $this->status === 'published';
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this
            ->addMediaConversion('preview')
            ->fit(Fit::Max, 180, 240)
            ->nonQueued();

        $this
            ->addMediaConversion('responsive')
            ->fit(Fit::Max, 210, 280)
            ->performOnCollections('research_featured_image')
            ->quality(75)
            ->format('webp')
            ->withResponsiveImages()
            ->nonQueued();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('research_featured_image')
            ->singleFile();

    }

    public function file(): MorphOne
    {
        return $this->morphOne(File::class, 'fileable');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
