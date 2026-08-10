<?php

namespace App\Console\Commands;

use Database\Seeders\HomeFeaturesSeeder;
use Database\Seeders\MediaFellowshipsSeeder;
use Database\Seeders\MemberInstitutesSeeder;
use Database\Seeders\SiteSettingsSeeder;
use Illuminate\Console\Command;

class SeedSawteeContentCommand extends Command
{
    protected $signature = 'sawtee:seed-content
                            {--only= : Comma-separated subset: fellowships,institutes,features,settings}
                            {--skip-assets : Do not sync resources/site-assets into public/assets}';

    protected $description = 'Idempotently seed CMS content from database/data fixtures (safe for production)';

    public function handle(): int
    {
        if (! $this->option('skip-assets')) {
            $this->info('Syncing site assets…');
            $exit = $this->call('sawtee:sync-site-assets');
            if ($exit !== self::SUCCESS) {
                return $exit;
            }
        }

        $only = collect(explode(',', (string) $this->option('only')))
            ->map(fn (string $value) => trim($value))
            ->filter()
            ->all();

        $map = [
            'fellowships' => MediaFellowshipsSeeder::class,
            'institutes' => MemberInstitutesSeeder::class,
            'features' => HomeFeaturesSeeder::class,
            'settings' => SiteSettingsSeeder::class,
        ];

        $selected = $only === []
            ? array_keys($map)
            : array_values(array_intersect(array_keys($map), $only));

        if ($selected === []) {
            $this->error('No valid --only targets. Use fellowships,institutes,features,settings.');

            return self::FAILURE;
        }

        foreach ($selected as $key) {
            $this->info("Seeding {$key}…");
            $this->call('db:seed', [
                '--class' => $map[$key],
                '--force' => true,
            ]);
        }

        $this->info('Content seeding complete.');

        return self::SUCCESS;
    }
}
