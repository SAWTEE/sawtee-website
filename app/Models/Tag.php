<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @mixin IdeHelperTag
 */
class Tag extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class)->as('articles');
    }
    public function publications(): BelongsToMany
    {
        return $this->belongsToMany(Publication::class);
    }

}
