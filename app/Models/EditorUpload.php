<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * Standalone media host for TinyMCE / rich-text editor uploads.
 * Kept separate from posts so uploads work before a post exists.
 * Images are optimized to WebP before attach (see PostController::uploadmedia).
 */
class EditorUpload extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'user_id',
        'original_name',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('editor-images')->singleFile();
    }
}
