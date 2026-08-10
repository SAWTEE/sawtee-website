<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/site-settings.json');

        if (! File::exists($path)) {
            $this->command?->warn('Missing database/data/site-settings.json — skipped.');

            return;
        }

        /** @var array{about_intro?: string, social_menu?: list<array{name: string, link: string}>} $settings */
        $settings = File::json($path);

        if (array_key_exists('about_intro', $settings)) {
            SiteSetting::putValue('about_intro', $settings['about_intro']);
        }

        if (array_key_exists('social_menu', $settings)) {
            SiteSetting::putValue('social_menu', $settings['social_menu']);
        }
    }
}
