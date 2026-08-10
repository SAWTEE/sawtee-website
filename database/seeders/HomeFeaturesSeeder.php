<?php

namespace Database\Seeders;

use App\Models\Feature;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class HomeFeaturesSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/home-features.json');

        if (! File::exists($path)) {
            $this->command?->warn('Missing database/data/home-features.json — skipped.');

            return;
        }

        /** @var list<array{id?: string, title: string, description?: string, image_src?: string, link?: string}> $features */
        $features = File::json($path);

        foreach ($features as $index => $feature) {
            $key = Str::slug((string) ($feature['id'] ?? $feature['title'] ?? 'feature-'.$index));

            Feature::query()->updateOrCreate(
                ['key' => $key],
                [
                    'title' => $feature['title'],
                    'description' => $feature['description'] ?? null,
                    'image_src' => $feature['image_src'] ?? null,
                    'link' => $feature['link'] ?? null,
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ],
            );
        }
    }
}
