<?php

namespace App\Models;

use App\Models\Concerns\HasSeoMeta;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Category extends Model implements HasMedia
{
    use HasFactory;
    use HasSeoMeta;
    use HasSlug;
    use InteractsWithMedia;

    protected $fillable = ['name', 'slug', 'type', 'parent_id', 'meta_title', 'meta_description'];

    /**
     * @param  Builder<Category>  $query
     */
    public function scopeOfType(Builder $query, string $type): void
    {
        $query->where('type', $type);
    }

    /**
     * Top level categories, i.e. the ones without a parent.
     *
     * @param  Builder<Category>  $query
     */
    public function scopeRoots(Builder $query): void
    {
        $query->whereNull('parent_id');
    }

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

    public function children(): HasMany
    {
        // Eager-load the full subtree so Inertia (and archive UIs) receive
        // grandchildren, not only top-level children.
        return $this->hasMany(Category::class, 'parent_id', 'id')->with('children');
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

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('preview')
            ->fit(Fit::Max, 400, 400)
            ->format('webp')
            ->quality(75)
            ->nonQueued();

        $this->addMediaConversion('large')
            ->fit(Fit::Max, 1600, 1200)
            ->performOnCollections('category_media')
            ->format('webp')
            ->quality(80);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('category_media')->singleFile();
    }

    public function hasChildren($category)
    {
        if ($category->children->count()) {
            return true;
        }

        return false;
    }

    public function getCategoriesIds($category)
    {
        if (! empty($category)) {
            $array = [$category->id];
            if (count($category->children) == 0) {
                return $array;
            } else {
                return array_merge($array, $this->getChildrenIds($category->children));
            }
        } else {
            return null;
        }
    }

    public function getChildrenIds($children)
    {
        $array = [];
        foreach ($children as $subcategory) {
            $array[] = $subcategory->id;
            if (count($subcategory->children)) {
                $array = array_merge($array, $this->getChildrenIds($subcategory->children));
            }
        }

        return $array;
    }

    public function getAllPublicationsPost($category): ?array
    {
        if (! empty($category)) {
            $array = [];
            if (count($category->children) == 0) {
                return $array;
            } else {
                return array_merge($array, $this->getAllChildrenPosts($category->children));
            }

        } else {
            return null;
        }
    }

    public function getAllChildrenPosts($children): array
    {
        $array = [];
        foreach ($children as $subcategory) {
            $posts = $subcategory->publications()->orderByDesc('id')->take(4)->get();
            $array[$subcategory->slug] = $posts->toArray();

            if (count($subcategory->children) > 0) {
                $array = array_merge($array, $this->getAllChildrenPosts($subcategory->children));
            }
        }

        return $array;
    }
}
