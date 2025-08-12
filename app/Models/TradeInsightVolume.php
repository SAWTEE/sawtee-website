<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
class TradeInsightVolume extends Model
{
    use HasFactory;
    use HasSlug;

    protected $fillable = [
        "volume",
        "title",
        "slug",
        "description",
        "subtitle",
        "content",
        "full_article_link",
    ];


    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

     /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom("volume")
            ->saveSlugsTo("slug")
            ->startSlugSuffixFrom(2);
    }
}
