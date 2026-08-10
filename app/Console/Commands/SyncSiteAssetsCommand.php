<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;

class SyncSiteAssetsCommand extends Command
{
    protected $signature = 'sawtee:sync-site-assets';

    protected $description = 'Copy resources/site-assets into public/assets for HTTP serving';

    public function handle(): int
    {
        $source = resource_path('site-assets');
        $destination = public_path('assets');

        if (! File::isDirectory($source)) {
            $this->error('Missing resources/site-assets — nothing to sync.');

            return self::FAILURE;
        }

        // Prefer the Node script (same as npm run build) when available.
        $script = base_path('scripts/sync-site-assets.mjs');
        if (File::exists($script) && $this->nodeAvailable()) {
            $process = new Process(['node', $script], base_path());
            $process->setTimeout(60);
            $process->run(function (string $type, string $buffer): void {
                $this->output->write($buffer);
            });

            return $process->isSuccessful() ? self::SUCCESS : self::FAILURE;
        }

        File::ensureDirectoryExists(dirname($destination));
        if (File::isDirectory($destination)) {
            File::deleteDirectory($destination);
        }
        File::copyDirectory($source, $destination);

        $this->info('Synced resources/site-assets → public/assets');

        return self::SUCCESS;
    }

    protected function nodeAvailable(): bool
    {
        $process = Process::fromShellCommandline('command -v node', base_path());
        $process->run();

        return $process->isSuccessful();
    }
}
