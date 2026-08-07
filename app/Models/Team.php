<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Team extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    public $fillable = ['name', 'email', 'designation', 'bio', 'order'];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * @param  Builder<Team>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('order')->orderBy('name');
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
            ->performOnCollections('avatar')
            ->format('webp')
            ->quality(80);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')
            ->singleFile();

    }
}
