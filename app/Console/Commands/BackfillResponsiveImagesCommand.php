<?php

namespace App\Console\Commands;

use App\Models\Media;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Process;

class BackfillResponsiveImagesCommand extends Command
{
    protected $signature = 'sawtee:backfill-responsive-images
        {--chunk=5 : Media records per isolated PHP process}
        {--memory=512M : memory_limit for each child process}';

    protected $description = 'TEMPORARY: regenerate large conversions and responsive variants in memory-safe batches';

    public function handle(): int
    {
        $chunkSize = max(1, (int) $this->option('chunk'));
        $memory = (string) $this->option('memory');

        $pendingIds = $this->mediaMissingLargeVariants();

        if ($pendingIds->isEmpty()) {
            $this->info('No media need a responsive-image backfill.');

            return self::SUCCESS;
        }

        $this->info("Backfilling {$pendingIds->count()} media items in chunks of {$chunkSize}.");

        $skipped = [];

        foreach ($pendingIds->chunk($chunkSize) as $chunk) {
            $failed = $this->regenerateChunk($chunk, $memory);

            if ($failed === [] || $chunk->count() === 1) {
                $skipped = [...$skipped, ...$failed];

                continue;
            }

            $this->warn("Chunk {$chunk->first()}–{$chunk->last()} ran out of memory; retrying one media item per process.");

            foreach ($chunk as $id) {
                $skipped = [...$skipped, ...$this->regenerateChunk(collect([$id]), $memory)];
            }
        }

        if ($skipped !== []) {
            $this->warn('Skipped media IDs that still failed after an isolated retry: '.implode(', ', $skipped));
        }

        $this->info('Responsive-image backfill finished.');

        return self::SUCCESS;
    }

    /**
     * @return Collection<int, int>
     */
    private function mediaMissingLargeVariants(): Collection
    {
        return Media::query()
            ->orderBy('id')
            ->get(['id', 'responsive_images'])
            ->filter(fn (Media $media): bool => $this->missingLargeVariants($media))
            ->pluck('id')
            ->map(fn (int|string $id): int => (int) $id)
            ->values();
    }

    private function missingLargeVariants(Media $media): bool
    {
        $large = $media->responsive_images['large'] ?? null;

        if (! is_array($large)) {
            return true;
        }

        $urls = $large['urls'] ?? null;

        return ! is_array($urls) || $urls === [];
    }

    /**
     * @param  Collection<int, int>  $ids
     * @return list<int>
     */
    private function regenerateChunk(Collection $ids, string $memory): array
    {
        $idList = $ids->implode(',');

        $this->line("Regenerating media IDs {$idList}");

        $result = Process::path(base_path())
            ->timeout(1800)
            ->idleTimeout(1800)
            ->env([
                'QUEUE_CONNECTION' => 'sync',
            ])
            ->run([
                PHP_BINARY,
                '-d', "memory_limit={$memory}",
                '-d', 'max_execution_time=0',
                base_path('artisan'),
                'media-library:regenerate',
                '--ids='.$idList,
                '--only=large',
                '--force',
                '--no-interaction',
            ]);

        if ($result->successful()) {
            return [];
        }

        $this->error(trim($result->errorOutput().PHP_EOL.$result->output()) ?: "Regenerate failed for media IDs {$idList}.");

        return $ids->values()->all();
    }
}
