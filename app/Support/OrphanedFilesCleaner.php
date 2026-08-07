<?php

namespace App\Support;

use App\Models\Article;
use App\Models\File;
use App\Models\Page;
use App\Models\Post;
use App\Models\Publication;
use App\Models\Research;
use App\Models\Section;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File as Filesystem;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Finds (and optionally deletes) upload files under public/ that are no longer
 * referenced by Spatie media, File morph rows, or HTML content embeds.
 */
class OrphanedFilesCleaner
{
    /**
     * Upload roots that may contain stale CMS files. Never scans app assets.
     *
     * @var array<int, array{label: string, path: string, mode: string}>
     */
    private array $targets = [];

    public function __construct()
    {
        $this->targets = [
            [
                'label' => 'media-library',
                'path' => public_path('media-library'),
                'mode' => 'media_ids',
            ],
            [
                'label' => 'Featured_Events',
                'path' => public_path('Featured_Events'),
                'mode' => 'basenames',
            ],
            [
                'label' => 'Research_Reports',
                'path' => public_path('Research_Reports'),
                'mode' => 'basenames',
            ],
            [
                'label' => 'publications',
                'path' => public_path('publications'),
                'mode' => 'basenames',
            ],
            [
                'label' => 'storage/uploads',
                'path' => storage_path('app/public/uploads'),
                'mode' => 'basenames',
            ],
            [
                'label' => 'tmp',
                'path' => public_path('tmp'),
                // Page JSON / globe data live here — only purge optimizer leftovers.
                'mode' => 'tmp_uploads',
            ],
        ];
    }

    /**
     * @return array{
     *   orphans: list<array{path: string, label: string, size: int}>,
     *   kept: int,
     *   bytes: int,
     *   referenced_media_ids: int,
     *   referenced_basenames: int
     * }
     */
    public function scan(): array
    {
        $mediaIds = $this->referencedMediaIds();
        $basenames = $this->referencedBasenames();

        $orphans = [];
        $kept = 0;

        foreach ($this->targets as $target) {
            if (! is_dir($target['path'])) {
                continue;
            }

            $result = match ($target['mode']) {
                'media_ids' => $this->scanMediaLibrary($target['path'], $target['label'], $mediaIds),
                'basenames' => $this->scanBasenames($target['path'], $target['label'], $basenames),
                'tmp_uploads' => $this->scanTmpUploads($target['path'], $target['label']),
                default => ['orphans' => [], 'kept' => 0],
            };

            $orphans = [...$orphans, ...$result['orphans']];
            $kept += $result['kept'];
        }

        $bytes = array_sum(array_column($orphans, 'size'));

        return [
            'orphans' => $orphans,
            'kept' => $kept,
            'bytes' => $bytes,
            'referenced_media_ids' => count($mediaIds),
            'referenced_basenames' => count($basenames),
        ];
    }

    /**
     * @param  list<array{path: string, label: string, size: int}>  $orphans
     * @return array{deleted: int, bytes: int, failed: list<string>}
     */
    public function delete(array $orphans): array
    {
        $deleted = 0;
        $bytes = 0;
        $failed = [];

        foreach ($orphans as $orphan) {
            $path = $orphan['path'];

            try {
                if (is_dir($path)) {
                    $size = $this->directorySize($path);
                    Filesystem::deleteDirectory($path);
                    $deleted++;
                    $bytes += $size;
                } elseif (is_file($path)) {
                    $size = (int) filesize($path);
                    Filesystem::delete($path);
                    $deleted++;
                    $bytes += $size;
                }
            } catch (\Throwable $e) {
                report($e);
                $failed[] = $path;
            }
        }

        return compact('deleted', 'bytes', 'failed');
    }

    /**
     * @return array<int, true>
     */
    private function referencedMediaIds(): array
    {
        $ids = Media::query()->pluck('id')->mapWithKeys(
            fn ($id) => [(int) $id => true]
        )->all();

        // Also keep media IDs mentioned in HTML (absolute/relative media-library URLs).
        foreach ($this->contentHaystacks() as $html) {
            if (! is_string($html) || $html === '') {
                continue;
            }

            if (preg_match_all('#/media-library/(?:uploads/)?(\d+)/#i', $html, $matches)) {
                foreach ($matches[1] as $id) {
                    $ids[(int) $id] = true;
                }
            }
        }

        return $ids;
    }

    /**
     * @return array<string, true>
     */
    private function referencedBasenames(): array
    {
        $names = [];

        foreach (File::query()->pluck('path', 'name') as $name => $path) {
            if (is_string($name) && $name !== '') {
                $names[$name] = true;
            }
            if (is_string($path) && $path !== '') {
                $names[basename($path)] = true;
            }
        }

        foreach (Media::query()->pluck('file_name') as $fileName) {
            if (is_string($fileName) && $fileName !== '') {
                $names[$fileName] = true;
            }
        }

        foreach ($this->contentHaystacks() as $html) {
            if (! is_string($html) || $html === '') {
                continue;
            }

            $patterns = [
                '#/storage/uploads/([^"\'\s?<>]+)#i',
                '#/Featured_Events/([^"\'\s?<>]+)#i',
                '#/Research_Reports/([^"\'\s?<>]+)#i',
                '#/publications/([^"\'\s?<>]+)#i',
                '#/media-library/(?:uploads/)?\d+/(?:conversions/)?([^"\'\s?<>]+)#i',
            ];

            foreach ($patterns as $pattern) {
                if (preg_match_all($pattern, $html, $matches)) {
                    foreach ($matches[1] as $basename) {
                        $names[rawurldecode($basename)] = true;
                    }
                }
            }
        }

        return $names;
    }

    /**
     * @return list<string|null>
     */
    private function contentHaystacks(): array
    {
        $chunks = [];

        $chunks = [...$chunks, ...Post::query()->pluck('content')->all()];
        $chunks = [...$chunks, ...Post::query()->pluck('excerpt')->all()];
        $chunks = [...$chunks, ...Article::query()->pluck('content')->all()];
        $chunks = [...$chunks, ...Article::query()->pluck('excerpt')->all()];
        $chunks = [...$chunks, ...Page::query()->pluck('content')->all()];
        $chunks = [...$chunks, ...Section::query()->pluck('description')->all()];
        $chunks = [...$chunks, ...Publication::query()->pluck('description')->all()];
        $chunks = [...$chunks, ...Research::query()->pluck('description')->all()];

        // TinyMCE / body fields that may exist on other tables.
        if (DB::getSchemaBuilder()->hasTable('published_stories')) {
            $chunks = [...$chunks, ...DB::table('published_stories')->pluck('title')->all()];
        }

        return $chunks;
    }

    /**
     * @param  array<int, true>  $mediaIds
     * @return array{orphans: list<array{path: string, label: string, size: int}>, kept: int}
     */
    private function scanMediaLibrary(string $root, string $label, array $mediaIds): array
    {
        // Spatie stores items under {disk}/{prefix}/{id}/ (prefix defaults to "uploads").
        // Scanning only the disk root treats the entire prefix directory as one orphan.
        $prefix = trim((string) config('media-library.prefix', ''), '/');
        $mediaRoot = $prefix === '' ? $root : $root.DIRECTORY_SEPARATOR.$prefix;
        $labelPrefix = $prefix === '' ? $label : $label.'/'.$prefix;

        if (! is_dir($mediaRoot)) {
            return ['orphans' => [], 'kept' => 0];
        }

        $orphans = [];
        $kept = 0;

        foreach (Filesystem::directories($mediaRoot) as $directory) {
            $name = basename($directory);

            // Spatie stores each media item in a numeric folder named by media id.
            // Keep the whole tree (original + conversions/ + responsive-images/).
            if (ctype_digit($name)) {
                $id = (int) $name;
                if (isset($mediaIds[$id])) {
                    $kept++;

                    continue;
                }

                $orphans[] = [
                    'path' => $directory,
                    'label' => $labelPrefix.'/'.$name,
                    'size' => $this->directorySize($directory),
                ];

                continue;
            }

            // Non-numeric folders under the media prefix are unexpected leftovers.
            $orphans[] = [
                'path' => $directory,
                'label' => $labelPrefix.'/'.$name,
                'size' => $this->directorySize($directory),
            ];
        }

        foreach (Filesystem::files($mediaRoot) as $file) {
            $orphans[] = [
                'path' => $file->getPathname(),
                'label' => $labelPrefix.'/'.$file->getFilename(),
                'size' => $file->getSize(),
            ];
        }

        return compact('orphans', 'kept');
    }

    /**
     * @param  array<string, true>  $basenames
     * @return array{orphans: list<array{path: string, label: string, size: int}>, kept: int}
     */
    private function scanBasenames(string $root, string $label, array $basenames): array
    {
        $orphans = [];
        $kept = 0;

        foreach (Filesystem::files($root) as $file) {
            $name = $file->getFilename();
            if (isset($basenames[$name])) {
                $kept++;

                continue;
            }

            $orphans[] = [
                'path' => $file->getPathname(),
                'label' => $label.'/'.$name,
                'size' => $file->getSize(),
            ];
        }

        return compact('orphans', 'kept');
    }

    /**
     * Only remove temporary upload artifacts (PDFs/images), never page JSON data.
     *
     * @return array{orphans: list<array{path: string, label: string, size: int}>, kept: int}
     */
    private function scanTmpUploads(string $root, string $label): array
    {
        $orphans = [];
        $kept = 0;
        $purgeExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'gif'];

        foreach (Filesystem::files($root) as $file) {
            $extension = strtolower($file->getExtension());

            if (! in_array($extension, $purgeExtensions, true)) {
                $kept++;

                continue;
            }

            $orphans[] = [
                'path' => $file->getPathname(),
                'label' => $label.'/'.$file->getFilename(),
                'size' => $file->getSize(),
            ];
        }

        return compact('orphans', 'kept');
    }

    private function directorySize(string $directory): int
    {
        $size = 0;

        if (! is_dir($directory)) {
            return 0;
        }

        foreach (Filesystem::allFiles($directory) as $file) {
            $size += $file->getSize();
        }

        return $size;
    }
}
