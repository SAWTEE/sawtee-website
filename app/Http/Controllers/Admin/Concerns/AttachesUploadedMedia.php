<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;
use Spatie\MediaLibrary\HasMedia;

trait AttachesUploadedMedia
{
    /**
     * @param  Model&HasMedia  $model
     */
    protected function attachImageFromRequest(Model $model, Request $request, string $collection, string $field = 'image'): void
    {
        if (! $request->hasFile($field)) {
            return;
        }

        try {
            $model->addMediaFromRequest($field)->toMediaCollection($collection);
        } catch (\Throwable $e) {
            report($e);

            throw ValidationException::withMessages([
                $field => 'The image could not be processed. Please upload a smaller JPEG/PNG/WebP (max 2MB).',
            ]);
        }
    }

    /**
     * @param  Model&HasMedia  $model
     * @param  array<int, UploadedFile>|null  $images
     */
    protected function attachImages(Model $model, ?array $images, string $collection, string $field = 'images', bool $replace = false): void
    {
        if (! $images) {
            return;
        }

        if ($replace) {
            $model->clearMediaCollection($collection);
        }

        try {
            foreach ($images as $image) {
                $model->addMedia($image)->toMediaCollection($collection);
            }
        } catch (\Throwable $e) {
            report($e);

            throw ValidationException::withMessages([
                $field => 'The image could not be processed. Please upload a smaller JPEG/PNG/WebP (max 2MB).',
            ]);
        }
    }
}
