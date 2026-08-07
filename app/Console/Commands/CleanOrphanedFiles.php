<?php

namespace App\Console\Commands;

use App\Support\OrphanedFilesCleaner;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class CleanOrphanedFiles extends Command
{
    protected $signature = 'media:clean-orphans
                            {--delete : Actually delete orphaned files (default is dry-run)}
                            {--spatie : Also run media-library:clean --delete-orphaned}';

    protected $description = 'Find (and optionally delete) public upload files not referenced by posts, publications, research, or editor content';

    public function handle(OrphanedFilesCleaner $cleaner): int
    {
        $delete = (bool) $this->option('delete');

        if ($this->option('spatie')) {
            $this->info('Running Spatie media-library:clean...');
            Artisan::call('media-library:clean', [
                '--force' => true,
                '--delete-orphaned' => true,
                '--dry-run' => ! $delete,
            ]);
            $this->line(Artisan::output());
        }

        $this->info($delete ? 'Scanning and deleting orphaned uploads...' : 'Dry-run: scanning for orphaned uploads...');

        $report = $cleaner->scan();

        $this->table(
            ['Metric', 'Value'],
            [
                ['Referenced media IDs', (string) $report['referenced_media_ids']],
                ['Referenced filenames', (string) $report['referenced_basenames']],
                ['Kept (still referenced)', (string) $report['kept']],
                ['Orphans found', (string) count($report['orphans'])],
                ['Orphan size', $this->formatBytes($report['bytes'])],
            ]
        );

        if ($report['orphans'] === []) {
            $this->info('Nothing to clean.');

            return self::SUCCESS;
        }

        $preview = array_slice($report['orphans'], 0, 40);
        $this->table(
            ['Path', 'Size'],
            array_map(
                fn (array $orphan) => [$orphan['label'], $this->formatBytes($orphan['size'])],
                $preview
            )
        );

        if (count($report['orphans']) > 40) {
            $this->line('… and '.(count($report['orphans']) - 40).' more');
        }

        if (! $delete) {
            $this->warn('Dry-run only. Re-run with --delete to remove these files.');

            return self::SUCCESS;
        }

        if (
            app()->environment('production')
            && $this->input->isInteractive()
            && ! $this->confirm('Delete '.count($report['orphans']).' orphaned files/folders?', false)
        ) {
            $this->warn('Aborted.');

            return self::SUCCESS;
        }

        $result = $cleaner->delete($report['orphans']);

        $this->info("Deleted {$result['deleted']} items (".$this->formatBytes($result['bytes']).').');

        if ($result['failed'] !== []) {
            $this->error('Failed to delete '.count($result['failed']).' paths.');
        }

        return self::SUCCESS;
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes < 1024) {
            return $bytes.' B';
        }

        if ($bytes < 1024 * 1024) {
            return round($bytes / 1024, 1).' KB';
        }

        return round($bytes / (1024 * 1024), 1).' MB';
    }
}
