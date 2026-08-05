<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class NormalizeGoogleFontUrls extends Command
{
    protected $signature = 'google-fonts:normalize-urls';

    protected $description = 'Rewrite absolute font URLs under storage/fonts to root-relative /storage paths (avoids CORS across www/apex hosts)';

    public function handle(): int
    {
        $roots = array_unique(array_filter([
            storage_path('app/public/fonts'),
            // Many hosts (incl. this app historically) use a real public/storage
            // directory instead of a symlink — normalize both so /storage/* is safe.
            public_path('storage/fonts'),
        ]));

        $updated = 0;

        foreach ($roots as $fontsRoot) {
            if (! is_dir($fontsRoot)) {
                continue;
            }

            $this->line("Scanning {$fontsRoot}");

            foreach (File::allFiles($fontsRoot) as $file) {
                if (! in_array($file->getExtension(), ['css', 'html'], true)) {
                    continue;
                }

                $contents = File::get($file->getPathname());
                $normalized = preg_replace(
                    '#https?://[^/"\s\)]+(/storage/fonts/)#i',
                    '$1',
                    $contents
                );

                if (! is_string($normalized) || $normalized === $contents) {
                    continue;
                }

                File::put($file->getPathname(), $normalized);
                $updated++;
                $this->line('  Normalized: '.$file->getRelativePathname());
            }
        }

        $this->info("Normalized {$updated} font asset file(s).");

        return self::SUCCESS;
    }
}
