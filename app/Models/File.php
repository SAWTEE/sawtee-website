<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'path',
    ];

    protected static function booted(): void
    {
        static::deleting(function (File $file): void {
            $file->deleteStoredFile();
        });
    }

    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Remove the physical file from disk when the DB row is deleted.
     * Paths may be absolute (legacy) or relative to a public disk root.
     */
    public function deleteStoredFile(): void
    {
        $path = $this->path;

        if (! is_string($path) || $path === '') {
            return;
        }

        if (is_file($path)) {
            @unlink($path);

            return;
        }

        foreach (['events', 'research', 'publications', 'public'] as $disk) {
            try {
                if (Storage::disk($disk)->exists($path)) {
                    Storage::disk($disk)->delete($path);

                    return;
                }
            } catch (\Throwable) {
                // Disk may be misconfigured; try the next one.
            }
        }

        $basename = basename($path);
        $candidates = [
            public_path('Featured_Events/'.$basename),
            public_path('Research_Reports/'.$basename),
            public_path('publications/'.$basename),
        ];

        foreach ($candidates as $candidate) {
            if (is_file($candidate)) {
                @unlink($candidate);

                return;
            }
        }
    }
}
