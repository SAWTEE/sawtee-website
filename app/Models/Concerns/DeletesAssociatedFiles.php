<?php

namespace App\Models\Concerns;

use App\Models\File;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Ensure morph File attachments (and their on-disk files) are removed with the parent.
 * Soft-deleted parents keep files until a force delete (matches Spatie Media Library).
 */
trait DeletesAssociatedFiles
{
    public static function bootDeletesAssociatedFiles(): void
    {
        static::deleting(function ($model): void {
            if (
                in_array(SoftDeletes::class, class_uses_recursive($model), true)
                && ! $model->isForceDeleting()
            ) {
                return;
            }

            if (method_exists($model, 'file')) {
                $file = $model->file;
                if ($file instanceof File) {
                    $file->delete();
                }
            }

            if (method_exists($model, 'postContentFiles')) {
                $model->postContentFiles->each(function (File $file): void {
                    $file->delete();
                });
            }
        });
    }
}
