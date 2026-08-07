<?php

namespace App\Models;

use App\Models\Concerns\DeletesAssociatedFiles;
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
    use DeletesAssociatedFiles;
    use HasFactory;
    use HasSeoMeta;
    use InteractsWithMedia;
    use Searchable;

    protected $fillable = ['title', 'slug', 'subtitle', 'description', 'year', 'link', 'meta_title', 'meta_description'];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'year' => 'integer',
    ];

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
        $this->addMediaConversion('preview')
            ->fit(Fit::Max, 400, 400)
            ->format('webp')
            ->quality(75)
            ->nonQueued();

        $this->addMediaConversion('large')
            ->fit(Fit::Max, 1600, 1200)
            ->performOnCollections('research_featured_image')
            ->format('webp')
            ->quality(80);
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
}
