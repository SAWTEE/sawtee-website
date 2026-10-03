<?php

use App\Models\Category;
use App\Models\Media;
use App\Models\Post;
use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\Process;

function mediaNeedingBackfill(array $responsiveImages = []): Media
{
    $category = Category::query()->create([
        'name' => 'News',
        'slug' => 'news-backfill-'.uniqid(),
        'type' => 'post',
        'parent_id' => null,
    ]);

    $post = Post::factory()->create([
        'category_id' => $category->id,
        'theme_id' => null,
    ]);

    return Media::query()->create([
        'model_type' => $post->getMorphClass(),
        'model_id' => $post->id,
        'collection_name' => 'post-featured-image',
        'name' => 'featured',
        'file_name' => 'featured.jpg',
        'mime_type' => 'image/jpeg',
        'disk' => 'media',
        'size' => 1024,
        'manipulations' => [],
        'custom_properties' => [],
        'generated_conversions' => [],
        'responsive_images' => $responsiveImages,
    ]);
}

function regenerateIds(PendingProcess $process): ?string
{
    $command = $process->command;

    if (! is_array($command)) {
        return null;
    }

    foreach ($command as $part) {
        if (str_starts_with((string) $part, '--ids=')) {
            return substr((string) $part, 6);
        }
    }

    return null;
}

test('it does not spawn regenerate processes when every media item already has large variants', function () {
    Process::fake();

    mediaNeedingBackfill([
        'large' => [
            'urls' => ['featured___large_800_600.webp'],
        ],
    ]);

    $this->artisan('sawtee:backfill-responsive-images')
        ->expectsOutputToContain('No media need a responsive-image backfill.')
        ->assertSuccessful();

    Process::assertNothingRan();
});

test('it regenerates missing large variants in isolated child processes', function () {
    Process::fake();

    $first = mediaNeedingBackfill();
    $second = mediaNeedingBackfill();
    mediaNeedingBackfill([
        'large' => [
            'urls' => ['already-done.webp'],
        ],
    ]);

    $this->artisan('sawtee:backfill-responsive-images', ['--chunk' => 2, '--memory' => '256M'])
        ->assertSuccessful();

    Process::assertRan(function (PendingProcess $process) use ($first, $second): bool {
        $command = $process->command;

        return is_array($command)
            && in_array('-d', $command, true)
            && in_array('memory_limit=256M', $command, true)
            && in_array('media-library:regenerate', $command, true)
            && in_array('--only=large', $command, true)
            && regenerateIds($process) === $first->id.','.$second->id
            && ($process->environment['QUEUE_CONNECTION'] ?? null) === 'sync';
    });

    Process::assertRanTimes(fn (): bool => true, 1);
});

test('it retries a failed chunk one media item at a time and continues', function () {
    $first = mediaNeedingBackfill();
    $second = mediaNeedingBackfill();

    Process::fake(function (PendingProcess $process) use ($first, $second) {
        $ids = regenerateIds($process);

        if ($ids === $first->id.','.$second->id) {
            return Process::result(
                errorOutput: 'Allowed memory size of 134217728 bytes exhausted',
                exitCode: 255,
            );
        }

        return Process::result();
    });

    $this->artisan('sawtee:backfill-responsive-images', ['--chunk' => 2])
        ->expectsOutputToContain('retrying one media item per process')
        ->assertSuccessful();

    Process::assertRanTimes(fn (): bool => true, 3);
    Process::assertRan(fn (PendingProcess $process): bool => regenerateIds($process) === (string) $first->id);
    Process::assertRan(fn (PendingProcess $process): bool => regenerateIds($process) === (string) $second->id);
});
