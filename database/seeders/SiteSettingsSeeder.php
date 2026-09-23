<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use App\Support\SiteCopy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/site-settings.json');

        if (File::exists($path)) {
            /** @var array<string, mixed> $settings */
            $settings = File::json($path);

            foreach ($settings as $key => $value) {
                if (SiteSetting::query()->where('key', $key)->exists()) {
                    continue;
                }

                SiteSetting::putValue((string) $key, $value);
            }
        }

        SiteCopy::seedMissing();
    }
}
