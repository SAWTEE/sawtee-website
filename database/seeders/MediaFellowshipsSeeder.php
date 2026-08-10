<?php

namespace Database\Seeders;

use App\Models\Fellow;
use App\Models\Fellowship;
use App\Models\PublishedStory;
use App\Support\MediaFellowshipAssembler;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Throwable;

class MediaFellowshipsSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/media-fellowships.json');

        if (! File::exists($path)) {
            $this->command?->warn('Missing database/data/media-fellowships.json — skipped.');

            return;
        }

        /** @var list<array{year: string, description: string, fellows: list<array<string, mixed>>}> $years */
        $years = File::json($path);
        $assembler = app(MediaFellowshipAssembler::class);

        foreach ($years as $cohort) {
            $year = (string) $cohort['year'];
            $fellowship = Fellowship::query()->updateOrCreate(
                ['year' => $year],
                [
                    'title' => 'SAWTEE Media Fellowship '.$year,
                    'description' => $cohort['description'],
                ],
            );

            foreach ($cohort['fellows'] as $fellowData) {
                $name = trim((string) $fellowData['name']);
                if ($name === '') {
                    continue;
                }

                $fellow = Fellow::query()->updateOrCreate(
                    [
                        'fellowship_id' => $fellowship->id,
                        'name' => $name,
                    ],
                    [
                        'designation' => trim((string) ($fellowData['designation'] ?? '')),
                        'description' => trim((string) ($fellowData['bio'] ?? '')),
                        'experience' => $assembler->experienceToStoredHtml(
                            array_values(array_filter(
                                array_map('strval', $fellowData['experience'] ?? []),
                                fn (string $p) => trim($p) !== ''
                            ))
                        ),
                    ],
                );

                $this->attachLocalMedia(
                    $fellow,
                    'profile_picture',
                    is_string($fellowData['avatar'] ?? null) ? $fellowData['avatar'] : null,
                );

                foreach ($fellowData['published_stories'] ?? [] as $storyData) {
                    $link = trim((string) ($storyData['link'] ?? ''));
                    $title = trim((string) ($storyData['title'] ?? ''));

                    if ($link === '' || $title === '') {
                        continue;
                    }

                    $mediaSrc = $storyData['media_src'] ?? null;
                    $mediaSrc = is_string($mediaSrc) && trim($mediaSrc) !== '' ? trim($mediaSrc) : null;

                    $story = PublishedStory::query()->updateOrCreate(
                        [
                            'fellow_id' => $fellow->id,
                            'link' => $link,
                        ],
                        [
                            'title' => $title,
                            'media_src' => $mediaSrc,
                        ],
                    );

                    $images = array_values(array_filter(
                        array_map('strval', $storyData['image_src'] ?? []),
                        fn (string $src) => trim($src) !== ''
                    ));

                    foreach ($images as $imagePath) {
                        $this->attachLocalMedia($story, 'published-story-images', $imagePath, allowMultiple: true);
                    }
                }
            }
        }
    }

    protected function attachLocalMedia(
        Fellow|PublishedStory $model,
        string $collection,
        ?string $publicPath,
        bool $allowMultiple = false
    ): void {
        if ($publicPath === null || trim($publicPath) === '') {
            return;
        }

        $relative = ltrim(parse_url($publicPath, PHP_URL_PATH) ?: $publicPath, '/');

        // Prefer synced public/assets; fall back to tracked resources/site-assets.
        $absolute = public_path($relative);
        if (! is_file($absolute) && str_starts_with($relative, 'assets/')) {
            $absolute = resource_path('site-assets/'.substr($relative, strlen('assets/')));
        }

        if (! is_file($absolute)) {
            return;
        }

        $fileName = basename($absolute);

        if (! $allowMultiple && $model->hasMedia($collection)) {
            $existing = $model->getFirstMedia($collection);
            if ($existing && $existing->file_name === $fileName) {
                return;
            }
        }

        if ($allowMultiple) {
            $already = $model->getMedia($collection)->contains(
                fn ($media) => $media->file_name === $fileName
            );
            if ($already) {
                return;
            }
        }

        try {
            $model
                ->addMedia($absolute)
                ->preservingOriginal()
                ->usingFileName($fileName)
                ->toMediaCollection($collection);
        } catch (Throwable $e) {
            $this->command?->warn("Could not attach {$relative}: {$e->getMessage()}");
        }
    }
}
