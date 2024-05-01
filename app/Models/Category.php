<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Category extends Model implements HasMedia
{
    use InteractsWithMedia;
    use HasFactory;
    use HasSlug;

    protected $fillable = ['name', 'slug', 'type', 'parent_id', 'meta_title', 'meta_description'];


    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug')
            // ->skipGenerateWhen(fn () => $this->status !== "published")
            ->startSlugSuffixFrom(2);
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id', 'id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id', 'id');
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function publications(): HasMany
    {
        return $this->hasMany(Publication::class);
    }

    public function research(): HasMany
    {
        return $this->hasMany(Publication::class);
    }


    public function registerMediaConversions(Media $media = null): void
    {
        $this
            ->addMediaConversion('preview')
            ->fit(Manipulations::FIT_MAX, 600, 300)
            ->quality(90)
            ->sharpen(30)
            ->keepOriginalImageFormat()
            ->nonQueued();

        $this
            ->addMediaConversion('responsive')
            ->fit(Manipulations::FIT_MAX, 1920, 1080)
            ->performOnCollections('category_media')
            ->quality(90)
            ->keepOriginalImageFormat()
            ->withResponsiveImages()
            ->nonQueued();
    }

    // protected $with = ['media'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('category_media')
            ->singleFile();
    }

    public function getCategoriesIds($category)
    {
        if (!empty($category)) {
            $array = array($category->id);
            if (count($category->children) == 0)
                return $array;
            else
                return array_merge($array, $this->getChildrenIds($category->children));
        } else
            return null;
    }

    public function getChildrenIds($children)
    {
        $array = array();
        foreach ($children as $subcategory) {
            array_push($array, $subcategory->id);
            if (count($subcategory->children))
                $array = array_merge($array, $this->getChildrenIds($subcategory->children));
        }
        return $array;
    }


    /**
     * Get the route key for the model.
     *
    //  * @return string
     */
    // public function getRouteKeyName()
    // {
    //     return 'slug';
    // }

}
